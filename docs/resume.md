# The résumé

One Markdown file, two formats, published by CI.

`resume/resume.md` is the words. Pandoc turns it into a **PDF** for downloading
and an **HTML fragment** that `/resume` renders inline, in the site's own type —
instead of the embedded PDF this page used to be, which was unreadable on a
phone, invisible to a text browser and to anything that indexes the page, and
set in a typeface no other page here uses.

```
resume/resume.md ─── filters/resume-entries.lua ── structure, once
                                │
              ┌─────────────────┴──────────────────┐
     templates/resume.latex              templates/resume.html
     pandoc → tectonic                   pandoc → html5, headings −2
              │                                  │
        resume.pdf                          resume.html
              └──────────── R2: private ─────────┘
                      │                │
              /resume.pdf         /resume  (set:html)
```

Both branches are the same document: one input, one metadata file, one Lua
filter. They differ in two places and no more — the fragment carries classes
where the PDF carries LaTeX macros, and its headings start two levels lower so the
résumé's sections sit underneath the page's own `h2`. That is the property to defend when editing
anything here: the page and the PDF should never disagree about what 2021
looked like.

## The pieces

| Path                                | Owns                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `resume/resume.md`                  | The content, and the front matter the header block is built from.        |
| `resume/filters/resume-entries.lua` | Structure: entry rows, the date column, compacted skill lines, contacts. |
| `resume/templates/resume.latex`     | The PDF's typography.                                                    |
| `resume/templates/resume.html`      | The fragment's markup. A fragment on purpose: no `<head>`, no CSS.       |
| `resume/metadata.yaml`              | Page, fonts, colours for the PDF; the filter's switches for both.        |
| `resume/build.sh`                   | The driver. `--outdir`, `--pdf`, `--html`, `--font`, `--keep-tex`.       |
| `src/lib/resume.ts`                 | Reading the two objects, and the download filename.                      |
| `src/pages/resume.astro`            | The page around it.                                                      |
| `src/pages/resume.pdf.ts`           | Streaming the PDF, with its etag and disposition.                        |
| `src/styles/app.css`                | `.resume-doc` — the résumé's typography on screen.                       |
| `.github/workflows/resume.yml`      | Build, verify, upload, purge.                                            |

## Building it

```bash
npm run resume        # nix run .#resume → resume/out/{resume.pdf,resume.html}
npm run resume:seed   # …and put both in the local dev bucket
```

`resume/out/` is ignored: the copy that matters is in R2, and a second one in
git would only ever be the stale one. To watch the page, seed once and run
`npm run dev` — `/resume` reads whatever the bucket holds.

The toolchain comes from the flake rather than from `devShell`, because pandoc,
tectonic and four font packages are a large closure for the one script that
needs them. `nix run .#resume` is `resume/build.sh` with that toolchain on
`PATH` and its fonts on `XDG_DATA_DIRS` — tectonic resolves families through
fontconfig, so in a store path the fonts have to be _findable_, not installed.

It is an app and not a package for the reason the original template documented:
tectonic downloads its own TeX bundle into `~/.cache/tectonic` on first use, and
a sandboxed derivation cannot reach it. `nix build .#resume-toolchain` is the
toolchain alone, which is what `pdfinfo` in CI runs out of.

`build.sh` also works without Nix at all — `--no-nix` insists both binaries are
already on `PATH`.

## Publishing

`.github/workflows/resume.yml` runs on a push to `master` that touches
`resume/**`, `flake.nix` or `flake.lock`. It builds both outputs, checks them,
writes them to bucket `private` under the keys the Worker reads, and purges
`seanbehan.ca` so the new fragment is what readers get next request rather than
in ten minutes. The same build on a pull request stops before the upload: a
résumé that no longer typesets should be caught by whoever broke it.

Two checks in there are load-bearing rather than decorative:

- **No `\resume` in the fragment.** If `tex_markup=false` ever stops reaching the
  filter, the HTML fills with LaTeX macros and the page prints them.
- **No font fell back.** `templates/resume.latex` walks a candidate chain and
  keeps the engine default rather than failing the build, so a missing typeface
  is one line in the TeX log and a PDF quietly set in DejaVu. CI fails on that
  line.

The PDF is not byte-reproducible — tectonic stamps a creation date — so every
run republishes, and an etag or hash of the file says nothing about whether the
content changed.

## Serving

The Worker holds a `RESUME` binding on bucket `private`, which has no public
domain of its own. That is why both artifacts are read at request time and why
the download is `/resume.pdf` rather than a bucket hostname:

- A résumé edit is an upload plus a purge, not a deploy. Neither Worker is
  rebuilt, so `npm run build` never needs TeX.
- The link stays same-origin. `object-src` no longer opens the CSP to an r2.dev
  domain — it is `'none'` now, because nothing is embedded any more.
- `resume.pdf` keeps its existing object key, so a link pasted into an inbox
  last month still resolves. What the reader's machine calls the file is a
  separate matter: `resumePdfFilename()` builds `Sean-Behan-Resume.pdf` from the
  site's identity, and the route sends it as `Content-Disposition`.

The page is honest about an empty bucket: `/resume` says the inline copy is
missing and offers the PDF, which is the state of a fresh clone until someone
seeds it — and the state CI would notice on a real deploy, because the workflow
curls `/resume` and looks for the résumé in it.

**Trusting the fragment.** `resume.astro` injects it with `set:html`, unescaped,
because the whole point is that the résumé _is_ the page. It is this repo's own
build output, written by this repo's CI, with no script and no stylesheet. That
makes write access to bucket `private` equivalent to writing HTML on
seanbehan.ca — which is a reason to keep that bucket's tokens as carefully as
the deployment's, not a reason to escape the markup and be back to reading a
résumé through a wall of `&lt;`.

## Editing the words

`resume/README.md` is the author's guide: the Markdown conventions the filter
reads, the front-matter keys, and every knob in `metadata.yaml`. It is next to
the file you would be editing, which is why it is there and not here.

## Required credentials

| Secret          | Used by               | Needs                                                           |
| --------------- | --------------------- | --------------------------------------------------------------- |
| `CF_API_TOKEN`  | the upload, the purge | Account → R2 → **Edit**, Zone → Cache Purge, Zone → Zone → Read |
| `CF_ACCOUNT_ID` | the upload            | —                                                               |

`seanbehan-ca-backups` is the other bucket CI writes to, with the same token. If
that token is scoped to one bucket rather than the account, `private` has to be
added to it before the résumé workflow can publish — the failure is a 403 from
`wrangler r2 object put`, on a run that built everything correctly.
