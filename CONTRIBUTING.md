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
npm run lint
npm run check
npm run test:run
```

Tests are Vitest. CI runs lint, check, both variant builds, and the suite on every push.

## Pre-commit Hooks

`.githooks/` runs lint-staged (ESLint, Prettier) and svelte-check before each commit. Installed by `prepare` during `npm install`. Bypass a single commit with `git commit --no-verify`.
