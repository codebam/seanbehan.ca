# Edge caching

Every page on this site is rendered per request by a Worker, out of D1. That is
the trade the CMS bought: a post can be edited in the admin panel and be live
without a build. What it costs is that a page nobody has asked for recently is
assembled from a database query, a Portable Text render and — on a post — a
syntax highlighter, every time.

The edge cache is what pays that back. HTML is served with:

```
Cache-Control: public, max-age=0, s-maxage=600, must-revalidate
```

set in `src/middleware.ts`. `max-age=0, must-revalidate` means a reader's own
browser revalidates on every visit, so nobody is served a stale page from their
disk cache. `s-maxage=600` is the shared-cache half, which only a shared cache
reads — it tells Cloudflare it may hold the response for ten minutes.

Until the Cache Rule below exists, that directive is inert: Cloudflare does not
cache HTML by default, whatever the origin says.

## The rule

Dashboard → **Caching** → **Cache Rules** → **Create rule**, on the
`seanbehan.ca` zone.

| Field             | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Rule name         | `Cache rendered HTML`                                                                  |
| Expression        | `(http.request.uri.path.extension eq "" or http.request.uri.path.extension eq "html")` |
| Cache eligibility | **Eligible for cache**                                                                 |
| Edge TTL          | **Use cache-control header if present, use default otherwise**, default `10 minutes`   |
| Browser TTL       | **Respect origin**                                                                     |

Or, the same rule without the dashboard:

```sh
CF_API_TOKEN=… bash tools/cloudflare/cache-rule.sh          # seanbehan.ca
CF_API_TOKEN=… bash tools/cloudflare/cache-rule.sh codebam.ca
```

The token needs **Zone → Cache Rules → Edit**, plus **Zone → Zone → Read** for
the name lookup, scoped to the zone you are changing. Wrangler's own OAuth
token will not do: it carries `zone (read)` and nothing that can write a
ruleset, so `wrangler whoami` looking healthy says nothing about this.

The script is idempotent — it reads the existing cache ruleset, replaces any
rule with the same description, and writes the set back, so re-running after an
edit updates in place instead of stacking duplicates.

Notes on the shape of it:

- **Extension match, not `/*`.** Everything under `/_astro` is content-hashed
  and already served `immutable`; a blanket rule would put the fonts, images
  and JS bundles under this TTL too, which is strictly worse for them.
  Extensionless paths (`/`, `/posts`, `/posts/some-slug`) and `.html` are
  exactly the rendered pages.
- **Respect origin, both TTLs.** The TTL then lives in `src/middleware.ts`, in
  this repo, next to the comment explaining it — rather than as a number in a
  dashboard nobody diffs. Changing the cache window is a commit, not a click.
- **The admin is excluded by its own headers.** Everything under `/_emdash` is
  sent `private, no-store` by the middleware, so the rule above can never hold
  a signed-in view of the CMS at the edge.
- **`/rss.xml` is unaffected.** It has an extension, so the expression does not
  match it, and it keeps the `max-age=3600` its route sets. The same goes for
  `/og/<slug>.png`, which is cached for a month.

## Purge on deploy

The reason to purge changed with the move off Pages, but it did not go away.

When the site was prerendered, stale HTML pointed at content-hashed bundles
that only existed in the deployment that built them, so serving a cached page
after a deploy meant 404s on hydration. Now the deployed Worker serves whatever
the database holds, and the risk is milder: ten minutes of a page rendered by
the previous version of the templates.

What has not changed is that a deploy should be visible when it finishes, not
ten minutes later. `.github/workflows/deploy.yml` runs
`tools/cloudflare/purge.sh` for each zone immediately after `wrangler deploy`,
and `npm run deploy` does the same locally when `CF_API_TOKEN` is set —
printing a skip notice when it is not, so a deploy from a machine without the
token still works and says so.

## Content changes are not deploys

Publishing a post does not run a deploy, so nothing purges — and the archive,
the home page and the feed would keep serving their cached copies for up to ten
minutes.

That is the intended behaviour: ten minutes is short enough that it reads as
"the site catches up", and the alternative is a purge on every content write,
which would throw away the whole zone's cache each time a typo is fixed. EmDash
sets a cache tag per entry (`Astro.cache.set(cacheHint)` on every page that
queries content), so a targeted purge is available if that ever stops being an
acceptable trade.

## Required tokens

| Secret          | Used by                  | Scopes                                                                   |
| --------------- | ------------------------ | ------------------------------------------------------------------------ |
| `CF_API_TOKEN`  | the deploy and the purge | Zone → Cache Purge, Zone → Zone → Read, Account → Workers Scripts → Edit |
| `CF_ACCOUNT_ID` | the deploy               | —                                                                        |
