/**
 * A CMS page as JSON.
 *
 * The `/pages/example.md` facts in fields. See that route for what is shared.
 */
import type { APIRoute } from 'astro';
import { decodeSlug, getEmDashEntry } from 'emdash';
import { jsonDocument, jsonResponse, notFoundResponse } from '../../lib/markdown';

export const GET: APIRoute = async ({ params }) => {
	const slug = decodeSlug(params.slug);
	if (!slug) return notFoundResponse();

	const { entry, cacheHint } = await getEmDashEntry('pages', slug);
	if (!entry) return notFoundResponse();
	if (typeof Astro !== 'undefined' && Astro.cache?.enabled) Astro.cache.set(cacheHint);

	return jsonResponse(jsonDocument(entry as never, { path: `/pages/${slug}` }));
};
