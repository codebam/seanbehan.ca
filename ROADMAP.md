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
      item HTML or lengthening feed edge time. The route no longer fetches the
      archive twice: `getPosts({ includeContent: true })` keeps the Portable
      Text the first query already carried, so a MISS is one collection query
      plus the highlighting, not two queries.

## 2. Content / UX

- [x] Section headings link to themselves. The `.heading-anchor` styles were
      already in `app.css` but `Block.astro` never rendered the anchor — it
      does now, with no script involved.
- [ ] Related fallback. **Declined:** the empty state is deliberate — siblings
      already cover recency, and a "related" row of unrelated posts misleads
      (`src/pages/posts/[slug].astro:58-73`).
- [ ] Contact form. Investigated: `<Form id="…">` from
      `@emdash-cms/plugin-forms/ui` renders nothing when the form does not
      exist (`if (!form) return`), so embedding is safe — but the form itself,
      its notification routing, and the `ec-form-*` style integration all need
      doing in the admin first. Standalone task.
      The cheap half of the problem is now done without it: `/contact` leads
      with Email and LinkedIn instead of burying them behind Mastodon, Matrix
      and PGP, and the address carries a copy button
      (`scripts/copy-address.ts`) for the readers `mailto:` silently fails —
      webmail, a shared inbox, no mail handler. The form would replace the
      mailto, not the ordering.
- [x] Cross-origin jumps have no affordance. Chrome links that leave for the
      repo's other origin now carry a quiet ↗ plus a screen-reader host note
      (`SiblingMark.astro`, `isSiblingHref` in `src/lib/site.ts`), applied to
      the header nav and footer in `Base.astro`. Content links stay unmarked —
      flagging every post row would be noise, and the destination page
      identifies itself. (Unifying the origins behind canonicals remains the
      alternative; it is an SEO call, not taken here.)
- [x] Mobile nav wraps to two rows. The decision was subtraction, not a menu
      widget: the header now carries four items plus Contact, chosen per
      variant in `site.data.js` (`nav`, resolved by `linkHref`). Links and
      Services moved to the footer, where both already were or now are, so
      nothing became unreachable. On seanbehan.ca the reorder matters more
      than the count — Résumé was fifth of six, which put the one page a
      hiring reader came for on the wrapped second row.
- [ ] No manual dark toggle — `prefers-color-scheme` only (DESIGN §2.2). Needs
      a design decision; invariant 2 still requires the no-JS path.
- [ ] `reveal` ships globally (`src/layouts/Base.astro`, the `reveal` import at the end of the body). **Dropped:**
      one tiny inline bundle per page; scoping it buys nothing measurable.
- [ ] No newsletter capture, comments/webmentions, or per-post “suggest an edit”
      link. Needs service decisions.
- [x] Services schema: provider `sameAs` (GitHub, LinkedIn) added
      (`src/pages/services.astro`). No `offers`/`priceRange`/FAQ — prices are
      unknown and FAQ copy is unwritten; both need authoring, not code.

## 3. SEO / feeds

- [x] `/services` was duplicate content on two origins. The middleware sent
      `/projects`, `/products` and `/legal` from seanbehan.ca across to
      codebam.ca, but not `/services` — which `services.astro` already pinned
      its canonical to. So the page answered 200 on Sean's origin wearing
      Sean's header and footer, told Google it was codebam.ca's, and asked the
      reader to email codebam@codebam.ca. `llms.txt` has always promised every
      cross-origin section 301s; it does now.

- [x] `absolutizeUrls()` missed `srcset`/`poster` (`src/lib/rssFeed.ts`); every
      entry in both is now prefixed. Covered in `rssFeed.test.ts`.
- [x] `lastBuildDate = now` destabilized edge caching; it is the newest
      post activity (updated, else published) instead. Covered in tests.
- [ ] `managingEditor`/`webMaster` expose the raw email. **Kept:** RSS wants an
      address there and readers show the name beside it.
- [ ] `twitter:site @seanwbehan` vs handle `codebam` (`src/layouts/Base.astro`, the `twitter:site` meta).
      **Kept:** consistent with the author's long-standing handle; no evidence
      it is wrong.
- [x] `robots.txt` emitted two `User-agent: *` groups — mergeable per RFC 9309,
      but one group is the shape every crawler agrees on. The body now lives in
      `src/lib/robots.ts` (tested) and the route is three lines.
- [x] Shiki fence labels added: `html`, `json`, `yaml` (+`yml`), `dockerfile`
      (+`docker`), `diff` (+`patch`) (`src/lib/highlight.ts`). Each grammar is
      a few KB; unknown labels still fall back to plaintext.

## 4. Accessibility / performance hygiene

- [x] `footer-label` used `--dim` for type at ~3.4:1 on the inverted footer —
      now `--muted` (~6.6:1+, `src/layouts/Base.astro`). Verified by computing
      the ratios; the scrollbar and search icon keep `--dim` (UI marks, 3:1 bar).
- [x] Search label mismatch fixed: the redundant `aria-label="Search posts"`
      is gone, so the visible `<label>Filter</label>` names the field
      (`src/components/PostSearch.astro`).
