/**
 * The ranking half of post search.
 *
 * The archive renders the list and the reader reorders it; this only says in
 * what order a match keeps them. Everything the query could hit — titles,
 * descriptions, tags and the full bodies — stays on this side of the wire.
 */
import type { APIRoute } from 'astro';
import { getPosts } from '../lib/posts';
import { searchPosts } from '../lib/search';

/**
 * The archive as search reads it, held per isolate.
 *
 * Every novel query string is an edge-cache MISS, and without this each MISS
 * cost two D1 round trips plus a Fuse build — one per keystroke burst that
 * outran the debounce. Sixty seconds of isolate memory covers the burst; the
 * edge cache (keyed on `?q=`, see edgeCache.ts) and the content tags below
 * remain the real caching layers.
 */
const MEMO_SECONDS = 60;

let memo: { at: number; index: Awaited<ReturnType<typeof getPosts>> } | null = null;

async function getSearchIndex() {
	if (memo && Date.now() - memo.at < MEMO_SECONDS * 1000) return memo.index;
	const index = await getPosts();
	memo = { at: Date.now(), index };
	return index;
}

export const GET: APIRoute = async ({ url }) => {
	const query = (url.searchParams.get('q') ?? '').trim();
	if (query.length < 2) return json({ slugs: [] });

	const { posts, cacheHint, bodies } = await getSearchIndex();
	// The Astro global is absent where the sandbox runs the endpoint, so the
	// guard is a typeof rather than a direct read.
	if (typeof Astro !== 'undefined' && Astro.cache?.enabled) Astro.cache.set(cacheHint);

	return json({ slugs: searchPosts(query, posts, bodies) });
};

const json = (body: { slugs: string[] }) =>
	new Response(JSON.stringify(body), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			// Ranked per query string, so the browser revalidates and the edge
			// holds it for ten minutes like any other anonymous render.
			'Cache-Control': 'public, max-age=0, s-maxage=600, must-revalidate'
		}
	});
