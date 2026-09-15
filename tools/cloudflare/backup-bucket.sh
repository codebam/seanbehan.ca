#!/usr/bin/env bash
# Backup-bucket posture for `seanbehan-ca-backups`.
#
# The nightly D1 dump is only a backup if the bucket holding it stays private
# and does not grow forever. Nothing in the deploy or backup workflow enforces
# either: wrangler creates the bucket, and a dashboard click (r2.dev URL,
# custom domain, lifecycle) is invisible to a code review. This checker reads
# the five wrangler commands that expose that state and reports it.
#
#   bash tools/cloudflare/backup-bucket.sh          # report only, reads all five
#   bash tools/cloudflare/backup-bucket.sh --apply  # add the 90-day expiry rule if missing
#   bash tools/cloudflare/backup-bucket.sh --help
#
# --apply is the only mutation this script can make. It adds one lifecycle
# rule (`backups-expire-90d`, expire objects after 90 days) when no
# object-expiry rule exists, and never touches public access, domains, locks,
# existing lifecycle rules, or objects. Adding is idempotent: a second run
# reads the rule back and refuses to add a duplicate.
#
# --apply needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, or a local
# `wrangler login`; report mode only needs whatever the read commands need.
#
# This script is deliberately not called from CI. `.github/workflows/backup.yml`
# uploads on a schedule, but deciding that a bucket is private or that backups
# should expire is an owner action; wire this in only if that changes.
#
# Exit status:
#   0  posture clean (or --apply made it clean)
#   1  a gap was found, or one of the five reads failed
#   2  bad usage
set -euo pipefail

BUCKET=seanbehan-ca-backups
LIFECYCLE_RULE=backups-expire-90d
LIFECYCLE_DAYS=90
APPLY=0

usage() {
	cat <<'EOF'
Usage: bash tools/cloudflare/backup-bucket.sh [--apply]

  (no arguments)  read-only posture report for seanbehan-ca-backups
  --apply         add the 90-day object-expiry lifecycle rule if no expiry
                  rule exists; refuses all other mutations
  -h, --help      this text

Reads: r2 bucket info, dev-url get, domain list, lifecycle list, lock list.
The bucket is fixed; pass no bucket name.
EOF
}

for arg in "$@"; do
	case "$arg" in
	--apply)
		APPLY=1
		;;
	-h | --help)
		usage
		exit 0
		;;
	-*)
		echo "unknown option: $arg" >&2
		usage >&2
		exit 2
		;;
	*)
		echo "unexpected argument: $arg (the bucket is fixed to $BUCKET)" >&2
		usage >&2
		exit 2
		;;
	esac
done

# Wrangler stores OAuth state under the global config dir; `wrangler login`
# writes config/default.toml (or default.enc when the keyring is in use). The
# legacy ~/.wrangler layout is still the one wrangler prefers when it exists.
has_wrangler_login() {
	local base
	for base in "${XDG_CONFIG_HOME:-$HOME/.config}/.wrangler" "${XDG_CONFIG_HOME:-$HOME/.config}/wrangler" "$HOME/.wrangler"; do
		if [ -f "$base/config/default.toml" ] || [ -f "$base/config/default.enc" ]; then
			return 0
		fi
	done
	return 1
}

