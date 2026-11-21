import { describe, expect, it } from 'vitest';
import { buildRecords, searchPosts } from './search';
import type { PostSummary } from './types';

const post = (slug: string, title: string, tags: string[], description?: string): PostSummary => ({
	path: `/posts/${slug}`,
	slug,
	meta: { title, date: '2026-01-01', description, tags, draft: false }
});

const posts = [
	post('booting-linux', 'Booting Linux the slow way', ['linux'], 'What happens before a shell.'),
	post('rust-servers', 'Rust for people who run web servers', ['systemd']),
	post('garden', 'Composting in a cold climate', [])
];

const bodies = new Map([
	['booting-linux', 'The kernel asks the firmware for memory.'],
	['rust-servers', 'linux kernels, linux panics, linux all day.'],
	['garden', 'Carrot tops and coffee grounds.']
]);

describe('buildRecords', () => {
	it('flattens each post into the fields the ranker reads, in order', () => {
		expect(buildRecords(posts, bodies)).toEqual([
			{
				slug: 'booting-linux',
				title: 'Booting Linux the slow way',
				description: 'What happens before a shell.',
				tags: ['linux'],
				body: 'The kernel asks the firmware for memory.'
			},
			{
				slug: 'rust-servers',
				title: 'Rust for people who run web servers',
				description: '',
				tags: ['systemd'],
				body: 'linux kernels, linux panics, linux all day.'
			},
			{
				slug: 'garden',
				title: 'Composting in a cold climate',
				description: '',
				tags: [],
				body: 'Carrot tops and coffee grounds.'
			}
		]);
	});

	it('uses empty strings for a missing description or body', () => {
		const [record] = buildRecords([post('bare', 'Bare post', [])], new Map());
		expect(record).toEqual({
			slug: 'bare',
			title: 'Bare post',
			description: '',
			tags: [],
			body: ''
		});
	});

	it('returns no records for no posts', () => {
		expect(buildRecords([], bodies)).toEqual([]);
	});
});

describe('searchPosts', () => {
	it('ranks a title hit above a body-only hit for the same word', () => {
		const slugs = searchPosts('linux', posts, bodies);
		expect(slugs.indexOf('booting-linux')).toBeLessThan(slugs.indexOf('rust-servers'));
	});

	it('matches a tag that no prose mentions', () => {
		expect(searchPosts('systemd', posts, bodies)).toContain('rust-servers');
	});

	it('leaves out a post that matches nothing', () => {
		expect(searchPosts('quantum entanglement', posts, bodies)).not.toContain('garden');
	});

	it('trims the query on its way to the ranker', () => {
		const slugs = searchPosts('  composting  ', posts, bodies);
		expect(slugs[0]).toBe('garden');
		expect(slugs).toEqual(searchPosts('composting', posts, bodies));
	});

	it('answers an empty list when there are no posts', () => {
		expect(searchPosts('linux', [], bodies)).toEqual([]);
	});
});
