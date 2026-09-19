# Edge caching

There are two caches in front of a reader, and the mistake this file exists to
prevent is believing a header set for one of them controls the other.

- **Cloudflare's zone cache** runs before the Worker. The zone's Cache Rule
  decides whether a response is eligible, and that rule **overrides the origin's
  `Cache-Control: private`**. Only `no-store` survives it. Proved live on both
  zones: an extensionless admin page carrying `private, no-store` answers
  `cf-cache-status: BYPASS` every time, while `/` carrying `private, max-age=0,
must-revalidate` answered from cache with a rising `age`. A cached entry is
  served before the Worker runs, so no middleware can correct it afterwards.
- **The Worker's own Cache API** (`caches.default`) is inside the Worker, and
  `src/middleware.ts` is its only policy. It is the cache that stores a route's
  own public policy, keeps the browser-facing policy beside it in
  `X-Edge-Browser-Cache-Control`, and reports itself as `X-Edge-Cache: HIT` or
  `MISS`. HTML never enters it: `HTML_CACHE` is `no-store` and the middleware's
  `safeToStore` refuses that value. It is `no-store` rather than `private` for
  the zone's sake, not the Worker's.

The `/__host/<host>` prefix in `edgeCacheKey` scopes the Worker cache key only.
It does not and cannot scope Cloudflare's zone cache, which keys the URL the
client sent before this Worker runs.

## Production traffic arrives on the custom domains

`wrangler.jsonc` sets `"workers_dev": false` and `"preview_urls": false` at the
top level; wrangler inherits both into the named `codebam` environment. A
`<name>.<subdomain>.workers.dev` deployment URL or a
`<version>-<name>.<subdomain>.workers.dev` preview URL reaches the Worker
without passing through the zone: no Cache Rule, no WAF rate-limit rule and no
zone-level Page Rule applies, and a www request on such a host never reaches
the middleware's redirect because it never claimed to be www. Production is
`seanbehan.ca` and `codebam.ca` (and their www aliases) only. Preview-test
locally with `wrangler dev` instead of reopening a preview URL.

That switch is a deployment control, not a cache setting: it removes the
alternate hostnames so every production request has to arrive on a host the
zone rules were written for. If a deploy ever needs a preview URL temporarily,
the two settings and this reason are next to each other in `wrangler.jsonc`;
turn them back off before the deploy that matters.

## The failure the current rules address

An earlier Cache Rule marked extensionless and `.html` paths eligible with no
`http.host` clause. On these zones an apex HTML entry then answered a www
request byte for byte, before the middleware's www-to-apex 301 could run, so
`www.seanbehan.ca/` returned 200 instead of 301. Origin `private` did not stop
it; that is exactly what the rule overrides.

The repository's scripts could not fix it either. They looked for a rule
described as `Cache prerendered HTML`, while the live rule was named `Cache
rendered HTML`; the merge kept every rule that did not match that description
and appended the new one behind them. Cloudflare evaluates Cache Rules in order,
so the stale hostless rule kept winning through four rounds of "applying the
fix".

`tools/cloudflare/cache-rule.sh` and `cache-bypass.sh` now identify the target
by the cache-key clause in its expression — the extension test for HTML, the
`/og/` path test for cards — replace the first match **in place**, collapse any
later duplicates, and only append when no such rule exists. They can therefore
replace a cache-on rule they did not create. `CF_CACHE_RULE_ID` is an escape
hatch for a rule whose expression has also drifted; a pinned id that matches
nothing is an error, not a silent append.

The safe posture is:

- **HTML: `no-store` from the Worker.** That is `HTML_CACHE` in
  `src/middleware.ts`, not a dashboard setting, and it is the load-bearing half:
  the zone cannot hold what the origin refuses to let it store, so nothing can
  answer a www request before the Worker's 301, and the guard survives a Cache
  Rule that is later added, renamed or left hostless.
- **HTML rule: bypass** (`cache-bypass.sh`, the `--no-edge-cache` path in
  `zone-posture.sh`). Belt and braces while the zone still has a rule of its
  own, and what keeps the zone from holding anything if the header is ever
  relaxed.
- **Card rule: cache on** and host-scoped. `/og/<slug>.png` is public, stable,
  host-scoped and draws with satori and resvg when cold, so it keeps a rule of
  its own even while HTML is bypassed.

An edge window for HTML is two changes, not one: re-run `cache-rule.sh` for the
host-scoped, cache-eligible rule, verify the www redirect through the real edge,
and only then set `HTML_CACHE` back to `private, max-age=0, must-revalidate`.

## Why the Worker caches public routes at all

Every page is rendered per request by a Worker, out of D1. That is the trade the
CMS bought: a post can be edited in the admin panel and be live without a build.
What it costs is that a page nobody has asked for recently is assembled from a
database query, a Portable Text render and — on a post — a syntax highlighter,
every time.

A route that sets its own public `Cache-Control` — the feed, `/og/<slug>.png`,
image transforms — is looked up in `caches.default` before the route runs and
put back after it renders. On a HIT the response is returned with the stored
`Cache-Control` replaced by the route's browser policy from
`X-Edge-Browser-Cache-Control`, and the internal marker is removed. The stored
copy cannot carry that browser policy directly: `max-age=0` would tell the
Cache API to store nothing, so the copy is written with the route's own TTL
(a feed's hour, a card's month) and the marker carries the reader-facing half.

