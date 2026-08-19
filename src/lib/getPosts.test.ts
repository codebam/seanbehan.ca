import { describe, it, expect } from 'vitest';
import getPosts, { getAllTags, getPostsByTag } from './getPosts';
import { displayTag, slugifyTag } from './tags';

describe('getPosts', () => {
	it('should return an array of posts', async () => {
		const posts = await getPosts();
		expect(Array.isArray(posts)).toBe(true);
	});

	it('should return posts with correct structure', async () => {
		const posts = await getPosts();
		if (posts.length > 0) {
			const post = posts[0];
			expect(post).toHaveProperty('path');
			expect(post).toHaveProperty('meta');
			expect(post.meta).toHaveProperty('title');
			expect(post.meta).toHaveProperty('date');
			expect(post.meta).toHaveProperty('draft');
			expect(post.readingMinutes).toBeGreaterThanOrEqual(1);
			expect(Number.isInteger(post.readingMinutes)).toBe(true);
		}
	});

	it('should sort posts by date (newest first)', async () => {
		const posts = await getPosts();
		if (posts.length > 1) {
			const firstPostDate = new Date(posts[0].meta.date);
			const secondPostDate = new Date(posts[1].meta.date);
			expect(firstPostDate.getTime()).toBeGreaterThanOrEqual(secondPostDate.getTime());
		}
	});

	it('should filter out posts with invalid metadata', async () => {
		const posts = await getPosts();
		posts.forEach((post) => {
			expect(post.meta.title).toBeTruthy();
			expect(post.meta.date).toBeTruthy();
			expect(typeof post.meta.draft).toBe('boolean');
		});
	});
});

describe('slugifyTag', () => {
	it('lowers case and folds whitespace into a single hyphen', () => {
		expect(slugifyTag('Secure Boot')).toBe('secure-boot');
		expect(slugifyTag('NixOS')).toBe('nixos');
		expect(slugifyTag('  cloudflare   workers  ')).toBe('cloudflare-workers');
	});
});

describe('displayTag', () => {
	it('titles known proper nouns and leaves unknown tags alone', () => {
		expect(displayTag('nixos')).toBe('NixOS');
		expect(displayTag('Secure Boot')).toBe('Secure Boot');
		expect(displayTag('advice')).toBe('advice');
	});
});

describe('getAllTags', () => {
	it('returns distinct tags with a slug and a positive count', async () => {
		const tags = await getAllTags();
		const slugs = new Set(tags.map((t) => t.slug));
		expect(slugs.size).toBe(tags.length);
		tags.forEach((t) => {
			expect(t.count).toBeGreaterThan(0);
			expect(t.slug).toBe(t.slug.toLowerCase());
		});
		expect(tags.find((t) => t.slug === 'nixos')?.tag).toBe('NixOS');
	});

	it('sorts most-tagged first', async () => {
		const tags = await getAllTags();
		for (let i = 1; i < tags.length; i++) {
			expect(tags[i - 1].count).toBeGreaterThanOrEqual(tags[i].count);
		}
	});
});

describe('getPostsByTag', () => {
	it('matches case-insensitively and across space/hyphen forms', async () => {
		const tags = await getAllTags();
		if (tags.length === 0) return;
		const slug = tags[0].slug;
		const upper = slug.toUpperCase();
		const spaced = slug.replace(/-/g, ' ').toUpperCase();
		const bySlug = await getPostsByTag(slug);
		const byUpper = await getPostsByTag(upper);
		const bySpaced = await getPostsByTag(spaced);
		expect(byUpper.map((p) => p.path)).toEqual(bySlug.map((p) => p.path));
		expect(bySpaced.map((p) => p.path)).toEqual(bySlug.map((p) => p.path));
	});

	it('returns exactly the posts whose tag slug matches, newest first', async () => {
		const tags = await getAllTags();
		if (tags.length === 0) return;
		const posts = await getPostsByTag(tags[0].slug);
		expect(posts.length).toBe(tags[0].count);
		posts.forEach((p) => {
			expect((p.meta.tags ?? []).map(slugifyTag)).toContain(tags[0].slug);
		});
		for (let i = 1; i < posts.length; i++) {
			expect(new Date(posts[i - 1].meta.date).getTime()).toBeGreaterThanOrEqual(
				new Date(posts[i].meta.date).getTime()
			);
		}
	});

	it('returns an empty list for an unknown tag', async () => {
		const posts = await getPostsByTag('no-such-tag-anywhere');
		expect(posts).toEqual([]);
	});
});
