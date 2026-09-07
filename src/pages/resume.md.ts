/**
 * The résumé as markdown, out of the private bucket.
 *
 * `/resume.md` answers a bot with the file the whole résumé is written from —
 * `resume/resume.md`, uploaded beside its two renderings — rather than a
 * conversion of them. The posts answer for their formats because their words
 * are Portable Text in D1; here the source was markdown already, so this
 * route is a copy and the workflow is what keeps the copy current. A request
 * for `/resume` carrying `Accept: text/markdown` arrives here through the
 * same negotiation as a post's does (see lib/accept.ts).
 *
 * Like the PDF route: 404 rather than a stale bundle copy when the bucket has
 * nothing, and R2's etag so a re-check of an unchanged résumé costs a 304.
 */
import type { APIRoute } from 'astro';
import { getResumeMarkdown } from '../lib/resume';
import { site } from '../lib/site';

/** The source sits at the same edge hour as the PDF: it changes when they do. */
const MD_CACHE = 'public, max-age=0, s-maxage=3600, must-revalidate';

const notFound = () =>
	new Response('Not found', {
		status: 404,
		headers: { 'Cache-Control': 'public, max-age=60', 'Content-Type': 'text/plain; charset=utf-8' }
	});

export const GET: APIRoute = async ({ request }) => {
	// The codebam variant does not pitch a résumé; see src/pages/resume.astro.
	if (!site.showResume) return notFound();

	const source = await getResumeMarkdown();
	if (!source) return notFound();

	const etag = source.httpEtag;
	const base = {
		ETag: etag,
		'Last-Modified': source.uploaded.toUTCString(),
		'Cache-Control': MD_CACHE
	};

	if (request.headers.get('if-none-match') === etag) {
		return new Response(null, { status: 304, headers: base });
	}

	return new Response(source.body, {
		headers: {
			...base,
			'Content-Type': 'text/markdown; charset=utf-8',
			'Content-Length': String(source.size)
		}
	});
};