Two rules in the middleware exist for DDoS reasons, not cache tidiness: the
cache key drops the query string on every route except `search.json` and
`/posts`, where it keeps only a normalised `q` — trimmed, whitespace-collapsed,
lowercased and capped — and `_image`, where it keeps only the transform
parameters the endpoint reads. A `?nonce=1..N` flood therefore cannot
manufacture unlimited fresh anonymous keys; and a request leaves the cache only
when a **real** session is attached to it, never on the mere presence of a
cookie, so `Cookie: emdash=fake` does not buy an uncached render per request.
The same middleware sends
`no-store` on any response carrying editor context (`locals.user.role >= 30`)
or a `_preview=<token>` query: those are per-person or revocable, and `private`
would not have kept them out of the zone cache.

## The rules

Dashboard → **Caching** → **Cache Rules**, on the `seanbehan.ca` zone. The
scripts write the same two rules without the dashboard:

| Rule name             | Expression                                                                                                            | Cache    | Notes                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------- |
| `Cache rendered HTML` | `(http.request.uri.path.extension eq "" or http.request.uri.path.extension eq "html") and http.host eq "<zone>"`      | eligible | Vary normalised on `Accept`, both TTLs respect origin |
| `Cache social cards`  | `(http.request.uri.path.extension eq "png" and starts_with(http.request.uri.path, "/og/")) and http.host eq "<zone>"` | eligible | No vary: card bytes do not change with `Accept`       |

The host clause is the whole point of the HTML rule: without it a cached apex
entry can answer www. The card rule carries the same clause for the same reason.
While `HTML_CACHE` is `no-store` the rule cannot hold anything — the origin's
value wins — so it is a second line of defence rather than the mechanism. It
becomes the mechanism again the moment that header is relaxed, which is why the
host clause is worth keeping in place.
The HTML rule also configures `Vary: Accept`, because the Worker sends that
header on `/posts/<slug>`, `/pages/<slug>` and `/resume` (the paths
`isNegotiablePath()` recognises in `src/lib/accept.ts`). Without the Cache Rule
setting, Cloudflare ignores the origin header and can serve a cached HTML copy
to a request that asked for `text/markdown` or `application/json` before the
Worker rewrites it. The script normalises `Accept` against the formats the site
serves, so browser, markdown and JSON variants key separately without
fragmenting on each browser's full Accept string. The card rule has no such
block: a PNG does not negotiate.

Run the scripts with:

```sh
CF_API_TOKEN=… bash tools/cloudflare/cache-bypass.sh           # HTML off, cards on
CF_API_TOKEN=… bash tools/cloudflare/cache-rule.sh codebam.ca  # HTML cached, host-scoped
```

The token needs **Zone → Cache Rules → Edit**, plus **Zone → Zone → Read** for
the name lookup and **Zone → Cache Purge** for the workflows that purge. It is
scoped per zone, so each origin is a separate run. Wrangler's own OAuth token
will not do: it carries `zone (read)` and nothing that can write a ruleset.

