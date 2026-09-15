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
	minMatchCharLength: 2,
	/*
	 * Fuse scores a match partly by where it is: by default the first 100
	 * characters hold all the weight, and title/description/tags do not cover a
	 * term buried in a 600-line post. Live, that made `toolbox`, `sbctl` and
	 * `authentication` — each in a body on this site — answer "0 of 25". The
	 * field asks for full text, so position carries no signal here.
	 */
	ignoreLocation: true
};

/**
 * The shortest query either search path answers. One character is a real
 * prefix search, and the no-JS form has always accepted it, so /search.json
 * must not invent a stricter rule of its own — that mismatch made `/posts?q=r`
 * say "6 of 25 match" while a browser with JS hid every card. Both paths call
 * this one predicate so the floor cannot drift apart again.
 */
export const MIN_QUERY_LENGTH = 1;

/**
 * The longest query the ranker or a cache key will look at. Anyone can put an
 * enormous string in `?q=`; without a ceiling each one costs a fresh Fuse scan
 * and can become a fresh edge-cache entry. Truncation is deliberate — a reader
 * past 128 characters has stopped typing a search, not lost a result.
 */
export const MAX_QUERY_LENGTH = 128;

/**
 * Bound every query before it reaches Fuse or a cache key. Trims, collapses
 * runs of whitespace to one space (Fuse tokenizes on it anyway) and slices at
 * MAX_QUERY_LENGTH. A long query is truncated, never rejected: the only floor
 * is MIN_QUERY_LENGTH, and callers still answer anything above it.
 */
export function clampQuery(query: string): string {
	return query.trim().replace(/\s+/g, ' ').slice(0, MAX_QUERY_LENGTH);
}

/**
 * Whether either search path should rank this query at all. One character is
 * the floor; a long query stays searchable and is truncated by clampQuery on
 * its way to the ranker.
 */
export const isSearchableQuery = (query: string) => clampQuery(query).length >= MIN_QUERY_LENGTH;

/**
 * Pure and synchronous on purpose: the endpoint supplies the records and this
 * decides the order, so the test can exercise the ranking without a database.
 * The clamp lives here, not at the two callers, so a new caller cannot hand
 * Fuse an unbounded pattern.
 */
export function rank(query: string, records: SearchRecord[]): string[] {
	return new Fuse(records, options).search(clampQuery(query)).map((match) => match.item.slug);
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
