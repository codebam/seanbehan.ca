# DESIGN.md

## On this page

- [1. The machinery](#1-the-machinery)
- [2. Invariants — every future change must keep these](#2-invariants--every-future-change-must-keep-these)
- [3. The design, as shipped](#3-the-design-as-shipped)
- [4. Roads not taken](#4-roads-not-taken)

A working document, not a museum. Section 1 is the machinery that makes the
design cheap to change. Section 2 is the standing gate for whatever comes next.
Section 3 describes the shipped Quiet Mode design and why it replaced the
light editorial theme. Section 4 records the roads not taken.

Nothing here touches the constraints in `AGENTS.md`: server-rendered content,
the site must work with JS off, `src/styles/app.css` as the shared design
surface, and the two-variant mechanic (`PUBLIC_SITE`, `src/lib/site.data.js`). A
change that needs a client framework, a component library swap, or a third copy
of the copy tables is not a change for this site.

---

## 1. The machinery

**The voice.** Quiet Mode uses the grammar of a calm shell session without
turning the site into a terminal pastiche. A local monospace stack carries
display type, navigation, labels, metadata, commands and code. System UI type
carries explanations, article prose and the résumé. The prompt is identity and
orientation; prose remains prose.

The display face is local-first: Fira Code, JetBrains Mono and Cascadia Code are
used when installed, then the platform's monospace. No mono webfont ships. The
old Inter and Newsreader files remain available to the social-card renderer,
but the public page no longer preloads them.

**The palette.** Quiet Mode is deliberately dark on every device. The ground is
`#0d1512`, the raised surface is `#14231d`, ink is `#e4f1e8`, muted text is
`#8fa99a`, and the single interactive accent is `#a7ff83`. The accent is bright
enough for links and focus rings on the dark ground; button labels switch to
`#111111`. There is no light/dark toggle and no `prefers-color-scheme` branch.
Print pins a separate ink-on-paper palette.

**The composition.** The shared `.shell` remains the inner column. The home
page is a two-column hero — statement and action on the left, a current-focus
command block and availability on the right — followed by the facts strip,
project directory, writing log, offers, experience and newsletter. The
handle-first variant still changes order through `leadWith`, not CSS.

Projects are rows, not a card gallery: path and metadata in the left gutter,
title, description, tags and links in the main column. Writing is a log: date
in the gutter, title and summary in the main column. The same directory/log
language carries into the archive and related-reading rows.

Every other page opens with `Masthead`: a command label and meta row above a
mono display headline and a deck capped at 60 ch. Long-form is one system-sans
column, 46rem wide, with 1.75 leading. This is a conscious departure from the
old serif-reading invariant: the chosen direction treats technical prose as
part of the same readable system, while code and interface type share the
local mono stack.

**The machinery that makes it cheap to restyle.**

- Every colour is a token; components do not name hex values.
- Shiki tokens, prose, buttons, inputs, scrollbars, selection, résumé and print
  styles are token-derived.
- The prompt cursor is the only looping motion. It disappears under
  `prefers-reduced-motion`; the entrance ladder and reading progress retain
  their existing reduced-motion guards.
- Variant differences remain copy and ordering in `site.data.js`.
- Kumo still supplies the input and button. `.flat-control`, `.site-cta` and
  `.site-field` re-ink those controls to the Quiet Mode palette.

**The surfaces the tokens cannot reach.** A palette change is not only a token
change. These hold copied values and must move with it:

- `src/pages/og/[slug].png.ts` — the fixed social-card palette
- `src/pages/site.webmanifest.ts` — installed theme and background colours
- `public/favicon.svg`, `tools/favicon/build-favicon.sh` and the generated
  raster icons in `public/`
- `public/profile-dark.webp` — the portrait ground used by the dark-only pages
- `resume/metadata.yaml` — the PDF palette
- display ads in `public/img/` and `tools/ads/build-ads.mjs`
- the dark brand figures in `public/img/brand/`
- the `@media print` block in `src/styles/app.css`
- the single `theme-color` meta in `Base.astro`

This list exists because the September 2026 redesign changed `app.css` and
`Base.astro` without moving every copied surface. Quiet Mode updates the set
together so the tab, share card, installed app, résumé and ads do not keep
speaking the previous palette.

---

## 2. Invariants — every future change must keep these

1. **Token architecture.** One dark screen palette, one print palette. A change
   that hard-codes colours into components is rejected at review, including the
   copied surfaces listed above.
2. **Dark by design.** Quiet Mode does not follow the operating system's light
   preference. The document declares `color-scheme: dark`; there is no toggle
   that can lie when JavaScript is unavailable.
3. **Print.** A long article printed from the dark site still has to be legible
   on paper. The print block owns its ink-optimised values and moves with the
   screen palette.
4. **A readable long-form column.** Posts are the product. The reading column
   keeps a 46rem measure, 1.75 leading and system-sans prose; code remains
   visibly monospace. Headings inside a post are still re-based by
   `prepareBody`, never in a template.
5. **JS-off parity.** Search filtering, the contents list, the copy buttons and
   the topline work without a script. Motion is enhancement only and dies under
   `prefers-reduced-motion`.
6. **No new runtime.** Everything stays plain Astro, Kumo for the two controls
   it earns, and `src/scripts` for behaviour.
7. **Two variants, one design.** Any difference between seanbehan.ca and
   codebam.ca is data in `site.data.js`, not a branch in CSS.
8. **Contrast discipline.** Text clears 4.5:1; control boundaries, icons and
   focus rings clear 3:1. The accent is not used for small text unless it clears
   the same 4.5:1 bar against its actual ground.
9. **Perf envelope.** The public page no longer preloads two variable webfonts.
   New assets must not cost more than the ones they replace. The cursor blink,
   entrance ladder and scroll-driven reading bar remain the only motion.
10. **Keyboard and touch targets.** Navigation links keep a 44px minimum target,
    focus remains visible, and horizontal code/file-tree regions are named,
    focusable and scrollable.

---

## 3. The design, as shipped

**1. The prompt is the wordmark.** The header brand is a shell prompt —
`sean@seanbehan:~$` or `codebam@codebam:~$` — with a blinking accent cursor. It
replaces the legal-name wordmark without hiding the name: the prompt contains
the origin, and the page metadata still carries Sean Behan. The mobile menu
uses the same navigation and current-page semantics as the desktop row.

**2. The hero is a current-focus summary.** The left side carries the role, one
mono statement, the introduction and the variant's primary action. The right
side is a small command block:

```text
systems = rust + typescript
platform = nixos + cloudflare
method = small, explicit, reproducible
ship_in_the_open = true
```

Availability follows the block. The portrait leaves the home hero; it remains
on About and Contact, where a hiring reader wants a face beside the biography.

**3. Work is a directory.** `Selected work` is headed by `ls ~/projects`. Each
row shows its repository path, year/language metadata, title, description,
tags and links. Images remain available on case-study pages, but the home page
does not spend its first screen on a gallery of product shots. This makes the
work scannable and gives the descriptions more room.

**4. Writing is a log.** `Latest writing` is headed by `tail -n 6 ~/writing`.
Dates sit in a monospace gutter; titles and summaries sit in the reading
column. The archive keeps its server-rendered rows and JS-off search behavior,
styled with the same hairline rhythm.

**5. The facts strip is telemetry, not a dashboard.** Four values use mono type
and the accent; labels stay quiet. The strip proves experience, output and
stack before the project directory asks for a deeper read.

**6. The footer is a status line.** It keeps the real link lists and newsletter
form, but the wordmark becomes the same prompt and the palette stays in the
dark green family rather than inverting to an unrelated navy.

**7. Contrast.** The Quiet Mode palette was checked against its actual grounds:
ink and muted text clear 4.5:1, the accent clears 4.5:1 for text-sized marks,
and the dark button label clears 4.5:1 on the green accent. Print uses dark ink
on white with a darkened accent so a dark-mode page does not print as a grey
block.

**8. Motion.** The prompt cursor blinks at 1.2s. Links and rows change color or
background over 120–220ms. The existing entrance ladder, reading progress and
view transitions remain under 0.6s. All looping and transition motion is off
under `prefers-reduced-motion`.

---

## 4. Roads not taken

- **The Marginalia Column.** A warm editorial publication with chapter
  navigation and annotated spreads. Beautiful for long-form writing, but less
  specific to Sean's Linux, Rust and systems work than Quiet Mode.
- **The broadsheet.** The site ran a newspaper front page in an earlier season.
  It imposed a decoding step before the work and résumé; Quiet Mode keeps the
  directness without the nameplate ceremony.
- **A literal terminal.** Full-screen ASCII art, fake command input and console
  chrome would make the site harder to read and maintain. Quiet Mode borrows
  the grammar — prompt, path, metadata, log — not the limitations.
- **A manual theme toggle.** The dark palette is the chosen identity, not a
  preference layer. A toggle would add state and a second palette to maintain
  without improving the design.
