# Fonts

The site serves two woff2 files from `static/fonts`, built from the Fontsource
Newsreader package in `node_modules`. Nothing runs in CI — run the script by
hand when the package is upgraded, and commit the result.

The interface face is the mono stack and ships no file, so Newsreader is the
whole payload; `public/fonts/og-inter.woff` and `og-newsreader.woff` are static
Fontsource cuts the OG card route reads, checked in and not built here.

```sh
nix-shell -p "python3.withPackages(ps: [ps.fonttools ps.brotli])" \
  --run "bash tools/fonts/build-fonts.sh"
```

## Why not import Fontsource directly

`@import '@fontsource-variable/…'` costs 328 kB of font and 13 `@font-face`
blocks in the render-blocking stylesheet, for a latin-only site that renders two
serif weights. Two changes cut that to 106 kB:

- **Latin only.** The cyrillic, greek and vietnamese subsets are never fetched
  by a reader here; only their `@font-face` blocks were, on every page.
- **Axis instancing.** Newsreader ships `wght 200–800` and `opsz 6–72`. The CSS
  asks for weight 400 (`.display`) and 500 (`.prose` headings), at heading
  sizes. Trimming to `wght 400:500` and `opsz 18:72` halves both Newsreader
  files. The `opsz` axis stays variable, so `font-optical-sizing: auto` still
  works — the dropped 6–18 range is smaller than anything the site renders.

The stable filenames are what let `Base.astro` preload the roman file with the
HTML instead of discovering it a round trip later, after the stylesheet parses.

Stable filenames mean the files are not content-hashed, so `_headers` caches
them for 30 days rather than a year with `immutable`.
