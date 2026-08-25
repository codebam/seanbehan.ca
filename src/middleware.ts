/**
 * Security and caching headers.
 *
 * On Cloudflare Pages these lived in `_headers`, a static file the platform
 * read. The site is a Worker now: every response comes through here instead,
 * which also means the rules apply to the CMS's own routes rather than only to
 * the pages the build emitted.
 *
 * Two things are deliberately not blanket-applied. A route that sets its own
 * `Cache-Control` (the feeds, security.txt) keeps it — the equivalent of the
 * `! Cache-Control` lines in the old file. And nothing under /_emdash is
 * cached at all: the admin, its API and preview responses are per-user by
 * definition.
 */

import { defineMiddleware } from 'astro:middleware';

/**
 * The admin panel is a React application EmDash ships and updates; it is
 * excluded rather than pinned to a policy this file would have to chase.
 *
 * Content-Security-Policy is not here any more: Astro writes it, one source
 * aware of the build, from `security.csp` in astro.config.mjs, and this file
 * used to overwrite it with a policy that refused the page's own inline
 * scripts.
 */
const SECURITY_HEADERS: Record<string, string> = {
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
	'X-Frame-Options': 'DENY',
	'Permissions-Policy':
		'accelerometer=(), ambient-light-sensor=(), autoplay=(), camera=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), hid=(), idle-detection=(), magnetometer=(), microphone=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), usb=(), web-share=(), xr-spatial-tracking=()'
};

/** Assets whose bytes never change under a given URL. */
const IMMUTABLE = /^\/_astro\//;

/**
 * Stable filenames rather than content-hashed ones: fonts, the favicon set,
 * raster art and the generated social cards. A month of caching, not a year
 * with `immutable`, so a rebuilt file reaches readers within 30 days instead
 * of never.
 */
const LONG_LIVED = /^\/(fonts|og|img|optimized)\/|\.(webp|png|svg|ico)$/;

/**
 * HTML is revalidated by the browser and held at the edge for ten minutes.
 * Pages are rendered from D1 now rather than prerendered, so this is what
 * keeps a popular post from hitting the database on every visit; EmDash
 * purges the tag when content changes.
 */
const EDGE_SECONDS = 600;

const HTML_CACHE = `public, max-age=0, s-maxage=${EDGE_SECONDS}, must-revalidate`;

/**
 * A response the Worker made is not cached by a Cache Rule.
 *
 * This cost a production outage's worth of confusion, so it is written down: a
 * Cache Rule matches requests to an *origin*, and on a Workers custom domain
 * the Worker is the origin. `s-maxage` on a rendered page is therefore inert —
 * the rule that made HTML cacheable when this site was prerendered on Pages
 * does nothing here, and every page view went to D1.
 *
 * So the Worker caches its own output. The Cache API stores a copy keyed by
 * URL and honours the `s-maxage` below for its TTL, which puts the ten-minute
 * window back where the documentation says it is.
 *
 * Only anonymous GETs. A signed-in editor carries an EmDash session cookie and
 * gets the admin bar and edit affordances in the markup, and storing that copy
 * under the page's URL would serve one reader's session furniture to everyone.
 */
const isCacheable = (request: Request, pathname: string) =>
	request.method === 'GET' &&
	!pathname.startsWith('/_emdash') &&
	!/(^|;\s*)(emdash|ec)[_-]/i.test(request.headers.get('Cookie') ?? '');

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;
	const cache = caches.default;
	const cacheable = isCacheable(context.request, pathname);

	if (cacheable) {
		const hit = await cache.match(context.request);
		if (hit) {
			const response = new Response(hit.body, hit);
			response.headers.set('X-Edge-Cache', 'HIT');
			return response;
		}
	}

	const response = await next();

	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(name, value);
	}

	if (pathname.startsWith('/_emdash')) {
		// The CSP above describes the site's own pages, and the admin is not one:
		// it is a React application EmDash ships and updates, and under a policy
		// written for a static-rendered blog it loaded as far as "Loading
		// EmDash..." and stopped. Pinning it here would mean chasing the CMS's
		// bundle from one release to the next; the panel is behind authentication
		// and sends its own policy.
		//
		// The rest of the headers stay: nothing about an admin panel wants MIME
		// sniffing, a leaked referrer, or the option of being framed.
		response.headers.delete('Content-Security-Policy');
		response.headers.set('Cache-Control', 'private, no-store');
		return response;
	}

	if (!response.headers.has('Cache-Control')) {
		if (IMMUTABLE.test(pathname)) {
			response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
		} else if (LONG_LIVED.test(pathname)) {
			response.headers.set('Cache-Control', 'public, max-age=2592000');
		} else {
			response.headers.set('Cache-Control', HTML_CACHE);
		}
	}

	if (cacheable && response.status === 200) {
		// The stored copy is read by `cache.match` above and never by a browser,
		// so it is put away without the `max-age=0, must-revalidate` half of the
		// policy — those two are instructions to the reader's own cache, and the
		// Cache API would honour the zero and store nothing.
		const stored = new Response(response.clone().body, response);
		stored.headers.set('Cache-Control', `public, max-age=${EDGE_SECONDS}`);
		stored.headers.delete('X-Edge-Cache');
		// Awaited rather than handed to waitUntil: Astro 6 removed the runtime
		// context from locals, and a put of an already-rendered response costs
		// about a millisecond.
		await cache.put(context.request, stored);
		response.headers.set('X-Edge-Cache', 'MISS');
	}

	return response;
});
