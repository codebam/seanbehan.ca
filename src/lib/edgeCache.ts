/** Routes whose response changes with their query string. */
const QUERY_SENSITIVE = /(^|\/)(?:search\.json|_image)$/;

/**
 * Collapse irrelevant query strings so they cannot manufacture unlimited cache
 * misses. Image transforms are the exception: their query identifies the
 * source, dimensions and format, so dropping it would mix different images.
 */
export function edgeCacheKey(url: URL): Request {
	const search = QUERY_SENSITIVE.test(url.pathname) ? url.search : '';
	return new Request(`${url.origin}${url.pathname}${search}`, { method: 'GET' });
}
