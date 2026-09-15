#!/usr/bin/env bash
# WAF posture for the site(s), in the repo next to the cache rule.
#
# The layers, and which one a plan actually gets:
#
#   * `admin-panel: rate-limit /_emdash` — 2 req / 10 s / IP, block. The
#     admin panel and its API: every request that isn't absorbed here is a
#     full Worker render through D1 (metered). This is the rule that matters
#     to an attacker of exactly this site, and the one the free plan's
#     one-slot budget should be spent on.
#
#   * `commerce: rate-limit checkout POST` — 10 req / min / IP, block. One
#     session creation per purchase, so the bound is deliberately low.
#
#   * `commerce: rate-limit checkout GETs` — 30 req / min / IP, managed
#     challenge. One shared bucket for /checkout/download and
#     /checkout/success because the success page links straight into the
#     download and a refresh must not spend two budgets.
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
# the rule created by hand in the dashboard. So the layers above cannot all
# exist on free. This script makes the trade explicit instead of silently
# misreporting it, and never claims a rule is installed when the retained rule
# is for something else:
#
#   * default mode (RATE_LIMIT_MODE=admin): if the zone already holds its
#     one rule, the retained rule's expression is read. It is kept only if it
#     actually targets /_emdash; an unrelated occupant is reported and the
#     script exits non-zero rather than print false assurance.
#   * RATE_LIMIT_MODE=floor: delete whatever holds the slot and install the
#     floor only. /_emdash keeps working (authentication still guards it),
#     it just loses its rate limit. Choose this only deliberately.
#   * RATE_LIMIT_MODE=commerce: install both checkout rules. That needs a
#     plan/API that allows more than one rate rule. If the slot is already
#     occupied, the script warns about the trade and exits non-zero rather
#     than delete the occupant; on free the operator has to choose between
#     the /_emdash guard and the commerce rules.
#
# ALLOW_OCCUPIED=1 is the explicit override for admin and commerce modes: on a
# plan with more than one rate-limit slot it merges/installs the requested
# rules alongside the retained one instead of exiting. Floor mode deliberately
# always replaces the occupant, so it does not consult the flag. It is
# deliberately not the default; anything on a single-slot plan will still be
# refused by the API.
#
# Usage:
#   CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh                 # both zones, admin mode
#   CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh seanbehan.ca    # one zone
#   RATE_LIMIT_MODE=commerce CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh
#   RATE_LIMIT_MODE=floor CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh
#   ALLOWED_IPS="1.2.3.4, 5.6.7.0/24" CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh
#   ALLOW_OCCUPIED=1 RATE_LIMIT_MODE=commerce CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh
#   DRY_RUN=1 CF_API_TOKEN=… bash tools/cloudflare/waf-rules.sh       # read/report only
#
# DRY_RUN=1 still performs the reads the report depends on; every write
# (rate-limit create/delete, custom-rule write, bot-fight flip) is skipped
# with a printed `DRY_RUN:` line.
#
# Token permissions, per zone: WAF → Rate Limiting (Edit + the legacy
# Rate Limit Rules delete for floor mode), WAF → Custom Rules (Edit),
# Zone → Read (name lookup), Settings (Bot Fight Mode). The bot-fight flip
# is best-effort; a refusal there warns, it does not fail the run. The same
# permissions cover admin, floor and commerce; commerce does not need any
# scope beyond Rate Limiting Edit.
#
# Idempotent: custom rules with the same description are replaced in place;
# rate-limit slots are measured before anything is written. Commerce mode
# recognises its own rules by expression and leaves an already-complete set
# alone.
set -euo pipefail

ZONES=("$@")
[ ${#ZONES[@]} -eq 0 ] && ZONES=(seanbehan.ca codebam.ca)

FLOOR_RATE="${FLOOR_RATE:-100}"
RATE_LIMIT_MODE="${RATE_LIMIT_MODE:-admin}"
DRY_RUN="${DRY_RUN:-0}"
ALLOW_OCCUPIED="${ALLOW_OCCUPIED:-0}"

case "$RATE_LIMIT_MODE" in
admin | floor | commerce) ;;
*)
	echo "unknown RATE_LIMIT_MODE '$RATE_LIMIT_MODE' — expected admin, floor, or commerce." >&2
	exit 2
	;;
esac
case "$DRY_RUN" in
0 | 1) ;;
*)
	echo "DRY_RUN must be 0 or 1, got '$DRY_RUN'." >&2
	exit 2
	;;
