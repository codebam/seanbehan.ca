/**
 * A CMS page as markdown.
 *
 * Same offer as `/posts/example.md`, for the other collection whose words live
 * in the database. Pages carry no byline or tags, so the header says less;
 * everything else — the dates, the conversion, the draft rules — is shared
 * with the post route in lib/markdown.ts.
 */
import type { APIRoute } from 'astro';
import { decodeSlug, getEmDashEntry } from 'emdash';
import { markdownDocument, markdownResponse, notFoundResponse } from '../../lib/markdown';

export const GET: APIRoute = async ({ params }) => {
	const slug = decodeSlug(params.slug);
	if (!slug) return notFoundResponse();

	const { entry, cacheHint } = await getEmDashEntry('pages', slug);
	if (!entry) return notFoundResponse();
	if (typeof Astro !== 'undefined' && Astro.cache?.enabled) Astro.cache.set(cacheHint);

	return markdownResponse(markdownDocument(entry as never, { path: `/pages/${slug}` }));
};
