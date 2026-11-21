import { describe, expect, it } from 'vitest';
import { buildRecords } from './search';
import type { PostSummary } from './types';

const post = (meta: Partial<PostSummary['meta']> = {}, slug = 'example'): PostSummary => ({
	path: `/posts/${slug}`,
	slug,
	meta: {
		title: 'Example post',
		date: '2026-01-01',
		tags: [],
		draft: false,
		...meta
	}
});

describe('buildRecords', () => {
	it('flattens a post into the fields a query can hit', () => {
		const posts = [
			post({
				title: 'Booting Linux',
				description: 'From power-on to a shell.',
				tags: ['linux']
			})
		];
		const bodies = new Map([['example', 'The kernel asks the firmware for memory.']]);

		expect(buildRecords(posts, bodies)).toEqual([
			{
				slug: 'example',
				title: 'Booting Linux',
				description: 'From power-on to a shell.',
				tags: ['linux'],
				body: 'The kernel asks the firmware for memory.'
			}
		]);
	});

	it('defaults a missing description and body to empty strings', () => {
		expect(buildRecords([post()], new Map())).toEqual([
			{ slug: 'example', title: 'Example post', description: '', tags: [], body: '' }
		]);
	});

	it('looks a body up by slug, not by the /posts/... path', () => {
		// getPosts keys its bodies map by entry.id, which is the slug.
		const bodies = new Map([['example', 'body by slug']]);

		expect(buildRecords([post()], bodies)[0].body).toBe('body by slug');
	});

	it('keeps post order and leaves its inputs untouched', () => {
		const posts = [post({}, 'b'), post({}, 'a')];
		const bodies = new Map([
			['b', 'B'],
			['a', 'A']
		]);
		const postsBefore = structuredClone(posts);
		const bodiesBefore = new Map(bodies);

		const records = buildRecords(posts, bodies);

		expect(records.map((record) => record.slug)).toEqual(['b', 'a']);
		expect(posts).toEqual(postsBefore);
		expect(bodies).toEqual(bodiesBefore);
	});
});
