#!/usr/bin/env bash
# build.sh -- render a Markdown resume to a PDF and an inline-HTML fragment.
#
#   ./build.sh                       resume.md -> resume.pdf + resume.html
#   ./build.sh --outdir out          write both into out/
#   ./build.sh --pdf                 only the PDF (needs tectonic)
#   ./build.sh --html                only the fragment (needs pandoc alone)
#   ./build.sh -o out.pdf            name the PDF; the fragment lands beside it
#   ./build.sh -i other.md           custom input
#   ./build.sh --font "TeX Gyre Heros"  override the body font
#   ./build.sh --open                also open the PDF in the browser
#   ./build.sh --keep-tex            keep the generated .tex for debugging
#   ./build.sh --no-nix              require pandoc/tectonic on PATH
#
# Fonts, colours and filter switches live in metadata.yaml; the page content
# comes from resume.md (its YAML front matter wins over metadata.yaml).
# pandoc and tectonic are taken from PATH when present, otherwise fetched
# with nix (pkgs.pandoc, pkgs.tectonic), so this works on a bare checkout.
#
# Both outputs are one pandoc pass over one document with one filter: the PDF to
# print, the fragment for /resume. They differ in exactly two ways -- the
# fragment carries classes where the PDF carries LaTeX macros, and its headings
# start two levels lower so the résumé's sections sit underneath the page's own
# -- and nothing else, which is the property that keeps the two from ever
# telling different stories about the same career.

set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
HERE="$(pwd)"
# Assets are read from the script's directory (which is read-only when this
# runs through `nix run`, where ROOT is a store path); output goes to cwd.
TEMPLATE="$ROOT/templates/resume.latex"
HTML_TEMPLATE="$ROOT/templates/resume.html"
FILTER="$ROOT/filters/resume-entries.lua"
METADATA="$ROOT/metadata.yaml"
SHIM="${XDG_CACHE_HOME:-$HOME/.cache}/resume-toolchain/bin"
MAINFONT=""
OPEN=0
KEEP_TEX=0
USE_NIX=1
WANT_PDF=1
WANT_HTML=1
INPUT=""
OUTPUT=""
HTML_OUTPUT=""
OUTDIR=""

die() { printf '\033[31merror:\033[0m %s\n' "$*" >&2; exit 1; }
note() { printf '\033[36m::\033[0m %s\n' "$*" >&2; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    -i|--input)    INPUT="$2"; shift 2 ;;
    -o|--output)   OUTPUT="$2"; shift 2 ;;
    --html-output) HTML_OUTPUT="$2"; shift 2 ;;
    -O|--outdir)   OUTDIR="$2"; shift 2 ;;
    --pdf)         WANT_PDF=1; WANT_HTML=0; shift ;;
    --html)        WANT_PDF=0; WANT_HTML=1; shift ;;
    -f|--font)     MAINFONT="$2"; shift 2 ;;
    --open)        OPEN=1; shift ;;
    --keep-tex)    KEEP_TEX=1; shift ;;
    --no-nix)      USE_NIX=0; shift ;;
    -h|--help)     sed -n '3,18p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)             die "unknown argument: $1 (see --help)" ;;
  esac
done

# ---------------------------------------------------------------- paths
# Named after the input, in the cwd, unless something above said otherwise;
# the fragment always defaults to sitting beside the PDF.
[[ -n "$INPUT" ]] || { INPUT="$HERE/resume.md"; [[ -f "$INPUT" ]] || INPUT="$ROOT/resume.md"; }
[[ -f "$INPUT" ]] || die "no such input file: $INPUT"
NAME="$(basename -- "${INPUT%.*}")"
[[ -n "$OUTPUT" ]] || OUTPUT="$HERE/$NAME.pdf"
if [[ -z "$HTML_OUTPUT" ]]; then
  # Beside the PDF, so `-o somewhere/x.pdf` keeps the pair together; a PDF path
  # that does not end in .pdf is a surprise, and the fragment goes to cwd.
  case "$OUTPUT" in
    *.pdf) HTML_OUTPUT="${OUTPUT%.pdf}.html" ;;
    *)     HTML_OUTPUT="$HERE/$NAME.html" ;;
  esac
fi
if [[ -n "$OUTDIR" ]]; then
  mkdir -p "$OUTDIR"
  OUTPUT="$OUTDIR/$(basename -- "$OUTPUT")"
  HTML_OUTPUT="$OUTDIR/$(basename -- "$HTML_OUTPUT")"
fi

[[ $WANT_PDF -eq 1 || $WANT_HTML -eq 1 ]] || die "nothing to build (--pdf, --html)"
[[ $WANT_PDF -eq 0 || -f "$TEMPLATE" ]] || die "missing template: $TEMPLATE"
[[ $WANT_HTML -eq 0 || -f "$HTML_TEMPLATE" ]] || die "missing template: $HTML_TEMPLATE"

