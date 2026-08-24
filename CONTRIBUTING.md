# Contributing to Sean Behan's Website

## Prerequisites

- Node.js 26 (see `.node-version`)
- npm
- Git

## Getting Started

```bash
git clone https://github.com/codebam/seanbehan.ca.git
cd seanbehan.ca
npm install
npm run dev
```

`npm run dev` migrates and seeds a local SQLite database on first run, then serves the site at `http://localhost:4321`. The admin panel is at `/_emdash/admin`; on localhost it signs you in without a passkey.

A fresh database has the schema and no posts. That is expected — the writing lives in D1 on the deployed site, not in this repo.

## Build Variants

- `seanbehan.ca` — name-first, résumé in the nav
- `codebam.ca` — handle-first, work leads

```bash
npm run build
npm run build:codebam
```

## Branching

- `master` is the latest stable release
- Feature branches for new work
- Pull requests against `master`

## Code Quality

```bash
npm run lint               # prettier --check
npm run check              # astro check
npm run test:run           # vitest
npm run smoke              # against a running server
```

CI runs the formatter check, the type check, the tests and both variant builds on every push.

The smoke test is not in CI, because it needs a running site with a database behind it. Run it locally against `npm run dev`, and against the deployed site after a deploy — it is the only check that exercises a page end to end.

## Pre-commit Hooks

`.githooks/` runs lint-staged (Prettier) and `astro check` before each commit. Installed by `prepare` during `npm install`. Bypass a single commit with `git commit --no-verify`.
