# Project mockups

The five pictures in Selected work, and on each project's case-study page.

Viewport is a real 1600×1000 capture of the compositor running nested with its
built-in default config and btop open. The other four are drawn as HTML rather
than screenshotted from live products: a running service changes without asking,
and a photograph of it would be a picture of what it used to be. Those four say
what the row claims.

## Rendering the HTML illustrations

```sh
npm run mockups        # or: node tools/mockups/build.mjs
```

The four generated screenshots land in `src/assets/projects/`, where
`src/lib/projects.ts` imports them. `Work.astro` and `projects/[slug].astro`
render them through `astro:assets`, so Astro generates the responsive `srcset`
and the browser downloads a card-sized variant instead of the 1600×1000 original.
Chromium writes WebP when the screenshot file ends in `.webp`, so the only
requirement is a `chromium` on `PATH`. Nothing runs this in CI — redraw by hand
when a row changes.

`project-viewport.webp` is deliberately not in the generator. Replacing it with
an illustration would make `npm run mockups` silently undo the real capture.

## Recapturing Viewport

Run `viewport` nested with an isolated `HOME` (so it uses the built-in defaults),
no `--config` flag and a writable, short `XDG_RUNTIME_DIR`; the host's
`WAYLAND_DISPLAY` must be an absolute socket path so winit does not connect back
to the nested server. Set
`VIEWPORT_DUMP_OUTPUT=/path/nested.ppm`, open a client inside the nested display,
and resize the host window to 1600×1000 with the host compositor's `view.layout`
message. The dump is a binary PPM; convert it to WebP and replace
`src/assets/projects/project-viewport.webp`.

## Art direction

`frame.css` is only a reset for the HTML illustrations: page dimensions,
typography defaults and a monospace helper. Each page owns its palette and
composition. There is deliberately no shared ordinal, technology-stack header,
grid or footer; the project name and stack already live in the card beside the
picture, and repeating them inside every image made different projects look
interchangeable at thumbnail size.

The four HTML source pages are fixed at 1600×1000. Content must fit that source
box: the site contains the complete image rather than cropping it, so anything
clipped here would stay clipped in the generated asset. Open the HTML directly
at 1600×1000 when changing a layout, then regenerate and inspect the WebP at the
size the project cards actually display.
