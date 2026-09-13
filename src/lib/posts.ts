/**
 * The posts, as the site's own views want them.
 *
 * EmDash hands back entries whose shape is the database's: `data.publishedAt`
 * is a Date, tags arrive as taxonomy terms, and the body is Portable Text. The
 * templates were written against the markdown era's `meta.date` / `meta.tags`,
 * and there is no reason to rewrite them for a rename — this module does the
 * translation once, in one place, and everything above it keeps reading the
 * same field names.
 *
 * Reading time is computed here too. It used to come from the raw markdown
 * file; the words now live in Portable Text, so they are walked out of the
 * blocks instead. Code is charged at readingTime's half weight rather than
 * dropped: a 60-line shell transcript is not prose, but it is also not
 * nothing, and dropping it made exactly the tutorial posts the blog is
 * proudest of understate their length.
 */

import { getEmDashCollection, getTermsForEntries } from 'emdash';
import { countWords, weightedReadingMinutes } from './readingTime';
import { slugifyTag } from './tags';
import type { Heading, PostSummary } from './types';

/** A Portable Text block, as much of it as this module has to know about. */
interface PTBlock {
	_type: string;
	style?: string;
	children?: { _type?: string; text?: string; marks?: string[] }[];
	/** Code blocks carry their text here rather than in children. */
	code?: string;
	[key: string]: unknown;
}

/**
 * Prose contained in a Portable Text body, as one string — the search index.
 *
 * Only spans inside `block` nodes are collected: an image block carries no
 * words, and code is left to `bodyWordCounts`, which is where the reading
 * label goes looking for it.
 */
export function plainText(value: unknown): string {
	if (!Array.isArray(value)) return '';
	const out: string[] = [];
	for (const block of value as PTBlock[]) {
		if (block?._type !== 'block') continue;
		for (const child of block.children ?? []) {
			if (typeof child?.text === 'string') out.push(child.text);
		}
	}
	return out.join(' ');
}

/**
 * The words in a Portable Text body the way readingTime counts markdown: prose
 * spans as prose, fenced code blocks and inline-code marks as code. Exported
 * rather than folded into `toSummary` so `getPosts` can hand over counts it
 * already has instead of walking each body twice.
 */
export function bodyWordCounts(value: unknown): { prose: number; code: number } {
	if (!Array.isArray(value)) return { prose: 0, code: 0 };
	const prose: string[] = [];
	const code: string[] = [];
	for (const block of value as PTBlock[]) {
		if (block?._type === 'code' && typeof block.code === 'string') {
			code.push(block.code);
			continue;
		}
		if (block?._type !== 'block') continue;
		for (const child of block.children ?? []) {
			if (typeof child?.text !== 'string') continue;
			if (child.marks?.includes('code')) code.push(child.text);
			else prose.push(child.text);
		}
	}
	return { prose: countWords(prose.join(' ')), code: countWords(code.join(' ')) };
}

/**
 * A body with anchor ids attached to its section headings, and the list of
 * those headings for the table of contents.
 *
 * The ids are computed here, once, rather than in the component that renders a
 * heading: the contents list and the headings themselves have to agree on
 * every id, and a renderer that numbered duplicates as it went would depend on
 * render order and on nothing else having rendered first.
 *
 * Heading levels are re-based to the page, not left as stored: every section
 * in the archive was written as `###`, so a post body rendered an `h1` title
 * followed by `h3` sections and skipped a level — on all twenty-five posts,
 * and on the CMS pages too. The shallowest heading present becomes `h2`, and
 * anything deeper keeps its distance from it. A body that stores real `##`
 * headings gets them unchanged, because then the shallowest already is one,
 * and a stray `#` becomes an `h2` rather than a second page title.
 */
export function prepareBody(value: unknown) {
	if (!Array.isArray(value)) return { blocks: [] as PTBlock[], headings: [] as Heading[] };

	const seen = new Map<string, number>();
	const collected: { id: string; text: string; level: number; index: number }[] = [];

	const blocks = (value as PTBlock[]).map((block, index) => {
		const level = headingLevel(block?.style);
		if (block?._type !== 'block' || level === null) return block;

		const text = (block.children ?? [])
			.map((child) => child?.text ?? '')
			.join('')
			.trim();
		if (!text) return block;

		const base = slugifyHeading(text);
		// Two sections called "Conclusion" would otherwise share a fragment and
		// the second would be unreachable.
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);
		const id = count === 0 ? base : `${base}-${count}`;

		collected.push({ id, text, level, index });
		return block;
	});

	// One level, computed from the whole body before anything is re-based: a
	// heading cannot know how deep the document around it is.
	const shallowest = collected.length ? Math.min(...collected.map((h) => h.level)) : 2;
	const shift = shallowest - 2;

	const headings: Heading[] = collected.map((h) => ({
		id: h.id,
		text: h.text,
		level: h.level - shift
	}));
	const relocated = new Map(collected.map((h) => [h.index, h]));

	return {
		blocks: blocks.map((block, index) => {
			const heading = relocated.get(index);
			return heading
				? { ...block, style: `h${heading.level - shift}`, headingId: heading.id }
				: block;
		}),
		headings
	};
}

