import { describe, expect, it } from 'vitest';
import { buildRecords } from './search';
import type { PostSummary } from './types';

const makePost = (meta: Partial<PostSummary['meta']> = {}, slug = 'nixos'): PostSummary => ({
	path: `/posts/${slug}`,
	slug,
	meta: {
		title: 'NixOS Flakes',
		date: '2025-11-02',
		description: 'A description.',
		tags: ['nix', 'linux'],
		draft: false,
		...meta
	}
});

describe('buildRecords', () => {
	it('flattens a post into the five fields a query ranks', () => {
		const tags = ['nix', 'linux'];
		const body = 'The kernel asks the firmware for memory, then hands off to init.';
		const records = buildRecords([makePost({ tags })], new Map([['nixos', body]]));

		expect(records).toEqual([
			{
				slug: 'nixos',
				title: 'NixOS Flakes',
				description: 'A description.',
				tags,
				body
			}
		]);
	});

	it('keeps the posts in the order they were supplied', () => {
		const posts = [makePost({}, 'a'), makePost({}, 'b'), makePost({}, 'c')];
		expect(buildRecords(posts, new Map()).map((r) => r.slug)).toEqual(['a', 'b', 'c']);
	});

	it('uses an empty description when the post has none', () => {
		const missing = makePost();
		delete (missing.meta as { description?: string }).description;
		const nulled = makePost();
		(nulled.meta as { description: string | null }).description = null;

		const records = buildRecords([missing, nulled], new Map());
		expect(records.map((r) => r.description)).toEqual(['', '']);
	});

	it('gives every post an empty body when the bodies map is empty', () => {
		const posts = [makePost({}, 'nixos'), makePost({ title: 'Rust servers' }, 'rust-servers')];
		const records = buildRecords(posts, new Map());

		expect(records).toHaveLength(2);
		expect(records.every((r) => r.body === '')).toBe(true);
	});

	it('leaves the body empty for a slug the bodies map does not carry', () => {
		const posts = [makePost({}, 'nixos'), makePost({}, 'rust-servers')];
		const bodies = new Map([['nixos', 'a known body']]);
		expect(buildRecords(posts, bodies).map((r) => r.body)).toEqual(['a known body', '']);
	});

	it('identifies a record by slug alone, without building a url from path', () => {
		const [record] = buildRecords([makePost()], new Map());
		expect(Object.keys(record)).toEqual(['slug', 'title', 'description', 'tags', 'body']);
		expect(record.slug).toBe('nixos');
		expect(record).not.toHaveProperty('url');
		expect(record).not.toHaveProperty('path');
	});
});
