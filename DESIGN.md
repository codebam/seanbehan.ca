# DESIGN.md

A working document, not a museum. Section 1 is the machinery that makes the
design cheap to change. Section 2 is the list of things no change is allowed
to break — it is the standing gate for whatever comes next. Section 3 is the
design itself: what it changed and why, with the values as currently
shipped. Section 4 keeps the roads not taken, in one line each, so the next
person knows what was ruled out and on what grounds.

Nothing here touches the constraints in `AGENTS.md`: server-rendered
content, the site must work with JS off, one set of CSS tokens feeding both
palettes, `src/styles/app.css` as the single design surface, and the
two-variant mechanic (`PUBLIC_SITE`, `src/lib/site.data.js`). A change that
needs a client framework, a component library swap, or a third copy of the
copy tables is not a change for this site.

---

## 1. The machinery

**The voice.** Newsreader (a serif with a live optical-size axis and a
genuine italic) does all the writing and the shouting; Inter is furniture
(eyebrows, buttons, metadata); Fira Code is code. Headlines get exactly one
decorative move: an italic word set in the warm accent. Everything that
moves is under 0.6 s and a few pixels. The comments in `app.css` are the
best summary of intent — the site is deliberately a page, not a dashboard.

**The palette.** Warm paper in light (`#f7f2e8` / near-white `#fffdf8`
panels), deep espresso in dark (`#171310`), two accents on distinct duty
(section 3), and ten text/surface tiers per palette, written twice
(`--palette-light-*`, `--palette-dark-*`). The footer is the one band that
still carries the opposite palette (`panel-invert`); mid-page bands are
fills, not inversions.

**The composition.** Full-bleed horizontal bands (`panel` / `panel-alt`, and
the one `panel-invert` footer) with a shared 1140 px inner column
(`.shell`). The home page is: byline + one oversized serif statement → a
facts band → project rows → latest writing. Every other page opens with the
same `Masthead` — a folio line (small caps, label left, meta right, hairline
under) above a display-xl headline and a serif deck capping at 55 ch.
Long-form is one serif column at 1.72 leading with Tailwind typography
pointed at the tokens.

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

What was true before the redesign and is no longer true: the site used to be
recognizably one of a family — cool developer-site greys, a blue that could
sit on any of them. The split-accent pass fixed the accent job-split, the
bands, and the facts band; the warm re-ink (section 3.7) then lifted the
palette off that floor. The bones — the bands, the serif column, the folio
lines — did not move.

---

## 2. Invariants — every future change must keep these

1. **Token architecture.** One set of names, palettes as values. A change
   that hard-codes colours into components is rejected at review, not
   debated.
2. **`prefers-color-scheme`, plus the footer's `panel-invert`.** Both
   palettes must survive without JS.
3. **Print.** A long article printed in dark mode still has to be legible
   on paper. Whatever the next palette is, the print block gets a matching
   rewrite.
4. **Serif-first reading column.** The posts are the product. A change that
   demotes Newsreader below the UI face is re-arguing the site's reason for
   existing.
5. **JS-off parity.** Search filtering, the contents list, the copy
   buttons, and the topline work without a script. Motion is enhancement
   only and dies under `prefers-reduced-motion`.
6. **No new runtime.** Everything stays plain Astro, Kumo for the two or so
   controls it earns, `src/scripts` for behaviour.
7. **Two variants, one design.** Any difference between seanbehan.ca and
   codebam.ca must be expressible as data in `site.data.js`, not a branch in
   the CSS.
8. **Contrast discipline.** The current site was tuned around Lighthouse's
   complaints (`--dim` is 3.3:1, UI-marks only). New palettes ship their
   checks with them.
9. **Perf envelope.** The two-variable-fonts-plus-metric-fallbacks trick,
   the short entrance ladder, and the scroll-driven reading bar stay. New
   assets must not cost more than the ones they replace.

---

## 3. The design — a split-accent refinement, re-inked

The site is 90% right; the redesign is the 10%, itemized. Its whole
mechanism is one rule: **warm is the site's voice, blue is the user's
reach.** The warm accent (`--accent-warm`, `#b23f1e` light / `#e8925f`
dark) carries the editorial work — things the page says about itself. Blue
(`#1d4ed8` / `#84a9ff`) keeps the interactive work — things the hand can
reach. Two accents doing distinct jobs, on one page, was the site's old way
of getting neither right: blue was doing the interactive _and_ the
editorial, so the voice had to shout to be heard.

**1. The accent split, as shipped.**

- `::selection` — `--accent-warm-wash`, one token
  (`color-mix(in srgb, var(--accent-warm) 22%, transparent)`), which
  resolves against whichever warm is live, so one definition serves both
  themes.
- `.btn:hover` — the house button (404, project pages) takes the warm
  accent under the pointer. Kumo primaries stay blue: they are actions, and
  actions are blue duty.
