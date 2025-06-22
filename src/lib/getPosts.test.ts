import { describe, it, expect } from 'vitest';
import getPosts from './getPosts';

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
