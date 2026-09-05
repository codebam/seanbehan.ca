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
import { edgeCacheKey } from './lib/edgeCache';
import { SITES, site } from './lib/site';
import { EDITOR_CSP } from './lib/csp.js';

/**
 * The admin panel is a React application EmDash ships and updates; it is
 * excluded rather than pinned to a policy this file would have to chase.
 *
 * Content-Security-Policy is mostly not here: Astro writes the anonymous
 * policy (one source aware of the build) from `security.csp` in
 * astro.config.mjs, and this file used to overwrite it with one that refused
 * the page's own inline scripts. The one exception now sits just below the
 * /_emdash block: an editor browsing the site receives EmDash's inline
 * visual-editing toolbar — injected after Astro hashed the page, so it can
 * carry no hash of its own — and gets the inline-allowing variant from
 * src/lib/csp.js instead.
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

/** Order pages carry bearer credentials and can never enter the shared cache. */
const COMMERCE_PRIVATE = /^\/(checkout|api\/stripe)(?:\/|$)/;

/**
 * HTML is revalidated by the browser and held at the edge for ten minutes.
 * Pages are rendered from D1 now rather than prerendered, so this is what
 * keeps a popular post from hitting the database on every visit; EmDash
 * purges the tag when content changes.
 */
const EDGE_SECONDS = 600;
const IMMUTABLE_SECONDS = 31536000;

const HTML_CACHE = `public, max-age=0, s-maxage=${EDGE_SECONDS}, must-revalidate`;

/**
 * "Is this per-user?" is the whole caching policy, and the hardest question
 * in the file. A cached copy is shared: whoever renders it first, everyone
 * gets. So the rule in one line is: cache only anonymous renders, and never
 * let a header turn an anonymous request into an uncached one on demand.
 *
 * The previous rule pattern-matched cookie *names* (any `emdash*` or `ec*`
 * cookie counted as signed in) and failed in both directions at once. A real
 * editor carries the session in `astro-session`, which the pattern missed —
 * so a personalised render could be stored under the page's URL and the admin
 * bar reach readers. And a stranger needed nothing: `Cookie: emdash=fake`
 * carried every request past the cache into a full render, which is
 * DDoS as a feature (verified live: that one header flipped the page from
 * HIT to MISS).
 *
 * The signal is whether the session resolves, not the cookie's name:
 *
 *  - no `astro-session` → nobody is claiming one → no session read at all
 *    (EmDash #733: reading on every anonymous request turns normal traffic
 *    into a flood of store misses).
 *  - a bogus `astro-session` → no such session in the store → EmDash renders
 *    a plain anonymous page → safe to share, and a repeat of the same shape
 *    is a cache hit rather than a render.
 *  - a real `astro-session` → the render carries an editor's context →
 *    never stored, never served from a stored copy to anyone.
 *
 * The read mirrors EmDash's own `resolveSessionUser`: fail-closed with the
 * same 3 s backstop, so a stalled store read can neither hang the request
 * nor grant editor context — it can only drop it.
 */
type MaybeSession = { get(key: string): Promise<unknown> } | undefined;

async function hasLiveSession(request: Request, session: MaybeSession): Promise<boolean> {
	const cookie = request.headers.get('Cookie') ?? '';
	if (!/(^|;\s*)astro-session=/.test(cookie) || !session) return false;
	const read = Promise.resolve(session.get('user')).catch(() => undefined);
	const timeout = new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 3000));
	const user = await Promise.race([read, timeout]);
	return user !== undefined && user !== null;
}

/**
 * Two request shapes carry per-person content that no session can explain
 * away: previews (`?_preview=<token>`) and Bearer credentials. Both stay out
 * of the cache. Everything else that is a plain GET of a public path is
 * cacheable unless a live session is attached to it.
 */
