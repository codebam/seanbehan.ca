import { readSource } from './postSources';
import { readingMinutes } from './readingTime';
import { slugifyTag } from './tags';
import type { Post, PostMeta } from './types';

/**
 * Fetches and sorts all blog posts from the posts directory
 * @returns Promise<Post[]> - Array of posts sorted by date (newest first)
 * @throws Error if posts cannot be loaded or parsed
 */
export default async function getPosts(): Promise<Post[]> {
	try {
		const postModules = import.meta.glob('/src/routes/posts/*.md');

		if (Object.keys(postModules).length === 0) {
			console.warn('No blog posts found in /src/routes/posts/');
			return [];
		}

		const posts = await Promise.all(
			// The annotation is load-bearing: without it the inferred element type
			// has readingMinutes as required, and the `post is Post` predicate
			// below stops being assignable to it now that the field is optional.
			Object.entries(postModules).map(async ([path, resolver]): Promise<Post | null> => {
				try {
					const module = (await resolver()) as { metadata: PostMeta };
					const { metadata } = module;

					// Validate required metadata fields
					if (!metadata.title || !metadata.date) {
						console.warn(`Post at ${path} is missing required metadata (title or date)`);
						return null;
					}

					// Drafts stay out of every list, the RSS feed and the sitemap. The
					// route itself still renders, so a draft can be shared by URL.
					if (metadata.draft) return null;

					const postPath = path.slice(11, -3); // Remove '/src/routes' and '.md'
					return {
						meta: metadata,
						path: postPath,
						readingMinutes: readingMinutes(await readSource(path))
					};
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
		throw new Error('Unable to load blog posts', { cause: error });
	}
}

/** One topic tag as it appears on the /posts/tags index. */
export interface TagInfo {
	/** The display form (first-seen casing, e.g. "Secure Boot"). */
	tag: string;
	/** URL-safe form: lowercase, spaces to hyphens ("secure-boot"). */
	slug: string;
	/** How many posts carry this tag. */
	count: number;
}

/**
 * Every distinct tag across the posts, with how many posts carry it. Sorted by
 * frequency first, then alphabetically within a tie, so the index reads as a
 * topic cloud rather than an arbitrary list.
 */
export const getAllTags = async (): Promise<TagInfo[]> => {
	const posts = await getPosts();
	const bySlug = new Map<string, TagInfo>();

	for (const post of posts) {
		for (const rawTag of post.meta.tags ?? []) {
			const slug = slugifyTag(rawTag);
			const existing = bySlug.get(slug);
			if (existing) existing.count += 1;
			else bySlug.set(slug, { tag: rawTag, slug, count: 1 });
		}
	}

	return [...bySlug.values()].sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
};

/**
 * Posts carrying a given tag, matched on the tag's slug so the lookup is
 * case-insensitive ("NixOS" and "nixos" hit the same page). The result keeps
 * getPosts' ordering — newest first. An unknown tag yields an empty list.
 */
export const getPostsByTag = async (tagSlug: string): Promise<Post[]> => {
	const target = slugifyTag(tagSlug);
	const posts = await getPosts();
	return posts.filter((post) => (post.meta.tags ?? []).some((t) => slugifyTag(t) === target));
};
