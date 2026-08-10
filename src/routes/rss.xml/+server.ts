import getPosts from '$lib/getPosts';
import { generateRSSFeed } from '$lib/rssFeed';
import { renderPostHtml } from '$lib/renderPost';

export const prerender = true;

const postModules = import.meta.glob('/src/routes/posts/*.md');

export const GET = async () => {
	const posts = await getPosts();
	const postHtml = new Map<string, string>();

	await Promise.all(
		posts.map(async (post) => {
			const module = (await postModules[`/src/routes${post.path}.md`]()) as {
				default: import('svelte').Component;
			};
			postHtml.set(post.path, renderPostHtml(module));
		})
	);

	const body = generateRSSFeed(posts, postHtml);

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
