/**
 * Syntax highlighting for the code blocks in a post.
 *
 * The SvelteKit site ran shiki inside mdsvex, at build time, over markdown
 * files. The words live in D1 now and pages render on a Worker, so the same
 * highlighter has to run per request — which rules out the default WASM
 * (Oniguruma) engine and the full grammar bundle. Instead: the JavaScript
 * regex engine, and only the languages the posts actually use, each imported
 * on its own so nothing else is in the Worker.
 *
 * The highlighter is created once per isolate and reused. Creating it is the
 * expensive part; highlighting a block afterwards is cheap.
 *
 * Both themes are baked into the same markup: shiki writes `--shiki-light`
 * and `--shiki-dark` custom properties per token and app.css picks one via
 * prefers-color-scheme. That keeps code blocks on the same no-JS theming
 * mechanism as the rest of the site.
 */

import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

/** Fence labels the posts use, mapped to the grammar that renders them. */
const LANGS = {
	sh: () => import('@shikijs/langs/shellscript'),
	shell: () => import('@shikijs/langs/shellscript'),
	bash: () => import('@shikijs/langs/shellscript'),
	shellscript: () => import('@shikijs/langs/shellscript'),
	typescript: () => import('@shikijs/langs/typescript'),
	javascript: () => import('@shikijs/langs/javascript'),
	jsx: () => import('@shikijs/langs/jsx'),
	svelte: () => import('@shikijs/langs/svelte'),
	css: () => import('@shikijs/langs/css'),
	html: () => import('@shikijs/langs/html'),
	json: () => import('@shikijs/langs/json'),
	yaml: () => import('@shikijs/langs/yaml'),
	nix: () => import('@shikijs/langs/nix'),
	rust: () => import('@shikijs/langs/rust'),
	toml: () => import('@shikijs/langs/toml'),
	ini: () => import('@shikijs/langs/ini'),
	sql: () => import('@shikijs/langs/sql'),
	nginx: () => import('@shikijs/langs/nginx'),
	systemd: () => import('@shikijs/langs/systemd'),
	dockerfile: () => import('@shikijs/langs/dockerfile'),
	diff: () => import('@shikijs/langs/diff')
} as const;

/** Fence labels that are not shiki language ids. */
const ALIASES: Record<string, keyof typeof LANGS> = {
	conf: 'ini',
	yml: 'yaml',
	docker: 'dockerfile',
	patch: 'diff'
};

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter() {
	highlighterPromise ??= createHighlighterCore({
		// Gruvbox, not GitHub: the theme's ground (#282828 / #fbf1c7) is the
		// warm ash and cream the palette is built from, and on this site's own
		// code ground (--panel) its worst token is 4.81:1 in the dark scheme,
		// where github-dark's was 3.35:1. Shiki only writes token colours here
		// (defaultColor: false), so the block keeps --panel under both
		// schemes.
		themes: [
			import('@shikijs/themes/gruvbox-light-medium'),
			import('@shikijs/themes/gruvbox-dark-medium')
		],
		langs: Object.values(LANGS),
		engine: createJavaScriptRegexEngine()
	});
	return highlighterPromise;
}

/**
 * A code block as highlighted HTML — a `<pre>` shiki produced, or the plain
 * one this returns for an unknown label. An unknown or missing label falls
 * back to plain text rather than throwing and failing the whole page.
 */
export async function highlight(code: string, lang?: string): Promise<string> {
	const label = lang?.toLowerCase() ?? '';
	const resolved = label in LANGS ? label : (ALIASES[label] ?? null);

	/*
	 * `data-language` is the fence's own label, carried on the <pre> so the
	 * stylesheet can caption the full-bleed block with it — a fact about the
	 * source, not something the page has to restate in markup. It rides the
	 * attribute name the style uses rather than a class, and it is only set
	 * when a fence had a label: a block without one gets no caption.
	 */
	const meta: Record<string, string> = {
		role: 'region',
		'aria-label': label ? `Code block: ${label}` : 'Code block'
	};
	if (label) meta['data-language'] = resolved ?? label;

	const highlighter = await getHighlighter();
	return highlighter.codeToHtml(code, {
		lang: resolved ?? 'plaintext',
		themes: { light: 'gruvbox-light-medium', dark: 'gruvbox-dark-medium' },
		defaultColor: false,
		// Shiki makes the <pre> focusable (tabindex="0") because a long line
		// can make it a scroll container. Dropping the tabindex would hurt the
		// keyboard reader who needs to reach that scroll, so the block keeps
		// it and gets the name the default omitted: an unlabelled tab stop
		// tells a screen reader nothing about what it just landed on. `meta`
		// entries become attributes on the <pre> shiki renders.
		meta
	});
}
