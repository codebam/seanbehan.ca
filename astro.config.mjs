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
					linkedinUrl: 'https://www.linkedin.com/in/sean-behan'
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
				'astro/logger/json',
				'fuse.js'
			]
		},
		plugins: [tailwindcss()],
		server: {
			allowedHosts: ['nixos-desktop.tail7d7a2.ts.net']
		},
		resolve: {
			dedupe: ['react', 'react-dom']
		},
		ssr: {
			noExternal: ['@cloudflare/kumo']
		}
	},
	devToolbar: { enabled: false }
});