`.github/workflows/zone-posture.yml` reports by default and applies with
`--apply --no-edge-cache --drop-legacy-cache`; the `--no-edge-cache` is
deliberate, because applying the cache-on rule is what re-armed the www bug.
`.github/workflows/ci.yml` also runs `zone-posture.sh` in report mode whenever
`CF_API_TOKEN` is present, and skips with a notice rather than failing when it
is absent (forks, Dependabot's `workflow_call`): zone state is otherwise
unversioned, which is why it drifted unnoticed.

### Notes on the shape of it

- **Extension match, not `/*`.** Everything under `/_astro` is content-hashed
  and already served `immutable`; a blanket rule would put the fonts, images
  and JS bundles under the HTML TTL too. Extensionless paths (`/`, `/posts`,
  `/posts/some-slug`) and `.html` are exactly the rendered pages; the card rule
  names `/og/` explicitly for the one non-HTML route that wants a shared window.
- **Respect origin, both TTLs.** The TTL lives in the route or middleware, in
  this repo, next to the comment explaining it — rather than as a number in a
  dashboard nobody diffs. Changing a cache window is a commit, not a click.
- **The admin and previews are excluded by their own headers.** Everything
  under `/_emdash`, every editor render and every `_preview=` response is sent
  `private, no-store`, so no rule can hold a signed-in or revoked view.
- **`/rss.xml` is unaffected by the HTML rule.** It has an extension, so the
  expression does not match; it keeps the `max-age=3600` its route sets. The
  generated cards are handled by their own rule.

## The social-card route

`/og/<slug>.png` renders with satori and resvg and advertises
`public, max-age=2592000, s-maxage=2592000`. The Worker's Cache API stores it
for the month and a repeat is `X-Edge-Cache: HIT`; but Cloudflare's zone cache
only stores a Worker response for a path its Cache Rule marks eligible, and the
old HTML-only rule never matched `.png`. Every repeat still reported
`cf-cache-status: BYPASS` and woke the Worker, and because a Cache API write is
not immediately visible to another request, a scraper's immediate retry could
render the card twice before the Worker cache caught up. The `Cache social
cards` rule above is the fix; it takes effect when it is applied to the zone,
not when the Worker is deployed.

## Purge on deploy

The reason to purge changed with the move off Pages, but it did not go away.

When the site was prerendered, stale HTML pointed at content-hashed bundles
that only existed in the deployment that built them, so serving a cached page
after a deploy meant 404s on hydration. Now the deployed Worker serves whatever
the database holds, and the risk is milder: a page rendered by the previous
version of the templates. The purge still has to happen, because a zone cache
entry (and a `caches.default` entry — they share the zone's cache on a Workers
custom domain) outlives the deploy otherwise.

`.github/workflows/deploy.yml` runs `tools/cloudflare/purge.sh` for each zone
immediately after `wrangler deploy`, and `npm run deploy` does the same locally
when `CF_API_TOKEN` is set — printing a skip notice when it is not, so a deploy
from a machine without the token still works and says so.

## Content changes are not deploys

Publishing a post does not run a deploy, so nothing purges automatically. Every
page is rendered fresh, because the origin sends `no-store`; once that header is
relaxed and the host-scoped rule is trusted, a cached page can be up to its edge
window old.

That is the intended behaviour: a short window is how the site "catches up"
without purging the whole zone every time a typo is fixed. The targeted purge
is the alternative when it matters.

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

A response carries something like
`Cache-Tag: posts,01M12ZDR0A68MZMHFSHAR1EZK,astro-path:/posts`, so a single
post's edit can drop exactly the pages that rendered it:

```js
// anywhere the Astro global is in scope, e.g. a content hook
await Astro.cache.invalidate({ tags: [entry.data.id] });
```

**Do not expect to see that header in production.** Cloudflare consumes
`Cache-Tag` and `Cloudflare-CDN-Cache-Control` at the edge and does not pass
them to the client, so `curl https://seanbehan.ca/posts` shows neither even
when the provider is working — which is the two minutes this note exists to
save. Check it against a local `wrangler dev` on a real build, where nothing
sits in front of the Worker, or against the build itself: the provider is
bundled as `dist/server/chunks/_virtual_astro_cache-provider_*.mjs`.

Nothing calls `invalidate` yet; the window is still the trade this site makes.

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

## Browser Cache TTL: the day-long warm HIT (operator action)

Reproduced live on 2026-09-13. A warm Worker HIT for HTML returned
`Cache-Control: public, max-age=86400`, while the route and middleware sent
`private, max-age=0, must-revalidate` — the value HTML carried before it became
`no-store`. The Worker was doing its job; the zone's
Browser Cache TTL rewrote the browser-facing `max-age` to a day on the way out.
The route files were correct; changing their TTLs would not fix that. The
operator step is the zone setting, and it is deliberately not attempted from
this repo.

**Operator step, both zones (`seanbehan.ca` and `codebam.ca`):**

1. Dashboard → **Caching** → **Configuration** → **Browser Cache TTL** →
   **Respect Existing Headers** (not a fixed default).
2. Check the Cache Rules from "The rules" above still say Browser TTL
   **Respect origin** — a Cache Rule overrides the zone default.
3. Purge both zones (or run `tools/cloudflare/purge.sh`) so copies written with
   the old header are gone.

**Acceptance — run each command twice and read the second response:**

```sh
# HTML: nothing may store it, and the Worker refuses the put too.
curl -sS -D - -o /dev/null https://seanbehan.ca/about | grep -i cache-control
# expect: cache-control: private, no-store

# A route policy is left alone.
curl -sS -D - -o /dev/null https://seanbehan.ca/rss.xml | grep -i cache-control
# expect: cache-control: max-age=3600

# A card keeps the month, and the outer cache should answer the second request
# with cf-cache-status: HIT once the card rule is applied.
curl -sS -D - -o /dev/null https://seanbehan.ca/og/site.png | grep -iE '^(cache-control|cf-cache-status):'
# expect: cache-control: public, max-age=2592000, s-maxage=2592000
```

If HTML still reports `max-age=86400`, the zone's Browser Cache TTL is the first
suspect (a Cache Rule with Browser TTL respect-origin wins over the zone
default), then the zone setting. Both origins have to be changed independently.

- `public/_headers` is only read when the Worker is deployed with the assets
  directory it sits in. `wrangler deploy` prints `Parsed N valid header rules`;
  if that count is not what you expect, the rules are not live.

## Required tokens

| Secret          | Used by                  | Scopes                                                                   |
| --------------- | ------------------------ | ------------------------------------------------------------------------ |
| `CF_API_TOKEN`  | the deploy and the purge | Zone → Cache Purge, Zone → Zone → Read, Account → Workers Scripts → Edit |
| `CF_ACCOUNT_ID` | the deploy               | —                                                                        |

The Cache Rule scripts need **Zone → Cache Rules → Edit** in addition; the
workflows that call them use the same `CF_API_TOKEN`, so it has to carry both
sets of scopes.
