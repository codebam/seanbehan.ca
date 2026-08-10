import { render } from 'svelte/server';
import { readSource, sourcePath } from '$lib/postSources';
import { readingMinutes } from '$lib/readingTime';
import type { BlogPost, PostMeta } from '$lib/types';

/**
 * Post bodies are authored in markdown, so the anchors come out of the renderer
 * bare. Send anything pointing off-site to a new tab, and carry the usual
 * noopener/noreferrer with it.
 */
function externalLinksInNewTab(html: string): string {
	return html.replace(/<a\s+([^>]*href="https?:\/\/[^"]*"[^>]*)>/gi, (match, attrs: string) => {
		if (/\btarget=/i.test(attrs)) return match;
		const rel = /\brel="([^"]*)"/i.exec(attrs);
		if (rel) {
			const values = new Set([...rel[1].split(/\s+/).filter(Boolean), 'noopener', 'noreferrer']);
			attrs = attrs.replace(rel[0], `rel="${[...values].join(' ')}"`);
		} else {
			attrs = `${attrs} rel="noopener noreferrer"`;
		}
		return `<a ${attrs} target="_blank">`;
	});
}

export async function load({ params }): Promise<{ post: BlogPost }> {
	try {
		const post = await import(`../${params.slug}.md`);
		const metadata = post.metadata as PostMeta;
		const { html } = render(post.default);
		const htmlWithExternalLinks = externalLinksInNewTab(html);

		// Validate required metadata
		if (!metadata.title || !metadata.date) {
			throw new Error(`Post ${params.slug} is missing required metadata`);
		}

		return {
			post: {
				path: `/posts/${params.slug}`,
				meta: metadata,
				html: htmlWithExternalLinks,
				readingMinutes: readingMinutes(await readSource(sourcePath(params.slug)))
			}
		};
	} catch (error) {
		console.error(`Failed to load post ${params.slug}:`, error);
		throw error;
	}
}
