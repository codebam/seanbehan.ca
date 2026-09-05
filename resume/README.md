# `resume/` — the résumé source

`resume.md` in, two formats out: the PDF people download and the HTML fragment
`/resume` renders inline. How the artifacts reach the site — bucket, Worker
routes, CI, credentials — is [`docs/resume.md`](../docs/resume.md). This file is
about writing the document and about the knobs that change how it looks.

```bash
npm run resume                    # from the repo root; both outputs into resume/out/
./build.sh                        # from here; both outputs into .
./build.sh --html --outdir /tmp/o # just the fragment: pandoc, no TeX, no bundle
./build.sh --pdf --keep-tex       # just the PDF, and the .tex it came from
./build.sh --font "TeX Gyre Heros"
./build.sh --open
PANDOC=pandoc ./lint-template.sh  # compile-check the LaTeX template alone
```

## Writing the Markdown

The filter reads intent out of ordinary Markdown. Nothing here is a syntax the
PDF understands and the page does not — both get the same structure.

| Written                             | Becomes
| ----------------------------------- | ------------------------------------------------
| `# EXPERIENCE`                      | A section: accent title, double rule beneath.
| `## LANGUAGES`                      | A quiet subsection label, no rule.
| `### Role · Company`                | One entry: bold role, accent company.
| `*Apr. 2021 – Oct. 2021*` under it  | That entry's right-hand column.
| `*Peterborough, ON* \| *2016 – 2023*` | Both parts, in the same column.
| `**Expert:**` then `- short items`  | One line: `Expert: TypeScript · Rust · Nix`.
| `- a longer item`                   | A real bullet list, kept as bullets.
| `---`                               | Nothing. Sections already have rules.

An entry heading pairs with the italic line *directly* below it — the blank
line between them is optional, and a `- item` line with no blank line above it
is still read as a list, which is how resumes get written in a hurry.

The `·` in `Role · Company` is the separator the split happens on; change the
character with `entry_separator`, or turn the split off with
`split_entries: false`.

### Front matter

```yaml
title: "SEAN BEHAN"                    # rendered as the name
subtitle: "Software Developer · TypeScript & Rust"
location: "Greater Toronto Area"
email: "contact@seanbehan.ca"
website: "https://seanbehan.ca"        # the scheme is trimmed for display
github: "codebam"                      # shown as github.com/codebam
linkedin: "sean-behan"
phone: "555-555-0100"                  # omit it for a document you host publicly
abstract: "One paragraph under the header rule."
```

Those six contact keys are normalised into the header line in the order above,
and whatever is absent is simply not there — on the PDF they separate with
pipes, on the page they stack to the right. `title`, `subtitle` and `abstract`
are the only front matter the body does not see.

## Knobs

`metadata.yaml` holds them; any key can be overridden per build with
`-V key=value`, and `resume.md`'s front matter wins over the file for keys it
defines.

| Key | Default | Effect
| --- | ------- | -------
| `papersize` | `letter` | `letter` or `a4`.
| `fontsize` | `10.5` | Body size in pt; fractional sizes work.
| `margin`, `top`…`right` | `0.62in` sides | Page margins.
| `mainfont` | TeX Gyre Pagella | Body face.
| `sansfont` | TeX Gyre Heros | Name, section titles, entry titles.
| `monofont` | DejaVu Sans Mono | `\texttt{}`.
| `fallbackfont`, `fallbacksans`, `fallbackmono` | — | Second choice when a family is missing.
| `accentcolor` | `1F3A5F` | Rules, section titles, company names (hex, no `#`).
| `inkcolor`, `mutedcolor`, `rulecolor` | `1A1D21`, `5C6672`, `AEB7C0` | Body, dates and contacts, hairlines.
| `namesize`, `nameTracking`, `titleTracking`, `subtitleTracking` | `21`, `8`, `6`, `16` | Name height; letter-spacing as a percentage.
| `links` | `true` | Colourised but clickable links.
| `nofooter` | `false` | `true` drops the "Page 2 of 2" footer.
| `contactSep` | `\,\textbar\,` | Between contact items (PDF only).
| `icons` | `false` | FontAwesome glyphs in the contact line (PDF only; needs `fontawesome5`).

The filter's own switches, each `true` unless noted: `dash_lists`, `drop_rules`,
`date_rows`, `split_entries`, `entry_separator` (`·`), `inline_bullets`,
`inline_bullet_max` (30), `inline_bullet_join` (`·`), `uppercase_sections`
(`false`), `build_contacts`.

`tex_markup` is the one that decides between the two outputs — `true` for the
PDF's macros, `false` for the fragment's classes. `build.sh` sets it; leave it
alone unless you are adding a third format, in which case the hooks are
`hook()` in the filter and the five `.resume-*` classes in
`src/styles/app.css`.

Fonts are resolved through **fontconfig**, so a family has to be visible to the
system or to `XDG_DATA_DIRS` — which is what `nix run .#resume` arranges and
`resumeFonts` in `flake.nix` decides. A name that resolves to nothing is silent
on the page and loud in the TeX log; CI treats that line as an error.

## Notes

- The current content is 2 pages. The last page's footer reports the total via
  `lastpage`.
- `pdftotext resume.pdf -` extracts in reading order, which is what ATS parsers
  want. With `icons: true` the glyphs are decorative and do not extract.
- PDF bookmarks come from the headings and carry the plain entry text.
- `★`, `✓`, `●`, `■`, `◆` and friends are mapped onto AMS symbols by the LaTeX
  template, so a pasted star count renders whatever the body font is. On the
  page they are the characters you typed, and the site's fonts carry them.
- Any Unicode engine works: `--pdf-engine=xelatex` or `lualatex` if a full TeX
  Live is installed. tectonic needs none.
- The PDF is not byte-reproducible: tectonic stamps a creation date, so two
  builds of the same commit differ. Compare `pdftotext` output, not hashes.
