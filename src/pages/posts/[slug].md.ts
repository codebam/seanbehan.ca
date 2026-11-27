/**
 * A post as markdown, for the reader who is a program.
 *
 * `/posts/example.md` answers directly, and the middleware sends a request
 * for `/posts/example` carrying `Accept: text/markdown` here too. The HTML
 * page and this share one source — the same entry, converted — and the same
 * rules: a draft is reachable at its URL and no more listed here than there.
 */
import type { APIRoute } from 'astro';
import { decodeSlug, getEmDashEntry, getEntryTerms } from 'emdash';
import { markdownDocument, markdownResponse, notFoundResponse } from '../../lib/markdown';

export const GET: APIRoute = async ({ params, cache }) => {
	const slug = decodeSlug(params.slug);
	if (!slug) return notFoundResponse();

	const { entry, cacheHint } = await getEmDashEntry('posts', slug);
	if (cache?.enabled) cache.set(cacheHint);
	if (!entry) return notFoundResponse();

	const tags = (await getEntryTerms('posts', entry.data.id, 'tag')).map(
		(term) => term.label || term.slug
	);
	return markdownResponse(
		markdownDocument(entry as never, { path: `/posts/${slug}`, tags, byline: true })
	);
};
