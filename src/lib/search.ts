/**
 * Full-text search over the archive.
 *
 * Ranking runs here, on the server, rather than in the browser: the index has
 * to include the post bodies, and a reader should not download every word of
 * the archive in order to find one of them. The client's job shrinks to
 * asking for an order and applying it to the list the server already rendered,
 * so a reader with no JS still gets the whole archive in its published order.
 *
 * The scorer is the same fuse.js the site's client-side search used in the
 * SvelteKit era. EmDash ships its own FTS5 search (`search` from 'emdash'),
 * and it is not a bad engine — but it indexes only the fields marked
 * `searchable`, which leaves a post's tags out of the index entirely, and it
 * does not forgive a misspelling. Fuzzy over title, description, tags and
 * body is the behaviour the archive page has advertised, so it keeps living
 * here with the words it is ranking.
 */

import Fuse from 'fuse.js';
import type { PostSummary } from './types';

/** One post, flattened to the fields a query can hit. */
export interface SearchRecord {
	slug: string;
	title: string;
	description: string;
	tags: string[];
	body: string;
}

/**
 * The weights are the old client-side values — title outranks description and
 * tags, exactly as before — with body a notch below both. A word found once in
 * a six-hundred-line post is a weaker signal than the same word chosen as the
 * title or the one-line pitch.
 */
const options = {
	keys: [
		{ name: 'title', weight: 3 },
		{ name: 'description', weight: 1 },
		{ name: 'tags', weight: 1 },
		{ name: 'body', weight: 0.5 }
	],
	threshold: 0.4,
	minMatchCharLength: 2
};

/**
 * Pure and synchronous on purpose: the endpoint supplies the records and this
 * decides the order, so the test can exercise the ranking without a database.
 */
export function rank(query: string, records: SearchRecord[]): string[] {
	return new Fuse(records, options).search(query).map((match) => match.item.slug);
}

/**
 * Every published post, shaped for ranking.
 *
 * The bodies come out of the same query getPosts() already ran — it reads the
 * content to compute reading time — rather than a second round trip, because
 * these endpoints serve a small archive and the page's budget is one query,
 * not two.
 */
export function buildRecords(posts: PostSummary[], bodies: Map<string, string>) {
	return posts.map((post) => ({
		slug: post.slug,
		title: post.meta.title,
		description: post.meta.description ?? '',
		tags: post.meta.tags,
		body: bodies.get(post.slug) ?? ''
	}));
}

/** The ranked slugs for a query, best match first. */ export function searchPosts(
	query: string,
	posts: PostSummary[],
	bodies: Map<string, string>
) {
	return rank(query, buildRecords(posts, bodies));
}
