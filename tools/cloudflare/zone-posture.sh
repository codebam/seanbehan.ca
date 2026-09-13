#!/usr/bin/env bash
# The zone posture the repo assumes, applied instead of documented.
#
# The Worker already sends Strict-Transport-Security at max-age=63072000 with
# includeSubDomains and preload (src/middleware.ts). Cloudflare's zone-level
# HSTS setting overrides that header, and a lower zone value silently weakens
# the header the code believes it ships, so the two have to move together.
# Browser Cache TTL belongs at "Respect Existing Headers" (value 0) because
# the route and middleware policies are the source of truth, not a zone-wide
# day-long override.
#
#   CF_API_TOKEN=… bash tools/cloudflare/zone-posture.sh            # report
#   CF_API_TOKEN=… bash tools/cloudflare/zone-posture.sh --apply    # apply + purge
#   CF_API_TOKEN=… bash tools/cloudflare/zone-posture.sh --apply codebam.ca
#
# The token needs Zone → Zone Settings → Edit, plus Zone → Cache Purge when
# --apply is used (the purge calls tools/cloudflare/purge.sh).
set -euo pipefail

APPLY=0
if [ "${1:-}" = "--apply" ]; then
APPLY=1
shift
fi

ZONES=("$@")
if [ ${#ZONES[@]} -eq 0 ]; then
ZONES=(seanbehan.ca codebam.ca)
fi

: "${CF_API_TOKEN:?set CF_API_TOKEN to a token with Zone Settings Edit}"

api() {
local method="$1" path="$2"
shift 2
curl -sS -X "$method" "https://api.cloudflare.com/client/v4$path" \
-H "Authorization: Bearer $CF_API_TOKEN" \
-H "Content-Type: application/json" \
"$@"
}

json() { python3 -c "import json,sys; d=json.load(sys.stdin); $1"; }

check() {
python3 - "$1" <<-'PY'
import json, sys
d = json.loads(sys.argv[1])
if not d.get('success'):
    print('Cloudflare API error:', json.dumps(d.get('errors'), indent=2), file=sys.stderr)
    sys.exit(1)
PY
}

# The value src/middleware.ts emits, kept in one place for the patch below.
HSTS_PATCH='{"value":{"strict_transport_security":{"enabled":true,"max_age":63072000,"include_subdomains":true,"preload":true,"nosniff":true}}}'

echo "zones visible to this token:"
api GET "/zones?per_page=50" | json "print('  ' + ', '.join(z['name'] for z in (d.get('result') or [])) if d.get('success') else json.dumps(d.get('errors')))"

for zone in "${ZONES[@]}"; do
echo "=== $zone"
zone_id="$(api GET "/zones?name=$zone" | json "print(d['result'][0]['id'] if d.get('success') and d['result'] else '')")"
[ -n "$zone_id" ] || {
echo "could not resolve zone $zone — is the token scoped to it?" >&2
exit 1
}

current="$(api GET "/zones/$zone_id/settings/browser_cache_ttl")"
check "$current"
echo "browser_cache_ttl: $(printf '%s' "$current" | json "print(d['result']['value'])")"

current="$(api GET "/zones/$zone_id/settings/security_header")"
check "$current"
echo "security_header:  $(printf '%s' "$current" | json "import json; print(json.dumps(d['result']['value'], sort_keys=True))")"

ruleset="$(api GET "/zones/$zone_id/rulesets/phases/http_request_cache_settings/entrypoint")"
expr="$(printf '%s' "$ruleset" | json "print(next((r.get('expression','') for r in ((d.get('result') or {}).get('rules') or []) if r.get('description') == 'Cache prerendered HTML'), '(no matching cache rule)'))")"
echo "html cache rule: $expr"

if [ "$APPLY" = 1 ]; then
result="$(api PATCH "/zones/$zone_id/settings/browser_cache_ttl" -d '{"value":0}')"
check "$result"
echo "set browser_cache_ttl = 0 (respect origin)"

result="$(api PATCH "/zones/$zone_id/settings/security_header" -d "$HSTS_PATCH")"
check "$result"
echo "set HSTS = max-age=63072000; includeSubDomains; preload"

www_url="https://www.$zone/"
purge="$(api POST "/zones/$zone_id/purge_cache" -d "{\"files\":[\"$www_url\"]}")"
if printf '%s' "$purge" | json "sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
echo "purged $www_url"
else
echo "warning: targeted purge of $www_url rejected: $(printf '%s' "$purge" | json "print(d.get('errors'))")" >&2
fi
fi
done

if [ "$APPLY" = 1 ]; then
# Keep the HTML cache rule scoped to the apex: an edge-cached www copy
# outranks the middleware 301 that sends www to the apex. Purge last, so a
# copy already stored under the www key cannot survive the change.
for zone in "${ZONES[@]}"; do
if ! bash "$(dirname "$0")/cache-rule.sh" "$zone"; then
echo "warning: could not update the HTML cache rule for $zone (token may lack Cache Rules edit)" >&2
fi
done
for zone in "${ZONES[@]}"; do
bash "$(dirname "$0")/purge.sh" "$zone"
done
fi