/** The stored heading styles, as levels. Anything else is not a heading. */
const headingLevel = (style: unknown): number | null =>
	typeof style === 'string' && /^h[1-6]$/.test(style) ? Number(style.slice(1)) : null;

/**
 * The id form for a heading: lowercase, punctuation dropped, spaces hyphenated.
 * Matches what the renderer puts on the element, so the two agree without
 * either importing the other's markup.
 */
export const slugifyHeading = (text: string) =>
	text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-');

/** An EmDash entry narrowed to the fields this module reads. */
interface PostEntry {
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

/** One entry as the list and detail views read it. */
export function toSummary(
	entry: PostEntry,
	tags: string[] = [],
	counts?: { prose: number; code: number }
): PostSummary {
	const published = entry.data.publishedAt ?? entry.data.createdAt ?? null;
	const updated = entry.data.updatedAt ?? null;
	const words = counts ?? bodyWordCounts(entry.data.content);

	return {
		path: `/posts/${entry.id}`,
		slug: entry.id,
		meta: {
			title: entry.data.title,
			date: (published ?? new Date(0)).toISOString(),
			// Only a real edit counts: EmDash touches updated_at on publish, so an
			// untouched post would otherwise advertise a modified date equal to its
			// publication date and gain nothing but noise in the feed.
			updated:
				updated && published && updated.getTime() - published.getTime() > 60_000
					? updated.toISOString()
					: undefined,
			description: entry.data.excerpt ?? undefined,
			tags,
			draft: entry.data.status !== 'published',
			image: entry.data.featured_image?.src ?? undefined
		},
		readingMinutes: weightedReadingMinutes(words.prose, words.code)
	};
}

/**
 * Every published post, newest first, with its tags.
 *
 * Tags come from one batched lookup rather than a query per post: the archive
 * draws 20-odd rows, and a round trip each would be the page's whole budget.
 *
 * `bodies` hands back the plain prose per slug: search wants exactly the words
 * `plainText` collects, and reading time wants the code too, so both walks
 * share this one query. Only search.json reads the map, so every other caller
 * passes `{ includeBodies: false }` and skips keeping a second copy of the
 * archive's words per request.
 *
 * `content` is the raw Portable Text, and it exists for the feed: the archive
 * query already transferred it, so asking for it here is what lets the feed
 * render bodies without a second `getEmDashCollection` for the same rows.
 */
export async function getPosts(opts?: { includeBodies?: boolean; includeContent?: boolean }) {
	const includeBodies = opts?.includeBodies ?? true;
	const includeContent = opts?.includeContent ?? false;
	const { entries, cacheHint } = await getEmDashCollection('posts', {
		status: 'published',
		orderBy: { published_at: 'desc' },
		limit: 200
	});

	const list = entries as unknown as PostEntry[];
	const termsByEntry = await getTermsForEntries(
		'posts',
		list.map((entry) => entry.data.id),
		'tag'
	);

	const bodies = new Map<string, string>();
	const content = new Map<string, unknown>();
	const posts = list
		.map((entry) => {
			const body = plainText(entry.data.content);
			if (includeBodies) bodies.set(entry.id, body);
			if (includeContent) content.set(entry.id, entry.data.content);
			return toSummary(
				entry,
				(termsByEntry.get(entry.data.id) ?? []).map((term) => term.slug),
				bodyWordCounts(entry.data.content)
			);
		})
		.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

	return { posts, cacheHint, bodies, content };
}

/** Tag counts across the published posts, most used first. */
export function tagCounts(posts: PostSummary[]) {
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.meta.tags) {
			const slug = slugifyTag(tag);
			counts.set(slug, (counts.get(slug) ?? 0) + 1);
		}
	}
	return [...counts.entries()]
		.map(([slug, count]) => ({ slug, count }))
		.sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}
