#!/usr/bin/env bash
# Creates (or updates) the Cache Rule that lets Cloudflare hold the prerendered
# HTML at the edge. See docs/edge-caching.md for why this is not something
# _headers can do on its own.
#
#   CF_API_TOKEN=… bash tools/cloudflare/cache-rule.sh [zone]
#
# The token needs Zone → Cache Rules → Edit, plus Zone → Zone → Read if you let
# the script look the zone id up by name. Wrangler's own OAuth token is not
# enough: it carries zone:read and nothing that can write a ruleset.
#
# Idempotent. A rule with the same description is updated in place rather than
# added again, so re-running after an edit here does the right thing.
set -euo pipefail

ZONE_NAME="${1:-seanbehan.ca}"
DESCRIPTION='Cache prerendered HTML'
# Extensionless paths (/, /posts, /posts/some-slug) and .html are exactly the
# prerendered pages. Everything under /_app/immutable is content-hashed and
# already cached hard by Pages, and /rss.xml keeps the max-age its route sets.
EXPRESSION='(http.request.uri.path.extension eq "" or http.request.uri.path.extension eq "html")'

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
# and write it back with our rule merged in.
existing="$(api GET "/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" || true)"
current_rules='[]'
if printf '%s' "$existing" | json "sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
	current_rules="$(printf '%s' "$existing" | json "print(json.dumps(d['result'].get('rules', [])))")"
fi

payload="$(
	python3 - "$current_rules" "$DESCRIPTION" "$EXPRESSION" <<-'EOF'
		import json, sys

		rules, description, expression = json.loads(sys.argv[1]), sys.argv[2], sys.argv[3]

		rule = {
		    'description': description,
		    'expression': expression,
		    'action': 'set_cache_settings',
		    'action_parameters': {
		        'cache': True,
		        # Both TTLs respect the origin, so the cache window lives in
		        # _headers and hooks.server.ts — in the repo, next to the comment
		        # explaining it — rather than as a number in a dashboard. No
		        # `default` alongside: the API rejects one in respect_origin mode
		        # ("default is useless in respect_origin mode"), since s-maxage
		        # from the origin is the whole answer.
		        'edge_ttl': {'mode': 'respect_origin'},
		        'browser_ttl': {'mode': 'respect_origin'},
		    },
		    'enabled': True,
		}

		kept = [r for r in rules if r.get('description') != description]
		for r in kept:
		    for key in ('id', 'version', 'last_updated', 'ref'):
		        r.pop(key, None)
		print(json.dumps({'rules': kept + [rule]}))
	EOF
)"

result="$(api PUT "/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" -d "$payload")"
fail_if_error "$result"

printf '%s' "$result" | json "
[print('rule:', r['description'], '|', r['expression']) for r in d['result'].get('rules', [])]"

echo
echo "Verify (first request MISS, second HIT with a rising Age):"
echo "  curl -sSI https://$ZONE_NAME/ | grep -iE 'cf-cache-status|age:'"
