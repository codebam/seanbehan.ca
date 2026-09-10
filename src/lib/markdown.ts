/**
 * The page, in the forms a program reads.
 *
 * Markdown and JSON for one entry, both derived from the same Portable Text
 * the HTML renders from. The conversion itself is EmDash's own
 * (`portableTextToMarkdown`, what the CMS hands its API clients), with two
 * repairs in front of it: the images bodies carry are root-relative, which a
 * reader far from this origin cannot resolve (and the older ones spell the
 * URL `src` where the converter reads `asset.url`), and a code block's
 * filename would vanish into a bare fence. Both are fixed by adjusting the
 * blocks, not by reimplementing the renderer — the converter stays the single
 * account of what marks and styles mean here.
 *
 * The markdown document leads with a plain header — title, description, the
 * dates, tags, a pointer back to the HTML page — because a bot handed a post
 * without its context has to guess whose words these are and when they ran.
 * The JSON document carries the same facts as fields, with the markdown body
 * inside them, so either answer fits in one request.
 */

import { portableTextToMarkdown, type PortableTextBlock } from 'emdash/client';
import { prepareBody, toSummary } from './posts';
import { LEGAL_NAME, absolute } from './site';

/** An EmDash entry from either content collection, narrowed to what is read. */
interface ExportEntry {
	id: string;
	data: {
		id: string;
		title: string;
		excerpt?: string | null;
		content?: unknown;
		status?: string;
		featured_image?: { src?: string } | null;
		publishedAt?: Date | null;
		updatedAt?: Date | null;
		createdAt?: Date | null;
	};
}

export interface ExportOptions {
	/** Site path of the HTML page, e.g. `/posts/nixos`. */
	path: string;
	/** Tag slugs, for the posts; pages carry none. */
	tags?: string[];
	/** Posts have an author; a page speaks for the site. */
	byline?: boolean;
}

const DATE_FORMAT = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' } as const;

const longDate = (iso: string) => new Date(iso).toLocaleDateString('en-CA', DATE_FORMAT);

/**
 * Bodies as stored, put into the shape the CMS converter expects.
 */
function fitBlocks(value: unknown): PortableTextBlock[] {
	if (!Array.isArray(value)) return [];
	const out: PortableTextBlock[] = [];
	for (const block of value as PortableTextBlock[]) {
		if (block?._type === 'image') {
			// The feed renderer reads `src`; the converter and the stored bodies
			// read `asset.url`. Accept either, and absolutize whatever is found:
			// a bot reads the document far from this origin, as in the feed.
			const stored =
				(block.asset as { url?: string } | undefined)?.url ?? (block as { src?: string }).src;
			out.push({ ...block, asset: { url: stored ? absolute(stored) : '' } });
		} else {
			if (block?._type === 'code' && typeof block.filename === 'string' && block.filename) {
				// A fence carries no name, so the file it came from becomes the
				// line above it — the convention every markdown reader shows.
				out.push({
					_type: 'block',
					style: 'normal',
					children: [{ _type: 'span', text: block.filename }]
				});
			}
			out.push(block);
		}
	}
	return out;
}

/** The body alone, as markdown. */
export function bodyMarkdown(content: unknown): string {
	const blocks = fitBlocks(content);
	// The converter's empty answer is a bare newline; a page with no body has
	// no body, not a blank line posing as one.
	return blocks.length ? portableTextToMarkdown(blocks) : '';
}

/** The shared reading of the entry: dates, description, tags, reading time. */
const describe = (entry: ExportEntry, opts: ExportOptions) =>
	toSummary(entry as never, opts.tags ?? []);

/**
 * One entry as a markdown document: the header, then the converted body.
 */
export function markdownDocument(entry: ExportEntry, opts: ExportOptions): string {
	const summary = describe(entry, opts);
	const meta = [`URL: ${absolute(opts.path)}`];
	if (opts.byline) meta.push(`Author: ${LEGAL_NAME}`);
	meta.push(`Published: ${longDate(summary.meta.date)}`);
	if (summary.meta.updated) meta.push(`Updated: ${longDate(summary.meta.updated)}`);
	if (summary.meta.tags.length) meta.push(`Tags: ${summary.meta.tags.join(', ')}`);
	if (summary.readingMinutes)
		meta.push(
			`Reading time: ${summary.readingMinutes} minute${summary.readingMinutes === 1 ? '' : 's'}`
		);
	if (summary.meta.draft) meta.push('Status: draft');

	const lines = [`# ${summary.meta.title}`, ''];
	if (summary.meta.description) lines.push(`> ${summary.meta.description}`, '');
	for (const line of meta) lines.push(`- ${line}`);
	lines.push('', '---', '');

	return `${lines.join('\n')}\n${bodyMarkdown(entry.data.content)}`;
}

/**
 * One entry as the machine-readable sibling of the markdown document: the
 * header's facts as fields, the same body inside, and the heading anchors the
 * HTML page uses so a section can be cited precisely.
 */
export function jsonDocument(entry: ExportEntry, opts: ExportOptions) {
	const summary = describe(entry, opts);
	return {
		title: summary.meta.title,
		url: absolute(opts.path),
		description: summary.meta.description ?? null,
		author: opts.byline ? LEGAL_NAME : null,
		published: summary.meta.date,
		updated: summary.meta.updated ?? null,
		draft: summary.meta.draft,
		tags: summary.meta.tags,
		readingMinutes: summary.readingMinutes ?? null,
		image: summary.meta.image ? absolute(summary.meta.image) : null,
		sections: prepareBody(entry.data.content).headings,
		content_format: 'text/markdown',
		content_url: `${absolute(opts.path)}.md`,
		content: bodyMarkdown(entry.data.content)
	};
}

export const markdownResponse = (body: string) =>
	new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });

export const jsonResponse = (payload: unknown) =>
	new Response(JSON.stringify(payload), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' }
	});

export const notFoundResponse = () =>
	new Response('Not Found\n', {
		status: 404,
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
