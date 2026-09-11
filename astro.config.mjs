import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { d1, r2, sandbox } from '@emdash-cms/cloudflare';
import { cloudflareEmail } from '@emdash-cms/cloudflare/plugins';
import { formsPlugin } from '@emdash-cms/plugin-forms';
import { defineConfig } from 'astro/config';
import emdash from 'emdash/astro';
import { siteFor } from './src/lib/site.data.js';
import { siteSeo } from './src/plugins/site-seo';
import { CSP_DIRECTIVES } from './src/lib/csp.js';

const buildSite = siteFor(process.env.PUBLIC_SITE);

/**
 * The admin panel is React; the site itself is plain Astro templates.
 *
 * No `fonts:` block: the two faces are subset to latin and served from
 * public/fonts, declared by @font-face in src/styles/app.css. Astro's font
 * pipeline would fetch them from Google instead, which costs a second origin
 * on the critical path and re-adds the subsets the build strips out.
 */
export default defineConfig({
	output: 'server',
	adapter: cloudflare(),
	image: {
		layout: 'constrained',
		responsiveStyles: true
	},
	// Astro emits the Content-Security-Policy header itself (the header
	// destination is the default for server-rendered routes), adding the sha256
	// hash of each page's inline <script> bundles — which the old header-only
	// policy in src/middleware.ts used to refuse: `script-src 'self'` alone
	// allows no inline script at all, and since the move to Astro it had been
	// killing every page script in the browser. Every directive the middleware
	// used to send lives here, in one place that is aware of the build.
	//
	// Style attributes stay 'unsafe-inline' for the same reason they did
	// before: shiki bakes per-token --shiki-light / --shiki-dark custom
	// properties into inline style attributes, and the enter animations set
	// their delay the same way. <style> elements instead carry their hash.
	security: {
		csp: {
			directives: CSP_DIRECTIVES,
			styleDirective: {
				resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }]
			},
			// Cloudflare injects its Web Analytics beacon into pages proxied by the
			// zone. Allow the script origin here; csp.js allows the data endpoint in
			// connect-src.
			scriptDirective: {
				resources: ["'self'", 'https://static.cloudflareinsights.com']
			}
		}
	},
	integrations: [
		react(),
		emdash({
			siteUrl: buildSite.url,
			database: d1({ binding: 'DB', session: 'auto' }),
			storage: r2({ binding: 'MEDIA' }),
			plugins: [
				siteSeo({
					authorName: 'Sean Behan',
					authorHandle: 'codebam',
					authorUrl: 'https://seanbehan.ca',
					githubUrl: 'https://github.com/codebam',
					mastodonUrl: 'https://mstdn.ca/@codebam',
					linkedinUrl: 'https://www.linkedin.com/in/sean-behan',
					jobTitle: 'Full-stack developer',
					homeLocation: {
						'@type': 'PostalAddress',
						addressRegion: 'Ontario',
						addressCountry: 'CA'
					},
					// The subjects the writing and the repositories both bear on.
					// These are literals rather than reads from site.data.js
					// because this config runs under plain node for both variants
					// and the Person is the same person on either origin; the
					// trade is that a change to the skills list has to be made
					// here too.
					knowsAbout: [
						'TypeScript',
						'Rust',
						'NixOS',
						'Cloudflare Workers',
						'Durable Objects',
						'Wayland',
						'Linux',
						'Serverless architecture'
					]
				}),
				formsPlugin(),
				// Email transport: EmDash on Workers ships only a dev-console stub, so every
				// mail-dependent auth flow (magic-link login, invites, password recovery) failed
				// in production. This delivers them through Cloudflare Email Sending via the
				// EMAIL binding in wrangler.jsonc — no API key — and replies are routed to the
				// real inbox rather than the from address.
				// The sending domain must still be onboarded in the Cloudflare dashboard
				// (Email → Email Sending); until then, selects in Settings are inactive.
				cloudflareEmail({
					from: { email: 'cms@seanbehan.ca', name: 'seanbehan.ca' },
					replyTo: 'codebam@riseup.net'
				})
			],
			sandboxRunner: sandbox(),
			marketplace: 'https://marketplace.emdashcms.com'
		})
	],
	vite: {
		// Cloudflare's SSR scanner misses imports in Astro frontmatter. Pre-bundle
		// this site's late discoveries so workerd never sees invalidated chunks.
		optimizeDeps: {
			include: [
				'@cf-wasm/og',
				'@cloudflare/kumo/components/badge',
				'@cloudflare/kumo/components/button',
				'@cloudflare/kumo/components/input',
				'@cloudflare/kumo/components/layer-card',
				'@emdash-cms/plugin-forms',
				'@emdash-cms/plugin-forms/astro',
				'@portabletext/to-html',
				'astro/app/manifest',
				'astro/logger/console',
				'astro/logger/json',
				'fuse.js'
			]
		},
		plugins: [tailwindcss()],
		server: {
			allowedHosts: ['nixos-desktop.tail7d7a2.ts.net'],
			// `.direnv/flake-inputs` symlinks the whole Nix store checkout into
			// the repo; following it exhausts the inotify watch limit and the
			// dev server dies before it serves a page.
			// `.wrangler` and `.emdash` are written on every request (D1,
			// observability traces, generated types), so watching them turns
			// normal traffic into a stream of invalidation events.
			watch: { ignored: ['**/.direnv/**', '**/.wrangler/**', '**/.emdash/**'] }
		},
		resolve: {
			dedupe: ['react', 'react-dom']
		},
		ssr: {
			noExternal: ['@cloudflare/kumo']
		}
	},
	devToolbar: { enabled: false },
	/*
	 * Astro's cache provider, which every `Astro.cache.set(cacheHint)` in this
	 * repo was written for and none of them reached: without this block
	 * `Astro.cache` is a DisabledAstroCache, `enabled` is false, and the hint
	 * each query hands back — the entry tags, the last-modified time — is
	 * computed and thrown away. `docs/edge-caching.md` promised a targeted
	 * purge on the strength of calls that did nothing.
	 *
	 * The name has to be exactly `cloudflare`: the adapter decides whether to
	 * register its provider with `config.cache?.provider?.name === 'cloudflare'`
	 * (see @astrojs/cloudflare's `needsWorkerCache`), and it is what turns the
	 * hints into `Cache-Tag` headers and `cache.purge({ tags })`.
	 *
	 * Verified in a local `wrangler dev` against the real build before this
	 * stayed: pages still answer `X-Edge-Cache: HIT` on the second request, the
	 * middleware's Cache-Control policy is unchanged, and the stored edge copy
	 * now keeps each route's own max-age instead of the HTML window.
	 */
	cache: {
		provider: {
			name: 'cloudflare',
			entrypoint: '@astrojs/cloudflare/cache/provider'
		}
	}
});
