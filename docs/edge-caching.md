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

That directive alone does nothing here, and the reason is worth stating plainly
because it looks like it should work.

## Why the middleware does the caching

The rule below was written when this site was prerendered HTML served by Pages, where it did the whole job. After the move to a Worker it was still in place and still looked correct — but rendered pages stopped getting the window, because `s-maxage` only counts once something _stores_ the response, and a response rendered inside a Worker does not pass through the rule's cache by itself. During that stretch every page view went to D1; it cost a production outage's worth of confusion, which is why this page exists. Live check on 2026-08 (both zones): first GET answers `X-Edge-Cache: MISS`, second answers `cf-cache-status: HIT` — on a Workers custom domain `caches.default` _is_ the shared edge cache, so the rule (eligibility) and the Cache API (store/read) cooperate. Keep both; neither alone gives a rendered page its ten-minute window.

So the Worker caches its own output, in `src/middleware.ts`, through the Cache
API: a cacheable `GET` is looked up in `caches.default` before anything
renders, and a rendered page is put back into it for the ten minutes
`s-maxage` describes. `X-Edge-Cache: HIT` or `MISS` on the response says which
happened — a second request for the same page should say HIT.

Two rules in that middleware exist for DDoS reasons, not caching tidiness:
the cache key drops the query string on every route except `search.json`
(a `?nonce=1..N` flood must not manufacture an unlimited supply of fresh
anonymous keys), and a request leaves the cache only when a **real** session
is attached to it, never on the mere presence of a cookie
(a `Cookie: emdash=fake` flood must not buy itself an uncached render per
request). The full rationale is in the comments where the rules live.

Requests carrying an EmDash session cookie skip the cache in both directions. A
signed-in editor gets the admin bar and the edit affordances in the markup, and
storing that copy under the page's URL would serve one person's session
furniture to everyone.

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

It is still worth having — it governs the static assets Cloudflare serves ahead
of the Worker — but it is not what caches a post. Or, the same rule without the
dashboard:

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
- **Respect origin, both TTLs.** The TTL lives in `src/middleware.ts`, in this
  repo, next to the comment explaining it — rather than as a number in a
  dashboard nobody diffs. Changing the cache window is a commit, not a click,
  and `EDGE_SECONDS` there is the one place it is written down.
- **The admin is excluded by its own headers.** Everything under `/_emdash` is
  sent `private, no-store` by the middleware, so the rule above can never hold
  a signed-in view of the CMS at the edge.
- **`/rss.xml` is unaffected.** It has an extension, so the expression does not
  match it, and it keeps the `max-age=3600` its route sets. The same goes for
  `/og/<slug>.png`, which is cached for a month.
- **A route's own TTL is what the Cache API stores.** The stored copy is
  written with the response's own `Cache-Control` when it has one, and only
  falls back to `EDGE_SECONDS` when it does not. It used to overwrite every
  route with `EDGE_SECONDS`, which quietly cut the social cards from a month to
  ten minutes — satori and resvg re-rasterising every card on the site, six
  times an hour, for a URL only a scraper ever asks for.

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
which would throw away the whole zone's cache each time a typo is fixed.

**The targeted purge now works.** It did not until Sept 2026, and the reason is
worth keeping: every page that queries content calls
`Astro.cache.set(cacheHint)` with the tags EmDash hands back, and none of it
did anything, because `astro.config.mjs` never configured Astro's cache
provider. Without `cache.provider` the Astro global is a `DisabledAstroCache`
whose `enabled` is false, so every one of those calls was skipped by its own
guard and the tags were computed and dropped. `cache.provider.name` has to be
exactly `cloudflare` — the adapter decides whether to register its own provider
with `config.cache?.provider?.name === 'cloudflare'` — and that is what turns
the hints into a `Cache-Tag` response header and makes
`Astro.cache.invalidate({ tags })` reach `cache.purge({ tags })`.

A response now carries something like
`cache-tag: posts,01M12ZDR0A68MZMHFSHAR1EZK,astro-path:/posts`, so a single
post's edit can drop exactly the pages that rendered it:

```js
// anywhere the Astro global is in scope, e.g. a content hook
await Astro.cache.invalidate({ tags: [entry.data.id] });
```

Nothing calls it yet — the ten-minute window is still the trade this site
makes — but the capability is real rather than described.

## Static assets are not this file's business

`src/middleware.ts` sets the policy for responses the Worker renders. Files
under `public/` never get that far: Workers Assets answers them before the
Worker is invoked, which is why the fonts, the favicon set and the mockups
shipped with `max-age=0, must-revalidate` while the middleware's own
`LONG_LIVED` rule sat there looking correct. Their policy lives in
`public/_headers` — a month for the stable filenames, with the adapter adding
the year-long immutable rule for content-hashed `/_astro/*` at build time.

One shape worth knowing: a `*` in `_headers` matches across `/`, so
`/*.webp` already covers `/img/project-tux.webp`. Adding `/img/*` as well makes
both rules match and emits `Cache-Control` twice with the same value — legal
but confusing, and easy to read as a bug. One rule per extension.

## Two things to check in the dashboard, not here

- The Cache Rule's **Browser TTL** is documented above as "Respect origin".
  Live responses disagree: an edge `HIT` for HTML came back with
  `Cache-Control: public, max-age=86400` rather than the origin's
  `max-age=0, must-revalidate`, which means a returning reader's browser may
  hold a page for a day. Worth confirming against the zone's Browser Cache TTL
  setting, because it silently undoes the revalidate-every-visit half of the
  policy this repo writes.
- `public/_headers` is only read when the Worker is deployed with the assets
  directory it sits in. `wrangler deploy` prints `Parsed N valid header
rules`; if that count is not what you expect, the rules are not live.

## Required tokens

| Secret          | Used by                  | Scopes                                                                   |
| --------------- | ------------------------ | ------------------------------------------------------------------------ |
| `CF_API_TOKEN`  | the deploy and the purge | Zone → Cache Purge, Zone → Zone → Read, Account → Workers Scripts → Edit |
| `CF_ACCOUNT_ID` | the deploy               | —                                                                        |