# ---------------------------------------------------------------- toolchain
# Appended, so a toolchain the caller already put on PATH (nix develop,
# nix run .#resume, the direnv shell) wins over our cached shim.
export PATH="$PATH:$SHIM"

resolve() { # resolve <attr> <binary>
  local attr="$1" bin="$2" path
  if command -v "$bin" >/dev/null 2>&1; then return 0; fi
  [[ $USE_NIX -eq 1 ]] || die "$bin not found on PATH (--no-nix)"
  note "$bin not on PATH; building nixpkgs#$attr with nix"
  path="$(nix build --no-link --print-out-paths --impure "nixpkgs#$attr" 2>/dev/null | tail -1)"
  [[ -n "$path" ]] || die "nix could not provide nixpkgs#$attr"
  mkdir -p "$SHIM"
  local f
  for f in "$path"/bin/*; do
    ln -sf "$f" "$SHIM/$(basename -- "$f")"
  done
  hash -r 2>/dev/null || true
  command -v "$bin" >/dev/null 2>&1 || die "$bin still not found after installing $attr"
}

resolve pandoc pandoc
if [[ $WANT_PDF -eq 1 ]]; then
  # tectonic is only in the fragment's way when the PDF is not wanted at all.
  resolve tectonic tectonic
  # pdfinfo is only used for the page-count line in the report; optional.
  command -v pdfinfo >/dev/null 2>&1 || resolve poppler-utils pdfinfo || true
fi

note "pandoc   $(command -v pandoc)"
[[ $WANT_PDF -eq 1 ]] && note "tectonic $(command -v tectonic)"

# ---------------------------------------------------------------- build
common=(
  "$INPUT"
  -f markdown-citations       # "@codebam/x" in the prose is a handle, not a
                              # citation: without this the HTML writer wraps it
                              # in span.citation and the PDF gains a \citep
  --lua-filter="$FILTER"
  --metadata-file="$METADATA"
)
[[ -n "$MAINFONT" ]] && common+=(-V "mainfont=$MAINFONT")

built=()

if [[ $WANT_PDF -eq 1 ]]; then
  pdf=(
    "${common[@]}"
    --standalone
    --pdf-engine=tectonic
    --template="$TEMPLATE"
    --resource-path="$HERE:$ROOT"
  )
  if [[ $KEEP_TEX -eq 1 ]]; then
    # Emitting the .tex first surfaces filter/template errors plainly.
    pandoc "${pdf[@]}" -o "${OUTPUT%.pdf}.tex"
    note "wrote ${OUTPUT%.pdf}.tex"
  fi
  note "typesetting $NAME -> $(basename -- "$OUTPUT")"
  pandoc "${pdf[@]}" -o "$OUTPUT"
  built+=("$OUTPUT")
fi

if [[ $WANT_HTML -eq 1 ]]; then
  html=(
    "${common[@]}"
    # --standalone is what makes pandoc consult --template at all; this template
    # emits a fragment, so "standalone" describes the template, not the output.
    --standalone
    -t html5
    --template="$HTML_TEMPLATE"
    --shift-heading-level-by=2
    # The filter's other spelling of the same five hooks (spans, not macros).
    -M tex_markup=false
  )
  note "fragmenting $NAME -> $(basename -- "$HTML_OUTPUT")"
  pandoc "${html[@]}" -o "$HTML_OUTPUT"
  # A template that lost a variable fails quietly: pandoc substitutes the empty
  # string, exits 0, and the page gets a header with no name in it. Checking for
  # the two anchors the stylesheet hangs on is cheaper than a browser.
  grep -q 'class="resume-doc"'   "$HTML_OUTPUT" || die "$HTML_OUTPUT has no .resume-doc root"
  grep -q 'class="resume-name"'  "$HTML_OUTPUT" || die "$HTML_OUTPUT has no .resume-name"
  built+=("$HTML_OUTPUT")
fi

# ---------------------------------------------------------------- report
if [[ $WANT_PDF -eq 1 ]] && command -v pdfinfo >/dev/null 2>&1; then
  note "done: $(basename -- "$OUTPUT") ($(pdfinfo "$OUTPUT" 2>/dev/null | awk '/^Pages:/{print $2}') pages)"
fi
for f in "${built[@]}"; do
  note "  $(printf '%6s' "$(du -h "$f" | cut -f1)")  $f"
done

if [[ $OPEN -eq 1 && $WANT_PDF -eq 1 ]]; then
  for browser in chromium chromium-browser google-chrome-stable google-chrome xdg-open; do
    if command -v "$browser" >/dev/null 2>&1; then
      note "opening with $browser"
      "$browser" "$OUTPUT" >/dev/null 2>&1 &
      break
    fi
  done
fi
