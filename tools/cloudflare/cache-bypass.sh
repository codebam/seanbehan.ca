#!/usr/bin/env bash
# Stops the zone from caching rendered HTML, without giving up the generated
# social cards.
#
# The HTML Cache Rule is normally useful: it lets Cloudflare answer a rendered
# page without waking the Worker. It also has a cache key that, on these zones,
# answered a www request with the apex copy — and a cached response is served
# before the Worker's www redirect can run, so www duplicated the site. Origin
# `private` does not stop it; the rule overrides `private`, and only `no-store`
# survives.
#
# This script replaces the HTML rule in place with `cache: false`, matching the
# rule by the extension clause in its expression rather than by description.
# That is what makes it idempotent against the live zones: the cache-on rule
# there had a different name, so the old description filter never removed it and
# every run merely appended another rule behind it. A rule the script did not
# create is still found, replaced, and never left behind as a later match.
#
# The card rule is different: `/og/<slug>.png` is public, stable and
# host-scoped, so it stays cache-eligible. Keeping it on is what lets the zone
# answer a cold card instead of waking satori and resvg again; the Worker's own
# Cache API write is not visible to an immediate retry, so removing that rule
# would make a scraper's double fetch render twice.
#
#   CF_API_TOKEN=… bash tools/cloudflare/cache-bypass.sh [zone]
#
# Needs Zone → Cache Rules → Edit (plus Zone → Zone → Read to resolve the name).
# Re-run tools/cloudflare/cache-rule.sh to put the host-scoped HTML cache back
# once that is verified.
set -euo pipefail

ZONE_NAME="${1:-seanbehan.ca}"
HTML_DESCRIPTION='Cache rendered HTML'
CARDS_DESCRIPTION='Cache social cards'
HTML_EXPRESSION="(http.request.uri.path.extension eq \"\" or http.request.uri.path.extension eq \"html\") and http.host eq \"$ZONE_NAME\""
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

json() { python3 -c "import json,sys; d=json.load(sys.stdin); $1"; }

fail_if_error() {
python3 - "$1" <<-'PY'
import json, sys
d = json.loads(sys.argv[1])
if not d.get('success'):
    print('Cloudflare API error:', json.dumps(d.get('errors'), indent=2), file=sys.stderr)
    sys.exit(1)
PY
}

ZONE_ID="${CF_ZONE_ID:-}"
if [ -z "$ZONE_ID" ]; then
response="$(api GET "/zones?name=$ZONE_NAME")"
fail_if_error "$response"
ZONE_ID="$(printf '%s' "$response" | json "print(d['result'][0]['id'] if d['result'] else '')")"
[ -n "$ZONE_ID" ] || {
echo "no zone named $ZONE_NAME visible to this token." >&2
exit 1
}
fi
echo "zone $ZONE_NAME ($ZONE_ID)"

existing="$(api GET "/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" || true)"
current_rules='[]'
if printf '%s' "$existing" | json "sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
current_rules="$(printf '%s' "$existing" | json "print(json.dumps(d['result'].get('rules', [])))")"
fi

payload="$(
python3 - "$current_rules" "$HTML_DESCRIPTION" "$HTML_EXPRESSION" "$CARDS_DESCRIPTION" "$CARDS_EXPRESSION" <<-'PY'
import copy, json, os, sys

rules = json.loads(sys.argv[1])
html_description, html_expression = sys.argv[2], sys.argv[3]
cards_description, cards_expression = sys.argv[4], sys.argv[5]
pinned_id = os.environ.get('CF_CACHE_RULE_ID', '').strip()

html_rule = {
    'description': html_description,
    'expression': html_expression,
    'action': 'set_cache_settings',
    'action_parameters': {'cache': False},
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
                # Keep any existing name so the rule an operator watches
                # does not churn; the expression is the identity.
                if rule.get('description'):
                    fresh['description'] = rule['description']
                result.append(fresh)
                seen = True
            # Collapse later rules that matched the same target: they are
            # the append-forever duplicates this rewrite exists to remove.
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
PY
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
echo "Now purge both zones, then verify:"
echo "  curl -sSI https://$ZONE_NAME/ | grep -iE 'cf-cache-status|age:'"
echo "  curl -sSI https://www.$ZONE_NAME/ | grep -iE 'HTTP|location'"
