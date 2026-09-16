/**
 * The read side of the MCP server: the same published words the site renders,
 * selected for one question instead of for a page.
 *
 * Nothing here is a second content path. Posts come through `getPosts`, which
 * the archive and /search.json already use; an entry's markdown comes through
 * `markdownDocument`, which the `.md` siblings already serve; the résumé comes
 * out of the same R2 object as `/resume.md`. What this module adds is only
 * selection: a ranked result list, a body fetched for the few entries a model
 * will actually read, and section extraction for the résumé.
 *
 * The post index is memoized per isolate for the same reason /search.json
 * memoizes it — a model that calls `search_content` twice in a conversation
 * should not pay two D1 round trips for the identical corpus.
 */
import { decodeSlug, getEmDashCollection, getEmDashEntry, getEntryTerms } from 'emdash';
import { getPosts, plainText } from '../posts';
import { markdownDocument } from '../markdown';
import { getResumeMarkdown } from '../resume';
import { buildRecords, clampQuery, type SearchRecord } from '../search';
import { SITES } from '../site';
import { slugifyTag } from '../tags';
import { personFacts } from './facts';
import { rankedSlugs } from './ranking';

export type EntryType = 'post' | 'page';

export interface SearchResult {
	type: EntryType;
	slug: string;
	title: string;
	url: string;
	date: string | null;
	tags: string[];
	description: string | null;
	excerpt: string;
}

export interface EntryDocument {
	type: EntryType;
	slug: string;
	title: string;
	url: string;
	markdown: string;
}

export interface ResumeDocument {
	url: string;
	/** Null when the bucket has no résumé (a fresh clone, or before seeding). */
	text: string | null;
	updated: string | null;
}

const INDEX_TTL_MS = 60_000;

let indexMemo: { at: number; value: Awaited<ReturnType<typeof getPosts>> } | null = null;

async function postIndex() {
	if (indexMemo && Date.now() - indexMemo.at < INDEX_TTL_MS) return indexMemo.value;
	const value = await getPosts();
	indexMemo = { at: Date.now(), value };
	return value;
}

/** Writing answers at one origin whichever Worker served the request. */
const writingUrl = (path: string) => `${SITES.seanbehan.url}${path}`;

/** A body window around the first query term, so a result carries its match. */
function excerptFor(body: string, query: string, length = 280): string {
	const terms = query
		.toLowerCase()
		.split(/\s+/)
		.filter((term) => term.length > 2);
	const lower = body.toLowerCase();
	let at = -1;
	for (const term of terms) {
		const found = lower.indexOf(term);
		if (found >= 0 && (at < 0 || found < at)) at = found;
	}
	if (at < 0) return body.slice(0, length).trim() + (body.length > length ? '…' : '');
	const start = Math.max(0, at - 80);
	return (
		(start > 0 ? '…' : '') +
		body.slice(start, start + length).trim() +
		(start + length < body.length ? '…' : '')
	);
}

/** An EmDash page entry, narrowed to the fields a search result reads. */
interface PageEntry {
	id: string;
	data: {
		title?: string;
		excerpt?: string | null;
		content?: unknown;
		updatedAt?: Date | null;
	};
}

/**
 * Ranked posts and CMS pages for a query. Posts keep the archive's own scorer
 * over titles, descriptions, tags and full bodies; pages are ranked by the
 * same scorer over the fields they have, then appended so a query that wants
 * prose in /pages/ is not answered with posts alone.
 */
export async function searchContent(query: string, limit = 6) {
	const q = clampQuery(query);
	const results: SearchResult[] = [];
	if (!q) return { query: q, results };

	const { posts, bodies } = await postIndex();
	const bySlug = new Map(posts.map((post) => [post.slug, post]));
	const postRecords = buildRecords(posts, bodies);
	for (const slug of rankedSlugs(q, postRecords, limit)) {
		if (results.length >= limit) break;
		const post = bySlug.get(slug);
		if (!post) continue;
		results.push({
			type: 'post',
			slug,
			title: post.meta.title,
			url: writingUrl(post.path),
			date: post.meta.date.slice(0, 10),
			tags: post.meta.tags,
			description: post.meta.description ?? null,
			excerpt: excerptFor(bodies.get(slug) ?? '', q)
		});
	}

	const { entries } = await getEmDashCollection('pages', {
		status: 'published',
		orderBy: { updated_at: 'desc' },
		limit: 50
	});
	const pages = entries as unknown as PageEntry[];
	const records: SearchRecord[] = pages
		.filter((page) => page.id)
		.map((page) => ({
			slug: page.id,
			title: page.data.title ?? page.id,
			description: page.data.excerpt ?? '',
			tags: [],
			body: plainText(page.data.content)
		}));
	for (const slug of rankedSlugs(q, records, limit - results.length)) {
		const page = pages.find((candidate) => candidate.id === slug);
		if (!page) continue;
		results.push({
			type: 'page',
			slug,
			title: page.data.title ?? slug,
			url: writingUrl(`/pages/${slug}`),
			date: page.data.updatedAt ? page.data.updatedAt.toISOString().slice(0, 10) : null,
			tags: [],
			description: page.data.excerpt ?? null,
			excerpt: excerptFor(plainText(page.data.content), q)
		});
	}

	return { query: q, results };
}

