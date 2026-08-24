# Improvement backlog

The site started polished (seanbehan.ca, 2026-08-18): SEO, structured data,
feeds, images, bundles, a11y, dual-variant identity, CI. The bulk of those
items was fixed that round and is now out of this file so it does not mislead
the next reader — the turn-by-turn history lives in git. What remains open
below.

## Status

Closed 2026-08-24: the site moved off SvelteKit and markdown files onto EmDash,
so posts are edited in an admin panel and rendered per request from D1. The
generated social cards became a route rather than a build step, which is what
closes the staleness half of the first item below.

Closed 2026-08-22: added `twitter:site` / `twitter:creator` with `@seanwbehan`
in the layout, removing the "no Twitter/X handle" gap on the 2026-08-18
still-open list.

## Open

- A generated card is one layout for every post. A post can set its own
  featured image, but nothing yet renders a card that varies by tag or series.
- The service worker did not come across from the SvelteKit site. It cached
  static assets for repeat visits; with pages rendered per request and held at
  the edge, it would now have to decide what a stale page is worth, and that is
  a design question rather than a port.
- Nothing purges the edge cache when a post is published, so a change takes up
  to ten minutes to appear. EmDash sets a cache tag per entry, so a targeted
  purge is available whenever that stops being an acceptable trade.
- One copy button per code block; a reader must open a block to copy it. A
  block that copies on hover-keep, without JS, would need no button at all.
