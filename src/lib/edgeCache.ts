/**
 * Routes whose response changes with their query string.
 *
 * The archive is on the list because it filters server-side on `?q=`: without
 * it a searched page would be stored under the plain `/posts` key and served
 * to everyone who asked for the archive.
 */
const QUERY_SENSITIVE = /(^|\/)(?:search\.json|_image)$/;

/** The one route that reads a search parameter out of its query string. */
const QUERY_FILTERED = /(^|\/)posts$/;

/**
 * How much of a query is allowed to key a cache entry. Long enough for a real
 * search, short enough that a flood of near-identical queries cannot fill the
 * cache with one entry per byte.
 */
const QUERY_MAX = 64;

/**
 * Just the `q` of a filtered route, normalised.
 *
 * Not the whole query string: only `q` can change what the archive renders, so
 * anything else on the URL (`utm_source`, a `?nonce=1..N` loop) is dropped
 * rather than turned into a fresh cache entry. Case and surrounding space are
 * folded too, since the ranking treats them as the same search.
 */
function filteredQuery(url: URL): string {
	const q = url.searchParams
		.get('q')
		?.trim()
		.replace(/\s+/g, ' ')
		.toLowerCase()
		.slice(0, QUERY_MAX);
	return q ? `?q=${encodeURIComponent(q)}` : '';
}

/**
 * Collapse irrelevant query strings so they cannot manufacture unlimited cache
 * misses. Image transforms are the exception: their query identifies the
 * source, dimensions and format, so dropping it would mix different images.
 */
export function edgeCacheKey(url: URL): Request {
	const search = QUERY_SENSITIVE.test(url.pathname)
		? url.search
		: QUERY_FILTERED.test(url.pathname)
			? filteredQuery(url)
			: '';
	return new Request(`${url.origin}${url.pathname}${search}`, { method: 'GET' });
}
