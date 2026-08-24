/**
 * One feed per topic, so a reader who wants the NixOS posts and not the rest
 * can subscribe to exactly that. The tag pages link theirs with a
 * <link rel="alternate">, which is how a reader's extension finds it.
 */
import type { APIRoute } from 'astro';
import { getEmDashCollection } from 'emdash';
import { generateRSSFeed } from '../../../../lib/rssFeed';
import { renderBodyHtml } from '../../../../lib/renderBody';
import { getPosts } from '../../../../lib/posts';
import { displayTag, slugifyTag } from '../../../../lib/tags';
import { site } from '../../../../lib/site';

export const GET: APIRoute = async ({ params }) => {
	const target = slugifyTag(params.tag!);
	const { posts: all } = await getPosts();
	const posts = all.filter((post) => post.meta.tags.some((tag) => slugifyTag(tag) === target));

	if (posts.length === 0) {
		return new Response(`No posts tagged "${params.tag}"`, { status: 404 });
	}

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

	// The display form of the tag, taken from the posts rather than the URL, so
	// the channel title reads "NixOS" and not "nixos".
	const label = displayTag(
		posts[0].meta.tags.find((tag) => slugifyTag(tag) === target) ?? target
	);

	return new Response(
		generateRSSFeed(posts, postHtml, {
			path: `/posts/tag/${target}/rss.xml`,
			title: `${site.name} — ${label}`,
			description: `Posts tagged “${label}”.`,
			link: `/posts/tag/${target}`
		}),
		{
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'max-age=3600'
			}
		}
	);
};