esac
case "$ALLOW_OCCUPIED" in
0 | 1) ;;
*)
	echo "ALLOW_OCCUPIED must be 0 or 1, got '$ALLOW_OCCUPIED'." >&2
	exit 2
	;;
esac

: "${CF_API_TOKEN:?set CF_API_TOKEN}"

if [ -n "${ALLOWED_IPS:-}" ]; then
	python3 - "$ALLOWED_IPS" <<'PY'
import ipaddress, sys

raw = sys.argv[1]
allowed_chars = set("0123456789abcdefABCDEF:.,/ ")

for ch in raw:
    if ch not in allowed_chars:
        print(f"ALLOWED_IPS contains {ch!r}, which is outside the allowed set ([0-9a-fA-F:.,/ ]).", file=sys.stderr)
        sys.exit(2)

bad = []
seen = 0
for token in raw.split(","):
    value = token.strip()
    if not value:
        bad.append("(empty entry)")
        continue
    seen += 1
    try:
        if "/" in value:
            ipaddress.ip_network(value, strict=False)
        else:
            ipaddress.ip_address(value)
    except ValueError:
        bad.append(value)

if bad:
    print("ALLOWED_IPS contains invalid entries: " + ", ".join(repr(entry) for entry in bad), file=sys.stderr)
    print('Expected a comma-separated list of IPv4, IPv6, or CIDR values, e.g. "1.2.3.4, 2001:db8::/32".', file=sys.stderr)
    sys.exit(2)
if seen == 0:
    print("ALLOWED_IPS is set but contains no entries.", file=sys.stderr)
    sys.exit(2)
PY
fi

api() {
	local method="$1" path="$2"
	shift 2
	curl -sS -X "$method" "https://api.cloudflare.com/client/v4$path" \
		-H "Authorization: Bearer $CF_API_TOKEN" \
		-H "Content-Type: application/json" \
		"$@"
}

