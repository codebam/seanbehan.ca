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

## Setup

```bash
git clone https://github.com/codebam/seanbehan.ca.git
cd seanbehan.ca
npm install
npm run dev
```

`npm run dev` runs `emdash dev`: it applies any pending migrations, seeds an empty database from `seed/seed.json`, and starts Astro. The site is at `http://localhost:4321` and the admin panel at `http://localhost:4321/_emdash/admin` — on localhost the dev bypass signs you in without a passkey.

The local database is a SQLite file under `.wrangler/state`, not committed. An empty one is seeded with the schema (posts, pages, tags) but no posts; see **Content** below for how the real ones got there.

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
npx wrangler secret put EMDASH_ENCRYPTION_KEY   # value from .env, or `npx emdash auth secret`
```

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

## Checks

```bash
npm run check              # astro check (types across .astro, .ts, .svelte)
npm run test:run           # unit tests over src/lib
npm run smoke              # ask a running site for one of everything
```

`npm run smoke` takes a base URL and defaults to `http://localhost:4321`. It is the check that matters most here: pages assemble on a Worker out of a database, so a page, a feed, a social card and a 404 have to be fetched to know they work.

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
| `src/components`         | Templates, plus the Svelte islands for the moving parts           |
| `src/scripts`            | Small client scripts: reveal, spotlight, copy buttons, contents   |
| `src/middleware.ts`      | Security headers and the cache policy                             |
| `seed/seed.json`         | Schema a fresh database is built from                             |
| `scripts/`               | The markdown import, its backfill, and the smoke test             |
| `tools/`                 | Font, favicon and Cloudflare cache utilities                      |
