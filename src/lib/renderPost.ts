import { render } from 'svelte/server';
import type { Component } from 'svelte';
import type { Heading } from './types';
import imageSizes from './imageSizes.json';

/**
 * Post bodies are authored in markdown, so the anchors come out of the renderer
 * bare. Send anything pointing off-site to a new tab, and carry the usual
 * noopener/noreferrer with it.
 */
export function externalLinksInNewTab(html: string): string {
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

/**
 * Stamp post-body images with everything markdown cannot express.
 *
 * `![alt](/img/x.webp)` renders as `<img src alt>` and nothing else, so the
 * browser reserves no space for the image and reflows the whole article when it
 * lands — and every image in a long post is fetched at once, in front of the
 * text. Dimensions come from src/lib/imageSizes.json, written by
 * tools/img/measure.mjs; an image with no entry there just keeps the markup it
 * had. `loading="lazy"` is safe on every one of these because a post body
 * begins with prose, never with an image above the fold.
 */
export function annotateImages(html: string): string {
	return html.replace(/<img\s+([^>]*?)\s*\/?>/g, (match, attrs: string) => {
		if (/\bwidth=|\bloading=/.test(attrs)) return match;

		const src = /\bsrc="([^"]+)"/.exec(attrs)?.[1];
		const size = src
			? (imageSizes as Record<string, { width: number; height: number }>)[src]
			: null;
		const dimensions = size ? ` width="${size.width}" height="${size.height}"` : '';

		return `<img ${attrs}${dimensions} loading="lazy" decoding="async" />`;
	});
}

/** Strip tags and decode the handful of entities a heading can contain. */
const headingText = (html: string) =>
	html
		.replace(/<[^>]+>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#3[59];/g, "'")
		.trim();

/**
 * The id a heading is linked by. Deliberately the same shape as the tag slugs:
 * lowercase, runs of anything but a letter or digit collapsed to one hyphen.
 */
export const headingId = (text: string) =>
	text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

/**
 * Give every h2 and h3 an id and a self-link, and return the list a table of
 * contents is built from.
 *
 * Markdown has no way to name a heading, so a reader could not link to a
 * section of a long post — and the posts that most need it (btrfs, nixos) are
 * the longest. h4 and below are left alone: they are detail inside a section,
 * not a place anyone links to.
 *
 * Duplicate titles get a numeric suffix, because two `#setup` anchors mean the
 * second one is unreachable.
 */
export function withHeadingAnchors(html: string): { html: string; headings: Heading[] } {
	const headings: Heading[] = [];
	const seen = new Map<string, number>();

	const withIds = html.replace(
		/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/g,
		(match, level: string, attrs: string | undefined, inner: string) => {
			// A heading that already carries an id was written as HTML by the
			// author; leave it exactly as it is.
			if (attrs && /\bid=/.test(attrs)) return match;

			const text = headingText(inner);
			const base = headingId(text);
			if (!base) return match;

			const count = seen.get(base) ?? 0;
			seen.set(base, count + 1);
			const id = count === 0 ? base : `${base}-${count + 1}`;

			headings.push({ id, text, level: Number(level) as 2 | 3 });

			return `<h${level}${attrs ?? ''} id="${id}"><a class="heading-anchor" href="#${id}">${inner}</a></h${level}>`;
		}
	);

	return { html: withIds, headings };
}

/**
 * Render an mdsvex-compiled markdown post to the HTML string the post page and
 * the RSS <content:encoded> element both show, with external links sent to a
 * new tab. `postModule` is what `import()` / `import.meta.glob` yields for a
 * `.md` file: a module whose `default` export is the compiled component.
 */
export function renderPostHtml(postModule: { default: Component }): string {
	const { html } = render(postModule.default);
	return annotateImages(externalLinksInNewTab(html));
}

/**
 * The post page's version: the same HTML, plus heading anchors and the list
 * they make. The feed deliberately does not get these — an anchor into a page
 * the reader is not on is noise in a feed reader.
 */
export function renderPostBody(postModule: { default: Component }): {
	html: string;
	headings: Heading[];
} {
	return withHeadingAnchors(renderPostHtml(postModule));
}
