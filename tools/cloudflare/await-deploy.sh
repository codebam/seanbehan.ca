#!/usr/bin/env bash
# Waits for a Cloudflare Pages deployment of a given commit to go live, so a
# purge cannot land on the build it was meant to follow.
#
#   CF_API_TOKEN=… CF_ACCOUNT_ID=… bash tools/cloudflare/await-deploy.sh <project> <commit-sha>
#
# Cloudflare's git integration does not report back to GitHub — the repo has no
# GitHub deployments, so a workflow cannot key off `deployment_status` and has
# nothing to wait on but the API. Polling for the commit is the difference
# between purging the new build and purging the old one ten seconds before the
# new one replaces it.
#
# The token needs Account → Cloudflare Pages → Read on top of Cache Purge. When
# CF_ACCOUNT_ID is unset the script degrades to a fixed sleep and says so: a
# purge on a timer is still better than no purge, and this keeps the workflow
# working with a purge-only token.
set -euo pipefail

PROJECT="${1:?usage: await-deploy.sh <project> <commit-sha>}"
COMMIT="${2:?usage: await-deploy.sh <project> <commit-sha>}"
TIMEOUT="${DEPLOY_TIMEOUT:-600}"
FALLBACK_SLEEP="${DEPLOY_FALLBACK_SLEEP:-180}"

: "${CF_API_TOKEN:?set CF_API_TOKEN}"

if [ -z "${CF_ACCOUNT_ID:-}" ]; then
	echo "CF_ACCOUNT_ID not set — cannot poll Pages, sleeping ${FALLBACK_SLEEP}s instead." >&2
	sleep "$FALLBACK_SLEEP"
	exit 0
fi

# Reports one of: success / failure / pending. A commit that is not the newest
# deployment yet reads as pending, which is the same thing as "keep waiting".
status_of() {
	curl -sS "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/pages/projects/$PROJECT/deployments?per_page=10" \
		-H "Authorization: Bearer $CF_API_TOKEN" |
		python3 -c "
import json, sys
d = json.load(sys.stdin)
if not d.get('success'):
    print('api-error', json.dumps(d.get('errors'))[:200], file=sys.stderr)
    print('error'); sys.exit(0)
for dep in d.get('result') or []:
    meta = (dep.get('deployment_trigger') or {}).get('metadata') or {}
    if meta.get('commit_hash', '').startswith('$COMMIT'[:12]):
        print((dep.get('latest_stage') or {}).get('status') or 'pending'); sys.exit(0)
print('pending')"
}

deadline=$((SECONDS + TIMEOUT))
while [ "$SECONDS" -lt "$deadline" ]; do
	case "$(status_of)" in
	success)
		echo "$PROJECT: deployment of ${COMMIT:0:8} is live"
		exit 0
		;;
	failure | canceled | skipped)
		echo "$PROJECT: deployment of ${COMMIT:0:8} did not succeed — not purging" >&2
		exit 1
		;;
	error)
		# A token without Pages → Read cannot poll. Fall back rather than fail:
		# the purge is the point, and the wait is only there to time it.
		echo "$PROJECT: cannot read deployments — sleeping ${FALLBACK_SLEEP}s instead." >&2
		sleep "$FALLBACK_SLEEP"
		exit 0
		;;
	esac
	sleep 10
done

echo "$PROJECT: timed out after ${TIMEOUT}s waiting for ${COMMIT:0:8}" >&2
exit 1
