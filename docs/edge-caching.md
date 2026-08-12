# Edge caching the HTML

Every page on this site is prerendered, but the HTML is still fetched from the
origin on every request:

```console
$ curl -sSI https://seanbehan.ca/ | grep -i cf-cache-status
cf-cache-status: DYNAMIC
```

`DYNAMIC` means Cloudflare never even considered the response for its cache.
That is the zone default: HTML is not a cacheable content type unless a rule
says otherwise, no matter what `Cache-Control` the origin sends. So this is not
something `_headers` can fix on its own — it needs a Cache Rule on the zone,
which lives in the Cloudflare dashboard rather than in this repo.

The payoff is TTFB, which is the floor under First Contentful Paint. Roughly
350 ms from origin against tens of milliseconds from a cache hit, on a page
where the browser can do nothing at all until that first byte lands.

## What the repo already does

Both header sources — `_headers` for prerendered pages off the CDN, and
`SECURITY_HEADERS` in `src/hooks.server.ts` for anything the Worker itself
serves — send:

```
Cache-Control: public, max-age=0, s-maxage=600, must-revalidate
```

`max-age=0, must-revalidate` is unchanged: a reader's browser still revalidates
the HTML on every visit, so nobody is served a stale page from their own disk
cache. `s-maxage=600` is the shared-cache half, which only a shared cache reads
— it tells Cloudflare it may hold the response for ten minutes. Until the rule
below exists, that directive is inert.

## The rule

Dashboard → **Caching** → **Cache Rules** → **Create rule**, on the
`seanbehan.ca` zone.

| Field             | Value                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------- |
| Rule name         | `Cache prerendered HTML`                                                               |
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

- **Extension match, not `/*`.** Everything under `/_app/immutable` is already
  content-hashed and cached hard by Pages; a blanket rule would put the fonts,
  images and JS bundles under this TTL too, which is strictly worse for them.
  Extensionless paths (`/`, `/posts`, `/posts/some-slug`) and `.html` are
  exactly the prerendered pages.
- **Respect origin, both TTLs.** The TTL then lives in `_headers` and
  `hooks.server.ts`, in this repo, next to the comment explaining it — rather
  than as a number in a dashboard nobody diffs. Changing the cache window is a
  commit, not a click.
- **`/rss.xml` is unaffected.** It has an extension, so the expression does not
  match it, and it keeps the `max-age=3600` its route handler sets.

## Purge on deploy — not optional

A cached page can outlive the deployment it came from, and the HTML references
content-hashed bundles (`/_app/immutable/entry/start.<hash>.js`) that only
exist in the deployment that built them. Ten minutes of stale HTML pointing at
bundles the new deployment does not have means 404s on hydration for anyone who
lands in that window.

So the deploy has to purge. `npm run deploy` now ends with
`tools/cloudflare/purge.sh`, which purges the whole zone when `CF_API_TOKEN` is
set in the environment and prints a skip notice when it is not — a deploy from
a machine without the token still succeeds, it just leaves the purge to you:

```sh
CF_API_TOKEN=… npm run deploy     # build, deploy, purge
bash tools/cloudflare/purge.sh    # or by hand, any time
```

That token needs **Zone → Cache Purge**. It purges everything rather than a
file list, because the site is small and a hardcoded list of URLs drifts out of
step with the routes. The hashed assets do not care either way — their URLs
changed with the deployment.

Shorten `s-maxage` if a purge step is not wired up yet: at `s-maxage=60` the
worst case is a minute of broken hydration for a reader who happened to load
during the deploy, which is a very different thing from ten.

## Verifying

```sh
curl -sSI https://seanbehan.ca/ | grep -iE 'cf-cache-status|cache-control|age'
```

The first request after a purge reports `cf-cache-status: MISS`, the second
`HIT` with a rising `Age`. Still `DYNAMIC` means the rule is not matching —
check the expression against the exact path, remembering that `/posts/` and
`/posts` differ in extension terms only if a trailing slash is involved.
