import { json } from '@sveltejs/kit';
import { render } from 'svelte/server';
import type { PostMeta } from '$lib/types';

export async function GET({ params }) {
	try {
		const post = await import(`../../../../posts/${params.slug}.md`);
		const metadata = post.metadata as PostMeta;
		const { html } = render(post.default);

		if (!metadata.title || !metadata.date) {
			return json({ error: 'Post metadata is invalid' }, { status: 400 });
		}

		return json({
			html,
			meta: metadata
		});
	} catch (error) {
		console.error(`Failed to load post content for ${params.slug}:`, error);
		return json({ error: 'Post not found' }, { status: 404 });
	}
}
