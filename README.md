# Sean Behan's Personal Website

Personal site and technical blog. SvelteKit 2, Svelte 5, Cloudflare Pages.

One repo, two origins:

- `seanbehan.ca` — name-first, résumé in the nav
- `codebam.ca` — handle-first, work leads, no résumé

Same posts. Identity is baked at build time by `PUBLIC_SITE`.

## Prerequisites

- Node.js 26 (see `.node-version`)
- npm

## Setup

```bash
git clone https://github.com/codebam/seanbehan.ca.git
cd seanbehan.ca
npm install
npm run dev
```

## Build

```bash
npm run build              # seanbehan.ca
npm run build:codebam      # codebam.ca
```

## Deploy

```bash
npm run deploy             # build seanbehan, wrangler pages deploy, purge seanbehan.ca
npm run deploy:codebam     # build codebam, deploy project codebam-ca, purge codebam.ca
```

HTML is served with `s-maxage` so Cloudflare can hold it at the edge, but that only takes effect once a Cache Rule marks HTML cacheable — a zone setting, not a repo one. `docs/edge-caching.md` has the rule and the deploy-time purge it requires.

Published posts on both origins canonical to `seanbehan.ca`. Homes stay self-canonical.

## CI

GitHub Actions runs lint, svelte-check, the seanbehan build, tests, and the codebam build on every push and pull request.

`.githooks` is wired by `prepare` so commits run ESLint, Prettier, and svelte-check first.

## Assets

- Profile image is WebP (13.7KB), with a 112px `avatar.webp` (1.4KB) for the hero byline
- Fonts are self-hosted from `static/fonts`, latin-only and axis-trimmed, and preloaded from `app.html`. Rebuild them with `tools/fonts/build-fonts.sh` after upgrading either Fontsource package — see `tools/fonts/README.md`
