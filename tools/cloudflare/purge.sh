#!/usr/bin/env bash
# Purges the edge cache. Run this after every deploy once the Cache Rule is in
# place: a cached page can outlive the deployment it came from, and the HTML
# references content-hashed bundles that only exist in the deployment that
# built them. Stale HTML plus a new deployment means 404s on hydration.
#
#   CF_API_TOKEN=… bash tools/cloudflare/purge.sh [zone]
#
# The token needs Zone → Cache Purge, and Zone → Zone → Read for the name
# lookup. `npm run deploy` calls this automatically when CF_API_TOKEN is set,
# and skips it silently when it is not.
set -euo pipefail

ZONE_NAME="${1:-seanbehan.ca}"

if [ -z "${CF_API_TOKEN:-}" ]; then
	echo "CF_API_TOKEN not set — skipping edge purge." >&2
	echo "If the Cache Rule is live, purge by hand: bash tools/cloudflare/purge.sh" >&2
	exit 0
fi

api() {
	local method="$1" path="$2"
	shift 2
	curl -sS -X "$method" "https://api.cloudflare.com/client/v4$path" \
		-H "Authorization: Bearer $CF_API_TOKEN" \
		-H "Content-Type: application/json" \
		"$@"
}

json() { python3 -c "import json,sys; d=json.load(sys.stdin); $1"; }

ZONE_ID="${CF_ZONE_ID:-}"
if [ -z "$ZONE_ID" ]; then
	ZONE_ID="$(api GET "/zones?name=$ZONE_NAME" | json "print(d['result'][0]['id'] if d.get('success') and d['result'] else '')")"
	[ -n "$ZONE_ID" ] || {
		echo "could not resolve zone $ZONE_NAME — is the token scoped to it?" >&2
		exit 1
	}
fi

# Everything, rather than a file list: the site is small, and a list that
# drifts out of step with the routes is worse than no list at all. The hashed
# assets are unaffected — their URLs changed with the deployment anyway.
result="$(api POST "/zones/$ZONE_ID/purge_cache" -d '{"purge_everything":true}')"

printf '%s' "$result" | python3 -c "
import json, sys
d = json.load(sys.stdin)
if not d.get('success'):
    print('purge failed:', json.dumps(d.get('errors'), indent=2), file=sys.stderr)
    sys.exit(1)
print('edge cache purged for $ZONE_NAME')"