/**
 * One entry as the markdown document its `.md` sibling serves. The path passed
 * to `markdownDocument` is already absolute, so the URL in the header stays
 * canonical even when the request reached the handle origin's Worker.
 */
export async function getEntry(type: EntryType, slug: string): Promise<EntryDocument | null> {
	const decoded = decodeSlug(slug);
	if (!decoded) return null;

	const collection = type === 'page' ? 'pages' : 'posts';
	const { entry } = await getEmDashEntry(collection, decoded);
	if (!entry) return null;

	const path = type === 'page' ? `/pages/${decoded}` : `/posts/${decoded}`;
	const tags =
		type === 'post'
			? (await getEntryTerms('posts', entry.data.id, 'tag')).map((term) => term.label || term.slug)
			: [];

	return {
		type,
		slug: decoded,
		title: entry.data.title,
		url: writingUrl(path),
		markdown: markdownDocument(entry as never, {
			path: writingUrl(path),
			tags,
			byline: type === 'post'
		})
	};
}

/** The published archive, newest first, optionally narrowed to one tag. */
export async function listPosts(tag?: string, limit = 20) {
	const { posts } = await postIndex();
	const wanted = tag ? tag.trim().toLowerCase() : null;
	const filtered = wanted
		? posts.filter((post) =>
				post.meta.tags.some(
					(value) => value.toLowerCase() === wanted || slugifyTag(value) === slugifyTag(tag ?? '')
				)
			)
		: posts;

	return {
		tag: tag ?? null,
		count: filtered.length,
		posts: filtered.slice(0, limit).map((post) => ({
			slug: post.slug,
			title: post.meta.title,
			url: writingUrl(post.path),
			date: post.meta.date.slice(0, 10),
			updated: post.meta.updated?.slice(0, 10) ?? null,
			tags: post.meta.tags,
			description: post.meta.description ?? null
		}))
	};
}

/**
 * One heading's worth of the résumé, or the whole document. Section lookup is
 * substring on the heading text so "experience" reaches "Experience" without a
 * second address scheme; the section runs to the next heading of the same or
 * shallower level.
 */
export async function getResume(section?: string): Promise<ResumeDocument> {
	const url = `${SITES.seanbehan.url}/resume.md`;
	const object = await getResumeMarkdown();
	if (!object) return { url, text: null, updated: null };

	const text = await new Response(object.body).text();
	const updated = object.uploaded.toISOString();
	if (!section?.trim()) return { url, text, updated };

	return { url, text: sectionOf(text, section.trim()), updated };
}

function sectionOf(markdown: string, section: string): string | null {
	const lines = markdown.split('\n');
	const wanted = section.toLowerCase();
	let start = -1;
	let level = 0;
	for (let index = 0; index < lines.length; index++) {
		const heading = /^(#{1,6})\s+(.*)$/.exec(lines[index] ?? '');
		if (!heading) continue;
		if (start < 0) {
			if (heading[2]?.toLowerCase().includes(wanted)) {
				start = index;
				level = heading[1]?.length ?? 1;
			}
			continue;
		}
		if ((heading[1]?.length ?? 6) <= level) return lines.slice(start, index).join('\n').trim();
	}
	return start < 0 ? null : lines.slice(start).join('\n').trim();
}

/** The canonical identity record; see facts.ts for why it is not per-origin. */
export const getFacts = personFacts;

/** Used by ask.ts to keep a truncated résumé on the writing origin. */
export const resumeUrl = `${SITES.seanbehan.url}/resume.md`;
