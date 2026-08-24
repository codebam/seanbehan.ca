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
	nix: () => import('@shikijs/langs/nix'),
	rust: () => import('@shikijs/langs/rust'),
	toml: () => import('@shikijs/langs/toml'),
	ini: () => import('@shikijs/langs/ini'),
	sql: () => import('@shikijs/langs/sql'),
	nginx: () => import('@shikijs/langs/nginx'),
	systemd: () => import('@shikijs/langs/systemd')
} as const;

/** Fence labels that are not shiki language ids. */
const ALIASES: Record<string, keyof typeof LANGS> = { conf: 'ini' };

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter() {
	highlighterPromise ??= createHighlighterCore({
		themes: [import('@shikijs/themes/github-light'), import('@shikijs/themes/github-dark')],
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

	const highlighter = await getHighlighter();
	return highlighter.codeToHtml(code, {
		lang: resolved ?? 'plaintext',
		themes: { light: 'github-light', dark: 'github-dark' },
		defaultColor: false
	});
}
