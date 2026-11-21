import { describe, expect, it } from 'vitest';
import { buildRecords, searchPosts } from './search';
import type { PostSummary } from './types';

const post = (
	slug: string,
	title: string,
	meta: Partial<PostSummary['meta']> = {}
): PostSummary => ({
	path: `/posts/${slug}`,
	slug,
	meta: {
		title,
		date: '2026-01-01',
		tags: [],
		draft: false,
		...meta
	}
});

describe('buildRecords', () => {
	it('flattens each post with the body the endpoint already read', () => {
		const posts = [
			post('booting-linux', 'Booting Linux', {
				description: 'What happens between power-on and a shell.',
				tags: ['linux']
			})
		];
		const bodies = new Map([['booting-linux', 'The kernel asks firmware for memory.']]);

		expect(buildRecords(posts, bodies)).toEqual([
			{
				slug: 'booting-linux',
				title: 'Booting Linux',
				description: 'What happens between power-on and a shell.',
				tags: ['linux'],
				body: 'The kernel asks firmware for memory.'
			}
		]);
	});

	it('gives Fuse empty strings instead of undefined for optional fields', () => {
		expect(buildRecords([post('bare', 'Bare post')], new Map())).toEqual([
			{ slug: 'bare', title: 'Bare post', description: '', tags: [], body: '' }
		]);
	});

	it('keeps post order and ignores bodies with no matching post', () => {
		const posts = [post('first', 'First'), post('second', 'Second')];
		const bodies = new Map([['orphan', 'No post by this slug']]);

		expect(buildRecords(posts, bodies).map((record) => record.slug)).toEqual(['first', 'second']);
	});
});

describe('searchPosts', () => {
	const posts = [
		post('kernel', 'Linux kernel internals', {
			description: 'How the kernel boots',
			tags: ['linux']
		}),
		post('garden', 'Composting in a cold climate', { tags: ['garden'] })
	];
	const bodies = new Map([
		['kernel', 'Memory, init and systemd arrive after firmware.'],
		['garden', 'A bin that never fully freezes.']
	]);

	it('returns ranked slugs only, with a title hit ahead of a body hit', () => {
		const withBodyHit = new Map(bodies).set('garden', 'Linux is not mentioned in this post.');

		expect(searchPosts('linux', posts, withBodyHit)).toEqual(['kernel', 'garden']);
	});

	it('answers with an empty ordering when no record matches', () => {
		expect(searchPosts('zzqvx', posts, bodies)).toEqual([]);
	});

	it('finds a post through a tag even when its prose stays silent', () => {
		expect(searchPosts('gardening', posts, bodies)).toEqual(['garden']);
	});
});
