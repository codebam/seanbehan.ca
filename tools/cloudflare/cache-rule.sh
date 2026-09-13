#!/usr/bin/env bash
# Creates (or updates in place) the Cache Rules that let Cloudflare hold
# rendered HTML and generated social cards at the edge. See
# docs/edge-caching.md for the two-cache model this participates in.
#
#   CF_API_TOKEN=… bash tools/cloudflare/cache-rule.sh [zone]
#
# The token needs Zone → Cache Rules → Edit, plus Zone → Zone → Read if you let
# the script look the zone id up by name. Wrangler's own OAuth token is not
# enough: it carries zone:read and nothing that can write a ruleset.
#
# Idempotence must not key on the description. The live zones had the rule named
# "Cache rendered HTML" while this script looked for "Cache prerendered HTML",
# so every run appended a second rule; Cloudflare evaluates Cache Rules in order
# and the stale rule won. The merge below targets a rule by the cache-key
# clause in its expression — the extension test for HTML, `/og/` plus the png
# test for cards — replaces the first match in place, collapses later
# duplicates, and only appends when no such rule exists at all. Set
# CF_CACHE_RULE_ID to replace one exact rule regardless of how its description
# or expression drifted; a pinned id that matches nothing is an error, never a
# silent append.
#
# The HTML rule also configures Vary for Accept. The Worker sends `Vary: Accept`
# on negotiated pages; without this Cache Rule setting Cloudflare ignores that
# header and a cached HTML copy can answer a markdown or JSON request before the
# Worker runs. See docs/edge-caching.md.
set -euo pipefail

ZONE_NAME="${1:-seanbehan.ca}"
HTML_DESCRIPTION='Cache rendered HTML'
CARDS_DESCRIPTION='Cache social cards'
# Extensionless paths (/, /posts, /posts/some-slug) and .html are exactly the
# rendered pages. The host clause is load-bearing: a cached www copy can answer
# a request before the Worker runs, and the middleware redirect that turns www
# into the apex never gets a chance to fire. Scoping the rule to the apex leaves
# www uncached, so its 301 always comes from the Worker.
HTML_EXPRESSION="(http.request.uri.path.extension eq \"\" or http.request.uri.path.extension eq \"html\") and http.host eq \"$ZONE_NAME\""
# The generated cards are the one non-HTML route with a public, stable URL and
# a month-long policy, but they are PNGs: the HTML rule deliberately does not
# match them, and without a rule of their own Cloudflare's zone cache answers
# BYPASS on every request, so every scraper wakes the Worker to re-render a card
# it could have answered from cache. Same host clause, same reason. No vary
# block: the card bytes do not change with Accept.
CARDS_EXPRESSION="(http.request.uri.path.extension eq \"png\" and starts_with(http.request.uri.path, \"/og/\")) and http.host eq \"$ZONE_NAME\""

: "${CF_API_TOKEN:?set CF_API_TOKEN to a token with Zone → Cache Rules → Edit}"

api() {
	local method="$1" path="$2"
	shift 2
	curl -sS -X "$method" "https://api.cloudflare.com/client/v4$path" \
		-H "Authorization: Bearer $CF_API_TOKEN" \
		-H "Content-Type: application/json" \
		"$@"
}

# `jq` is not assumed — python3 is already a dependency of tools/fonts.
json() { python3 -c "import json,sys; d=json.load(sys.stdin); $1"; }

fail_if_error() {
	python3 - "$1" <<-'EOF'
		import json, sys
		d = json.loads(sys.argv[1])
		if not d.get('success'):
		    print('Cloudflare API error:', json.dumps(d.get('errors'), indent=2), file=sys.stderr)
		    sys.exit(1)
	EOF
}

ZONE_ID="${CF_ZONE_ID:-}"
if [ -z "$ZONE_ID" ]; then
	response="$(api GET "/zones?name=$ZONE_NAME")"
	fail_if_error "$response"
	ZONE_ID="$(printf '%s' "$response" | json "print(d['result'][0]['id'] if d['result'] else '')")"
	[ -n "$ZONE_ID" ] || {
		echo "no zone named $ZONE_NAME visible to this token." >&2
		echo "A token scoped to a single zone can edit it without being able to" >&2
		echo "list it — pass the id directly: CF_ZONE_ID=… $0 $ZONE_NAME" >&2
		exit 1
	}
fi
echo "zone $ZONE_NAME ($ZONE_ID)"

# The cache phase entrypoint may not exist yet on a zone with no cache rules.
# PUT-ing the whole ruleset creates it either way, so read what is there first
# and write it back with our rules merged in.
existing="$(api GET "/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" || true)"
current_rules='[]'
if printf '%s' "$existing" | json "sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
	current_rules="$(printf '%s' "$existing" | json "print(json.dumps(d['result'].get('rules', [])))")"
