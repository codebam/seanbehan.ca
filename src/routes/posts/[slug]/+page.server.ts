import getPosts, { getAllTags } from '$lib/getPosts';
import { readSource, sourcePath } from '$lib/postSources';
import { readingMinutes } from '$lib/readingTime';
import { renderPostBody } from '$lib/renderPost';
import { slugifyTag } from '$lib/tags';
import type { BlogPost, Post, PostMeta } from '$lib/types';

/**
 * Every markdown file under /posts, including drafts. Drafts stay out of
 * getPosts() (lists, feed, sitemap) but the route has to name them here or
 * they are simply not in the build — which is why /posts/website 404'd even
 * though getPosts claimed a draft could be shared by URL.
 */
const postModules = import.meta.glob('/src/routes/posts/*.md');

export const entries = () =>
	Object.keys(postModules).map((path) => ({
		slug: path.slice('/src/routes/posts/'.length, -'.md'.length)
	}));

/** How many "keep reading" entries a post ends with. Two fills the row. */
const RELATED_LIMIT = 2;

/**
 * The posts either side of this one in the archive's order — newest first, so
 * `newer` is the entry above it and `older` the entry below. A draft is not in
 * the list at all, which is why the lookup can miss and both come back null.
 */
function siblings(posts: Post[], path: string) {
	const index = posts.findIndex((post) => post.path === path);
	if (index === -1) return { newer: null, older: null };
	return {
		newer: posts[index - 1] ?? null,
		older: posts[index + 1] ?? null
	};
}

/**
 * Posts sharing the most tags with this one, the newest first within a tie.
 * Sharing nothing means not being suggested — a "related" row of unrelated
 * posts is worse than no row, and the sibling links already cover "what else
 * is there".
 */
function related(posts: Post[], current: Post): Post[] {
	const tags = new Set((current.meta.tags ?? []).map(slugifyTag));
	if (tags.size === 0) return [];

	return posts
		.filter((post) => post.path !== current.path)
		.map((post) => ({
			post,
			shared: (post.meta.tags ?? []).filter((tag) => tags.has(slugifyTag(tag))).length
		}))
		.filter((entry) => entry.shared > 0)
		.sort(
			(a, b) =>
				b.shared - a.shared ||
				new Date(b.post.meta.date).getTime() - new Date(a.post.meta.date).getTime()
		)
		.slice(0, RELATED_LIMIT)
		.map((entry) => entry.post);
}

export async function load({ params }): Promise<{
	post: BlogPost;
	newer: Post | null;
	older: Post | null;
	related: Post[];
	publishedTagSlugs: string[];
}> {
	try {
		const post = await import(`../${params.slug}.md`);
		const metadata = post.metadata as PostMeta;
		const { html, headings } = renderPostBody(post);

		// Validate required metadata
		if (!metadata.title || !metadata.date) {
			throw new Error(`Post ${params.slug} is missing required metadata`);
		}

		const path = `/posts/${params.slug}`;
		const current: BlogPost = {
			path,
			meta: metadata,
			html,
			headings,
			readingMinutes: readingMinutes(await readSource(sourcePath(params.slug)))
		};

		const posts = await getPosts();
		const publishedTagSlugs = (await getAllTags()).map((t) => t.slug);

		return {
			post: current,
			...siblings(posts, path),
			related: related(posts, current),
			publishedTagSlugs
		};
	} catch (error) {
		console.error(`Failed to load post ${params.slug}:`, error);
		throw error;
	}
}
