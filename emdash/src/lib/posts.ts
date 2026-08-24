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
 * blocks instead. Code blocks are excluded deliberately: a 60-line shell
 * transcript is not read at prose speed, and counting it made every Linux post
 * claim twice the minutes it needs.
 */

import { getEmDashCollection, getTermsForEntries } from 'emdash';
import { readingMinutes } from './readingTime';
import { slugifyTag } from './tags';
import type { Heading, PostSummary } from './types';

/** A Portable Text block, as much of it as this module has to know about. */
interface PTBlock {
	_type: string;
	style?: string;
	children?: { _type?: string; text?: string }[];
	[key: string]: unknown;
}

/**
 * Prose contained in a Portable Text body, as one string.
 *
 * Only spans inside `block` nodes are collected: an image block carries no
 * words, and a `code` block carries words nobody reads end to end.
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
 * A body with anchor ids attached to its section headings, and the list of
 * those headings for the table of contents.
 *
 * The ids are computed here, once, rather than in the component that renders a
 * heading: the contents list and the headings themselves have to agree on
 * every id, and a renderer that numbered duplicates as it went would depend on
 * render order and on nothing else having rendered first.
 */
export function prepareBody(value: unknown) {
	if (!Array.isArray(value)) return { blocks: [] as PTBlock[], headings: [] as Heading[] };

	const seen = new Map<string, number>();
	const list: Heading[] = [];

	const blocks = (value as PTBlock[]).map((block) => {
		if (block?._type !== 'block' || (block.style !== 'h2' && block.style !== 'h3')) return block;

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

		list.push({ id, text, level: block.style === 'h3' ? 3 : 2 });
		return { ...block, headingId: id };
	});

	return { blocks, headings: list };
}

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
export function toSummary(entry: PostEntry, tags: string[] = []): PostSummary {
	const published = entry.data.publishedAt ?? entry.data.createdAt ?? null;
	const updated = entry.data.updatedAt ?? null;

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
		readingMinutes: readingMinutes(plainText(entry.data.content))
	};
}

/**
 * Every published post, newest first, with its tags.
 *
 * Tags come from one batched lookup rather than a query per post: the archive
 * draws 20-odd rows, and a round trip each would be the page's whole budget.
 */
export async function getPosts() {
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

	const posts = list
		.map((entry) =>
			toSummary(
				entry,
				(termsByEntry.get(entry.data.id) ?? []).map((term) => term.slug)
			)
		)
		.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

	return { posts, cacheHint };
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
