import Fuse from 'fuse.js';
import { describe, expect, it, vi } from 'vitest';
import { buildRecords, searchPosts } from './search';
import type { PostSummary } from './types';

const post = (slug: string, title: string, tags: string[], description?: string): PostSummary => ({
	path: `/posts/${slug}`,
	slug,
	meta: { title, date: '2026-01-01', description, tags, draft: false }
});

const posts = [
	post('linux-boot', 'Booting Linux the slow way', ['linux', 'kernel'], 'Firmware to init.'),
	post('garden', 'Composting in a cold climate', [], 'Carrot tops and coffee grounds.')
];

const bodies = new Map([
	['linux-boot', 'The kernel asks the firmware for memory, then hands off to init.'],
	['garden', 'A bin that never fully freezes.']
]);

describe('buildRecords', () => {
	it('flattens each summary and its body into one searchable record', () => {
		expect(buildRecords(posts, bodies)).toEqual([
			{
				slug: 'linux-boot',
				title: 'Booting Linux the slow way',
				description: 'Firmware to init.',
				tags: ['linux', 'kernel'],
				body: 'The kernel asks the firmware for memory, then hands off to init.'
			},
			{
				slug: 'garden',
				title: 'Composting in a cold climate',
				description: 'Carrot tops and coffee grounds.',
				tags: [],
				body: 'A bin that never fully freezes.'
			}
		]);
	});

	it('uses an empty description and body when the archive has none for a post', () => {
		const summary = post('bare', 'A bare post', []);
		expect(buildRecords([summary], new Map())).toEqual([
			{ slug: 'bare', title: 'A bare post', description: '', tags: [], body: '' }
		]);
	});

	it('leaves the summaries and the body map untouched', () => {
		const snapshot = structuredClone(posts);
		const bodySnapshot = [...bodies];
		buildRecords(posts, bodies);
		expect(posts).toEqual(snapshot);
		expect([...bodies]).toEqual(bodySnapshot);
	});
});

describe('searchPosts', () => {
	it('ranks a title hit ahead of a body-only hit', () => {
		const ranked = searchPosts('kernel', posts, bodies);
		expect(ranked[0]).toBe('linux-boot');
		expect(ranked).not.toContain('garden');
	});

	it('finds a post through a word only its body carries', () => {
		expect(searchPosts('freezes', posts, bodies)).toContain('garden');
	});

	it('matches a tag that no prose mentions', () => {
		expect(searchPosts('kernel', posts, new Map())).toContain('linux-boot');
	});

	it('clamps the query before handing it to the ranker', () => {
		const search = vi.spyOn(Fuse.prototype, 'search');
		try {
			searchPosts('  kernel  ', posts, bodies);
			expect(search).toHaveBeenCalledWith('kernel');
		} finally {
			search.mockRestore();
		}
	});
});
