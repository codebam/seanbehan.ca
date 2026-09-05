# Sean Behan's Personal Website

Personal site and technical blog. [EmDash](https://github.com/emdash-cms/emdash) on Astro, deployed as a Cloudflare Worker with D1 and R2.

One repo, two origins:

- `seanbehan.ca` — name-first, résumé in the nav
- `codebam.ca` — handle-first, work leads, no résumé

Same posts. Identity is chosen at build time by `PUBLIC_SITE`.

## Prerequisites

- Node.js 26 (see `.node-version`)
- npm
- A Cloudflare account. EmDash runs plugins in Worker sandboxes, which needs a paid Workers plan; everything else here works on the free one.
- Nix, only for the résumé: `nix run .#resume` is what builds the PDF. Nothing else in the repo needs it, and no build step here asks for it.

## Setup

```bash
git clone https://github.com/codebam/seanbehan.ca.git
cd seanbehan.ca
npm install
npm run dev
```

`npm run dev` runs `emdash dev`: it applies any pending migrations, seeds an empty database from `seed/seed.json`, and starts Astro. The site is at `http://localhost:4321` and the admin panel at `http://localhost:4321/_emdash/admin` — on localhost the dev bypass signs you in without a passkey.

Use `npm run dev:codebam` for the codebam variant and its private storefront bindings.

The local database is a SQLite file under `.wrangler/state`, not committed. An empty one is seeded with the schema (posts, pages, tags) but no posts; see **Content** below for how the real ones got there.

`/resume` reads its document out of R2 rather than the database, so a fresh clone renders it without the résumé in it. `npm run resume:seed` builds the two artifacts into the local store once, and the page is normal from then on.

## Content

Posts live in D1 and are written in the admin panel. They are not files in this repo — that is the point of the migration this site went through: the words are content, and the repo is the thing that renders them.

`seed/seed.json` is the schema, not the writing. It describes the collections, their fields and the tag taxonomy, and it is what a fresh database is built from.

Posts that predate the CMS came out of the old `src/routes/posts/*.md` files via `scripts/import-markdown.mjs`, which is kept for the record and for anyone repeating the move onto a fresh instance.

## Build

```bash
npm run build              # seanbehan.ca
npm run build:codebam      # codebam.ca
```

## Deploy

```bash
npm run deploy             # build seanbehan, wrangler deploy
npm run deploy:codebam     # build codebam, deploy as codebam-ca
```

Both Workers read the same D1 database and R2 bucket, so a post published from either admin panel is live on both origins.

First deploy needs the bindings to exist:

```bash
npx wrangler d1 create seanbehan-ca
npx wrangler r2 bucket create seanbehan-ca-media
npx wrangler r2 bucket create codebam-product-downloads
npx emdash secrets generate
npx wrangler secret put EMDASH_ENCRYPTION_KEY
npx wrangler secret put EMDASH_ENCRYPTION_KEY --env codebam
```

Use the same generated encryption key for both Worker secret prompts.

The production kit uses Stripe Checkout and a private R2 download. Product, Managed Payments,
webhook, artifact, email, and Worker secret setup is documented in
[`docs/stripe-checkout.md`](docs/stripe-checkout.md).

HTML is served with `s-maxage` so Cloudflare can hold it at the edge, but that only takes effect once a Cache Rule marks HTML cacheable — a zone setting, not a repo one. `docs/edge-caching.md` has the rule and the deploy-time purge it requires.

Published posts on both origins canonical to `seanbehan.ca`. Homes stay self-canonical.

## Backups

The posts used to be files in this repo, so every clone was a backup. They live
in D1 now, and `.github/workflows/backup.yml` runs nightly to keep that from
meaning "one copy": it exports the database and writes it to the
`seanbehan-ca-backups` bucket under a dated key, which the bucket expires after
90 days.

```bash
npm run backup                        # writes backup.sql from the deployed database
```

`wrangler d1 export` refuses a database containing FTS5 virtual tables, and
EmDash builds one per searchable collection, so `scripts/backup-d1.mjs` asks the
database for its table list and exports everything that is not virtual. The
search indexes are derived data — after a restore, rebuild each with
`INSERT INTO <fts_table>(<fts_table>) VALUES('rebuild')`.

## Résumé

`resume/resume.md` is the résumé, and it is a build rather than a page: pandoc
typesets it to PDF with tectonic and renders the same pass to an HTML fragment.
CI does both on a push that touches `resume/` — `.github/workflows/resume.yml`
builds, checks, and writes `resume.pdf` and `resume.html` to the `private`
bucket, then purges the zone.

The page renders the fragment inline; `/resume.pdf` streams the file out of the
same bucket, which is why the download is a path on this origin and not a
hostname. A résumé edit therefore goes live with an upload, not a deploy, and
`npm run build` never needs TeX.

```bash
npm run resume        # both artifacts into resume/out/, via nix
npm run resume:seed   # …and into the local dev bucket, for npm run dev
```

[`docs/resume.md`](docs/resume.md) is the pipeline — bucket, routes, CI, what a
token needs to be able to do. `resume/README.md` is the author's guide — the
Markdown conventions, the front matter, and every knob in `metadata.yaml`.

## Checks

```bash
npm run check              # astro check (types across .astro and .ts)
npm run test:run           # unit tests over src/lib
npm run smoke              # ask a running site for one of everything
```

`npm run smoke` takes a base URL and defaults to `http://localhost:4321`. It is the check that matters most here: pages assemble on a Worker out of a database, so a page, a feed, a social card and a 404 have to be fetched to know they work. It asks for `/resume` and `/resume.pdf` too, which are the two routes that answer out of R2 — so seed the local bucket first.

GitHub Actions runs the formatter check, `astro check`, the tests and both builds on every push and pull request. `.githooks` is wired by `prepare` so commits run Prettier and the type check first.

## Assets

- Profile image is WebP (13.7 kB), with a 112px `avatar.webp` (1.4 kB) for the hero byline
- Fonts are self-hosted from `public/fonts`, latin-only and axis-trimmed, and preloaded from the layout. Rebuild them with `tools/fonts/build-fonts.sh` after upgrading either Fontsource package — see `tools/fonts/README.md`
- `public/fonts/og-*.woff` are the static cuts the social-card renderer needs: satori misreads the variable fonts' `fvar` table, and a card needs one weight of each face
- Social cards are drawn per request at `/og/<slug>.png` from the title in the database

## Layout

| Path                     | What it is                                                        |
| ------------------------ | ----------------------------------------------------------------- |
| `src/pages`              | Routes. Every page is server-rendered.                            |
| `src/layouts/Base.astro` | Head metadata, header, footer — the frame every page renders into |
| `src/lib`                | The site's own logic: post adapter, identity, feed, highlighter   |
| `src/components`         | Plain Astro templates, including the decorative canvas markup     |
| `src/scripts`            | Canvas effects and small delegated client behaviours              |
| `src/middleware.ts`      | Security headers and the cache policy                             |
| `seed/seed.json`         | Schema a fresh database is built from                             |
| `resume/`                | The résumé: Markdown source, pandoc templates, Lua filter, driver |
| `scripts/`               | The markdown import, its backfill, and the smoke test             |
| `tools/`                 | Font, favicon and Cloudflare cache utilities                      |
