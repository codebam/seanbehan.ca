This is seanbehan.ca / codebam.ca: a personal site and technical blog, built on EmDash (a CMS on Astro) and deployed as a Cloudflare Worker with D1 and R2.

It used to be a SvelteKit site with the posts as markdown files. The design came across intact; the words moved into the database. If something reads like it was written for a static site, it probably was — say so rather than working around it.

## Commands

```bash
npm run dev          # emdash dev: migrate, seed, then serve on :4321
npm run check        # astro check
npm run test:run     # vitest over src/lib
npm run smoke        # ask a running site for one of everything
npm run build        # seanbehan.ca; build:codebam for the other origin
```

The admin UI is at `http://localhost:4321/_emdash/admin`; localhost signs you in without a passkey.

## Two origins, one repo

`PUBLIC_SITE` picks the identity at build time (`seanbehan` or `codebam`), and `src/lib/site.data.js` holds everything that differs — name, copy, email, whether the résumé exists. Anything that varies between the two belongs in that file, not in a template. Both Workers read the same database.

## Key files

| File                     | Purpose                                                                      |
| ------------------------ | ---------------------------------------------------------------------------- |
| `src/lib/posts.ts`       | Turns EmDash entries into what the templates read (`meta.date`, `meta.tags`) |
| `src/lib/site.ts`        | The variant, canonical/alternate URLs, the identity table                    |
| `src/lib/highlight.ts`   | shiki on the Worker: JS regex engine, only the grammars the posts use        |
| `src/layouts/Base.astro` | Head metadata, header, footer — every page renders into it                   |
| `src/middleware.ts`      | Security headers and the cache policy (was `_headers` on Pages)              |
| `seed/seed.json`         | Schema a fresh database is built from. Not the writing.                      |
| `src/styles/app.css`     | The whole design: tokens, panels, prose, code blocks                         |

## Rules

- All content pages are server-rendered. No `getStaticPaths()` for CMS content.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for `getEntryTerms` and friends).
- Call `Astro.cache.set(cacheHint)` on any page that queries content.
- The taxonomy is named `tag`, singular, matching the seed.
- Heading ids come from `prepareBody`, so the contents list and the headings cannot disagree. Do not derive them anywhere else.
- Client behaviour goes in `src/scripts` as a delegated listener, not a Svelte island per element. The islands that remain (Grainient, DotGrid, StarBorder) are there because they animate.
- The page must work with JS off: search filters a server-rendered list, the copy buttons are injected rather than shipped, the contents list starts open.

## Writing style

Comments explain why, not what, and are written for someone who will read the code a year from now with none of today's context. Match the density of what is already there. The same goes for commit messages: what changed, and what made the previous state wrong.

## EmDash documentation

The EmDash docs are an MCP server at `https://docs.emdashcms.com/mcp`. Call `search_docs` against it rather than relying on recall — the API is young and moves. `.mcp.json` is committed so it is discovered automatically.

Agent skills for EmDash itself are in `.agents/skills/`: **building-emdash-site** (querying, Portable Text, schema, seeds), **creating-plugins**, and **emdash-cli**.
