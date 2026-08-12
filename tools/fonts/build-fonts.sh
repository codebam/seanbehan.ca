#!/usr/bin/env bash
# Builds the three webfont files the site actually serves, from the Fontsource
# packages in node_modules.
#
# Fontsource ships Newsreader with both variable axes (wght 200–800, opsz
# 6–72) across every subset. That is 279 kB of Newsreader alone for a face the
# site only uses on headings, at two weights. Instancing the axes down to the
# range the CSS asks for cuts that roughly in half without touching a single
# glyph outline the design depends on:
#
#   wght 400:500  — .display is 400, .prose headings are 500. Nothing else
#                   sets a serif weight.
#   opsz 18:72    — the axis stays variable, so `font-optical-sizing: auto`
#                   still does its job from body-copy size upward. Only the
#                   6–18 end, which nothing on the site renders at, is dropped.
#
# Inter is already a single-axis file, so it is copied through as-is and only
# gains a stable filename that `app.html` can preload.
#
# Latin only, deliberately: the non-latin subsets Fontsource declares were
# never downloaded by a reader of this site, and the CSS that declares them is
# render-blocking weight on every page.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
SRC="$ROOT/node_modules/@fontsource-variable"
OUT="$ROOT/static/fonts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$OUT"

# $1 = source woff2, $2 = output name, $3.. = axis limits
instance() {
	local src="$1" out="$2"
	shift 2
	python3 -m fontTools.varLib.instancer -o "$TMP/$out.ttf" "$src" "$@" >/dev/null
	python3 -m fontTools.ttLib.woff2 compress -o "$OUT/$out.woff2" "$TMP/$out.ttf" >/dev/null
}

instance "$SRC/newsreader/files/newsreader-latin-standard-normal.woff2" \
	newsreader-latin wght=400:500 opsz=18:72
# The italic pins `opsz` rather than keeping it variable, which is what takes it
# from 71 kB to 42 kB. It can afford to: the roman is set at everything from
# 16px body copy to an 86px headline, but the italic only ever appears inside
# `.display em` — the emphasised half of a hero headline, 42–86px. 48 sits in
# that band. Prose `em` is Inter, obliqued by the browser, so it is not a caller.
instance "$SRC/newsreader/files/newsreader-latin-standard-italic.woff2" \
	newsreader-latin-italic wght=400:500 opsz=48

# Inter ships wght 100–900. The site sets 400, 500 and 600, and Tailwind's
# typography plugin bolds `strong` to 600; 400–700 covers all of it with room to
# spare, for 12 kB less. Keep the @font-face range in app.css in step with this.
instance "$SRC/inter/files/inter-latin-wght-normal.woff2" \
	inter-latin wght=400:700

ls -l "$OUT"
