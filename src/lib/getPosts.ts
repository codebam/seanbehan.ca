import type { Post, PostMeta } from './types';

/**
 * Fetches and sorts all blog posts from the posts directory
 * @returns Promise<Post[]> - Array of posts sorted by date (newest first)
 * @throws Error if posts cannot be loaded or parsed
 */
export default async (): Promise<Post[]> => {
	try {
		const postModules = import.meta.glob('/src/routes/posts/*.md');

		if (Object.keys(postModules).length === 0) {
			console.warn('No blog posts found in /src/routes/posts/');
			return [];
		}

		const posts = await Promise.all(
			Object.entries(postModules).map(async ([path, resolver]) => {
				try {
					const module = (await resolver()) as { metadata: PostMeta };
					const { metadata } = module;

					// Validate required metadata fields
					if (!metadata.title || !metadata.date) {
						console.warn(`Post at ${path} is missing required metadata (title or date)`);
						return null;
					}

					const postPath = path.slice(11, -3); // Remove '/src/routes' and '.md'
					return { meta: metadata, path: postPath };
				} catch (error) {
					console.error(`Failed to load post at ${path}:`, error);
					return null;
				}
			})
		);

		// Filter out failed posts and sort by date
		const validPosts = posts.filter((post): post is Post => post !== null);

		return validPosts.sort((a, b) => {
			const dateA = new Date(a.meta.date).getTime();
			const dateB = new Date(b.meta.date).getTime();

			// Handle invalid dates
			if (isNaN(dateA) || isNaN(dateB)) {
				console.warn('Invalid date found in post metadata');
				return 0;
			}

			return dateB - dateA; // Newest first
		});
	} catch (error) {
		console.error('Failed to load posts:', error);
		throw new Error('Unable to load blog posts');
	}
};
