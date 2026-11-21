import Fuse from 'fuse.js';
import { describe, expect, it, vi } from 'vitest';
import type { PostSummary } from './types';
import { MAX_QUERY_LENGTH, buildRecords, searchPosts } from './search';

const post = (
	slug: string,
	title: string,
	tags: string[] = [],
	description?: string
): PostSummary => ({
	path: `/posts/${slug}`,
	slug,
	meta: { title, date: '2025-11-02T10:00:00Z', description, tags, draft: false }
});

const posts = [
	post('booting-linux', 'Booting Linux the slow way', ['linux'], 'What happens before a shell.'),
	post('garden', 'Composting in a cold climate')
];

const bodies = new Map([
	['booting-linux', 'The kernel asks the firmware for memory.'],
	['garden', 'Carrot tops and coffee grounds.']
]);

describe('buildRecords', () => {
	it('flattens a post to exactly the fields the ranker reads', () => {
		expect(buildRecords([posts[0]], bodies)).toEqual([
			{
				slug: 'booting-linux',
				title: 'Booting Linux the slow way',
				description: 'What happens before a shell.',
				tags: ['linux'],
				body: 'The kernel asks the firmware for memory.'
			}
		]);
	});

	it('defaults a missing description and body to empty strings', () => {
		expect(buildRecords([posts[1]], bodies)).toEqual([
			{
				slug: 'garden',
				title: 'Composting in a cold climate',
				description: '',
				tags: [],
				body: 'Carrot tops and coffee grounds.'
			}
		]);
		expect(buildRecords([posts[1]], new Map())[0].body).toBe('');
	});
});

describe('searchPosts', () => {
	it('returns ranked slugs from the supplied posts and bodies', () => {
		expect(searchPosts('linux', posts, bodies)[0]).toBe('booting-linux');
		expect(searchPosts('linux', posts, bodies)).not.toContain('garden');
	});

	it('finds a term carried only by a body the caller supplied', () => {
		expect(searchPosts('firmware', posts, bodies)).toEqual(['booting-linux']);
	});

	it('clamps an oversized query before ranking it', () => {
		const search = vi.spyOn(Fuse.prototype, 'search');
		try {
			expect(() => searchPosts('x'.repeat(10_000), posts, bodies)).not.toThrow();
			expect(search).toHaveBeenCalledWith('x'.repeat(MAX_QUERY_LENGTH));
		} finally {
			search.mockRestore();
		}
	});
});
