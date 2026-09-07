/**
 * A post as markdown, for the reader who is a program.
 *
 * `/posts/example.md` answers directly, and the middleware sends a request
 * for `/posts/example` carrying `Accept: text/markdown` here too. The HTML
 * page and this share one source — the same entry, converted — and the same
 * rules: a draft is reachable at its URL and no more listed here than there.
 */
import type { APIRoute } from 'astro';
import { getEmDashEntry, getEntryTerms } from 'emdash';
import { markdownDocument, markdownResponse, notFoundResponse } from '../../lib/markdown';

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug!;
	const { entry, cacheHint } = await getEmDashEntry('posts', slug);
	if (!entry) return notFoundResponse();
	// The Astro global is absent where the sandbox runs the endpoint, so the
	// guard is a typeof rather than a direct read.
	if (typeof Astro !== 'undefined' && Astro.cache?.enabled) Astro.cache.set(cacheHint);

	const tags = (await getEntryTerms('posts', entry.data.id, 'tag')).map((term) => term.slug);
	return markdownResponse(
		markdownDocument(entry as never, { path: `/posts/${slug}`, tags, byline: true })
	);
};
