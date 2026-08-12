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

The same rule as an API call:

```sh
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint/rules" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Cache prerendered HTML",
    "expression": "(http.request.uri.path.extension eq \"\" or http.request.uri.path.extension eq \"html\")",
    "action": "set_cache_settings",
    "action_parameters": {
      "cache": true,
      "edge_ttl": { "mode": "respect_origin", "default": 600 },
      "browser_ttl": { "mode": "respect_origin" }
    }
  }'
```

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

So the deploy has to purge. Either narrow, on the pages themselves:

```sh
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"files":["https://seanbehan.ca/","https://seanbehan.ca/posts","https://seanbehan.ca/resume","https://seanbehan.ca/contact"]}'
```

or, simplest for a site this size, everything:

```sh
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'
```

The token needs `Zone.Cache Purge` on this zone and nothing else. A post-file
purge does not touch the hashed assets — they are immutable and their URLs
changed anyway.

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
