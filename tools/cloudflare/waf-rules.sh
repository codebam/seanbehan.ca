#!/usr/bin/env bash
# WAF posture for the site(s), in the repo next to the cache rule.
#
# The two layers, and which one a free plan actually gets:
#
#   * `admin-panel: rate-limit /_emdash` — 2 req / 10 s / IP, block. The
#     admin panel and its API: every request that isn't absorbed here is a
#     full Worker render through D1 (metered). This is the rule that matters
#     to an attacker of exactly this site, and the one the free plan's
#     one-slot budget should be spent on.
#
#   * `zone: per-IP rate floor` — 100 req / 10 s / IP (FLOOR_RATE) over,
#     Managed challenge. The backstop for the surfaces the code cannot
#     close: /search.json?q=… (one render per distinct query) and
#     ?_preview=… (deliberately never cached).
#
#   * `admin-panel: block /_emdash except allow-list` (custom rule) — only
#     when ALLOWED_IPS is set. Stronger than the rate limit: a rate limit
#     charges the attacker 2 req / 10 s per IP and lets two through; an
#     allow-list lets nothing through. It is a Custom Rule, not a Rate
#     Limiting Rule, so it does not spend the free tier's slot. Delete it
#     in the dashboard (or extend this script) when it is unwanted.
#
# THE FREE-PLAN CAP: the free tier allows ONE rate-limiting rule per zone,
# and it counts every active one no matter which API created it — including
# the rule created by hand in the dashboard. So the two layers above cannot
# both exist on free. This script enacts the trade instead of failing on
# it:
#
#   * default mode (RATE_LIMIT_MODE=admin): if the zone already holds its
#     one rule, it is kept and nothing is written; if the slot is free, the
#     /_emdash rule is installed and the floor is not (say so loudly).
#   * RATE_LIMIT_MODE=floor: delete whatever holds the slot and install the
#     floor only. /_emdash keeps working (authentication still guards it),
#     it just loses its rate limit. Choose this only deliberately.
#
# Usage:
#   CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh                 # both zones, admin mode
#   CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh seanbehan.ca    # one zone
#   RATE_LIMIT_MODE=floor CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh
#   ALLOWED_IPS="1.2.3.4, 5.6.7.0/24" CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh
#   DRY_RUN=1 CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh       # print, don't write
#
# Token permissions, per zone: WAF → Rate Limiting (Edit + the legacy
# Rate Limit Rules delete for floor mode), WAF → Custom Rules (Edit),
# Zone → Read (name lookup), Settings (Bot Fight Mode). The bot-fight flip
# is best-effort; a refusal there warns, it does not fail the run.
#
# Idempotent: custom rules with the same description are replaced in place;
# rate-limit slots are measured before anything is written.
set -euo pipefail

ZONES=("$@")
[ ${#ZONES[@]} -eq 0 ] && ZONES=(seanbehan.ca codebam.ca)

FLOOR_RATE="${FLOOR_RATE:-100}"
RATE_LIMIT_MODE="${RATE_LIMIT_MODE:-admin}"
DRY_RUN="${DRY_RUN:-0}"

: "${CF_API_TOKEN:?set CF_API_TOKEN}"

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
python3 - "$1" <<'EOF'
import json, sys
d = json.loads(sys.argv[1])
if not d.get('success'):
    print('Cloudflare API error:', json.dumps(d.get('errors'), indent=2), file=sys.stderr)
    sys.exit(1)
EOF
}

resolve_zone_id() { # $1 = zone name
	local zone_name="$1" response
	response="$(api GET "/zones?name=$zone_name")"
	fail_if_error "$response"
	local id
	id="$(printf '%s' "$response" | json "print(d['result'][0]['id'] if d['result'] else '')")"
	if [ -z "$id" ]; then
		echo "no zone named $zone_name visible to this token — pass CF_ZONE_ID=<id> instead." >&2
		exit 1
	fi
	printf '%s' "$id"
}

apply_phase() { # $1 = zone id  $2 = phase  $3 = python expression building the managed rules list
	local zone_id="$1" phase="$2" build_expr="$3"
	local existing current_rules payload result
	existing="$(api GET "/zones/$zone_id/rulesets/phases/$phase/entrypoint" || true)"
	current_rules='[]'
	if printf '%s' "$existing" | json "sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
		current_rules="$(printf '%s' "$existing" | json "print(json.dumps(d['result'].get('rules', [])))")"
	fi
	payload="$(python3 - "$current_rules" "$build_expr" <<'EOF'
	import json, sys

	rules = json.loads(sys.argv[1])
	managed = json.loads(sys.argv[2])

	# Drop earlier copies of the rules we own (same description), keep the
	# rest in its original order, then append ours in the order given.
	ours = {r['description'] for r in managed}
	kept = [r for r in rules if r.get('description') not in ours]
	for r in kept:
		for key in ('id', 'version', 'last_updated', 'ref'):
			r.pop(key, None)
	print(json.dumps({'rules': kept + managed}))
EOF
)"
	if [ "$DRY_RUN" = 1 ]; then
		echo "--"
		echo "phase $phase:"
		printf '%s' "$payload" | python3 -m json.tool
		return 0
	fi
	result="$(api PUT "/zones/$zone_id/rulesets/phases/$phase/entrypoint" -d "$payload")"
	fail_if_error "$result"
	printf '%s' "$result" | json "
[print('  rule:', r.get('description'), '|', r.get('expression'), '->', r.get('action')) for r in d['result'].get('rules', [])]"
}

