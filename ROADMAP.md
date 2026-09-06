# ROADMAP

Improvement candidates from the September 2026 audit. Each item names the
files involved and the expected gain. Checked items are done; the rest are
proposed, roughly ordered by value within each section.

## 1. Per-request cost (in progress)

- [ ] Post page fetches the whole archive for nav (`src/pages/posts/[slug].astro:40`).
      It needs ≤4 summaries (older/newer + 2 related) but pays for all ~24:
      full entry transfer plus body-text extraction per entry. Add a nav-only
      query (ordered slugs/titles + tags, reading time only for the selected
      rows). Blocked on EmDash offering field selection — `getEmDashCollection`
      returns whole entries, so the D1 payload is fixed until then.
- [x] Skip the shared bodies map where nobody reads it. `getPosts()` built a
      slug → full-text map on every call, but only `search.json` consumes it.
      `getPosts({ includeBodies: false })` now opts out; all list/detail/sitemap
      callers use it. (Reading time still walks each body once — `PostList`
      prints it — so this saves the duplicated strings, not the parse.)
- [x] `search.json` re-ran the archive query per novel query string
      (`src/pages/search.json.ts`). Results are now memoized per isolate for 60 s
      and carry an explicit edge cache policy; the client aborts stale in-flight
      requests instead of letting them burn Worker CPU
      (`src/components/PostSearch.astro`).
- [x] Homepage and `/projects` blocked TTFB on GitHub (`src/lib/github.ts`,
      `src/pages/index.astro:20-23`, `src/pages/projects/index.astro:9`). The
      whole live-stats fetch now races a 600 ms budget and falls back to the
      committed numbers — stars are decoration, the page is the product.
- [ ] Feed renders highlight every code block on every MISS
      (`src/pages/rss.xml.ts`, `src/lib/renderBody.ts`). Hourly MISS × ~20 posts
      of shiki is the heaviest per-request CPU left. Consider caching rendered
      item HTML or lengthening feed edge time.

## 2. Content / UX

- [ ] Cross-origin jumps have no affordance. Writing lives on seanbehan.ca,
      projects/products/legal on codebam.ca (`src/middleware.ts:156-179`); nav
      links cross origins silently. Mark them or unify.
- [ ] No contact form despite `formsPlugin` installed — `/contact` is
      mailto-only (`src/pages/contact.astro`). Adds spam exposure + friction.
- [ ] TOC has no scrollspy; headings have no copy-link
      (`src/pages/posts/[slug].astro:160-178`).
- [ ] `related` is empty when no tags overlap (`src/pages/posts/[slug].astro:58-73`).
      Fall back to newest posts.
- [ ] Mobile nav wraps to two rows (`src/layouts/Base.astro:436-445`). Consider
      a condensed menu.
- [ ] `reveal` script ships globally (`src/layouts/Base.astro:280-282`) even on
      pages without `data-reveal`.
- [ ] No manual dark toggle — `prefers-color-scheme` only (DESIGN §2.2).
- [ ] No newsletter capture, comments/webmentions, or per-post “suggest an edit”
      link despite a GitHub audience.
- [ ] Services `Service` schema lacks `offers`/`priceRange`/FAQ
      (`src/pages/services.astro:41-55`).

## 3. SEO / feeds

- [ ] `absolutizeUrls()` misses `srcset`/`poster` (`src/lib/rssFeed.ts:32-34`).
- [ ] `lastBuildDate = now` destabilizes edge caching (`src/lib/rssFeed.ts:79`);
      use the newest post date.
- [ ] `managingEditor`/`webMaster` expose the raw email (`src/lib/rssFeed.ts:77-78`).
- [ ] `twitter:site @seanwbehan` vs handle `codebam` (`src/layouts/Base.astro:152`) —
      verify which is correct.
- [ ] Shiki fence labels missing: `json`, `yaml`, `dockerfile`, `diff`, `html`
      fall back to plaintext silently (`src/lib/highlight.ts:23-44`). Adding
      grammars grows the Worker bundle — weigh before adding.

## 4. Accessibility / performance hygiene

- [ ] `footer-label` uses `--dim`, documented as UI-marks-only contrast (DESIGN §2.8).
      Verify it clears AA for type.
- [ ] Search label mismatch: visible “Filter” vs `aria-label="Search posts"`
      (`src/components/PostSearch.astro:21-38`).
- [ ] Audit Portable Text images: `loading="lazy"`, explicit dimensions (CLS),
      alt enforcement; audit tables/code overflow in print.
- [ ] No privacy-friendly analytics; no 500 page (only `404.astro`).
