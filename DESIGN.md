# DESIGN.md

## On this page

- [1. The machinery](#1-the-machinery)
- [2. Invariants — every future change must keep these](#2-invariants--every-future-change-must-keep-these)
- [3. The design, as shipped](#3-the-design-as-shipped)
- [4. Roads not taken](#4-roads-not-taken)

A working document, not a museum. Section 1 is the machinery that makes the
design cheap to change. Section 2 is the standing gate for whatever comes next.
Section 3 describes the shipped Open Studio Index design and why it replaced
Quiet Mode. Section 4 records the roads not taken.

Nothing here touches the constraints in `AGENTS.md`: server-rendered content,
the site must work with JS off, `src/styles/app.css` as the shared design
surface, and the two-variant mechanic (`PUBLIC_SITE`, `src/lib/site.data.js`). A
change that needs a client framework, a component library swap, or a third copy
of the copy tables is not a change for this site.

---

## 1. The machinery

**The voice.** Open Studio Index treats the site as a warm, working studio
directory rather than a terminal. Trebuchet MS, with Verdana as the fallback,
carries display type and the wordmark. System UI type carries navigation,
labels, explanations, article prose and the résumé. The local monospace stack
is reserved for code and file metadata.

The display face is deliberately humanist: it has enough character to feel
made, without the severity of a mono interface. Headlines keep one italic
accent phrase. Body copy stays in system type so long technical writing remains
comfortable and the page does not depend on a downloaded font.

**The palette.** Open Studio Index follows the system preference. Light uses a
putty ground (`#e7e1d8`), paper surface (`#fbf8f3`), warm black ink (`#24211d`),
muted text (`#625b53`) and blue accent (`#315dc5`). Dark uses roasted umber
(`#171512`), a warm charcoal surface (`#24201b`), ivory ink (`#f3ede4`), muted
sand (`#b8ada0`) and a lighter blue accent (`#9cbcff`). Button labels switch to
white in light and near-black in dark. There is no manual toggle: the no-JS
`prefers-color-scheme` branch is the control.

**The composition.** The shared `.shell` remains the inner column, widened to
70rem for the studio layout while long-form keeps a 48rem reading measure. The
home page is a two-column hero — statement and action on the left, a 2×2
material-study grid and availability on the right — followed by the facts
strip, selected work, latest writing, commercial offers, experience and the
newsletter. `leadWith` still swaps facts and work for the handle-first variant.

Projects return to stacked cards: the lead pairs its plate and story, and the
remaining projects stack as full-width image-and-paper cards. Writing uses a
lead card and a responsive grid. The archive keeps its server-rendered rows,
styled with the same hairline and surface language.

Every other page opens with `Masthead`: a small label/meta row above a display
headline and a deck capped at 60 ch. About uses the portrait and working-notes
cards as a compact manifesto. The footer is a paper band in light and a warm
umber band in dark, not an unrelated inversion.

**The machinery that makes it cheap to restyle.**

- Every colour is a token; components do not name hex values.
- Shiki tokens, prose, buttons, inputs, scrollbars, selection, résumé and print
  styles are token-derived.
- Cards lift by three pixels on hover; text links draw a one-pixel underline.
  Both are disabled under `prefers-reduced-motion`.
- Variant differences remain copy and ordering in `site.data.js`.
- Kumo still supplies the input and button. `.flat-control`, `.site-cta` and
  `.site-field` re-ink those controls to the studio palette.

**The surfaces the tokens cannot reach.** A palette change is not only a token
change. These hold copied values and must move with it:

- `src/pages/og/[slug].png.ts` — the fixed social-card palette
- `src/pages/site.webmanifest.ts` — installed theme and background colours
- `public/favicon.svg`, `tools/favicon/build-favicon.sh` and the generated
  raster icons in `public/`
- `public/profile.webp` and `public/profile-dark.webp` — the portrait grounds
  selected by the system preference
- `resume/metadata.yaml` — the PDF palette
- display ads in `public/img/` and `tools/ads/build-ads.mjs`
- the light and dark brand figures in `public/img/brand/`
- the `@media print` block in `src/styles/app.css`
- the light/dark `theme-color` metas in `Base.astro`

This list exists because the September 2026 redesign changed `app.css` and
`Base.astro` without moving every copied surface. Open Studio Index updates the
set together so the tab, share card, installed app, résumé and ads do not keep
speaking the previous palette.

---

## 2. Invariants — every future change must keep these

1. **Token architecture.** One light screen palette, one dark screen palette and
   one print palette. A change that hard-codes colours into components is
   rejected at review, including the copied surfaces listed above.
2. **System theme.** Open Studio Index follows `prefers-color-scheme` without
   JavaScript. There is no manual toggle that can lie when JavaScript is
   unavailable; print always pins the light document palette.
3. **Print.** The screen already uses paper-like values, but the print block
   still pins white paper and darker quiet marks so a résumé or article prints
   cleanly.
4. **A readable long-form column.** Posts are the product. The reading column
   keeps a 48rem measure, 1.75 leading and system-sans prose; code remains
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
   focus rings clear 3:1. Muted text is never used for a primary action.
9. **Perf envelope.** Public pages use local display faces and system body type;
   they do not preload variable webfonts. The older font files remain for the
   social-card renderer. New assets must not cost more than the ones they
   replace.
10. **Keyboard and touch targets.** Navigation links keep a 44px minimum target,
    focus remains visible, and horizontal code/file-tree regions are named,
    focusable and scrollable.

---

## 3. The design, as shipped

**1. The wordmark is a studio signature.** `Sean Behan.` uses the display face,
with the accent dot as the only brand mark. It replaces Quiet Mode's shell
prompt. The name stays literal and professional; the navigation remains a plain
row of section links with one contact action.

**2. The hero is a material index.** The left side carries the role, one
display statement, the introduction and the variant's primary action. The
right side is a 2×2 study grid:

| Material   | Use                  |
| ---------- | -------------------- |
| Rust       | Linux userspace      |
| TypeScript | Edge applications    |
| NixOS      | Reproducible systems |
| Workers    | Distributed services |

Availability follows the grid. The portrait leaves the home hero and remains on
About and Contact, where a hiring reader wants a face beside the biography.

**3. Work is a stack of tangible projects.** `Selected work` keeps the project
plates. The lead pairs its image and story; the rest form a two-column card
grid. This is intentionally not a terminal directory: the pictures are evidence
of shipped work, and the warmer card surface keeps the page approachable.

**4. Writing is a set of notes.** `Latest writing` uses a lead card and a
responsive grid with the same surface, hairline and restrained lift. The archive
keeps its server-rendered rows and JS-off search behavior.

**5. The facts strip is proof, not telemetry.** Four values use display type and
the normal ink colour; labels stay quiet. The strip proves experience, output
and stack before the work asks for a deeper read.

**6. About is a working manifesto.** The portrait, biography, availability and
working-notes cards share the page's warm paper surface. The page states how the
work is done, not just where it has been.

**7. The footer is a paper/umber band.** It keeps the real link lists and
newsletter form, using the light paper surface or the dark warm umber surface
rather than an unrelated inversion. The legal, site and elsewhere lists remain
explicit and accessible.

**8. Motion.** Cards lift three pixels over 180ms. Text links draw a one-pixel
underline over 180ms. The existing entrance ladder, reading progress and view
transitions remain under 0.6s. All looping and transition motion is off under
`prefers-reduced-motion`.

---

## 4. Roads not taken

- **Quiet Mode.** The dark terminal direction was implemented and deployed, but
  it read too strongly as a hacker aesthetic for the person the site is meant
  to represent. Open Studio Index keeps the technical specificity while
  returning to a warmer, more human register.
- **The Marginalia Column.** A warm editorial publication with chapter
  navigation and annotated spreads. Beautiful for long-form writing, but less
  specific to Sean's Linux, Rust and systems work than Open Studio Index.
- **The broadsheet.** The site ran a newspaper front page in an earlier season.
  It imposed a decoding step before the work and résumé; Open Studio keeps the
  directness without the nameplate ceremony.
- **A literal terminal.** Full-screen ASCII art, fake command input and console
  chrome make the site harder to read and maintain. Quiet Mode proved that the
  grammar can still overwhelm the person even without the literal interface.
- **A manual theme toggle.** The system preference already supplies the choice.
  A manual toggle would add state, persistence and another control to maintain
  without improving the design.
