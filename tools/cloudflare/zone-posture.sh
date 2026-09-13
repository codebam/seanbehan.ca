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
# A www copy must redirect before the shared cache can answer it: when the
# cache key does not distinguish the host, an apex HTML copy can be served on
# www and the Worker's 301 never runs. The rule that caches HTML is scoped to
# the apex, and a Page Rule answers www before the cache.
#
#   CF_API_TOKEN=… bash tools/cloudflare/zone-posture.sh            # report
#   CF_API_TOKEN=… bash tools/cloudflare/zone-posture.sh --apply    # apply + purge
#   CF_API_TOKEN=… bash tools/cloudflare/zone-posture.sh --apply --www-only
#   CF_API_TOKEN=… bash tools/cloudflare/zone-posture.sh --apply --drop-legacy-cache
#   CF_API_TOKEN=… bash tools/cloudflare/zone-posture.sh --apply codebam.ca
#
# --www-only is for a token that holds Page Rules Edit and Cache Purge but not
# the Zone Settings or Cache Rules permissions: it still creates the www
# redirect and purges, and skips the settings work with a warning.
#
# Full apply wants Zone → Zone Settings → Edit, Zone → Cache Rules → Edit,
# Zone → Page Rules → Edit and Zone → Cache Purge. Report mode only needs
# Zone → Zone → Read plus whatever it can read.
set -euo pipefail

