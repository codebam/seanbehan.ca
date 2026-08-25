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

export const GET: APIRoute = async ({ url }) => {
	const query = (url.searchParams.get('q') ?? '').trim();
	if (query.length < 2) return json({ slugs: [] });

	const { posts, cacheHint, bodies } = await getPosts();
	// The Astro global is absent where the sandbox runs the endpoint, so the
	// guard is a typeof rather than a direct read.
	if (typeof Astro !== 'undefined' && Astro.cache?.enabled) Astro.cache.set(cacheHint);

	return json({ slugs: searchPosts(query, posts, bodies) });
};

const json = (body: { slugs: string[] }) =>
	new Response(JSON.stringify(body), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' }
	});
