/**
 * The résumé, as the site serves it.
 *
 * resume/resume.md holds the words. `.github/workflows/resume.yml` turns them
 * into two objects in the `private` bucket with the same pandoc pass:
 * `resume.pdf` to download, and `resume.html` as the fragment /resume renders
 * inline. The page reads both at request time rather than shipping either in
 * the bundle, which is what lets a résumé edit go live with an upload and a
 * purge instead of a redeploy of both origins — and what keeps TeX out of
 * `npm run build`.
 *
 * The fragment is injected, not escaped. It is this repo's own build output,
 * written by this repo's CI, carrying no script and no stylesheet of its own —
 * `.resume-doc` in src/styles/app.css is what styles it. Trusting it is a
 * decision about who can write to that bucket, not about Markdown.
 */
import { env } from 'cloudflare:workers';
import { site } from './site';

/** The keys the workflow writes. The PDF's doubles as its download filename. */
export const RESUME_PDF_KEY = 'resume.pdf';
export const RESUME_HTML_KEY = 'resume.html';

/** What a bucket `get` hands back, as far as this site is concerned. */
export type ResumeObjectBody = {
	body: ReadableStream<Uint8Array>;
	size: number;
	httpEtag: string;
	uploaded: Date;
};

export type ResumeFragment = {
	html: string;
	/** R2's etag for these bytes — the résumé's identity, and the only honest
	 * thing to hand a cache about a document whose URL never changes. */
	etag: string;
	updatedAt: Date;
};

/**
 * The inline résumé, or null when there is nothing to render: the bucket has
 * never been written (a fresh clone, a dev store before `npm run resume:seed`),
 * or it was written by a build that produced nothing. The page shows the
 * download rather than an empty box, because a résumé that renders as a blank
 * panel is the failure a reader should not have to notice on their own.
 */
export async function getResumeFragment(): Promise<ResumeFragment | null> {
	const object = await env.RESUME.get(RESUME_HTML_KEY);
	if (!object) return null;
	const html = await object.text();
	return html.trim() ? { html, etag: object.httpEtag, updatedAt: object.uploaded } : null;
}

/** The PDF, streamed to the reader by src/pages/resume.pdf.ts. */
export async function getResumePdf(): Promise<ResumeObjectBody | null> {
	return env.RESUME.get(RESUME_PDF_KEY);
}

/**
 * "Sean Behan" → "Sean-Behan-Resume.pdf".
 *
 * The object key stays `resume.pdf` — it predates this repo's CI, and a
 * résumé URL someone already pasted into an inbox is worth keeping alive.
 * What a reader's machine calls the file is a separate question, answered here
 * from the site's own identity rather than from a string in the bucket.
 */
export function resumePdfFilename(name: string = site.name): string {
	const slug = name
		.trim()
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-+|-+$/g, '');
	return `${slug || 'resume'}-Resume.pdf`;
}
