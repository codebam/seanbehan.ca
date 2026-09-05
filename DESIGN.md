# DESIGN.md

A working document, not a museum. Section 1 records what the site looks like
today and the machinery that produced it, because the proposals in section 3
are measured against that baseline. Section 2 is the list of things no
proposal is allowed to break. Section 3 is the actual argument: four
different directions the site could go, each specific enough to implement
this week, each with its trade. The recommendation at the end is a starting
position, not a verdict.

Nothing here touches the constraints in `AGENTS.md`: server-rendered content,
the site must work with JS off, one set of CSS tokens feeding both palettes,
`src/styles/app.css` as the single design surface, and the two-variant
mechanic (`PUBLIC_SITE`, `src/lib/site.data.js`). A proposal that needs a
client framework, a component library swap, or a third copy of the copy
tables is not a proposal for this site.

---

## 1. The site today

**The voice.** Newsreader (a serif with a live optical-size axis and a
genuine italic) does all the writing and the shouting; Inter is furniture
(eyebrows, buttons, metadata); Fira Code is code. Headlines get exactly one
decorative move: an italic word set in warm orange. Everything that moves is
under 0.6 s and a few pixels. The comments in `app.css` are the best summary
of intent — the site is deliberately _a page_, not a dashboard.

**The palette.** Cool paper greys in light (`#f1f5f9` / white panels), deep
slate in dark (`#101827`), one blue accent doing all interactive work
(`#2457d6` / `#60a5fa`), and one warm accent doing all editorial work
(`#c2410c` / `#fb923c`). Ten text/surface tiers per palette, written twice
(`--palette-light-*`, `--palette-dark-*`) so `panel-invert` can hand any
section the palette the page is not in.

**The composition.** Full-bleed horizontal bands (`panel` / `panel-alt` /
`panel-invert`) with a shared 1140 px inner column (`.shell`). The home
page is: byline + one oversized serif statement → a facts band → project
rows → latest writing. Every other page opens with the same
`Masthead` — a folio line (small caps, label left, meta right, hairline
under) above a display-xl headline and a serif deck capping at 55 ch.
Long-form is one serif column at 1.72 leading with Tailwind typography
pointed at the tokens.

**The machinery that makes it cheap to restyle.**

- Every colour is a token; components never name a hex.
- Shiki tokens, prose, buttons, inputs, scrollbars, selection — all token-derived.
- The dark mode is one `prefers-color-scheme` block plus the invert-band
  override. Print pins the light palette.
- The fonts are two variable files plus metric-matched fallbacks
  (no swap reflow); the build script is `tools/fonts/build-fonts.sh`.
- Variant differences are copy and ordering (`leadWith: 'facts' | 'work'`),
  not CSS.

The honest assessment: it is well-built and well-considered, and it is also
recognizably one of a family — light cool-grey SaaS-adjacent greys, a blue
that could belong on any developer site, panel bands that read slightly
"marketing landing page" against copy that is clearly not written for one.
The typography is the soul of the thing; the chrome is the part that could
be more _this person's_.

---

## 2. Invariants — every proposal must keep these

1. **Token architecture.** One set of names, palettes as values. A proposal
   that hard-codes colours into components is rejected at review, not
   debated.
2. **`prefers-color-scheme` + `panel-invert`** (or an explicit equivalent).
   Both palettes must survive without JS.
3. **Print.** A long article printed in dark mode still has to be
   legible on paper. Whatever the new palette is, the print block gets a
   matching rewrite.
4. **Serif-first reading column.** The posts are the product. Any proposal
   that demotes Newsreader below the UI face is re-arguing the site's
   reason for existing.
5. **JS-off parity.** Search filtering, the contents list, the copy
   buttons, and the topline work without a script. Motion is enhancement
   only and dies under `prefers-reduced-motion`.
6. **No new runtime.** Everything stays plain Astro, Kumo for the two or so
   controls it earns, `src/scripts` for behaviour.
