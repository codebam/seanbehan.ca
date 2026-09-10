This is seanbehan.ca / codebam.ca: a personal site and technical blog, built on EmDash (a CMS on Astro) and deployed as a Cloudflare Worker with D1 and R2.

It used to be a SvelteKit site with the posts as markdown files. The design came across intact; the words moved into the database. If something reads like it was written for a static site, it probably was — say so rather than working around it.

## Commands

```bash
npm run dev          # emdash dev: migrate, seed, then serve on :4321
npm run check        # astro check
npm run test:run     # vitest over src/lib
npm run smoke        # ask a running site for one of everything
npm run build        # seanbehan.ca; build:codebam for the other origin
npm run resume       # nix: the résumé PDF and HTML fragment into resume/out/
npm run resume:seed  # …and into the local bucket, which is what /resume reads
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
| `src/middleware.ts`      | Security headers, redirects, and the cache policy for rendered pages         |
| `public/_headers`        | The cache policy for static assets, which never reach the Worker             |
| `seed/seed.json`         | Schema a fresh database is built from. Not the writing.                      |
| `src/styles/app.css`     | The whole design: tokens, panels, prose, résumé, code blocks                 |
| `src/lib/resume.ts`      | The résumé artifacts in the `private` bucket, and their download name        |
| `resume/`                | The résumé's source, pandoc templates, Lua filter and driver                 |

## Rules

- All content pages are server-rendered. No `getStaticPaths()` for CMS content.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for `getEntryTerms` and friends).
- Call `Astro.cache.set(cacheHint)` on any page that queries content.
- The taxonomy is named `tag`, singular, matching the seed.
- Heading ids come from `prepareBody`, so the contents list and the headings cannot disagree. Do not derive them anywhere else. It also re-bases levels — the shallowest heading in a body becomes an `h2` — so a post written entirely in `###` does not skip a level under the page `h1`. Do not re-level headings anywhere else either.
- The public site is plain Astro. Client behaviour goes in `src/scripts`; prefer delegated listeners. React remains only because the EmDash admin UI requires it.
- The page must work with JS off: the archive filters on `?q=` on the server before the script reorders it, the copy buttons are injected rather than shipped, and the contents list starts open.
- A palette change is not only a token change. `src/pages/og/[slug].png.ts`, `src/pages/site.webmanifest.ts`, `public/favicon.svg` with `tools/favicon/`, `resume/metadata.yaml` and the ads in `public/img/` each hold a copy of the colours and move with them. DESIGN.md section 1 lists them.
- Asset cache headers belong in `public/_headers`, not in the middleware: Workers Assets answers those paths before the Worker runs.
- The résumé is the exception to "the words live in D1": `/resume` renders an HTML fragment CI built from `resume/resume.md` and uploaded to R2, styled from `src/styles/app.css` rather than a component. What it says is edited there, never in the admin.

## Writing style

Comments explain why, not what, and are written for someone who will read the code a year from now with none of today's context. Match the density of what is already there. The same goes for commit messages: what changed, and what made the previous state wrong.

## EmDash documentation

The EmDash docs are an MCP server at `https://docs.emdashcms.com/mcp`. Call `search_docs` against it rather than relying on recall — the API is young and moves. `.mcp.json` is committed so it is discovered automatically.

Agent skills for EmDash itself are in `.agents/skills/`: **building-emdash-site** (querying, Portable Text, schema, seeds), **creating-plugins**, and **emdash-cli**.
