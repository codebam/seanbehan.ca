import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

// Applied to every response the Worker itself produces (routes whose paths are
// absent from _routes.json's exclude list, most notably the 404 fallback — the
// site's _routes.json include is `/*` and the adapter had to drop exclude rules
// to fit Cloudflare's limit, so much of the site is served through this path).
//
// Static-prerendered pages served straight off the CDN get the same values from
// the project-root `_headers` file, so these two lists must stay in sync. The
// Content-Security-Policy is *not* set here: SvelteKit injects it itself (as a
// hash-based <meta> tag on prerendered pages, or a nonce-based HTTP header on
// this dynamic path), because its inline-bootstrap hash/nonce is per-build and
// can't be written into a static _headers file.
const SECURITY_HEADERS = {
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Strict-Transport-Security': 'max-age=63072000',
	'X-Frame-Options': 'DENY',
	'Permissions-Policy':
		'accelerometer=(), ambient-light-sensor=(), autoplay=(), camera=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), hid=(), idle-detection=(), magnetometer=(), microphone=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), usb=(), web-share=(), xr-spatial-tracking=()',
	// `max-age=0, must-revalidate` for the browser — a reader always gets fresh
	// HTML — with `s-maxage` letting Cloudflare hold the response at the edge in
	// between. The shared TTL only takes effect once a Cache Rule marks HTML
	// eligible for caching, which is a zone setting rather than a repo one; see
	// docs/edge-caching.md, including the deploy-time purge it requires.
	'Cache-Control': 'public, max-age=0, s-maxage=600, must-revalidate'
} as const;

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	if (dev) {
		response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		return response;
	}

	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		// Respect a Cache-Control a route handler set itself (e.g. the RSS feed's
		// max-age=3600); this default only fills in when none was declared.
		if (name === 'Cache-Control' && response.headers.has('Cache-Control')) {
			continue;
		}
		response.headers.set(name, value);
	}

	return response;
};
