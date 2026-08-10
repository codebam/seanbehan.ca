import { readSource, sourcePath } from '$lib/postSources';
import { readingMinutes } from '$lib/readingTime';
import { renderPostHtml } from '$lib/renderPost';
import type { BlogPost, PostMeta } from '$lib/types';

export async function load({ params }): Promise<{ post: BlogPost }> {
	try {
		const post = await import(`../${params.slug}.md`);
		const metadata = post.metadata as PostMeta;
		const html = renderPostHtml(post);

		// Validate required metadata
		if (!metadata.title || !metadata.date) {
			throw new Error(`Post ${params.slug} is missing required metadata`);
		}

		return {
			post: {
				path: `/posts/${params.slug}`,
				meta: metadata,
				html,
				readingMinutes: readingMinutes(await readSource(sourcePath(params.slug)))
			}
		};
	} catch (error) {
		console.error(`Failed to load post ${params.slug}:`, error);
		throw error;
	}
}
