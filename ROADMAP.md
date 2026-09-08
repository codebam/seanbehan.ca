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
- [ ] `reveal` ships globally (`src/layouts/Base.astro:280-282`). **Dropped:**
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
- [ ] `twitter:site @seanwbehan` vs handle `codebam` (`src/layouts/Base.astro:152`).
      **Kept:** consistent with the author's long-standing handle; no evidence
      it is wrong.
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
- [ ] No privacy-friendly analytics; no 500 page (only `404.astro`). Needs
      service decisions.