ratelimit_rule_py() { # $1 = floor  $2 = mode (admin | floor): one rule at a time, the free tier allows no more
	python3 - "$FLOOR_RATE" "$2" <<'EOF'
import json, sys
floor = int(sys.argv[1])
mode = sys.argv[2]
rule = {
    'description': 'admin-panel: rate-limit /_emdash',
    'expression': '(http.request.uri.path starts_with "/_emdash")',
    'action': 'rate_limit',
    'enabled': True,
    'action_parameters': {
        'ratelimit': {
            'characteristics': ['ip.src'],
            'intervals': ['10s'],
            'mitigations': ['block'],
            'rate': 2,
        }
    },
}
if mode == 'floor':
    rule = {
        'description': 'zone: per-IP rate floor',
        'expression': 'true',
        'action': 'rate_limit',
        'enabled': True,
        'action_parameters': {
            'ratelimit': {
                'characteristics': ['ip.src'],
                'intervals': ['10s'],
                'mitigations': ['managed_challenge'],
                'rate': floor,
            }
        },
    }
print(json.dumps([rule]))
EOF
}

allowlist_rule_py() {
	python3 - "${ALLOWED_IPS}" <<'EOF'
import json, sys
ips = sys.argv[1].strip()
if not ips:
    print(json.dumps([]))
else:
    print(json.dumps([
        {
            'description': 'admin-panel: block /_emdash except allow-list',
            'expression': '(http.request.uri.path starts_with "/_emdash") and not (ip.src in {' + ips + '})',
            'action': 'block',
            'enabled': True,
        }
    ]))
EOF
}

for zone in "${ZONES[@]}"; do
	zone_id="${CF_ZONE_ID:-$(resolve_zone_id "$zone")}"
	echo "zone $zone ($zone_id)"

	# The free tier's one rate-limiting slot is shared across every origin
	# (dashboard or API), so measure it before writing anything at all.
	existing="$(api GET "/zones/$zone_id/rules/ratelimits" || true)"
	ex_count="$(printf '%s' "$existing" | json "print(len(d['result']))" 2>/dev/null || echo 0)"
	ex_name="$(printf '%s' "$existing" | json "print(((d['result'] or [{}])[0]).get('description') or ((d['result'] or [{}])[0]).get('expression') or '?')" 2>/dev/null || echo '?')"

	if [ "$RATE_LIMIT_MODE" = "admin" ]; then
		if [ "$ex_count" -ge 1 ]; then
			echo "  free-tier cap (1 rate-limiting rule/zone) is filled by: $ex_name"
			echo "  keeping it — it is the rule that guards the admin panel. The zone"
			echo "  floor does not fit on the free plan, and swapping it in for the admin"
			echo "  rule would be a downgrade, so nothing is installed."
		else
			echo "  installing the admin-panel rate limit (the zone's one free slot on the free plan); the zone floor is not installed"
			apply_phase "$zone_id" "http_ratelimit_rules" "$(ratelimit_rule_py admin)"
		fi
	else
		# floor mode: takes the one slot the existing rule holds, so remove it first.
		if [ "$ex_count" -ge 1 ] && [ "$DRY_RUN" != 1 ]; then
			ex_ids="$(printf '%s' "$existing" | json "print(' '.join(r['id'] for r in d['result']))" 2>/dev/null)"
			for rid in $ex_ids; do
				api DELETE "/zones/$zone_id/rules/ratelimits/$rid" > /dev/null
				echo "  deleted existing rule $rid (the floor takes the slot)"
			done
		else
			echo "  (dry run) floor mode would delete the existing rule(s) above and install the floor instead"
		fi
		echo "  installing the zone floor — deliberate choice: /_emdash keeps working (authentication still guards it) but loses its rate limit"
		apply_phase "$zone_id" "http_ratelimit_rules" "$(ratelimit_rule_py floor)"
	fi

	if [ -n "${ALLOWED_IPS:-}" ]; then
		apply_phase "$zone_id" "http_custom_rules" "$(allowlist_rule_py)"
	else
		echo "  (ALLOWED_IPS not set — skipping the /_emdash allow-list rule)"
	fi

	# Best-effort: Bot Fight Mode. It is the cheap layer that challenges
	# non-browser clients before the flood even reaches a rate counter. A
	# refusal (plan/scoping) is printed and survives; it is not fatal.
	bfm="$(api PUT "/zones/$zone_id/settings/bots" -d '{"bot_fight_mode": true}' || true)"
	if printf '%s' "$bfm" | json "sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
		echo "  bot fight mode: enabled"
	else
		echo "  bot fight mode: API refused it (enable in the dashboard: Security → Bots)." >&2
	fi
done

echo
if [ "$DRY_RUN" = 1 ]; then
	echo "DRY RUN — nothing was written."
else
	echo "Done. Verify the live rule (a burst against the panel should be blocked after~"
	echo "  two requests, and a normal load of the admin panel still passes):"
	echo "  for i in \$(seq 1 6); do curl -s -o /dev/null -w '%{http_code} ' https://seanbehan.ca/_emdash/admin; done; echo"
fi
