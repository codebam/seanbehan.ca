#!/usr/bin/env bash
# lint-template.sh -- compile-check a pandoc LaTeX template and show the
# offending line, without building a document.
#   usage: ./lint-template.sh [template] [pandoc-args...]
set -u
T="${1:-templates/resume.latex}"; shift || true
P="${PANDOC:-pandoc}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
printf 'X\n' > "$TMP/in.md"

# A template is only usable once it is closed, so complete it for the check.
cp "$T" "$TMP/t.tex"
grep -q '\\end{document}' "$TMP/t.tex" || printf '\n$body$\n\\end{document}\n' >> "$TMP/t.tex"

err="$("$P" "$TMP/in.md" --template="$TMP/t.tex" -t latex -o /dev/null "$@" 2>&1)"
if grep -q 'Error compiling template' <<<"$err"; then
  loc="$(grep -o 'line [0-9]*, column [0-9]*' <<<"$err" | head -1)"
  line="$(grep -o 'line [0-9]*' <<<"$loc" | grep -o '[0-9]*')"
  echo "$err" | head -4
  [ -n "$line" ] && printf '>> %3d  %s\n' "$line" "$(sed -n "${line}p" "$T")"
  exit 1
fi
echo "template parses cleanly: $T"