APPLY=0
WWW_ONLY=0
DROP_LEGACY=0
ZONES=()
for arg in "$@"; do
case "$arg" in
--apply) APPLY=1 ;;
--www-only) WWW_ONLY=1 ;;
--drop-legacy-cache) DROP_LEGACY=1 ;;
-h | --help)
sed -n '2,30p' "$0"
exit 0
;;
-*)
echo "unknown option: $arg" >&2
exit 2
;;
*) ZONES+=("$arg") ;;
esac
done
if [ ${#ZONES[@]} -eq 0 ]; then
ZONES=(seanbehan.ca codebam.ca)
fi

: "${CF_API_TOKEN:?set CF_API_TOKEN to a Cloudflare API token}"

api() {
local method="$1" path="$2"
shift 2
curl -sS -X "$method" "https://api.cloudflare.com/client/v4$path" \
-H "Authorization: Bearer $CF_API_TOKEN" \
-H "Content-Type: application/json" \
"$@"
}

json() { python3 -c "import json,sys; d=json.load(sys.stdin); $1"; }

succeeded() { printf '%s' "$1" | json "sys.exit(0 if d.get('success') else 1)" 2>/dev/null; }

create_www_page_rule() {
local zone_id="$1" zone="$2" result
local payload="{\"targets\":[{\"target\":\"url\",\"constraint\":{\"operator\":\"matches\",\"value\":\"www.$zone/*\"}}],\"actions\":[{\"id\":\"forwarding_url\",\"value\":{\"url\":\"https://$zone/\$1\",\"status_code\":301}}],\"priority\":1,\"status\":\"active\"}"
result="$(api POST "/zones/$zone_id/pagerules" -d "$payload")"
if succeeded "$result"; then
echo "created www -> $zone page rule"
else
echo "warning: could not create the www page rule: $(printf '%s' "$result" | json "print(d.get('errors'))")" >&2
fi
}

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

bct_ok=0
hsts_ok=0
if [ "$WWW_ONLY" = 0 ]; then
current="$(api GET "/zones/$zone_id/settings/browser_cache_ttl")"
if succeeded "$current"; then
bct_ok=1
echo "browser_cache_ttl: $(printf '%s' "$current" | json "print(d['result']['value'])")"
else
echo "browser_cache_ttl: token cannot read it (needs Zone → Zone Settings → Read)" >&2
fi

current="$(api GET "/zones/$zone_id/settings/security_header")"
if succeeded "$current"; then
hsts_ok=1
echo "security_header:  $(printf '%s' "$current" | json "import json; print(json.dumps(d['result']['value'], sort_keys=True))")"
else
echo "security_header: token cannot read it (needs Zone → Zone Settings → Read)" >&2
fi

ruleset="$(api GET "/zones/$zone_id/rulesets/phases/http_request_cache_settings/entrypoint")"
if succeeded "$ruleset"; then
expr="$(printf '%s' "$ruleset" | json "print(next((r.get('expression','') for r in ((d.get('result') or {}).get('rules') or []) if r.get('description') == 'Cache prerendered HTML'), '(no matching cache rule)'))")"
echo "html cache rule: $expr"
else
echo "html cache rule: token cannot read it (needs Zone → Cache Rules → Read)" >&2
fi
fi

page_read=0
page_rules="$(api GET "/zones/$zone_id/pagerules")"
if succeeded "$page_rules"; then
page_read=1
existing="$(printf '%s' "$page_rules" | json "print(', '.join(((r.get('targets') or [{}])[0].get('constraint') or {}).get('value','?') for r in d['result']) or 'none')")"
echo "page rules: $existing"
printf '%s' "$page_rules" | json "
for r in d['result']:
    targets = '; '.join(str(((t.get('constraint') or {}).get('value','?'))) for t in (r.get('targets') or []))
    actions = ', '.join(str(a.get('id')) + '=' + str(a.get('value')) for a in (r.get('actions') or []))
    print('  -', r.get('id'), '|', targets, '|', actions)
"
legacy_ids="$(printf '%s' "$page_rules" | json "print(' '.join(r['id'] for r in d['result'] if any(a.get('id') == 'cache_level' and 'cache_everything' in str(a.get('value')) for a in (r.get('actions') or []))))")"
if [ "$APPLY" = 1 ] && [ "$DROP_LEGACY" = 1 ]; then
if [ -n "$legacy_ids" ]; then
for rule_id in $legacy_ids; do
result="$(api DELETE "/zones/$zone_id/pagerules/$rule_id")"
if succeeded "$result"; then
echo "deleted legacy cache-everything page rule $rule_id"
else
echo "warning: could not delete page rule $rule_id: $(printf '%s' "$result" | json "print(d.get('errors'))")" >&2
fi
done
else
echo "no cache-everything page rule found"
fi
fi
else
echo "page rules: token cannot read them (needs Zone → Page Rules → Read)" >&2
fi

if [ "$APPLY" = 1 ]; then
if [ "$page_read" = 1 ]; then
has_www="$(printf '%s' "$page_rules" | json "print(any('www.$zone' in (((r.get('targets') or [{}])[0].get('constraint') or {}).get('value','')) for r in d['result']))")"
if [ "$has_www" = "True" ]; then
echo "www page rule already present"
else
create_www_page_rule "$zone_id" "$zone"
fi
elif [ "$WWW_ONLY" = 1 ]; then
echo "page rules unreadable; attempting to create the www rule anyway" >&2
create_www_page_rule "$zone_id" "$zone"
fi

if [ "$WWW_ONLY" = 0 ]; then
if [ "$bct_ok" = 1 ]; then
if succeeded "$(api PATCH "/zones/$zone_id/settings/browser_cache_ttl" -d '{"value":0}')"; then
echo "set browser_cache_ttl = 0 (respect origin)"
else
echo "warning: could not set browser_cache_ttl (needs Zone Settings Edit)" >&2
fi
fi
if [ "$hsts_ok" = 1 ]; then
if succeeded "$(api PATCH "/zones/$zone_id/settings/security_header" -d "$HSTS_PATCH")"; then
echo "set HSTS = max-age=63072000; includeSubDomains; preload"
else
echo "warning: could not set HSTS (needs Zone Settings Edit)" >&2
fi
fi
fi

www_url="https://www.$zone/"
purge="$(api POST "/zones/$zone_id/purge_cache" -d "{\"files\":[\"$www_url\"]}")"
if succeeded "$purge"; then
echo "purged $www_url"
else
echo "warning: targeted purge of $www_url rejected (needs Cache Purge): $(printf '%s' "$purge" | json "print(d.get('errors'))")" >&2
fi
fi
done

if [ "$APPLY" = 1 ]; then
if [ "$WWW_ONLY" = 0 ]; then
for zone in "${ZONES[@]}"; do
if ! bash "$(dirname "$0")/cache-rule.sh" "$zone"; then
echo "warning: could not update the HTML cache rule for $zone (token may lack Cache Rules edit)" >&2
fi
done
fi
for zone in "${ZONES[@]}"; do
bash "$(dirname "$0")/purge.sh" "$zone"
done
fi