fi

payload="$(
	python3 - "$current_rules" "$HTML_DESCRIPTION" "$HTML_EXPRESSION" "$CARDS_DESCRIPTION" "$CARDS_EXPRESSION" <<-'EOF'
import copy, json, os, sys

rules = json.loads(sys.argv[1])
html_description, html_expression = sys.argv[2], sys.argv[3]
cards_description, cards_expression = sys.argv[4], sys.argv[5]
pinned_id = os.environ.get('CF_CACHE_RULE_ID', '').strip()

html_rule = {
    'description': html_description,
    'expression': html_expression,
    'action': 'set_cache_settings',
    'action_parameters': {
        'cache': True,
        # Both TTLs respect the origin, so the cache window lives in the
        # route or middleware — in the repo, next to the comment
        # explaining it — rather than as a number in a dashboard. No
        # `default` alongside: the API rejects one in respect_origin mode
        # ("default is useless in respect_origin mode").
        'edge_ttl': {'mode': 'respect_origin'},
        'browser_ttl': {'mode': 'respect_origin'},
        # The Worker sends `Vary: Accept` on `/posts/<slug>`, `/pages/<slug>`
        # and `/resume`. Normalizing it keeps browser Accept strings together
        # and keeps text/html, text/markdown and application/json distinct.
        'vary': {
            'default': {'action': 'bypass'},
            'headers': {
                'accept': {
                    'action': 'normalize',
                    'media_types': [
                        'text/html',
                        'application/xhtml+xml',
                        'application/xml',
                        'text/markdown',
                        'application/json'
                    ]
                }
            }
        }
    },
    'enabled': True
}
cards_rule = {
    'description': cards_description,
    'expression': cards_expression,
    'action': 'set_cache_settings',
    'action_parameters': {
        'cache': True,
        'edge_ttl': {'mode': 'respect_origin'},
        'browser_ttl': {'mode': 'respect_origin'}
    },
    'enabled': True
}

def compact(rule):
    return ' '.join((rule.get('expression') or '').replace("'", '"').split())

def is_html(rule):
    expression = compact(rule)
    return ('http.request.uri.path.extension' in expression
            and ('eq ""' in expression or 'eq "html"' in expression))

def is_cards(rule):
    expression = compact(rule)
    return '/og/' in expression and 'eq "png"' in expression

def merge(rule_list, predicate, replacement, pinned):
    result = []
    seen = False
    pinned_hit = False
    for rule in rule_list:
        pinned_match = bool(pinned and rule.get('id') == pinned)
        if pinned_match:
            pinned_hit = True
        if predicate(rule) or pinned_match:
            if not seen:
                fresh = copy.deepcopy(replacement)
                # Keep the operator-facing name already on the zone so an
                # in-place update does not rename a rule someone watches.
                if rule.get('description'):
                    fresh['description'] = rule['description']
                result.append(fresh)
                seen = True
            # Later duplicates of the same target collapse here: they were
            # how "append last and the first match wins" re-armed the bug,
            # and they are redundant now.
            continue
        kept = copy.deepcopy(rule)
        for key in ('id', 'version', 'last_updated', 'ref'):
            kept.pop(key, None)
        result.append(kept)
    if not seen:
        result.append(copy.deepcopy(replacement))
    return result, seen, pinned_hit

rules, _, pinned_hit = merge(rules, is_html, html_rule, pinned_id)
if pinned_id and not pinned_hit:
    print(f'CF_CACHE_RULE_ID={pinned_id} matched no rule; refusing to append blindly', file=sys.stderr)
    sys.exit(1)
rules, _, _ = merge(rules, is_cards, cards_rule, '')
print(json.dumps({'rules': rules}))
EOF
)"

result="$(api PUT "/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" -d "$payload")"
fail_if_error "$result"

printf '%s' "$result" | json "
for r in d['result'].get('rules', []):
    print('rule:', r.get('description'),
          '| cache:', (r.get('action_parameters') or {}).get('cache'),
          '| enabled:', r.get('enabled'),
          '|', r.get('expression'))"

echo
echo "Verify (first request MISS, then a HIT with a rising Age; cards will be"
echo "BYPASS at the zone until this run is what the zone is serving):"
echo "  curl -sSI https://$ZONE_NAME/ | grep -iE 'cf-cache-status|age:'"
echo "  curl -sSI https://$ZONE_NAME/og/site.png | grep -iE 'cf-cache-status|age:'"
