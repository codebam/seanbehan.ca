/**
 * The whole-site feed: every published post, full text.
 *
 * Bodies are rendered here rather than linked to, because a reader that shows
 * the post in place is the point of publishing a feed at all. The response is
 * cacheable for an hour — the feed changes when a post does, and an hour is
 * shorter than the gap between posts by some margin.
 */
import type { APIRoute } from 'astro';
import { generateRSSFeed } from '../lib/rssFeed';
import { renderBodyHtml } from '../lib/renderBody';
import { getPosts } from '../lib/posts';

export const GET: APIRoute = async () => {
	// One query, not two: the archive fetch already carried each entry's
	// Portable Text, so `includeContent` keeps it instead of throwing it away
	// and asking D1 for the same rows again.
	const { posts, content } = await getPosts({ includeBodies: false, includeContent: true });

	const postHtml = new Map<string, string>();
	await Promise.all(
		posts.map(async (post) => {
			postHtml.set(post.path, await renderBodyHtml(content.get(post.slug)));
		})
	);

	return new Response(generateRSSFeed(posts, postHtml), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
