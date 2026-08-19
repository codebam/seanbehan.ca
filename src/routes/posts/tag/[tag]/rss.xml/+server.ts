import { getAllTags, getPostsByTag } from '$lib/getPosts';
import { generateRSSFeed } from '$lib/rssFeed';
import { renderPostHtml } from '$lib/renderPost';
import { site } from '$lib/site';
import { displayTag, slugifyTag } from '$lib/tags';
import { error } from '@sveltejs/kit';

export const prerender = true;

/**
 * One feed per topic, so a reader who wants the NixOS posts and not the rest
 * can subscribe to exactly that. The tag pages link theirs with a
 * <link rel="alternate">, which is how a reader's extension finds it.
 */
export const entries = async () => (await getAllTags()).map(({ slug }) => ({ tag: slug }));

const postModules = import.meta.glob('/src/routes/posts/*.md');

export const GET = async ({ params }) => {
	const posts = await getPostsByTag(params.tag);
	if (posts.length === 0) error(404, `No posts tagged "${params.tag}"`);

	const postHtml = new Map<string, string>();
	await Promise.all(
		posts.map(async (post) => {
			const module = (await postModules[`/src/routes${post.path}.md`]()) as {
				default: import('svelte').Component;
			};
			postHtml.set(post.path, renderPostHtml(module));
		})
	);

	// The display form of the tag, taken from the posts rather than the URL, so
	// the channel title reads "NixOS" and not "nixos".
	const label = displayTag(
		posts[0].meta.tags?.find((tag) => slugifyTag(tag) === slugifyTag(params.tag)) ?? params.tag
	);

	const body = generateRSSFeed(posts, postHtml, {
		path: `/posts/tag/${params.tag}/rss.xml`,
		title: `${site.name} — ${label}`,
		description: `Posts tagged “${label}”.`,
		link: `/posts/tag/${params.tag}`
	});

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
