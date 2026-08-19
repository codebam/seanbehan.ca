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

## Second pass (feed, images, bundles, a11y)

13. **done** — RSS `<content:encoded>` carried root-relative `src`/`href`, so
    the images in a full-text item resolved against the reader's origin and
    simply did not appear. `absolutizeUrls` rewrites them for the feed only;
    the site's own pages still want them relative.
14. **done** — The sitemap listed every tag page but not `/posts/tags`, which
    is now linked from the writing index.
15. **done** — Post-body images rendered as `<img src alt>` and nothing else:
    no reserved space, so the article reflowed when they landed, and no
    `loading`/`decoding`. `tools/img/measure.mjs` writes the intrinsic sizes to
    `src/lib/imageSizes.json` and the renderer stamps them on.
16. **done** — Fuse was ~29 kB of the archive page's bundle whether or not
    anyone searched. It is imported on first focus (or immediately, if the page
    was opened with a `?q=`), and is its own chunk now.
17. **done** — Metric-matched fallback faces for both webfonts, computed from
    the real files by `tools/fonts/fallback-metrics.py`, so `font-display:
swap` changes letterforms without moving the line.
18. **done** — Filtering the archive announced nothing to a screen reader. A
    `role="status"` line reports the match count, and the visible empty state
    is a live region itself.
19. **done** — `src/lib/headers.test.ts` compares the `/*` block of `_headers`
    with `SECURITY_HEADERS` in `hooks.server.ts`, which both files' comments
    said had to stay in sync with nothing enforcing it.
20. **done** — `/.well-known/security.txt` (RFC 9116), pointing at the email
    and the PGP key that was already published with nothing linking to it.
21. **done** — Per-tag RSS feeds at `/posts/tag/<tag>/rss.xml`, linked from
    each tag page, plus `<managingEditor>`/`<webMaster>` on the channel and
    `og:locale` on every page.

## Third pass (2026-08-18)

22. **done** — Inner pages shipped two `<meta name="description">` tags because
    svelte:head appends. Descriptions and og/twitter titles now live on
    `page.data` and are emitted once from the layout. `src/lib/meta.test.ts`
    reads the built HTML so a second tag fails the suite.
23. **done** — `/resume` 200'd on codebam.ca even though the variant hides it
    from the nav and sitemap. The route now 404s / is not prerendered when
    `showResume` is false.
24. **done** — Tag pages titled "nixos" because frontmatter is lowercase.
    `displayTag()` maps known proper nouns; the chips, heading and tag feed
    all use it.
25. **done** — Drafts were documented as shareable by URL but never prerendered
    (`/posts/website` 404'd). `entries` now names every slug; drafts are
    noindexed and draft-only tags are not linked (they have no published page).
26. **done** — Contact still said "Open to work" / hiring copy on the codebam
    variant. Gated on `showResume`.
27. **done** — Per-tag RSS inherited the HTML revalidation Cache-Control.
    `_headers` now carves `/posts/tag/*/rss.xml` the same way as `/rss.xml`.
28. **done** — `_routes.json` no longer expands `<files>` into one rule per
    static file. Directory / extension wildcards keep the exclude list a
    fixed handful; `security.test.ts` asserts it stays under 60 and that
    `/og/*` is one rule.
29. **done** — Home / contact / archive use `/og/site.png` (1200×630) instead
    of the 460px author photo.
30. **done** — `llama2.md` tagged typescript / cloudflare / serverless.
31. **done** — HSTS in `_headers` and hooks is now
    `max-age=63072000; includeSubDomains; preload`. Cloudflare may still
    emit its own 180-day header in front.
32. **done** — Résumé page has an HTML summary above the PDF object.
33. **done** — Dropped unused `@sveltejs/adapter-auto` and
    `@sveltejs/enhanced-img`. `@fontsource-variable/*` stays: the font
    rebuild scripts read those packages.

34. **done** — `seanbehan.ca/.well-known/security.txt` was a leftover two-line
    file in front of Pages. That host now serves the RFC 9116 route
    (`sean@seanbehan.ca`, Encryption, Canonical), matching codebam.ca.

## Still open

- A generated card is one layout for every post. A post can name its own
  `image:`, but nothing yet renders a card that varies by tag or series.
- No `twitter:site` / `twitter:creator`. There is no Twitter/X handle to put
  there.

## Fourth pass (2026-08-19)

35. **done** — Published posts on both origins now canonical to seanbehan.ca,
    with `rel=alternate` to the sibling. Person JSON-LD uses the legal name,
    `alternateName` for the handle, and `sameAs` for the sibling, GitHub,
    Mastodon, and LinkedIn when the résumé is shown.
36. **done** — CI on push/PR: lint, check, seanbehan build, tests, codebam
    build. `deploy:codebam` plus purge by zone. Docs match Node 26 and npm.
37. **done** — Hero `h1` no longer uses `.enter`, so LCP is not faded in.
38. **done** — Sitemap static/tag `lastmod` is the newest post date, not build
    time. `article:modified_time` / `dateModified` only when `updated:` is set.
39. **done** — Dropped leftover `ads.txt`, unused rasters, `.eslintrc.cjs`,
    cactus ignores, and unused types. `typescript` is a devDependency.
40. **done** — Archive tags are links. Tag pages have a visible RSS control.
    Skip-link uses the clip pattern. Manifest lists light/dark theme colours.
    Cross-origin résumé `download` attribute removed.
41. **done** — Broken/stale post links: rust book dest, react.dev Fragment,
    official Kinoite page, svelte-auth demo (repo only).
42. **done** — `flake.nix` declares a `nixpkgs` input.
