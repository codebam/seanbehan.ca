# Improvement backlog

The site started polished (seanbehan.ca, 2026-08-18): SEO, structured data,
feeds, images, bundles, a11y, dual-variant identity, CI. The bulk of those
items was fixed that round and is now out of this file so it does not mislead
the next reader — the turn-by-turn history lives in git. What remains open
below.

## Status

Closed 2026-08-22: added `twitter:site` / `twitter:creator` with `@seanwbehan`
in the layout's `<svelte:head>`, removing the "no Twitter/X handle" gap on the
2026-08-18 still-open list.

## Open

- A generated card is one layout for every post. A post can name its own
  `image:`, but nothing yet renders a card that varying by tag or series.
- One copy button per code block; a reader must open a block to copy it. A
  block that copies on hover-keep, without JS, would need no button at all.
