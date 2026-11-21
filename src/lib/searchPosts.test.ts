import { describe, expect, it } from 'vitest';
import { searchPosts } from './search';
import type { PostSummary } from './types';

const posts: PostSummary[] = [
	{
		path: '/posts/linux',
		slug: 'linux',
		meta: {
			title: 'Booting Linux',
			date: '2026-01-01',
			description: 'kernel startup',
			tags: ['linux'],
			draft: false
		}
	},
	{
		path: '/posts/garden',
		slug: 'garden',
		meta: { title: 'Composting', date: '2026-01-01', description: '', tags: [], draft: false }
	}
];

const bodies = new Map([
	['linux', 'the sbctl tool signs keys during boot'],
	['garden', 'carrot tops and coffee grounds']
]);

describe('searchPosts', () => {
	it('returns matching slugs with the title hit first', () => {
		expect(searchPosts('linux', posts, bodies)[0]).toBe('linux');
	});

	it('ranks a post through a term carried only by its body', () => {
		expect(searchPosts('sbctl', posts, bodies)).toContain('linux');
	});

	it('leaves out a post that matches nothing', () => {
		expect(searchPosts('zzzqqqxx', posts, bodies)).toEqual([]);
	});

	it('clamps the query the same way the ranker does', () => {
		expect(searchPosts('  booting   linux  ', posts, bodies)[0]).toBe('linux');
	});
});