7. **Two variants, one design.** Any difference between seanbehan.ca and
   codebam.ca must expressible as data in `site.data.js`, not a branch in
   the CSS.
8. **Contrast discipline.** The current site was tuned around Lighthouse's
   complaints (`--dim` is 3.3:1, UI-marks only). New palettes ship their
   checks with them.
9. **Perf envelope.** The two-variable-fonts-plus-metric-fallbacks trick, the
   short entrance ladder, and the scroll-driven reading bar stay. A
   proposal's new assets must not cost more than the ones they replace.

---

## 3. Four directions

Each proposal is written as a change set against the baseline: what dies,
what stays, and the new token values, so the estimate is a build, not a
research trip.

---

### A — "Ink & Paper": warm editorial

_The one with the most identity upside. The site's greyest problem is its
palette: cool slate greys are what every developer site ships by default,
and they fight the serif. This proposal keeps every structural decision and
re-inks the whole thing onto warm paper. It reads as a person's journal,
not a product's landing page._

**Concept.** Cream paper, warm ink, one saturated accent done with intent
(terracotta), and the blue retired from _editorial_ duty but kept, quieter,
for _interaction_ — because "everything red" is a different cliché than
"everything blue".

**Palette (light):**

```
--bg           #f6f1e7   (aged paper; replaces #f1f5f9)
--surface-alt  #efe7d9
--panel        #fbf8f1   (warm white, never clinical #fff)
--line         #d8cbb6
--line-strong  #b3a488
--text         #211c14
--body         #3d3629
--muted        #6d6250
--dim          #8f8269   (UI marks only — re-check 3:1)
--accent       #b23a1e   (terracotta; replaces the blue as THE accent)
--accent-hover #932c13
--accent-warm  #1e4fd0   (the blue demoted: italic emphasis, links-in-prose)
```

**Palette (dark):** deep amber-black rather than slate —

```
--bg           #16120c
--surface-alt  #201a11
--panel        #1d1710
--line         #3a2f1f
--text         #f3ede1
--body         #cfc3ad
--accent       #e5744a   (terracotta, lifted)
--accent-warm  #8fb2ef   (the demoted blue, as a cool counterweight)
```

**Type and composition stay** — Newsreader, the folio masthead, the
serif column, the single-orange-italic rule all survive untouched. That is
the point: the typography was already editorial; the chrome just wasn't.

**What dies:** the "cool paper" reads (the 2021 Figma-default look). The
blue wordmark dot, the blue hover washes — all swap to terracotta.

**Variant behaviour:** none in CSS. `leadWith` and copy already do the
work. If anything, codebam could take the _cool_ counterweight accent
(blue) while seanbehan takes terracotta — expressible as a token override
in `site.data.js`-driven inline custom properties on `<html>`, which is data,
not a CSS branch.

**Trade.** Highest identity upside, near-zero structural risk. The risk is
aesthetic, not engineering: terracotta-on-cream is also now a known look
(IndieWeb-adjacent). The demoted-blue-as-link rule is the detail that keeps
it feeling deliberate instead of "blog theme #47".

**Cost.** S: a token swap, the print block, the fallback-contrast recheck,
the OG cards (tools/og), the Kumo button vars, and a pass over the project
images for anything baked to the old greys. A weekend.

---

### B — "Broadsheet": the site as newspaper

_The maximal proposal. If the Masthead's folio line is already a nod to the
broadsheet, follow it to the end: the site name set huge across the top in
two hairlines, an index column set like a classified, and the decorative
orange demoted to the only non-ink colour allowed anywhere._

**Concept.** Drop the panel bands entirely. The surface is one continuous
sheet, divided by rules, not fills. The homepage becomes front page → inner
pages: the "latest writing" section becomes a genuine **index** — three to
four columns on desktop (two on mobile), entries as _title — first sentence
— date_, no cards, no panels, exactly how a newspaper lists its contents.

