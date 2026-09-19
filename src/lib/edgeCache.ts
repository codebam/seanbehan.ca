import { MAX_QUERY_LENGTH, clampQuery } from './search';

/**
 * Routes whose response can change with their query string. Only the image
 * endpoint is left: a transform is keyed by more than `q`, so it goes through
 * imageQuery instead. /search.json used to sit here and key on its whole raw
 * query string, which let `?q=x&nonce=1..N` fill the cache with responses that
 * are byte-identical.
 */
const QUERY_SENSITIVE = /(^|\/)_image$/;

/**
 * Routes that read only `q` out of their query string. Both drop every other
 * parameter, so `?q=nixos&nonce=1..N` is one cache entry.
 */
const QUERY_FILTERED = /(^|\/)(?:posts|search\.json)$/;

/**
 * The parameters Astro's image endpoint reads, in a fixed order so a reordered
 * URL cannot look like a fresh cache entry. `nonce` and other cache-busters are
 * dropped. `q` here is image quality and is copied verbatim; the search `q` is
 * normalised in filteredQuery instead.
 */
const IMAGE_QUERY_KEYS = ['href', 'w', 'h', 'f', 'fit', 'q'] as const;

/**
 * Build the image key from known parameters only.
 *
 * `get` decodes once and `set` re-encodes the same value, so the bytes the
 * endpoint sees are preserved without trusting the incoming encoding. A missing
 * parameter stays missing rather than becoming the string "null"; when `href`
 * is absent the key is whatever known parameters were present, which keeps it
 * stable across cache-busters.
 */
function imageQuery(url: URL): string {
	const params = new URLSearchParams();
	for (const key of IMAGE_QUERY_KEYS) {
		const value = url.searchParams.get(key);
		if (value !== null) params.set(key, value);
	}
	const query = params.toString();
	return query ? `?${query}` : '';
}

/**
 * Just the `q` of a filtered route, normalised.
 *
 * Not the whole query string: only `q` can change what the archive or
 * /search.json renders, so anything else on the URL (`utm_source`, a
 * `?nonce=1..N` loop) is dropped rather than turned into a fresh cache entry.
 * Case and surrounding space are folded too, since the ranking treats them as
 * the same search, and clampQuery caps the length before it can key an
 * unbounded number of entries.
 */
function filteredQuery(url: URL): string {
	const q = clampQuery(url.searchParams.get('q') ?? '')
		.toLowerCase()
		// Folding case can expand one code point; take the cap again so the key
		// itself, not just the pre-fold string, is bounded.
		.slice(0, MAX_QUERY_LENGTH);
	return q ? `?q=${encodeURIComponent(q)}` : '';
}

/**
 * Collapse irrelevant query strings so they cannot manufacture unlimited cache
 * misses. Image transforms are the exception: their query identifies the
 * source, dimensions and format, so it is narrowed to the parameters the
 * endpoint reads rather than dropped.
 */
export function edgeCacheKey(url: URL): Request {
	const search = QUERY_SENSITIVE.test(url.pathname)
		? imageQuery(url)
		: QUERY_FILTERED.test(url.pathname)
			? filteredQuery(url)
			: '';
	/*
	 * This prefix scopes the Worker's own Cache API key, and nothing else. It
	 * cannot scope Cloudflare's zone cache, which keys the URL the client sent
	 * before the Worker runs; that cache is governed by the zone's Cache Rule
	 * (tools/cloudflare/cache-rule.sh, docs/edge-caching.md). HTML never gets a
	 * key here anyway — the middleware's HTML_CACHE is `no-store`, so
	 * `safeToStore` refuses the put — and that, not this prefix, is why the www
	 * redirect cannot depend on the Worker cache. Entries that do get stored
	 * (feeds, transforms, cards) stay per-host because of the prefix. The
	 * marker never reaches a rendered page.
	 */
	return new Request(`${url.origin}/__host/${url.host}${url.pathname}${search}`, { method: 'GET' });
}
