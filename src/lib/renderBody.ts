/**
 * A post body as an HTML string.
 *
 * The pages render Portable Text through Astro components, which is the right
 * thing there and useless here: the feed needs the markup as a string, in a
 * plain function, with no component tree to render into. `@portabletext/to-html`
 * covers the standard blocks and marks; code blocks are rendered as plain
 * `<pre><code>` rather than through the page's shiki highlighter.
 *
 * The feed has no stylesheet, so the inline `style` attributes and per-token
 * `<span>`s shiki writes are carried by every subscriber and read by none. The
 * words are the point — the fence label survives as the language class, and a
 * reader's own highlighting can still use it — so the feed stays full text
 * while the payload drops from a quarter megabyte to the post itself.
 */

import { toHTML, type PortableTextHtmlComponents } from '@portabletext/to-html';

/** Escape text content: the three characters that end a text run. */
const escapeText = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Escape an attribute value: everything text needs, plus the quote. */
const escapeAttribute = (value: string) => escapeText(value).replace(/"/g, '&quot;');

/** A dimension attribute only when the stored value is a positive integer. */
const positiveInteger = (value: unknown): number | undefined => {
	const number = typeof value === 'number' ? value : Number(value);
	return Number.isInteger(number) && number > 0 ? number : undefined;
};

/** `sh` on a code block becomes `class="language-sh"`, nothing else. */
const languageClass = (language: unknown) => {
	const label = typeof language === 'string' ? language.toLowerCase() : '';
	return /^[a-z0-9-]+$/.test(label) ? ` class="language-${label}"` : '';
};

/** What a Portable Text image node may carry, whichever era stored it. */
interface ImageNode {
	asset?: { url?: string } | null;
	src?: string;
	alt?: string | null;
	width?: number | string | null;
	height?: number | string | null;
}

/**
 * Render a body to HTML for the feed. Async is kept for the callers' sake even
 * though nothing here awaits any more.
 */
export async function renderBodyHtml(value: unknown): Promise<string> {
	if (!Array.isArray(value)) return '';

	const components: Partial<PortableTextHtmlComponents> = {
		types: {
			code: ({ value: node }) => {
				const block = node as { code?: unknown; language?: unknown };
				if (typeof block?.code !== 'string') return '';
				return `<pre><code${languageClass(block.language)}>${escapeText(block.code)}</code></pre>`;
			},
			// An image in a body is stored by the media library at `asset.url`;
			// the older import wrote `src`. The feed wants the same absolute URL
			// the site serves it from, which rssFeed.ts applies to the whole
			// document afterwards. Dimensions are optional — the content repair
			// adds them — and alt falls back to empty rather than dropping out.
			image: ({ value: node }) => {
				const block = node as ImageNode;
				const stored = block?.asset?.url;
				const src = typeof stored === 'string' && stored ? stored : block?.src;
				if (!src) return '';
				const alt = typeof block?.alt === 'string' ? block.alt : '';
				const width = positiveInteger(block?.width);
				const height = positiveInteger(block?.height);
				return (
					`<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}"` +
					(width ? ` width="${width}"` : '') +
					(height ? ` height="${height}"` : '') +
					' />'
				);
			}
		}
	};

	return toHTML(value, { components });
}
