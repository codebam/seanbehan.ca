# DESIGN.md

A working document, not a museum. Section 1 is the machinery that makes the
design cheap to change. Section 2 is the list of things no change is allowed
to break — it is the standing gate for whatever comes next. Section 3 is the
design itself: what it is, what it changed, and why, with the values as
currently shipped. Section 4 keeps the roads not taken, in one line each, so
the next person knows what was ruled out and on what grounds.

Nothing here touches the constraints in `AGENTS.md`: server-rendered
content, the site must work with JS off, one set of CSS tokens feeding both
palettes, `src/styles/app.css` as the single design surface, and the
two-variant mechanic (`PUBLIC_SITE`, `src/lib/site.data.js`). A change that
needs a client framework, a component library swap, or a third copy of the
copy tables is not a change for this site.

---

## 1. The machinery

**The voice.** Inter does the interface — navigation, headings, labels,
buttons, metadata, and the display type. Newsreader does the reading: the
article body, and the résumé, which is a document. Fira Code (with a mono
fallback stack) is code. Headlines get exactly one decorative move: an italic
word set in the warm accent, which is also the colour of the wordmark's dot.
Everything that moves is under 0.6 s and a few pixels. The comments in
`app.css` are the best summary of intent — the site is deliberately a page,
not a dashboard.

**The palette.** White paper in light (`--bg #ffffff`, panels `#ffffff`, alt
fills `#f8fafc`) with slate ink (`#0f172a` / `#334155` / `#64748b`); dark is a
deep navy-ink (`#0b1220`, panels `#111827`) with near-white type
(`#f1f5f9` / `#cbd5e1`). One set of names carries both schemes — there is no
parallel `--palette-light-*` / `--palette-dark-*` pair to keep in step. The
footer is the one band that still carries the opposite palette
(`panel-invert`); mid-page bands are fills, not inversions.

**The composition.** A shared 1120 px inner column (`.shell`) and one vertical
rhythm (`.section`: `padding-block: clamp(3.5rem, 7vw, 5.5rem)`) that every
page-level section uses rather than restating. The home page is: hero (eyebrow,
statement, one action) → a facts strip → project cards → latest writing, with
`leadWith` swapping the middle two on the handle-first variant. Every other
page opens with the same `Masthead` — a folio line (uppercase label left, meta
right, hairline under) above a display-xl headline and a deck capped at 60 ch.
Long-form is one serif column (820 px, 1.75 leading) with Tailwind typography
pointed at the tokens; headings inside it are sans.

**The machinery that makes it cheap to restyle.**

- Every colour is a token; components never name a hex.
- Shiki tokens, prose, buttons, inputs, scrollbars, selection — all
  token-derived.
- The dark mode is one `prefers-color-scheme` block plus the footer's
  inversion override. Print pins the light palette.
- The fonts are two variable files plus metric-matched fallbacks
  (no swap reflow); the build script is `tools/fonts/build-fonts.sh`.
- Variant differences are copy and ordering (`leadWith: 'facts' | 'work'`),
  not CSS.
- Kumo supplies the two controls the site earns (the input, the button) and
  `.flat-control` / `.site-cta` in `app.css` re-ink them; nothing else is
  borrowed.

**The surfaces the tokens cannot reach.** A palette change is not only a token
change. These hold a copy of the values and have to be re-inked with them:
`src/pages/og/[slug].png.ts` (the light values, hard-coded), `src/pages/site.webmanifest.ts`,
`public/favicon.svg` and `tools/favicon/build-favicon.sh` (regenerate the
raster set with it), `resume/metadata.yaml` (the PDF's LaTeX palette), and the
display ads in `public/img/`. `Base.astro`'s two `theme-color` metas take the
same pair the manifest does. This list exists because the redesign of Sept 2026
updated `app.css` and `Base.astro` and nothing else, and the social cards, the
manifest, the favicon, the résumé PDF and the ads spent a commit showing the
previous design.

---

## 2. Invariants — every future change must keep these

1. **Token architecture.** One set of names, two schemes as values. A change
   that hard-codes colours into components is rejected at review, not
   debated — including the five surfaces listed in section 1, which are the
   documented exceptions and must be updated in the same change.
2. **`prefers-color-scheme`, plus the footer's `panel-invert`.** Both
   palettes must survive without JS.
3. **Print.** A long article printed in dark mode still has to be legible
   on paper. Whatever the next palette is, the print block gets a matching
   rewrite.
4. **A serif reading column.** The posts are the product, and the column a
   reader sits in is the serif. Headings, navigation and the display type are
   the interface face; demoting the _reading_ column to the UI face is
   re-arguing the site's reason for existing. (Re-worded in Sept 2026: the
   invariant used to say "serif-first", which the shipped design does not
   keep — see 3.2 — while the thing it was protecting, the column, still
   holds.)
5. **JS-off parity.** Search filtering, the contents list, the copy
   buttons, and the topline work without a script. Motion is enhancement
   only and dies under `prefers-reduced-motion`.
6. **No new runtime.** Everything stays plain Astro, Kumo for the two or so
   controls it earns, `src/scripts` for behaviour.
7. **Two variants, one design.** Any difference between seanbehan.ca and
   codebam.ca must be expressible as data in `site.data.js`, not a branch in
   the CSS.
8. **Contrast discipline.** Text clears 4.5:1 against what it sits on, and
   anything a reader has to perceive to use the page — a control's boundary,
   an icon, a focus ring — clears 3:1. `--dim` is the quietest mark the site
   draws and is set to just clear that bar (`#828d9d`, 3.36:1 on white); it is
   not a licence to go quieter. New palettes ship their checks with them.
