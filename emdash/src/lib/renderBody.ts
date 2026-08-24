/**
 * A post body as an HTML string.
 *
 * The pages render Portable Text through Astro components, which is the right
 * thing there and useless here: the feed needs the markup as a string, in a
 * plain function, with no component tree to render into. `@portabletext/to-html`
 * covers the standard blocks and marks; code blocks are handed to the same
 * shiki highlighter the post page uses, so a snippet reads the same in a feed
 * reader as it does on the site.
 */

import { toHTML, type PortableTextHtmlComponents } from '@portabletext/to-html';
import { highlight } from './highlight';

/**
 * Highlighting is async and `toHTML` is not, so the code blocks are rendered
 * first and looked up by key while the document is serialised.
 */
export async function renderBodyHtml(value: unknown): Promise<string> {
	if (!Array.isArray(value)) return '';

	const codeHtml = new Map<string, string>();
	await Promise.all(
		value
			.filter((block) => block?._type === 'code' && typeof block.code === 'string')
			.map(async (block) => {
				codeHtml.set(block._key, await highlight(block.code, block.language));
			})
	);

	const components: Partial<PortableTextHtmlComponents> = {
		types: {
			code: ({ value: node }) => codeHtml.get(node._key) ?? '',
			// An image in a body is stored by the media library; the feed wants the
			// same absolute URL the site serves it from, which rssFeed.ts applies
			// to the whole document afterwards.
			image: ({ value: node }) =>
				node?.src ? `<img src="${node.src}" alt="${node.alt ?? ''}" />` : ''
		}
	};

	return toHTML(value, { components });
}
