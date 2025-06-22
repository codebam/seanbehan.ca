import { render } from 'svelte/server';
import type { BlogPost, PostMeta } from '$lib/types';

export async function load({ params }): Promise<{ post: BlogPost }> {
	try {
		const post = await import(`../${params.slug}.md`);
		const metadata = post.metadata as PostMeta;
		const { html } = render(post.default);

		// Validate required metadata
		if (!metadata.title || !metadata.date) {
			throw new Error(`Post ${params.slug} is missing required metadata`);
		}

		return {
			post: {
				path: `/posts/${params.slug}`,
				meta: metadata,
				html
			}
		};
	} catch (error) {
		console.error(`Failed to load post ${params.slug}:`, error);
		throw error;
	}
}
