import { render } from 'svelte/server';
import type { Component } from 'svelte';

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
 * Render an mdsvex-compiled markdown post to the HTML string the post page and
 * the RSS <content:encoded> element both show, with external links sent to a
 * new tab. `postModule` is what `import()` / `import.meta.glob` yields for a
 * `.md` file: a module whose `default` export is the compiled component.
 */
export function renderPostHtml(postModule: { default: Component }): string {
	const { html } = render(postModule.default);
	return externalLinksInNewTab(html);
}
