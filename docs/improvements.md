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

4. **partly done** — Every post shared the profile photo as its `og:image`.
   Posts can now declare `image:` in frontmatter, and the post page emits
   `og:image`/`og:url`/`twitter:*` explicitly instead of inheriting. Still
   open: generating a per-post OG card at build time so posts without an image
   get something better than the profile photo.
5. **done** — Post pages had `article:published_time` but no
   `article:modified_time` (from an optional `updated:` frontmatter field) and
   no `article:tag`.
6. **done** — `/posts/tags` was linked only from an individual tag page, so the
   tag index was orphaned from the writing index. Linked from `/posts` now.

## UX (open)

7. No previous/next post navigation in the post footer — a reader reaching the
   end of a post has only "All posts".
8. No related posts by shared tag, though the tag data is already computed in
   `src/lib/getPosts.ts`.
9. Search state lives only in the component: no `?q=` deep link, so a query is
   lost on back-navigation and cannot be shared.
10. No heading anchors or table of contents on long posts (btrfs, nixos).

## Performance / infrastructure (open)

11. `_headers` gives fonts and raster art 30 days, but the SvelteKit bundles
    under `/_app/immutable/*` fall through to the blanket
    `max-age=0, must-revalidate`. Those filenames are content-hashed, so they
    are the one place `max-age=31536000, immutable` is exactly right — today
    every visit revalidates them.
12. The service worker precaches all of `build` + `files`, which includes both
    profile images and the whole favicon set. Trim to what is actually needed
    offline.
