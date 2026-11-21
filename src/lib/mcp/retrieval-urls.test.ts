import { describe, expect, it, vi } from 'vitest';

/** The origin retrieval writes against, whatever Worker served the request. */
const { WRITING_ORIGIN, POSTS } = vi.hoisted(() => ({
	WRITING_ORIGIN: 'https://seanbehan.ca',
	POSTS: [
		{
			path: '/posts/nixos',
			slug: 'nixos',
			meta: {
				title: 'NixOS notes',
				date: '2026-01-02T00:00:00.000Z',
				updated: undefined,
				tags: ['nixos'],
				description: 'Notes on NixOS'
			}
		},
		{
			path: '/posts/matrix',
			slug: 'matrix',
			meta: {
				title: 'Matrix notes',
				date: '2026-02-03T00:00:00.000Z',
				updated: '2026-02-04T00:00:00.000Z',
				tags: ['matrix'],
				description: undefined
			}
		}
	]
}));

vi.mock('../site', () => ({
	SITES: {
		seanbehan: { url: WRITING_ORIGIN },
		codebam: { url: 'https://codebam.ca' }
	}
}));

vi.mock('../posts', () => ({
	getPosts: async () => ({ posts: POSTS, bodies: new Map() }),
	plainText: () => ''
}));

vi.mock('emdash', () => ({
	decodeSlug: (slug: string) => slug,
	getEmDashCollection: async () => ({ entries: [] }),
	getEmDashEntry: async () => ({ entry: null }),
	getEntryTerms: async () => []
}));

vi.mock('../markdown', () => ({ markdownDocument: () => '' }));
vi.mock('../resume', () => ({ getResumeMarkdown: async () => null }));
vi.mock('../search', () => ({ buildRecords: () => [], clampQuery: (query: string) => query }));
vi.mock('../tags', () => ({ slugifyTag: (value: string) => value }));
vi.mock('./facts', () => ({ personFacts: () => ({}) }));
vi.mock('./ranking', () => ({ rankedSlugs: () => [] }));

import { listPosts, resumeUrl } from './retrieval';

describe('writing-origin URL construction', () => {
	it('pins the resume URL to the writing origin', () => {
		expect(resumeUrl).toBe(`${WRITING_ORIGIN}/resume.md`);
	});

	it('builds each listed post URL from the writing origin and its path', async () => {
		const { posts } = await listPosts();
		expect(posts.map((post) => post.url)).toEqual([
			`${WRITING_ORIGIN}/posts/nixos`,
			`${WRITING_ORIGIN}/posts/matrix`
		]);
	});

	it('keeps the same URL construction for filtered and limited lists', async () => {
		const tagged = await listPosts('nixos');
		expect(tagged.posts.map((post) => post.url)).toEqual([`${WRITING_ORIGIN}/posts/nixos`]);

		const limited = await listPosts(undefined, 1);
		expect(limited.posts.map((post) => post.url)).toEqual([`${WRITING_ORIGIN}/posts/nixos`]);
	});
});
