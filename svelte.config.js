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
		// The adapter's default exclude list names every prerendered page one by
		// one, which for a site with 50 posts overflows Cloudflare's 100-rule
		// limit on _routes.json. The adapter then drops the overflow — "Dropping
		// 41 exclude rules" in the build log — and every post is served by the
		// Worker instead of as a static asset. A Worker response is generated per
		// request and cannot be held in the edge cache, so those pages were
		// `cf-cache-status: DYNAMIC` no matter what Cache Rule the zone carried.
		//
		// Wildcards say the same thing in a handful of rules. `<build>` covers
		// /_app, `<files>` covers static/. Everything else here is prerendered.
		//
		// Anything genuinely dynamic must NOT be listed: an excluded path never
		// reaches the Worker. A future server route under /posts would need the
		// wildcard below narrowed to match.
		//
		// Watch the count: `<files>` expands to one rule per file in static/, and
		// static/og now holds a generated social card per post, so each new post
		// costs a rule. The build log says "Dropping N exclude rules" if the list
		// ever passes Cloudflare's 100.
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: [
					'<build>',
					'<files>',
					'/',
					'/__data.json',
					'/contact',
					'/posts',
					// Covers the archive, every post, the tag pages and their feeds.
					'/posts/*',
					'/resume',
					// Generated from the site config rather than kept in static/, so it
					// no longer falls under <files> and needs naming here.
					'/robots.txt',
					'/.well-known/security.txt',
					'/rss.xml',
					'/site.webmanifest',
					'/sitemap.xml'
				]
			}
		}),

		// Inline the stylesheet into every prerendered page rather than linking
		// it. The whole site's CSS is ~45 kB (about 9 kB over the wire), and as a
		// <link> it was the one render-blocking request left: the browser parses
		// the HTML, discovers the stylesheet, and waits a full round trip before
		// it can paint anything. Lighthouse put that at 390 ms on mobile.
		//
		// The trade is that the CSS is no longer cached across pages — but only
		// on hard loads, since client-side navigation reuses the styles already
		// in the document, and the HTML itself is what most visits re-fetch.
		// Raise this if the stylesheet ever grows past the point where paying for
		// it on each page load beats one cacheable request.
		inlineStyleThreshold: 51200,

		// SvelteKit registers the service worker in dev too, where its cache-first
		// strategy serves stale modules on reload. Register it ourselves in +layout.svelte
		// so it only runs in production builds.
		serviceWorker: {
			register: false
		},

		// Content-Security-Policy. Everything is prerendered to static HTML, so
		// SvelteKit injects the policy as a <meta> tag with 'auto' mode, hashing
		// the inline bootstrap script whose hash is per-build and therefore can't
		// live in the static _headers file. frame-ancestors can't travel in a meta
		// tag, so clickjacking protection is the X-Frame-Options header in _headers.
		csp: {
			mode: 'auto',
			directives: {
				// Everything loads from this origin unless listed below.
				'default-src': ['self'],
				// Rely on the hash SvelteKit appends for the inline bootstrap; the
				// service worker and client bundle are same-origin module scripts.
				'script-src': ['self'],
				// Inline style attributes are used throughout (enter animations)
				// and shiki bakes per-token `--shiki-light/--shiki-dark` custom
				// properties into inline styles, so inline styles must be allowed.
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self'],
				// Fontsource variable fonts are bundled under /_app by Vite.
				'font-src': ['self'],
				// SvelteKit fetches __data.json payloads for client-side navigation.
				'connect-src': ['self'],
				// The résumé is embedded as an <object> from a Cloudflare R2 bucket.
				'object-src': ['self', 'https://pub-b1fc9705d9cd4b50885284c3ede52d27.r2.dev'],
				'frame-src': ['none'],
				'base-uri': ['self'],
				// No <form> on the site; mailto: links are plain anchors.
				'form-action': ['none'],
				'manifest-src': ['self'],
				// The service worker at /service-worker.js.
				'worker-src': ['self']
			}
		}
	},

	extensions: ['.svelte', '.svx', '.md']
};

export default config;
