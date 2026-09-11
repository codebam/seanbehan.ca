/**
 * The résumé as plain text, out of the private bucket.
 *
 * This is the copy an application form or an ATS reads. The PDF extracts
 * cleanly enough, but it is still a layout for a parser to reconstruct, and
 * this is not: one fact per line, no fonts, no columns. CI builds it from the
 * same source and the same filter as the PDF and the fragment, so it cannot
 * quietly say something different about 2021.
 *
 * Like the other two: 404 rather than a stale bundle copy when the bucket has
 * nothing, R2's etag so a re-check of an unchanged résumé costs a 304, and
 * `inline` so the filename travels into "Save as…". The page's own link adds
 * `download` for readers who meant to take the file.
 */
import type { APIRoute } from 'astro';
import { getResumeText, resumeTxtFilename } from '../lib/resume';
import { site } from '../lib/site';

/** The text sits at the same edge hour as the PDF: it changes when they do. */
const TXT_CACHE = 'public, max-age=0, s-maxage=3600, must-revalidate';

const notFound = () =>
	new Response('Not found', {
		status: 404,
		headers: { 'Cache-Control': 'public, max-age=60', 'Content-Type': 'text/plain; charset=utf-8' }
	});

export const GET: APIRoute = async ({ request }) => {
	// The codebam variant does not pitch a résumé; see src/pages/resume.astro.
	if (!site.showResume) return notFound();

	const text = await getResumeText();
	if (!text) return notFound();

	const etag = text.httpEtag;
	const base = {
		ETag: etag,
		'Last-Modified': text.uploaded.toUTCString(),
		'Cache-Control': TXT_CACHE
	};

	if (request.headers.get('if-none-match') === etag) {
		return new Response(null, { status: 304, headers: base });
	}

	return new Response(text.body, {
		headers: {
			...base,
			'Content-Type': 'text/plain; charset=utf-8',
			'Content-Length': String(text.size),
			'Content-Disposition': `inline; filename="${resumeTxtFilename()}"`
		}
	});
};
