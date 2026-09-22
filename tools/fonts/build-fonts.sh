#!/usr/bin/env bash
# Builds the two webfont files the site serves, from the Fontsource variable
# packages. The CSS that declares them is the @font-face block in
# src/styles/app.css, and src/layouts/Base.astro preloads the roman file.
#
# The interface face is the mono stack and ships no file, so Newsreader is the
# whole webfont payload now; the Inter instance this script used to cut is gone
# with it. The OG route still reads its own og-inter.woff — a static Fontsource
# cut, checked in, not built here.
#
# Fontsource is not a dependency of this repo: it is a build input a maintainer
# fetches only when re-cutting the fonts. Point FONT_SOURCE_DIR at an unpacked
# @fontsource-variable tree (the default is node_modules/@fontsource-variable,
# which `npm install --no-save @fontsource-variable/newsreader` produces), or
# the script stops before touching public/fonts and says which file is missing.
# Hiding that failure would let an incomplete rebuild ship a stale face.
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
# Keep the Newsreader ranges in step with the @font-face declarations in
# app.css.
#
# Latin only, deliberately: the non-latin subsets Fontsource declares were
# never downloaded by a reader of this site, and the CSS that declares them is
# render-blocking weight on every page.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
SRC="${FONT_SOURCE_DIR:-$ROOT/node_modules/@fontsource-variable}"
OUT="$ROOT/public/fonts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

die() {
printf 'build-fonts: %s\n' "$*" >&2
exit 1
}

# The two sources this script needs, named so the error can say which one is
# absent. The Fontsource package layout is files/<face>-<subset>-standard-<style>.woff2.
NEWSREADER_ROMAN="$SRC/newsreader/files/newsreader-latin-standard-normal.woff2"
NEWSREADER_ITALIC="$SRC/newsreader/files/newsreader-latin-standard-italic.woff2"

for src in "$NEWSREADER_ROMAN" "$NEWSREADER_ITALIC"; do
[ -f "$src" ] || die "missing input $src
Install the build-only sources, or point FONT_SOURCE_DIR at them:
  npm install --no-save @fontsource-variable/newsreader
Nothing in public/fonts was changed."
done

command -v python3 >/dev/null 2>&1 || die 'python3 is required (fontTools lives in it).'
python3 -c 'import fontTools' >/dev/null 2>&1 ||
die 'fontTools is not importable by this python3.
  python3 -m pip install fonttools
Nothing in public/fonts was changed.'

mkdir -p "$OUT"

# $1 = source woff2, $2 = output name, $3.. = axis limits
instance() {
local src="$1" out="$2"
shift 2
[ -f "$src" ] || die "missing input $src"
python3 -m fontTools.varLib.instancer -o "$TMP/$out.ttf" "$src" "$@" >/dev/null
python3 -m fontTools.ttLib.woff2 compress -o "$OUT/$out.woff2" "$TMP/$out.ttf" >/dev/null
}

# The italic pins `opsz` rather than keeping it variable, which is what takes it
# from 71 kB to 42 kB. It can afford to: the roman is set at everything from
# 16px body copy to an 86px headline, but the italic only ever appears inside
# `.display em` — the emphasised half of a hero headline, 42–86px. 48 sits in
# that band. Prose `em` is Newsreader's own italic file, not a synthetic one.
instance "$NEWSREADER_ROMAN" newsreader-latin wght=400:500 opsz=18:72
instance "$NEWSREADER_ITALIC" newsreader-latin-italic wght=400:500 opsz=48

ls -l "$OUT"