- [ ] Portable Text images: EmDash's default renderer owns them (only `block`
      and `code` are overridden); intrinsic dimensions/alt need verifying
      against real content — could not check with an empty local DB.
      **Verified Sept 2026** against the live archive (three posts carry an
      image): the renderer emits `alt` from the block (empty when the source
      has none) and `loading="lazy" decoding="async"`, but no `width`/`height`,
      so every body image is a layout shift. Two content fixes belong in the
      admin, not in code: the DDoS post inlines a 41 kB base64 PNG with no alt
      text, and the Silverblue post embeds the full 2560×1440 screenshot
      (204 kB) at column width. Overriding the renderer to carry dimensions
      needs the media record to have them.
- [x] No 500 page (`src/pages/500.astro`): an unhandled error fell back to
      Astro's bare default. It now matches the 404, offers a retry and a report
      link, and is noindex.
- [x] The résumé fragment skipped a heading level (`resume/build.sh`): the flat
      `--shift-heading-level-by=2` turned a `#` section and a `###` entry into
      h3 and h5, and Lighthouse's heading-order check failed on `/resume`.
      Entries are now h4; the PDF is sectioned by the LaTeX macros, not these.
- [ ] No privacy-friendly analytics. Needs a service decision.

## 5. Follow-up audit (September 2026) — fixed

A second pass over the whole site, verified against production rather than
read from the source. Everything below is done; the two items it could not
close are marked.

- **The redesign had reached two files.** The commit that replaced the
  broadsheet design updated `app.css` and `Base.astro` and left the social
  cards, the web manifest, the favicon set, the résumé PDF's palette and the
  ad creative on the warm palette. The cards were the visible one: every
  share preview drew `#b23f1e` on `#f7f2e8` while the site was white and
  blue. All five now carry the shipped tokens, and DESIGN.md section 1 lists
  them as the surfaces a palette change has to touch.
- **Every post page skipped a heading level.** Sections are stored as `###`,
  so a body rendered `h1` then `h3` — on all 25 posts. `prepareBody` now
  re-bases the level so the shallowest heading is an `h2`, which also turns a
  stray `#` into a section instead of a second page title.
- **`Astro.cache.set(cacheHint)` did nothing.** No `cache.provider` was
  configured, so `Astro.cache.enabled` was false and all fourteen guarded
  calls were skipped — while `docs/edge-caching.md` promised a targeted purge
  on the strength of them. The provider is configured now (`name` must be
  `cloudflare`), responses carry `Cache-Tag`, and a purge by tag is real.
- **A route's TTL was overwritten on the way into the edge cache.** The
  stored copy took the HTML window regardless of what the route asked for, so
  every social card went from a month to ten minutes and satori re-rasterised
  each one six times an hour. The stored copy now keeps the route's own
  policy. Verified locally: `/rss.xml` and `/og/*.png` hits carry their own
  max-age.
- **Static assets were revalidated on every visit.** `LONG_LIVED` in the
  middleware never ran for them — Workers Assets answers those paths first —
  so fonts, icons and mockups shipped `max-age=0, must-revalidate`.
  `public/_headers` carries the month-long policy now.
- **Search did not work without JS,** though two documents said it did. The
  archive answers `?q=` on the server from the same ranking the script uses,
  and the field is a real form.
- **Contrast:** the primary CTA's label was 3.47:1 on Kumo's gradient
  (`.site-cta` re-inks it), the search field's boundary was 1.25:1 and its
  placeholder 2.58:1 (`.site-field`), the footer's link hover was 3.45:1 from
  a self-referential `--accent: var(--accent)`, and `--dim` was 2.56:1.
- **Markup and CSS weight:** 4.7 kB of unread `data-` attributes on the
  archive (10% of the page), ten classes with no rule anywhere, ~55 lines of
  dead CSS, an ignored prop, the footer's link groups as loose anchors rather
  than lists, two `h2` levels on one archive page, a duplicate
  `aria-current`, unannounced new tabs, an unreachable image link, and a
  checkout title that said "confirmed" on the 404 and 503 paths.
- **Docs:** DESIGN.md described the design the redesign replaced, including
  an invariant the shipped design violated. Rewritten to what ships, with the
  change recorded. `AGENTS.md` no longer mentions canvas markup, and
  `docs/edge-caching.md` documents the provider, the tags and the two things
  that need checking in the Cloudflare dashboard.
- **Copy:** a card showed "★ 324" above "325 stars" (the prose no longer
  quotes a star count), and every short post's markdown export said
  "Reading time: 1 minutes".

Left open on purpose:

- **`<Image>` for the mockups.** `image.layout` and `responsiveStyles` are
  configured and unused — every image is a raw `<img>` on a file in
  `public/`, so the 1600×1000 mockups are served whole into ~500 px slots.
  Converting means moving the binaries into `src/assets`, rewriting
  `tools/mockups/build.mjs`'s output and putting the Cloudflare Images
  binding on the critical path for the home page. Worth doing with a
  production deploy to watch, not from a local build.
- **The zone's Browser Cache TTL.** Live edge hits for HTML come back
  `Cache-Control: public, max-age=86400` rather than the origin's
  `max-age=0, must-revalidate`, so a returning reader's browser may hold a
  page for a day. `docs/edge-caching.md` says the rule respects origin; the
  dashboard is the place to settle it.
- **Body images have no intrinsic dimensions** (see section 4).
