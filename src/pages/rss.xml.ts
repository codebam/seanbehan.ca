/**
 * The whole-site feed: every published post, full text.
 *
 * Bodies are rendered here rather than linked to, because a reader that shows
 * the post in place is the point of publishing a feed at all. The response is
 * cacheable for an hour — the feed changes when a post does, and an hour is
 * shorter than the gap between posts by some margin.
 */
import type { APIRoute } from 'astro';
import { getEmDashCollection } from 'emdash';
import { generateRSSFeed } from '../lib/rssFeed';
import { renderBodyHtml } from '../lib/renderBody';
import { getPosts } from '../lib/posts';

export const GET: APIRoute = async () => {
	const { posts } = await getPosts();

	// One query for the bodies: getPosts() summarises entries and drops the
	// Portable Text, which is all this needs from them.
	const { entries } = await getEmDashCollection('posts', {
		status: 'published',
		orderBy: { published_at: 'desc' },
		limit: 200
	});
	const bodies = new Map(entries.map((entry) => [`/posts/${entry.id}`, entry.data.content]));

	const postHtml = new Map<string, string>();
	await Promise.all(
		posts.map(async (post) => {
			postHtml.set(post.path, await renderBodyHtml(bodies.get(post.path)));
		})
	);

	return new Response(generateRSSFeed(posts, postHtml), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