9. **Perf envelope.** The two-variable-fonts-plus-metric-fallbacks trick,
   the short entrance ladder, and the scroll-driven reading bar stay. New
   assets must not cost more than the ones they replace.

---

## 3. The design, as shipped

**1. The accent split.** Warm is the site's voice, blue is the user's reach.
The warm accent (`--accent-warm`, `#b45309` light / `#fbbf24` dark) carries the
editorial work — the italic word in a headline, the wordmark's dot, language
tags, the résumé's rules and section titles. Blue (`#2563eb` / `#60a5fa`) keeps
the interactive work — links, focus, buttons, the one call to action. Two
accents doing distinct jobs is the whole mechanism; the failure mode it avoids
is one colour doing both, where the voice has to shout to be heard.

**2. The Sept 2026 redesign — the interface left the serif.** The previous
design was a broadsheet: a centred nameplate signed every page, the body
serif carried the headings as well as the prose, tracked uppercase labels
everywhere, and sections were separated by full-bleed bands. It asked a reader
to decode a newspaper before they could read a résumé. The shipped design puts
Inter in charge of the interface — headings included — and keeps Newsreader
for the reading column and the résumé, which is the invariant 4 above, stated
as it actually is. The header became a compact sticky bar (name left, four
links and one action right, a `<details>` menu under 56 rem) so the first
screen of every page belongs to the page. This is the change that re-worded
invariant 4 and cost the section-1 list its five stale surfaces; the argument
is here so the next person finds it by reading rather than by rediscovery.

**3. The home page.** A two-column hero states who this is, what they build and
how to reach them: eyebrow, one display-xl statement with a single italic word,
a lead paragraph, one primary action (the variant's `primaryAction`) and a
quiet row beside it, with the portrait and the availability mark in the aside.
The facts strip follows — four figures separated by hairlines on the page's own
ground — then project cards (one wide feature, then a two-column grid) and the
writing list (one lead card, then a grid). `leadWith` decides whether the work
or the numbers come first, so the two variants differ by order, not layout.

**4. The availability mark.** `Availability.astro` puts a dot and a sentence in
the home hero's identity block and on the résumé's masthead: who, where, and is
he reachable, answered in one place instead of three. The dot is `--positive`
green because that is the signal a reader already reads as "available" without
being taught it; it does not pulse. A blinking indicator is a dashboard's
grammar, and the site is a page — the status is a fact, not a feed. The copy
is `site.availability` in `site.data.js`, `null` on the variant that pitches
the code, so the component renders nothing there rather than branching.

**5. The footer is the one inversion.** The page ends, and the signature's page
is different. It carries its own small token set (`--footer-*`) including
`--footer-accent` (`#60a5fa`, the blue the dark palette already picked for a
dark ground), because the light scheme's `#2563eb` reads at 3.45:1 on
`#0f172a` — which is what a self-referential
`--accent: var(--accent)` silently produced. Its three link groups are real
lists, for the item counts.

**6. Contrast, as shipped.** Body copy is 10.4:1 on the light ground and 12.6:1
on the dark one; `--muted` is 4.76:1 / 7.30:1; `--accent` is 5.17:1 / 7.36:1;
`--accent-warm` is 5.02:1 / 11.22:1. The print block re-states the light
palette at `--muted #475569` (7.58:1) so a dark-mode print is still a legible
page. The two places this had drifted — the primary button, whose Kumo gradient
put a white label at 3.47:1, and the search field, whose boundary was 1.25:1 —
are now pinned by `.site-cta` and `.site-field` in `app.css`.

**7. Type scale.** `display-xl` is `clamp(2.25rem, 5vw, 3.5rem)`, `display-lg`
`clamp(1.5rem, 2.6vw, 2rem)`, the article title the same as `display-xl`. The
reading column is 820 px and the prose sets at 1.75; the section deck caps at
60 ch. Headings inside a post are re-based by `prepareBody` so the shallowest
is an `h2`, which is what keeps a body written entirely in `###` from skipping
a level under the page's `h1`.

**8. Motion.** One entrance ladder (`fadeInUp`, 0.4–0.6 s, ≤12 px, staggered by
`--enter-delay` / `--reveal-delay`), a scroll-driven reading bar with no
listener, and cross-page view transitions. All of it is off under
`prefers-reduced-motion`, and the reveal's hidden state is applied by script so
nothing is ever stuck invisible without JS.

---

## 4. Roads not taken

- **"The Console" — the technical journal, dark-first, mono-voiced.** Dark
  as the default, a monospace display face, a prompt-line masthead, code
  blocks full-bleed. The most truthful for _this_ audience — and the one
  that inverts invariant 4 by demoting the reading column, and the one that
  collides with the two-variant rule, since its best reading is codebam
  only. Turned down on those two grounds, and recorded so the collision is
  found by argument next time, not by rediscovery.
- **The broadsheet, kept.** A newspaper front page is a real design, and the
  site ran it for a season (commit `fcda5e8` and its neighbours). It lost to
  the reading it imposed on the one page a hiring reader actually came for:
  a centred nameplate, 11 px tracked labels, and a serif interface between
  them and a résumé. Recorded as a road not re-taken, with the argument, so
  the next person does not rediscover it as an improvement.
- **A manual dark toggle.** `prefers-color-scheme` only. Invariant 2 still
  requires the no-JS path, and a toggle that cannot be honoured without a
  script is a control that lies to a reader who has none.
