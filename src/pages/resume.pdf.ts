/**
 * The résumé PDF, out of the private bucket.
 *
 * `private` has no public domain of its own — it holds the résumé next to
 * things that are not for the site at all — so this Worker is the way to it.
 * That is also what makes the download link same-origin: no second hostname in
 * the CSP, no r2.dev URL baked into a template, and a reader who saves the file
 * gets a name built from the site's identity rather than from an object key.
 *
 * The bytes are CI's; the URL is forever. Both reasons to be dull about it:
 * 404 rather than redirect when the object is missing, and an etag so a
 * recruiter who downloaded it yesterday costs a 304 rather than 35 KB.
 */
import type { APIRoute } from 'astro';
import { getResumePdf, resumePdfFilename } from '../lib/resume';
import { site } from '../lib/site';

/**
 * An hour at the edge, then back to the bucket. Long enough that a busy
 * afternoon of hiring managers is one read, short enough that a résumé
 * published without a purge still turns up the same day — and the workflow
 * purges anyway.
 */
const PDF_CACHE = 'public, max-age=0, s-maxage=3600, must-revalidate';

const notFound = () =>
	new Response('Not found', {
		status: 404,
		headers: { 'Cache-Control': 'public, max-age=60', 'Content-Type': 'text/plain; charset=utf-8' }
	});

export const GET: APIRoute = async ({ request }) => {
	// The codebam variant does not pitch a résumé; see src/pages/resume.astro.
	if (!site.showResume) return notFound();

	const pdf = await getResumePdf();
	if (!pdf) return notFound();

	const filename = resumePdfFilename();
	const etag = pdf.httpEtag;
	const base = {
		ETag: etag,
		'Last-Modified': pdf.uploaded.toUTCString(),
		'Cache-Control': PDF_CACHE
	};

	if (request.headers.get('if-none-match') === etag) {
		return new Response(null, { status: 304, headers: base });
	}

	return new Response(pdf.body, {
		headers: {
			...base,
			'Content-Type': 'application/pdf',
			'Content-Length': String(pdf.size),
			// `inline` so a click opens the document in the tab, and the
			// filename still travels with it into "Save as…". The page's own
			// button adds `download` for readers who meant to take the file.
			'Content-Disposition': `inline; filename="${filename}"`
		}
	});
};