```
--bg / --panel   #ffffff (light) / #0e0e0c (dark: near-black, not slate)
--text           #111110
--line           #111110 at 1px (rules ARE the structure now)
--accent         #b23a1e  (the one non-ink colour, as today's warm accent)
interactive      #0034e0 (blue, reserved for links and focus)
```

**Type.** Newsreader goes _bigger_, not smaller: display-xl up to `clamp(3.4rem, 9vw, 7rem)`
for the front-page statement; the site name itself set in Newsreader caps
across the full shell width, flanked by thin rules and the date — the
masthead _is_ the logo, no wordmark dot. Inter survives only for the
small-caps furniture. Headline italics stay warm-accent (this rule survives
every proposal by virtue of being good).

**What dies:** `panel`, `panel-invert`, the `hero-kicker` avatar row (a
broadsheet does not show the byline's photograph next to the headline),
`PostList` cards as cards (they become index rows: hairline under each entry,
`<span class="tag-lang">` inline, date right-aligned on the rule). The
Facts band becomes a single folio line inside the masthead
("Est. 2014 · 42 posts · 9 repos"), the way a newspaper states its volume.

**Variant behaviour:** `leadWith` maps `facts → front page, work → the work
leads`. The two hairlines of the masthead are the only place variant copy
differs.

**Trade.** The most _design_'d of the four. It is also the highest effort
(`PostList`, `Facts`, `Work`, `Masthead`, and the tag pages all re-layout,
not re-token), and the densest on mobile — a four-column index collapses to
one, and "one column of rules" can read as a wall if the rule rhythm
(1 px rule / 1.25 rem breath) is not tuned. Print is _excellent_ under this
scheme for free, which is not nothing for a blog whose reader might actually
hit Cmd-P.

**Cost.** M: two solid sessions of component rework, plus a real pass on
the mobile rhythm.

**Worth saying:** this is the proposal to make if the site's ambition is to
look like _this particular writer's_ site rather than a good website. It
succeeds or fails as a statement.

---

### C — "Refinement": keep the bones, fix the edges

_The "do no harm" option, made honest. The current site is 90% right; this
is the 10%, itemized, for anyone who would rather the site be quietly better
than visibly different._

**Changes, in order of impact:**

1. **Retire the blue as the _only_ accent.** Keep it for links/focus, but let
   the warm accent do the button hover, the tag-lang colour, and the
   selection tint. Two accents doing distinct jobs beats one doing all
   the work, at a cost of about an hour of search-and-verify.
2. **Tighten the display scale.** `display-xl` at `clamp(2.9rem, 6.8vw,
5.2rem)` is correct for a 1140 px shell; for the ~650 px reading column
   the masthead heading overspans slightly. Cap at ~4.6rem and let the
   optical-size axis do more of the work.
3. **The `panel-invert` band.** It is the one thing on a page that does not
   belong to a page. Replace it with the _light_ palette's `--surface-alt`
   in both modes (i.e. a fill, not a palette inversion) and let the footer
   be the only inversion, if any.
4. **The Facts band numbers.** Currently they read as dashboard KPIs. Set
   them in Newsreader (serif numerals via `font-variant-numeric`,
   oldstyle where the font agrees) and drop the `--panel` background to
   `--bg` — a line of text, not a stat card.
5. **Selection + focus tint** to the warm accent at 22%; links keep the
   interaction blue.

**What dies:** essentially nothing. The cool palette stays. That is both the
appeal and the ceiling — the site will look like a very good version of
itself, and "very good version of a developer-site family" is exactly the
family it is in now.

**Cost.** XS–S: a day of careful edits and the Lighthouse pass.

**Worth saying:** if the goal of this exercise is "make a decision and
ship it in a weekend", C is the answer. If the goal is "make the site look
like no other site", C fails by design and the argument is A vs B vs D.

---

### D — "The Console": dark-first, mono-voiced

_The contrarian. A technical journal written by people who live in a
terminal could reasonably be *styled* like one: dark by default, a monospace
display face carrying the voice, hairlines in place of shadow, and the
light palette demoted to a preference, not the default. The strongest fit
for codebam.ca specifically, and a deliberate rejection for seanbehan.ca —
which is the point of naming it._

**Concept.** `color-scheme: dark light` (dark first). Display face is
**JetBrains Mono** (or Fira Code, already in the stack) at 400 weight,
tracked slightly _negative_, uppercase for the eyebrow tier only — the
serif demotes from headline to **body** (Newsreader as the reading face is
an invariant this proposal explicitly trades against §2.4, which is why it
is named here for what it costs). Blue accent stays — it is already
terminal-native (`#60a5fa` on `#0d1117` is GitHub dark, which is both the
virtue and the problem).

```
--bg        #0d1117        --panel   #161b22
--text      #e6edf3        --body    #adbac7
--accent    #58a6ff        --warm    #f0883e (GitHub syntax-orange, on purpose)
light mode:  #ffffff / #1f2328, same accent, Newsreader headlines come back
```

**Signature moves:** the folio line becomes a **prompt line** —
`$ seanbehan.ca — posts(42)` in mono, the `#` in place of the em-dash.
The reading-progress bar stays (it is already correct). `PostList` entries
get a `▸` bullet in the accent colour. The code blocks are _promoted_:
full-bleed (breaking out of the shell column), since in this scheme code is
first-class content, not an exhibit.

**Trade.** Distinctive and honest about the audience. But it is a **GitHub
dark clone at first glance** (which is where it looks tired), it inverts
the §2.4 invariant (serif headlines are what make the posts _posts_), and
it is the one proposal the _other_ domain actively resists. If seanbehan.ca
and codebam.ca shared one database, they share one design under this
scheme's best reading — which means either the whole thing is codebam, or
D does not apply.

**Cost.** S: tokens + font swap + the `PostList`/`Masthead` bullet and
prompt-line work. The light-mode fallback is the part to spec carefully so
it doesn't read as an afterthought.

**Worth saying:** if the honest answer to "who is this site for, really"
is "people who would find a NixOS paste on HN and want to know who wrote
it", D is the most truthful of the four. If the answer is "me, and readers
who should enjoy me", reject it and read A.

---

## 4. Where the four actually differ

The palette is the loudest difference, but the real axes are two:

|                 | Surface is                        | Voice is                      |
| --------------- | --------------------------------- | ----------------------------- |
| A — Ink & Paper | a warm page                       | the serif (unchanged)         |
| B — Broadsheet  | a printed sheet, divided by rules | the serif, bigger and ruled   |
| C — Refinement  | the current grey page, tidied     | the serif (unchanged)         |
| D — The Console | a terminal                        | the monospace (serif demoted) |

A, B, and C all agree with the site's existing claim on typography; only D
withdraws it. A and C are palette-and-token work; B is also component
work; D is both plus a font addition.

## 5. Recommendation, stated plainly

**B, scoped down** — the masthead _and_ the index rows, with the panel bands
gone — is the right move for seanbehan.ca specifically, because the copy is
already written at broadsheet register ("I build software that lives close
to the metal") and the chrome is doing it some disservice. **A** is the
right move for the _system_ (both domains): it is cheap, it is warm, and
the demoted-blue rule keeps it feeling authored. They are not mutually
exclusive and they are not expensive to do in order: A first (a weekend),
hold the site, then B if it still feels like it wants it.

If the appetite for either is low, **C** is the answer by default and
nothing is lost by taking it — it is the only proposal on the list with no
downside mode at all.

Whatever survives review, the first commit of whichever proposal is chosen
is a `DESIGN.md` (this file, section 3 narrowed to the winner) followed by
the token swap in `app.css`, followed by everything else reading from the
tokens. The design is the tokens; the components are just arithmetic on top.
