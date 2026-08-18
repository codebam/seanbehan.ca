# Improvement backlog

Findings from a survey of the site on 2026-08-18. Items marked **done** were
fixed in the same pass; the rest are still open.

## Bugs

1. **done** — Hardcoded `Sean Behan` in page titles and descriptions. The post
   page, the writing index, the error page and the résumé all spelled the name
   out, so a `PUBLIC_SITE=codebam` build titled every post `… — Sean Behan`.
   They read `site.name` now.
2. **done** — `static/robots.txt` listed only bot blocks: no `User-agent: *`
   default and no `Sitemap:` line, so `/sitemap.xml` was published but never
   advertised. It is a prerendered route now (`src/routes/robots.txt`), because
   the `Sitemap:` directive has to be absolute and the two variants are served
   from different origins.

## SEO

3. **done** — No structured data anywhere. The layout now emits `BlogPosting`
   on a post and `WebSite` + `Person` elsewhere. SvelteKit's CSP only hashes
   the scripts it injects itself, so `tools/csp/hash-jsonld.mjs` runs after the
   build and adds each page's JSON-LD hash to that page's own policy — strict
   `script-src` kept, no `unsafe-inline`.

   Emitting the tags in the layout also fixed a duplicate: the post page wrote
   its own `og:title`/`og:description`/`description`, and `svelte:head` appends
   to what the layout already wrote rather than replacing it, so every post
   shipped two of each.

4. **done** — Every post shared the profile photo as its `og:image`, so every
   link to the site looked the same in a timeline. `tools/og/build-cards.mjs`
   now draws a card per post at build time (satori for layout from bundled font
   buffers, sharp to rasterize) into the gitignored `static/og`. A post can
   still opt out by naming its own `image:` in frontmatter.
5. **done** — Post pages had `article:published_time` but no
   `article:modified_time` (from an optional `updated:` frontmatter field) and
   no `article:tag`.
6. **done** — `/posts/tags` was linked only from an individual tag page, so the
   tag index was orphaned from the writing index. Linked from `/posts` now.

## UX

7. **done** — A post footer offered only "All posts". It now links the post
   either side of it in the archive, labelled older/newer rather than by
   position in the list.
8. **done** — A "Related" block above that footer, chosen by shared tags and
   ranked by how many are shared. A post that shares no tags gets no block:
   an unrelated suggestion is worse than none.
9. **done** — The search query lives in the URL as `?q=`, written on the
   debounced value with `replaceState` so a search takes one history entry
   rather than one per keystroke.
10. **done** — h2 and h3 in a post body get an id and a self-link (a `#` in the
    margin on hover), and a post with four or more sections gets a contents
    list under its header. Indentation is relative to the shallowest heading
    the post actually uses, since most posts here start sections at `###`.

## Performance / infrastructure

11. **done** — `/_app/immutable/*` gets `max-age=31536000, immutable`; it was
    falling through to the blanket `max-age=0, must-revalidate` even though
    those filenames are content-hashed.
12. **done** — The service worker precached all of `build` + `files` — both
    profile images, every favicon, the post screenshots. The install list is
    the offline shell now (bundles, fonts, avatar); everything else enters the
    cache when it is first fetched.

## Still open

- A generated card is one layout for every post. A post can name its own
  `image:`, but nothing yet renders a card that varies by tag or series.
- The `_routes.json` exclude list grows by one rule per post, because each post
  now ships a card in `static/`. Cloudflare's limit is 100 rules and the list
  is at 58; the adapter starts dropping rules silently past that, so the site
  would quietly go back to being served by the Worker.
