#!/usr/bin/env bash
# WAF posture for the site(s), in the repo next to the cache rule:
#
#   1. `admin-panel: rate-limit /_emdash` — 2 req / 10 s / IP, block, on
#      every `/_emdash/*` path. (The same policy as the rule created by hand
#      in the dashboard, made durable here; first match wins, so the two can
#      coexist.)
#   2. `zone: per-IP rate floor` — the backstop. Bots that are not caught
#      by 1. (the public pages) are bounded per IP: over the floor they get
#      a Managed Challenge rather than free, uncached renders. This is what
#      tames the two remaining unique-URL surfaces the code cannot fix:
#      /search.json?q=… (one render per distinct query) and ?_preview=…
#      (deliberately never cached).
#   3. `admin-panel: block /_emdash except allow-list` — only written when
#      ALLOWED_IPS is set. Stronger than 1.: a rate limit charges the
#      attacker 2 req / 10 s per IP; an allow-list charges them nothing and
#      gives them nothing. Revoke by passing ALLOWED_IPS="" — no, by
#      re-running WITHOUT it the rule stays; to remove it, delete it in the
#      dashboard or extend this script.
#
#   CF_API_API_TOKEN=… is not a thing. Usage:
#   CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh                 # both zones
#   CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh seanbehan.ca    # one zone
#   ALLOWED_IPS="1.2.3.4, 5.6.7.0/24" CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh
#   DRY_RUN=1 CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh       # print, don't write
#
# The token needs, per zone: WAF → Rate Limiting Rules and WAF → Custom Rules
# (Edit), Zone → Zone → Read (name lookup), and Zone → Settings (Bot Fight
# Mode) — the bot-fight flip is best-effort and a refusal there is a warning,
# not a failure.
#
# Idempotent: rules with the same description are replaced in place.
set -euo pipefail

ZONES=("$@")
[ ${#ZONES[@]} -eq 0 ] && ZONES=(seanbehan.ca codebam.ca)

FLOOR_RATE="${FLOOR_RATE:-100}"
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
	# rest in its original order, then appendours in the order given: the
	# /_emdash rule before the floor, because the first matching rule wins.
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

ratelimit_rules_py() { # emit the JSON list of our two rate-limit rules
	python3 - "$FLOOR_RATE" <<'EOF'
import json, sys
floor = int(sys.argv[1])
print(json.dumps([
    {
        'description': 'admin-panel: rate-limit /_emdash',
        'expression': '(http.request.uri.path starts_with "/_emdash")',
        'action': 'rate_limit',
        'action_parameters': {
            'ratelimit': {
                'characteristics': ['ip.src'],
                'intervals': ['10s'],
                'mitigations': ['block'],
                'rate': 2,
            }
        },
        'enabled': True,
    },
    {
        'description': 'zone: per-IP rate floor',
        'expression': 'true',
        'action': 'rate_limit',
        'action_parameters': {
            'ratelimit': {
                'characteristics': ['ip.src'],
                'intervals': ['10s'],
                'mitigations': ['managed_challenge'],
                'rate': floor,
            }
        },
        'enabled': True,
    },
]))
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
	apply_phase "$zone_id" "http_ratelimit_rules" "$(ratelimit_rules_py)"
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
	echo "Done. Verify the floor is live (a rapid burst should get challenged,"
	echo "not 404'd), and that a normal load of the admin panel still passes:"
	echo "  for i in \$(seq 1 6); do curl -s -o /dev/null -w '%{http_code} ' https://seanbehan.ca/_emdash/admin; done; echo"
fi
