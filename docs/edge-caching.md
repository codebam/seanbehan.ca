# Edge caching

There are two caches in front of a reader, and the mistake this file exists to
prevent is believing a header set for one of them controls the other.

- **Cloudflare's zone cache** runs before the Worker. Which responses it holds
  is governed by the zone's Cache Rules, and a Worker override wins over them
  on this compatibility date: `wrangler.jsonc` pins `2026-02-24`, after the
  override flags became default, so a response the Worker marks `private`
  bypasses the zone even when a rule says cache eligible. Verified live on
  2026-11-12: `/`, `/og/site.png` and `/rss.xml` answer
  `cf-cache-status: BYPASS`, while Workers Assets files such as
  `/favicon.svg` answer `cf-cache-status: HIT`. The zone therefore holds
  static assets only, and no code here depends on it holding Worker HTML.
- **The Worker's own Cache API** (`caches.default`) is inside the Worker, and
  `src/middleware.ts` is its only policy. It is the cache that holds the
  site: anonymous HTML for 60 seconds, a route's own public policy for the
  feed, transforms and cards, with the browser-facing policy carried beside
  the stored copy in `X-Edge-Browser-Cache-Control` and the outcome reported
  as `X-Edge-Cache: HIT` or `MISS`. The scoreboard to read live is that
  header on the second request, not `cf-cache-status`.

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

The current posture is:

- **HTML: `private` for the browser, 60 seconds in the Worker cache.**
  That is `HTML_CACHE` plus the stored window in `src/middleware.ts`. A HIT
  restores the private policy, so a warm copy is never handed to a browser
  under a longer TTL. The www 301 still comes from the Worker because the
  Worker cache key is host-scoped and the zone holds no Worker HTML to
  answer www first. Personalised renders are excluded by never getting a
  cache key, or by carrying `no-store`.
- **Zone rules stay as the scripts write them, but they are not the
  mechanism.** `tools/cloudflare/cache-rule.sh` keeps the host-scoped
  cache-eligible rules and the `Vary: Accept` normalisation, so a future
  zone pass or a rule change does not silently re-arm the www bug. Do not
  switch them to Edge TTL override to chase a zone hold: an override
  caches `no-store` responses too, which would put editor and preview
  renders in front of anonymous readers.
- **Card rule stays host-scoped and eligible.** `/og/<slug>.png` is public,
  stable, and draws with satori and resvg when cold. Live it answers
  `BYPASS` at the zone and `HIT` in the Worker cache, so the month is
  held where it is actually held.

## Why the Worker caches public routes at all

Every page is rendered per request by a Worker, out of D1. That is the trade the
CMS bought: a post can be edited in the admin panel and be live without a build.
What it costs is that a page nobody has asked for recently is assembled from a
database query, a Portable Text render and — on a post — a syntax highlighter,
every time.

Anonymous HTML and any route that sets its own public `Cache-Control` (the
feed, `/og/<slug>.png`, image transforms) are looked up in `caches.default`
before the route runs and put back after it renders. On a HIT the response is
returned with the stored `Cache-Control` replaced by the browser policy from
`X-Edge-Browser-Cache-Control`, and the internal marker is removed. The stored
copy cannot carry that browser policy directly: `max-age=0` would tell the
Cache API to store nothing, so the copy is written with the stored window
(60 seconds for HTML, a feed's hour, a card's month) and the marker carries
the reader-facing half.

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
Today the Worker cache is the mechanism and the rule is defence in depth, so
the clause stays even though cached apex HTML is not what answers www now.
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
for the month and a repeat is `X-Edge-Cache: HIT`, verified live. The zone
still reports `cf-cache-status: BYPASS` for it, because the Worker override
wins over the card rule on this compatibility date, and a Cache API write is
not immediately visible to another request, so a scraper's immediate retry
can render the card twice before the Worker cache catches up. The month is
held in the Worker cache, where a repeat actually hits.

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

Publishing a post does not run a deploy, so nothing purges automatically. A
repeat visit within 60 seconds reads the Worker cache, so a published edit can
take up to its minute to appear. That is the window, not a bug.

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
# HTML: the Worker holds it for a minute, the browser still revalidates.
curl -sS -D - -o /dev/null https://seanbehan.ca/about | grep -iE '^(cache-control|x-edge-cache):'
# expect: cache-control: private, max-age=0, must-revalidate
# expect: x-edge-cache: HIT

# A route policy is left alone.
curl -sS -D - -o /dev/null https://seanbehan.ca/rss.xml | grep -i cache-control
# expect: cache-control: max-age=3600

# A card keeps the month, held in the Worker cache.
curl -sS -D - -o /dev/null https://seanbehan.ca/og/site.png | grep -iE '^(cache-control|x-edge-cache):'
# expect: cache-control: public, max-age=2592000, s-maxage=2592000
# expect: x-edge-cache: HIT
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