const isCacheable = async (context: {
	request: Request;
	url: URL;
	session?: MaybeSession;
}): Promise<boolean> => {
	const { request, url } = context;
	// Miniflare persists Cache API entries across restarts. Using the production
	// edge policy in development made template edits look unchanged for ten
	// minutes, which defeats Astro's file watcher and HMR.
	if (import.meta.env.DEV) return false;
	if (request.method !== 'GET' || url.pathname.startsWith('/_emdash')) return false;
	if (COMMERCE_PRIVATE.test(url.pathname)) return false;
	if (url.searchParams.has('_preview')) return false;
	if (request.headers.get('Authorization')?.toLowerCase().startsWith('bearer ')) return false;
	return !(await hasLiveSession(request, context.session));
};

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	if (!import.meta.env.DEV) {
		const target = new URL(context.url);
		let redirect = false;

		if (target.protocol !== 'https:') {
			target.protocol = 'https:';
			redirect = true;
		}
		if (target.hostname === 'www.seanbehan.ca' || target.hostname === 'www.codebam.ca') {
			target.hostname = target.hostname.slice(4);
			redirect = true;
		}
		if (
			!target.pathname.startsWith('/_emdash') &&
			target.pathname.length > 1 &&
			target.pathname.endsWith('/')
		) {
			target.pathname = target.pathname.replace(/\/+$/, '');
			redirect = true;
		}

		// The shared database does not imply two indexed copies. Writing belongs
		// to Sean's domain; projects and products belong to the code-first domain.
		if (
			site.id === 'codebam' &&
			(target.pathname === '/posts' ||
				target.pathname.startsWith('/posts/') ||
				target.pathname.startsWith('/pages/') ||
				target.pathname === '/rss.xml')
		) {
			target.host = new URL(SITES.seanbehan.url).host;
			redirect = true;
		}
		if (
			site.id === 'seanbehan' &&
			(target.pathname === '/projects' ||
				target.pathname.startsWith('/projects/') ||
				target.pathname === '/products' ||
				target.pathname.startsWith('/products/') ||
				target.pathname === '/legal' ||
				target.pathname.startsWith('/legal/'))
		) {
			target.host = new URL(SITES.codebam.url).host;
			redirect = true;
		}

		if (redirect) {
			if (COMMERCE_PRIVATE.test(pathname)) {
				return new Response(null, {
					status: 301,
					headers: {
						Location: target.toString(),
						'Cache-Control': 'private, no-store',
						'Referrer-Policy': 'no-referrer'
					}
				});
			}
			return Response.redirect(target, 301);
		}
	}
	const cache = caches.default;
	const cacheable = await isCacheable(context);
	// The match and the put must use this one key, or the second misses the
	// first.
	const key = cacheable ? edgeCacheKey(context.url) : null;

	if (key) {
		const hit = await cache.match(key);
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
	if (COMMERCE_PRIVATE.test(pathname)) {
		response.headers.set('Cache-Control', 'private, no-store');
		response.headers.set('Referrer-Policy', 'no-referrer');
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

	// EmDash's visual-editing toolbar is the one inline it injects into a
	// public page, and only for editors. Astro hashed the page for anonymous
	// readers and never saw this tool, so it can't carry one of their hashes
	// (and a hash would not coexist with an inline allowance, per CSP3). The
	// only browser that ever receives it already resolved a session and is the
	// one editing, so it gets the inline-allowing policy from the same
	// directive set; everyone else keeps the strict one.
	if ((context.locals?.user?.role ?? 0) >= 30) {
		response.headers.set('Content-Security-Policy', EDITOR_CSP);
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

	const cacheControl = response.headers.get('Cache-Control')?.toLowerCase() ?? '';
	const safeToStore =
		!cacheControl.includes('private') &&
		!cacheControl.includes('no-store') &&
		!response.headers.has('Set-Cookie');

	if (key && response.status === 200 && safeToStore) {
		// The stored copy is read by `cache.match` above and never by a browser,
		// so it is put away without the `max-age=0, must-revalidate` half of the
		// policy — those two are instructions to the reader's own cache, and the
		// Cache API would honour the zero and store nothing.
		const stored = new Response(response.clone().body, response);
		// EmDash image URLs identify immutable source bytes and transform options,
		// so keeping them for a year avoids decoding the same rendition again.
		stored.headers.set(
			'Cache-Control',
			pathname === '/_image'
				? `public, max-age=${IMMUTABLE_SECONDS}, immutable`
				: `public, max-age=${EDGE_SECONDS}`
		);
		stored.headers.delete('X-Edge-Cache');
		// Awaited rather than handed to waitUntil: Astro 6 removed the runtime
		// context from locals, and a put of an already-rendered response costs
		// about a millisecond.
		await cache.put(key, stored);
		response.headers.set('X-Edge-Cache', 'MISS');
	}

	return response;
});