# Every write goes through here so DRY_RUN=1 cannot touch the zone. The
# `DRY_RUN:` line goes to stderr (readers still get the report on stdout)
# and the empty stdout keeps a caller from mistaking the skip for a result.
api_write() {
	local method="$1" path="$2"
	shift 2
	if [ "$DRY_RUN" = 1 ]; then
		echo "DRY_RUN: skipping $method $path" >&2
		return 0
	fi
	api "$method" "$path" "$@"
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

# Normalize the legacy /rules/ratelimits response once: count, all ids, and
# per-rule expression/description. The API fields are `id`, `description`
# and `expression`; this is the only place that knows that shape.
ratelimit_summary() { # $1 = legacy /rules/ratelimits response body
	python3 - "$1" <<'PY'
import json, sys

try:
    d = json.loads(sys.argv[1])
except Exception:
    d = {}
rules = d.get('result') or []

def one_line(value):
    return ' '.join(str(value or '').split())

first = rules[0] if rules else {}
print(json.dumps({
    'count': len(rules),
    'ids': [str(r.get('id') or '') for r in rules],
    'expressions': [one_line(r.get('expression')) for r in rules],
    'first': {
        'description': one_line(first.get('description')),
        'expression': one_line(first.get('expression')) or '?',
        'id': str(first.get('id') or ''),
    },
}))
PY
}

# $1 = summary JSON, $2 = literal substring that must appear in a retained expression.
has_expression() {
	python3 -c '
import json, sys
summary = json.loads(sys.argv[1])
needle = sys.argv[2]
sys.exit(0 if any(needle in expr for expr in summary["expressions"]) else 1)
' "$1" "$2"
}

apply_phase() { # $1 = zone id  $2 = phase  $3 = python expression building the managed rules list
	local zone_id="$1" phase="$2" build_expr="$3"
	local existing current_rules payload result
	existing="$(api GET "/zones/$zone_id/rulesets/phases/$phase/entrypoint" || true)"
	current_rules='[]'
	if printf '%s' "$existing" | json "sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
		current_rules="$(printf '%s' "$existing" | json "print(json.dumps(d['result'].get('rules', [])))")"
	fi
	payload="$(
		python3 - "$current_rules" "$build_expr" <<'EOF'
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
		echo "DRY_RUN: would PUT /zones/$zone_id/rulesets/phases/$phase/entrypoint"
		printf '%s' "$payload" | python3 -m json.tool
		return 0
	fi
	result="$(api_write PUT "/zones/$zone_id/rulesets/phases/$phase/entrypoint" -d "$payload")"
	fail_if_error "$result"
	printf '%s' "$result" | json "
[print('  rule:', r.get('description'), '|', r.get('expression'), '->', r.get('action')) for r in d['result'].get('rules', [])]"
}

ratelimit_rule_py() { # $1 = mode (admin | floor | commerce)  $2 = zone name
	python3 - "$FLOOR_RATE" "$1" "$2" <<'EOF'
import json, sys

floor = int(sys.argv[1])
mode = sys.argv[2]
zone = sys.argv[3]

def rule(description, expression, rate, interval, mitigation):
    return {
        'description': description,
        'expression': expression,
        'action': 'rate_limit',
        'enabled': True,
        'action_parameters': {
            'ratelimit': {
                'characteristics': ['ip.src'],
                'intervals': [interval],
                'mitigations': [mitigation],
                'rate': rate,
            }
        },
    }

if mode == 'admin':
    rules = [rule(
        'admin-panel: rate-limit /_emdash',
        '(http.request.uri.path starts_with "/_emdash")',
        2, '10s', 'block',
    )]
elif mode == 'floor':
    rules = [rule(
        'zone: per-IP rate floor',
        'true',
        floor, '10s', 'managed_challenge',
    )]
elif mode == 'commerce':
    rules = [
        rule(
            'commerce: rate-limit checkout POST',
            'http.host eq "%s" and http.request.method eq "POST" and http.request.uri.path eq "/checkout/cloudflare-workers-production-kit"' % zone,
            10, '1m', 'block',
        ),
        rule(
            'commerce: rate-limit checkout GETs',
            'http.host eq "%s" and http.request.method eq "GET" and (http.request.uri.path eq "/checkout/download" or http.request.uri.path eq "/checkout/success")' % zone,
            30, '1m', 'managed_challenge',
        ),
    ]
else:
    raise SystemExit('unknown RATE_LIMIT_MODE: %s' % mode)

print(json.dumps(rules))
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
	if ! printf '%s' "$existing" | json "sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
		echo "  could not read the zone's rate-limit rules (needs WAF → Rate Limiting Read); refusing to guess whether the free slot is free:" >&2
		printf '%s' "$existing" | python3 -m json.tool >&2 2>/dev/null || printf '%s\n' "$existing" >&2
		exit 1
	fi
	ex_json="$(ratelimit_summary "$existing")"
	ex_count="$(printf '%s' "$ex_json" | json "print(d['count'])")"
	ex_description="$(printf '%s' "$ex_json" | json "print(d['first']['description'] or '?')")"
	ex_expression="$(printf '%s' "$ex_json" | json "print(d['first']['expression'] or '?')")"
	ex_id="$(printf '%s' "$ex_json" | json "print(d['first']['id'] or '?')")"
	ex_expressions="$(printf '%s' "$ex_json" | json "print('; '.join(e for e in d['expressions'] if e) or '?')")"

	if [ "$RATE_LIMIT_MODE" = "admin" ]; then
		if [ "$ex_count" -ge 1 ]; then
			echo "  free-tier cap (1 rate-limiting rule/zone) is filled by: $ex_description (id $ex_id)"
			echo "  retained expression(s): $ex_expressions"
			if has_expression "$ex_json" "/_emdash"; then
				echo "  keeping the retained rule(s) — at least one targets /_emdash, the repository's admin guard. Nothing is written."
			else
				echo "  WARNING: no retained rule targets /_emdash, so this zone is not guarding the admin panel from rate floods." >&2
				if [ "$ALLOW_OCCUPIED" != 1 ]; then
					echo "  Refusing to report success. Free the slot, or set ALLOW_OCCUPIED=1 to install the /_emdash rule alongside the retained one (a paid plan with more than one rate-limit rule)." >&2
					exit 1
				fi
				echo "  ALLOW_OCCUPIED=1 — installing the /_emdash rule alongside the retained rule."
				apply_phase "$zone_id" "http_ratelimit_rules" "$(ratelimit_rule_py admin "$zone")"
			fi
		else
			echo "  installing the admin-panel rate limit (the zone's one free slot on the free plan); the zone floor is not installed"
			apply_phase "$zone_id" "http_ratelimit_rules" "$(ratelimit_rule_py admin "$zone")"
		fi
	elif [ "$RATE_LIMIT_MODE" = "floor" ]; then
		# floor mode takes the one slot the existing rule holds, so remove it first.
		if [ "$ex_count" -ge 1 ]; then
			echo "  floor mode replaces the retained rule: $ex_description (id $ex_id) | $ex_expression"
			ex_ids="$(printf '%s' "$ex_json" | json "print(' '.join(i for i in d['ids'] if i))")"
			for rid in $ex_ids; do
				api_write DELETE "/zones/$zone_id/rules/ratelimits/$rid" >/dev/null
				if [ "$DRY_RUN" = 1 ]; then
					: # api_write already printed the DRY_RUN line.
				else
					echo "  deleted existing rule $rid (the floor takes the slot)"
				fi
			done
		else
			echo "  no existing rate-limit rule to remove"
		fi
		echo "  installing the zone floor — deliberate choice: /_emdash keeps working (authentication still guards it) but loses its rate limit"
		apply_phase "$zone_id" "http_ratelimit_rules" "$(ratelimit_rule_py floor "$zone")"
	else
		# commerce: two rules, so it only fully fits on a plan/API that allows
		# more than the free single slot. Never delete the occupant to make room.
		commerce_post_needle='http.request.method eq "POST" and http.request.uri.path eq "/checkout/cloudflare-workers-production-kit"'
		commerce_get_needle='http.request.uri.path eq "/checkout/download" or http.request.uri.path eq "/checkout/success"'
		echo "  commerce mode wants two rate rules: POST /checkout/cloudflare-workers-production-kit 10/min/IP (block) and GET /checkout/download + /checkout/success 30/min/IP (managed challenge)"
		if [ "$ex_count" -eq 0 ]; then
			echo "  the slot is free — installing both commerce rules (this needs a plan/API that allows more than one rate rule; the write is refused on the free single-slot plan)"
			apply_phase "$zone_id" "http_ratelimit_rules" "$(ratelimit_rule_py commerce "$zone")"
		elif has_expression "$ex_json" "$commerce_post_needle" && has_expression "$ex_json" "$commerce_get_needle"; then
			echo "  both commerce rules are already installed (first id $ex_id); keeping them. Nothing is written."
		else
			echo "  WARNING: the zone already holds $ex_count rate-limiting rule(s), so the free-plan one-slot cap means both commerce rules cannot fit: $ex_description (id $ex_id) | $ex_expressions" >&2
			echo "  WARNING: on the free plan the operator has to choose between the /_emdash admin guard (RATE_LIMIT_MODE=admin) and the commerce rules. The retained rule was not touched." >&2
			if [ "$ALLOW_OCCUPIED" != 1 ]; then
				echo "  Refusing to silently trade the retained rule away. Set ALLOW_OCCUPIED=1 to merge the commerce rules alongside it (a paid plan with more than one rate-limit rule), or choose a mode deliberately." >&2
				exit 1
			fi
			echo "  ALLOW_OCCUPIED=1 — merging the commerce rules alongside the retained rule."
			apply_phase "$zone_id" "http_ratelimit_rules" "$(ratelimit_rule_py commerce "$zone")"
		fi
	fi

	if [ -n "${ALLOWED_IPS:-}" ]; then
		apply_phase "$zone_id" "http_custom_rules" "$(allowlist_rule_py)"
	else
		echo "  (ALLOWED_IPS not set — skipping the /_emdash allow-list rule)"
	fi

	# Best-effort: Bot Fight Mode. It is the cheap layer that challenges
	# non-browser clients before the flood even reaches a rate counter. A
	# refusal (plan/scoping) is printed and survives; it is not fatal.
	bfm="$(api_write PUT "/zones/$zone_id/settings/bots" -d '{"bot_fight_mode": true}' || true)"
	if [ "$DRY_RUN" = 1 ]; then
		echo "  bot fight mode: not written (dry run)"
	elif printf '%s' "$bfm" | json "sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
		echo "  bot fight mode: enabled"
	else
		echo "  bot fight mode: API refused it (enable in the dashboard: Security → Bots)." >&2
	fi
done

echo
if [ "$DRY_RUN" = 1 ]; then
	echo "DRY RUN — reads and report only; nothing was written."
else
	echo "Done ($RATE_LIMIT_MODE mode). Confirm the live rules for the zones above before"
	echo "  relying on them; a missing permission or a free-plan refusal prints above."
fi
