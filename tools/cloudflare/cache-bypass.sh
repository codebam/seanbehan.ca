#!/usr/bin/env bash
# Stop the edge from caching prerendered HTML.
#
# The HTML Cache Rule is normally useful: it lets Cloudflare answer a rendered
# page without waking the Worker. It also has a cache key that, on these zones,
# answers a www request with the apex copy — and a cached response is served
# before the Worker's www redirect can run, so www duplicates the site.
# Page Rules and the Cache Rule expression cannot fix that once the shared
# entry exists. This script replaces the rule with the same description and
# expression set to bypass, so www always reaches the Worker (or the www Page
# Rule) and redirects; the Worker's own Cache API still holds a rendered page
# for ten minutes per host, which is where the cheap hit comes from.
#
#   CF_API_TOKEN=… bash tools/cloudflare/cache-bypass.sh [zone]
#
# Needs Zone → Cache Rules → Edit (plus Zone → Zone → Read to resolve the name).
# Re-run tools/cloudflare/cache-rule.sh to put edge caching back once the
# cache-key behaviour is understood.
set -euo pipefail

ZONE_NAME="${1:-seanbehan.ca}"
DESCRIPTION='Cache prerendered HTML'
EXPRESSION="(http.request.uri.path.extension eq \"\" or http.request.uri.path.extension eq \"html\") and http.host eq \"$ZONE_NAME\""

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
python3 - "$current_rules" "$DESCRIPTION" "$EXPRESSION" <<-'PY'
import json, sys

rules, description, expression = json.loads(sys.argv[1]), sys.argv[2], sys.argv[3]
# Drop any previous form of this rule (cache-on or bypass) and replace
# it, so re-running is idempotent. Other rules are preserved apart from
# the API's server-managed fields.
kept = [r for r in rules if r.get('description') != description]
for r in kept:
    for key in ('id', 'version', 'last_updated', 'ref'):
        r.pop(key, None)
rule = {
    'description': description,
    'expression': expression,
    'action': 'set_cache_settings',
    'action_parameters': {'cache': False},
    'enabled': True,
}
print(json.dumps({'rules': kept + [rule]}))
PY
)"

result="$(api PUT "/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" -d "$payload")"
fail_if_error "$result"
printf '%s' "$result" | python3 -c "
import json, sys
d = json.load(sys.stdin)
for r in d['result'].get('rules', []):
    if r.get('description') == '''$DESCRIPTION''':
        print('rule:', r['description'], '| cache:', r['action_parameters'].get('cache'))
"

echo
echo "Now purge both zones, then verify:"
echo "  curl -sSI https://$ZONE_NAME/ | grep -iE 'cf-cache-status|age:'"
echo "  curl -sSI https://www.$ZONE_NAME/ | grep -iE 'HTTP|location'"
