# Project mockups

The five pictures in Selected work, and on each project's case-study page.

They are drawn as HTML rather than screenshotted from the live products. A
running service changes without asking, and a photograph of it would be a
picture of what it used to be; these say what the row claims.

## Rendering

```sh
npm run mockups        # or: node tools/mockups/build.mjs
```

Chromium writes WebP when the screenshot file ends in `.webp`, so the only
requirement is a `chromium` on `PATH`. Nothing runs this in CI — redraw by hand
when a row changes.

## Layout

`frame.css` is the surround every page shares: the navy grid, the orange
ordinal at the left, the stack at the right, and one bordered surface. A page
styles only what goes inside that surface, so the set stays a set.

The surface is 1444x787 and the page is fixed at 1600x1000, which is the box
`Work.astro` and `projects/[slug].astro` ask the image for. Content that does
not fit is clipped by the card rather than scrolling, so check that it fits:

```sh
# prints OVERFLOW:<px> for each page; 0 means the picture is complete
for f in tools/mockups/*.html; do
  cp "$f" /tmp/check.html
  printf '<script>window.addEventListener("load",()=>{const c=document.querySelector(".card");document.title="OVERFLOW:"+(c.scrollHeight-c.clientHeight)});</script>' >> /tmp/check.html
  chromium --headless --disable-gpu --window-size=1600,1000 --virtual-time-budget=2000 \
    --dump-dom file:///tmp/check.html 2>/dev/null | grep -om1 "OVERFLOW:[-0-9]*"
done
```

The ordinals in the pages are the row order in `src/lib/projects.ts`. Adding a
project means redrawing the numbers on the rows below it — the cost of baking
them into the picture instead of a caption that could disagree with its row.
