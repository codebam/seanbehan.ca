/**
 * A post as JSON.
 *
 * The same content as `/posts/example.md`, with its facts in fields: a bot
 * that wants the document asks for this rather than parsing the markdown for
 * the date the entry already knows. See the markdown route for when this is
 * reached by header instead of by URL.
 */
import type { APIRoute } from 'astro';
import { getEmDashEntry, getEntryTerms } from 'emdash';
import { jsonResponse, jsonDocument, notFoundResponse } from '../../lib/markdown';

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug!;
	const { entry, cacheHint } = await getEmDashEntry('posts', slug);
	if (!entry) return notFoundResponse();
	if (typeof Astro !== 'undefined' && Astro.cache?.enabled) Astro.cache.set(cacheHint);

	const tags = (await getEntryTerms('posts', entry.data.id, 'tag')).map((term) => term.slug);
	return jsonResponse(jsonDocument(entry as never, { path: `/posts/${slug}`, tags, byline: true }));
};
