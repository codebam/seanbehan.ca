import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHighlighter } from 'shiki';

/**
 * Syntax highlighting for fenced code blocks.
 *
 * mdsvex defaults to Prism, which ships no grammars of its own here — every
 * block logged "failed to load language <x>" and rendered unhighlighted. Shiki
 * is loaded once at build time instead, with only the languages the posts
 * actually use, so nothing is shipped to the browser.
 *
 * Both themes are baked into the same markup: shiki writes `--shiki-light` and
 * `--shiki-dark` custom properties per token and app.css picks one via
 * prefers-color-scheme. That keeps code blocks on the same no-JS theming
 * mechanism as the rest of the site.
 */
const LANGS = [
	'sh',
	'shell',
	'bash',
	'typescript',
	'javascript',
	'jsx',
	'svelte',
	'css',
	'nix',
	'rust',
	'toml',
	'ini',
	'sql',
	'nginx',
	'systemd'
];

/** Fence labels that are not shiki language ids. */
const ALIASES = { conf: 'ini' };

const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: LANGS
});

const loaded = new Set(highlighter.getLoadedLanguages());

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: {
		highlighter: (code, lang) => {
			const resolved = ALIASES[lang] ?? lang;
			const html = highlighter.codeToHtml(code, {
				// An unknown or missing label falls back to plain text rather than
				// throwing and failing the whole build.
				lang: resolved && loaded.has(resolved) ? resolved : 'plaintext',
				themes: { light: 'github-light', dark: 'github-dark' },
				defaultColor: false
			});
			return `{@html \`${escapeSvelte(html)}\`}`;
		}
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess({}), mdsvex(mdsvexOptions)],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),

		// SvelteKit registers the service worker in dev too, where its cache-first
		// strategy serves stale modules on reload. Register it ourselves in +layout.svelte
		// so it only runs in production builds.
		serviceWorker: {
			register: false
		}
	},

	extensions: ['.svelte', '.svx', '.md']
};

export default config;
