# Favicon

The mark is Newsreader `SB` in white (`#ffffff`) on the warm accent (`#b45309`)
— `--accent-warm` and `--accent-on`'s light value in `src/styles/app.css`.
Re-ink both files below when the palette moves, or the tab stops matching the
page.

Two scripts regenerate the set. Neither runs in CI — run them by hand when the
mark or the palette changes.

## `build-favicon.sh`

Renders the raster set with headless Chromium and assembles `favicon.ico`.

```sh
bash tools/favicon/build-favicon.sh   # writes to tools/favicon/out
```

Each size is rendered natively rather than downscaled from one master, so the
small sizes get their own rasterization pass. 16 and 32 use a tuned variant —
weight 600, tracking −2, corner radius 9 — because the display proportions turn
to mush at tab size.

`favicon.ico` is written by hand in Node: header, directory, then the 16/32/48
PNG payloads. The format is trivial and it avoids an ImageMagick dependency.

## `trace-favicon.py`

Converts the lettering to SVG outlines, so `public/favicon.svg` carries no font
dependency. Needs fonttools and brotli:

```sh
nix-shell -p "python3.withPackages(ps: [ps.fonttools ps.brotli])" \
  --run 'python3 tools/favicon/trace-favicon.py'
```

It decompresses the woff2 from `node_modules`, pins the variable font at
`wght=600` and the `opsz` display end, then walks each glyph with an SVG pen and
flips the y axis. Keep its constants in sync with the tuned variant in
`build-favicon.sh` — the two are meant to produce the same shape.

Only the two `fill` values need re-running for a palette change; the outlines
are the same shape.

## Installing the output

```sh
cp tools/favicon/out/favicon.ico tools/favicon/out/favicon-*.png \
   tools/favicon/out/apple-touch-icon.png tools/favicon/out/android-chrome-*.png \
   public/
```

`src/layouts/Base.astro` declares the SVG first, then the `.ico`, then the
touched icons. `src/pages/site.webmanifest.ts` carries the same colours as the
layout's `<meta name="theme-color">`.