if [ "$APPLY" = 1 ]; then
	if [ -n "${CLOUDFLARE_API_TOKEN:-}" ] && [ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
		echo "--apply: using CLOUDFLARE_API_TOKEN/CLOUDFLARE_ACCOUNT_ID from the environment"
	elif has_wrangler_login; then
		echo "--apply: using the local wrangler login (no token pair in the environment)"
	else
		echo "--apply needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID, or a logged-in wrangler (npx wrangler login)." >&2
		exit 1
	fi
fi

FAILED=0
PRIVACY_GAP=0
LIFECYCLE_GAP=0

INFO_OK=0
DEV_OK=0
DOMAIN_OK=0
LIFECYCLE_OK=0
LOCK_OK=0
INFO=''
DEV=''
DOMAINS=''
LIFECYCLE=''
LOCKS=''

# Each read is captured whole (stderr included) so a refusal is visible in the
# report instead of being swallowed or mistaken for an empty result.
if INFO="$(npx wrangler r2 bucket info "$BUCKET" --json 2>&1)"; then INFO_OK=1; fi
if DEV="$(npx wrangler r2 bucket dev-url get "$BUCKET" 2>&1)"; then DEV_OK=1; fi
if DOMAINS="$(npx wrangler r2 bucket domain list "$BUCKET" 2>&1)"; then DOMAIN_OK=1; fi
if LIFECYCLE="$(npx wrangler r2 bucket lifecycle list "$BUCKET" 2>&1)"; then LIFECYCLE_OK=1; fi
if LOCKS="$(npx wrangler r2 bucket lock list "$BUCKET" 2>&1)"; then LOCK_OK=1; fi

echo "=== backup bucket posture: $BUCKET ==="
echo

echo "-- bucket info"
if [ "$INFO_OK" = 1 ]; then
	printf '%s\n' "$INFO" | python3 -m json.tool 2>/dev/null || printf '%s\n' "$INFO"
else
	echo "unreadable" >&2
	printf '%s\n' "$INFO" >&2
	FAILED=1
fi

echo
PUBLIC=0
if [ "$DEV_OK" = 1 ]; then
	if printf '%s' "$DEV" | grep -qi 'enabled at'; then
		PUBLIC=1
		R2_DEV_URL="$(printf '%s' "$DEV" | grep -oi "https:[^']*" | head -n1 || true)"
		echo "r2.dev URL: PUBLIC${R2_DEV_URL:+ — $R2_DEV_URL}"
	else
		echo "r2.dev URL: disabled"
	fi
else
	echo "r2.dev URL: unreadable" >&2
	printf '%s\n' "$DEV" >&2
	FAILED=1
fi

CUSTOM_DOMAIN=0
if [ "$DOMAIN_OK" = 1 ]; then
	if printf '%s' "$DOMAINS" | grep -qi 'no custom domains'; then
		echo "custom domains: none"
	else
		CUSTOM_DOMAIN=1
		echo "custom domains: PRESENT — this hostname is a public path to the backups:"
		printf '%s\n' "$DOMAINS" | sed 's/^/  /'
	fi
else
	echo "custom domains: unreadable" >&2
	printf '%s\n' "$DOMAINS" >&2
	FAILED=1
fi

echo
EXPIRY=0
HAS_OURS=0
if [ "$LIFECYCLE_OK" = 1 ]; then
	if printf '%s' "$LIFECYCLE" | grep -qi 'no lifecycle rules'; then
		echo "lifecycle: no rules — backups currently accumulate forever"
	elif printf '%s' "$LIFECYCLE" | grep -qi 'expire'; then
		EXPIRY=1
		echo "lifecycle: object-expiry configured"
		printf '%s\n' "$LIFECYCLE" | sed 's/^/  /'
	else
		echo "lifecycle: rules exist, but none expire objects"
		printf '%s\n' "$LIFECYCLE" | sed 's/^/  /'
	fi
	if printf '%s' "$LIFECYCLE" | grep -Fq "$LIFECYCLE_RULE"; then
		HAS_OURS=1
	fi
else
	echo "lifecycle: unreadable" >&2
	printf '%s\n' "$LIFECYCLE" >&2
	FAILED=1
fi

echo
if [ "$LOCK_OK" = 1 ]; then
	if printf '%s' "$LOCKS" | grep -qi 'no lock rules'; then
		echo "lock rules: none"
	else
		echo "lock rules: present"
		printf '%s\n' "$LOCKS" | sed 's/^/  /'
	fi
else
	echo "lock rules: unreadable" >&2
	printf '%s\n' "$LOCKS" >&2
	FAILED=1
fi

echo
if [ "$PUBLIC" = 1 ] || [ "$CUSTOM_DOMAIN" = 1 ]; then
	echo "PRIVACY: FAIL — the backup bucket has a public entry point." >&2
	PRIVACY_GAP=1
elif [ "$DEV_OK" = 1 ] && [ "$DOMAIN_OK" = 1 ]; then
	echo "PRIVACY: OK — no r2.dev URL or custom domain is configured."
else
	echo "PRIVACY: UNKNOWN — a public-access read failed; see the errors above." >&2
fi

if [ "$LIFECYCLE_OK" != 1 ]; then
	echo "LIFECYCLE: UNKNOWN — the lifecycle list could not be read." >&2
elif [ "$EXPIRY" = 1 ]; then
	echo "LIFECYCLE: OK — at least one object-expiry rule is configured."
else
	echo "LIFECYCLE: MISSING — no object-expiry rule was found." >&2
	LIFECYCLE_GAP=1
fi

if [ "$APPLY" = 1 ]; then
	echo
	if [ "$LIFECYCLE_OK" != 1 ]; then
		echo "--apply: refusing to write while the lifecycle list is unreadable; fix that check first." >&2
		FAILED=1
	elif [ "$EXPIRY" = 1 ]; then
		echo "--apply: an object-expiry rule already exists; nothing to add (idempotent)."
	elif [ "$HAS_OURS" = 1 ]; then
		echo "--apply: rule '$LIFECYCLE_RULE' exists but no expire action was recognised; inspect it in the dashboard rather than adding a duplicate." >&2
		FAILED=1
	else
		echo "--apply: adding '$LIFECYCLE_RULE' (expire objects after $LIFECYCLE_DAYS days)"
		if npx wrangler r2 bucket lifecycle add "$BUCKET" "$LIFECYCLE_RULE" --expire-days "$LIFECYCLE_DAYS" --force; then
			EXPIRY=1
			LIFECYCLE_GAP=0
			echo "--apply: lifecycle rule added."
		else
			echo "--apply: lifecycle add failed." >&2
			FAILED=1
		fi
	fi
fi

echo
if [ "$FAILED" = 1 ]; then
	echo "One or more checks failed; the report above is incomplete." >&2
fi
if [ "$PRIVACY_GAP" = 1 ]; then
	echo "Next step (dashboard, not this script): disable the r2.dev URL and remove any custom domain from $BUCKET." >&2
fi
if [ "$LIFECYCLE_GAP" = 1 ]; then
	echo "Next step: re-run with --apply to add the $LIFECYCLE_DAYS-day expiry rule." >&2
fi
if [ "$FAILED" = 1 ] || [ "$PRIVACY_GAP" = 1 ] || [ "$LIFECYCLE_GAP" = 1 ]; then
	exit 1
fi

echo "Backup bucket posture is clean."
exit 0