- `.tag-lang` — language tags, which name the site's materials, sit in the
  voice. Topic tags stay quiet.
- `.input:focus` — blue border (it is focus), warm wash around it (it is
  the page's response).
- `:focus-visible` outlines and every link stay blue, unchanged.

**2. The display scale.** `display-xl` is capped at
`clamp(2.9rem, 6.8vw, 4.6rem)` — the cap is set to the reading column, not
the 1140 px shell. At the old 5.2 rem the headline overspans the page it
sits on, and the optical-size axis is what does the fitting at the smaller
cap.

**3. The bands.** The two mid-page inversions (services' `process`, the
production kit's `workflow`) no longer carry the opposite palette — a band
that is a darker page inside the page reads as another page inside this
one. They are `panel-alt` fills in both themes, separated from their
neighbours by the house hairline. The footer is the one remaining
inversion: the page ends, and the signature's page is different.

**4. The facts band.** The numbers were the site's one dashboard. The
`--panel` fill is gone (the band sits on `--bg`, ruled top and bottom), and
the values set in Newsreader with oldstyle numerals — the face's own
figures, not a stat card's tabular ones. The fourth cell is a word, so it
stays a word.

**5. The wash token.** `--accent-warm-wash` sits beside `--accent-wash` in
`:root` (8% blue). The 22% is the selection's weight — heavy enough to read
as chosen, light enough that the text underneath keeps the ground.

**6. The availability mark.** `Availability.astro` puts a dot and a sentence
in the home hero's identity block and on the résumé's masthead: who, where,
and is he reachable, answered in one place instead of three. The dot is
`--accent-warm` with the wash token as its ring, not green, because a status
is something the page says about itself and warm is the voice — green would
be a new token doing a job the split already assigned. It does not pulse. A
blinking indicator is a dashboard's way of saying "this is live", and the
site is a page; the status is a fact, not a feed. The copy is
`site.availability` in `site.data.js`, `null` on the variant that pitches the
code, so the component renders nothing there rather than branching.

**7. The warm re-ink.** The palette itself moved, which is the change the
first six items were clearing the ground for. Light is cream paper
(`--bg #f7f2e8`, panels `#fffdf8`) with ink-brown type (`#221c15` /
`#4b4237`); dark is a deep espresso (`#171310`) with warm off-white type
(`#f4ede0` / `#d3c7b4`). The terracotta is the editorial accent in both, the
blue the interactive one — the split above, on a ground that no longer reads
as every other developer site. The token block is still the only place a
component looks for colour; the change reaches the surfaces the tokens cannot
— the browser `theme-color`, the web app manifest, the generated OG cards
(`src/pages/og/[slug].png.ts`), the `SB` mark (`tools/favicon/`) and the
résumé PDF's LaTeX palette (`resume/metadata.yaml`) — so the paper, the card,
the tab and the page still agree. The résumé page also joined the split it had
missed: its editorial marks (the rules, section titles and company names) now
take the warm accent while its links stay blue, which is exactly the
`accentcolor` / `linkcolor` pair the PDF draws. The one risk the old section 4
named, terracotta-on-cream reading as a blog theme, is answered by the same
thing that kept the site out of the family before: the serif column and the
two-job accent split, not the hue alone.

**Known seams.** Three bands now sit between the same two fills on two
pages (services: alt / alt / bg; the kit: bg / alt / alt), so one adjacent
pair on each shares a fill and rests on the hairline between them. It is the
cost of a two-fill system — the inversion was the third fill, and the third
fill was the thing that did not belong. If a future change wants the
seamlessness back, the answer is not a third fill; it is rules, which is a
road in section 4.

**The ceiling it does not lift.** Structure. The bands, the folio lines, the
one-column reading measure: still the family's bones, now on the site's own
ground. "Broadsheet" below is the road that changes the bones, and it is
still not taken.

---

## 4. Roads not taken

- **"Broadsheet" — the site as a printed sheet.** The bands go entirely;
  structure is rules, not fills; the masthead's site name is the logo
  between two hairlines; "latest writing" becomes a multi-column index of
  title / first sentence / date; the facts fold into a folio line. The
  maximal statement, and the right one if the ambition is _this writer's_
  site rather than a good website. Turned down on effort (a component
  rewrite, not a token swap) and on mobile rhythm (a one-column index of
  rules starts to read as a wall). Kept as the design to reach for when the
  site wants to say something.
- **"The Console" — the technical journal, dark-first, mono-voiced.** Dark
  as the default, a monospace display face, a prompt-line masthead, code
  blocks full-bleed. The most truthful for _this_ audience — and the one
  that inverts invariant 4 by demoting the serif, and the one that
  collides with the two-variant rule, since its best reading is codebam
  only. Turned down on those two grounds, and recorded so the collision is
  found by argument next time, not by rediscovery.
