import { describe, expect, it, vi } from 'vitest';
import { edgeCacheKey } from './edgeCache';
import { MAX_QUERY_LENGTH } from './search';

// The real middleware is exercised below; Astro's virtual module only exists
// inside a build, so it is mocked down to the identity `defineMiddleware`
// wrapper it is at runtime.
vi.mock('astro:middleware', () => ({
	defineMiddleware: (handler: unknown) => handler
}));

import { ADMIN_PERMISSIONS_POLICY, onRequest, owningSite } from '../middleware';

describe('edgeCacheKey', () => {
	it('keeps image transformation parameters distinct', () => {
		const first = edgeCacheKey(
			new URL('https://seanbehan.ca/_image?href=%2Fmedia%2Fphoto.jpg&w=640&f=webp')
		);
		const second = edgeCacheKey(
			new URL('https://seanbehan.ca/_image?href=%2Fmedia%2Fother.jpg&w=1280&f=webp')
		);

		expect(first.url).not.toBe(second.url);
		expect(first.url).toContain('w=640');
	});

	it('keeps search queries that change the response', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/search.json?q=nixos'));

		expect(key.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/search.json?q=nixos');
	});

	it('drops irrelevant query strings from page keys', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/posts/example?nonce=1'));

		expect(key.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/posts/example');
	});

	it('keys the archive on its search term', () => {
		const searched = edgeCacheKey(new URL('https://seanbehan.ca/posts?q=nixos'));
		const plain = edgeCacheKey(new URL('https://seanbehan.ca/posts'));

		expect(searched.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/posts?q=nixos');
		expect(plain.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/posts');
		expect(searched.url).not.toBe(plain.url);
	});

	it('folds the query it keys the archive on, and ignores the rest of the URL', () => {
		const noisy = edgeCacheKey(
			new URL('https://seanbehan.ca/posts?utm_source=x&nonce=7&q=%20NixOS%20%20Flakes%20')
		);

		expect(noisy.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/posts?q=nixos%20flakes');
	});

	it('keys /search.json on the normalised term and drops cache-busters', () => {
		const spaced = edgeCacheKey(
			new URL('https://seanbehan.ca/search.json?q=Hello%20World&nonce=1')
		);
		const plus = edgeCacheKey(new URL('https://seanbehan.ca/search.json?q=hello+world&nonce=2'));

		expect(spaced.url).toBe(plus.url);
		expect(spaced.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/search.json?q=hello%20world');
	});

	it('caps a /search.json key at the same length as the archive key', () => {
		const long = edgeCacheKey(
			new URL(`https://seanbehan.ca/search.json?q=${'b'.repeat(500)}&nonce=1`)
		);

		expect(new URL(long.url).searchParams.get('q')).toHaveLength(MAX_QUERY_LENGTH);
	});

	it('leaves the /posts key behavior unchanged', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/posts?q=Hello%20World&nonce=1'));

		expect(key.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/posts?q=hello%20world');
	});

	it('drops cache-busters from image transform keys', () => {
		const first = edgeCacheKey(
			new URL('https://seanbehan.ca/_image?href=%2Fmedia%2Fphoto.jpg&w=100&nonce=1')
		);
		const second = edgeCacheKey(
			new URL('https://seanbehan.ca/_image?href=%2Fmedia%2Fphoto.jpg&w=100&nonce=2')
		);

		expect(first.url).toBe(second.url);
		expect(first.url).toBe(
			'https://seanbehan.ca/__host/seanbehan.ca/_image?href=%2Fmedia%2Fphoto.jpg&w=100'
		);
	});

	it('keeps transform parameters that change the image distinct', () => {
		const small = edgeCacheKey(new URL('https://seanbehan.ca/_image?href=x&w=100'));
		const large = edgeCacheKey(new URL('https://seanbehan.ca/_image?href=x&w=200'));

		expect(small.url).not.toBe(large.url);
	});

	it('canonicalizes image keys to the endpoint parameters in a fixed order', () => {
		const key = edgeCacheKey(
			new URL('https://seanbehan.ca/_image?q=80&nonce=1&fit=cover&w=640&href=%2Fmedia%2Fphoto.jpg')
		);

		expect(key.url).toBe(
			'https://seanbehan.ca/__host/seanbehan.ca/_image?href=%2Fmedia%2Fphoto.jpg&w=640&fit=cover&q=80'
		);
	});

	it('keeps an href-less image key stable across cache-busters', () => {
		const first = edgeCacheKey(new URL('https://seanbehan.ca/_image?nonce=1'));
		const second = edgeCacheKey(new URL('https://seanbehan.ca/_image?nonce=2'));

		expect(first.url).toBe(second.url);
		expect(first.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/_image');
	});

	it('cannot let an apex key answer a www request', () => {
		const apex = edgeCacheKey(new URL('https://seanbehan.ca/posts'));
		const www = edgeCacheKey(new URL('https://www.seanbehan.ca/posts'));

		expect(apex.url).not.toBe(www.url);
		expect(apex.url).toContain('/__host/seanbehan.ca/posts');
		expect(www.url).toContain('/__host/www.seanbehan.ca/posts');
	});

	it('caps the length of a search key so a flood cannot multiply entries', () => {
		const long = edgeCacheKey(new URL(`https://seanbehan.ca/posts?q=${'a'.repeat(500)}`));

		expect(new URL(long.url).searchParams.get('q')).toHaveLength(MAX_QUERY_LENGTH);
	});
});

describe('owningSite', () => {
	it('sends every résumé artifact from codebam to the hiring origin', () => {
		for (const pathname of ['/resume', '/resume.md', '/resume.pdf', '/resume.txt']) {
			expect(owningSite(pathname, 'codebam')).toBe('seanbehan');
			// The hiring origin already owns them; no redirect is another 200.
			expect(owningSite(pathname, 'seanbehan')).toBeNull();
		}
	});

	it('keeps writing and commerce on the legal-name origin, projects on the handle', () => {
		expect(owningSite('/posts/silverblue', 'codebam')).toBe('seanbehan');
		expect(owningSite('/rss.xml', 'codebam')).toBe('seanbehan');
		expect(owningSite('/posts', 'seanbehan')).toBeNull();
		expect(owningSite('/services', 'codebam')).toBe('seanbehan');
		expect(owningSite('/services', 'seanbehan')).toBeNull();
		expect(owningSite('/products/cloudflare-workers-production-kit', 'codebam')).toBe('seanbehan');
		expect(owningSite('/products/cloudflare-workers-production-kit', 'seanbehan')).toBeNull();
		expect(owningSite('/legal/privacy', 'codebam')).toBe('seanbehan');
		expect(owningSite('/legal/privacy', 'seanbehan')).toBeNull();
		expect(owningSite('/projects/viewport', 'seanbehan')).toBe('codebam');
		expect(owningSite('/projects', 'codebam')).toBeNull();
		expect(owningSite('/product', 'seanbehan')).toBeNull();
	});

	it('sends old checkout and webhook links from codebam to the commercial origin', () => {
		expect(owningSite('/checkout/download', 'codebam')).toBe('seanbehan');
		expect(owningSite('/checkout/success', 'codebam')).toBe('seanbehan');
		expect(owningSite('/api/stripe/webhook', 'codebam')).toBe('seanbehan');
		expect(owningSite('/checkout/download', 'seanbehan')).toBeNull();
		expect(owningSite('/api/stripe/webhook', 'seanbehan')).toBeNull();
	});
});

/**
 * The middleware reads `import.meta.env.DEV` to stay out of the way during
 * `astro dev`; the tests flip it off to exercise the cache path, and the
 * Cache API is not in Node, so a Map stands in for `caches.default`.
 */
const makeContext = (pathname: string, locals: Record<string, unknown> = {}) =>
	({
		url: new URL(`https://seanbehan.ca${pathname}`),
		request: new Request(`https://seanbehan.ca${pathname}`, {
			headers: { Accept: 'text/html' }
		}),
		locals
	}) as unknown as Parameters<typeof onRequest>[0];

const respondWith =
	(headers: Record<string, string> = {}) =>
	async () =>
		new Response('ok', { headers });

/**
 * `onRequest` is typed as returning `Response | void` because a middleware may
 * rewrite the page instead of answering it; these tests always expect the
 * response and assert on its headers.
 */
async function runMiddleware(
	context: Parameters<typeof onRequest>[0],
	next: () => Promise<Response>
) {
	const response = await onRequest(context, next);
	if (!(response instanceof Response)) throw new Error('middleware returned no response');
	return response;
}

function installFakeCache() {
	const store = new Map<string, Response>();
	const cache = {
		async match(key: Request) {
			return store.get(key.url)?.clone();
		},
		async put(key: Request, response: Response) {
			store.set(key.url, response.clone());
		}
	};
	Object.defineProperty(globalThis, 'caches', {
		value: { default: cache },
		configurable: true,
		writable: true
	});
}

describe('security headers', () => {
	it('re-enables WebAuthn on /_emdash and keeps the other hardening', async () => {
		installFakeCache();
		const response = await runMiddleware(
			makeContext('/_emdash/admin/login'),
			respondWith({ 'Content-Security-Policy': "default-src 'self'" })
		);

		expect(response.headers.get('Permissions-Policy')).toBe(ADMIN_PERMISSIONS_POLICY);
		expect(response.headers.get('Permissions-Policy')).toContain(
			'publickey-credentials-get=(self)'
		);
		expect(response.headers.get('Permissions-Policy')).not.toContain(
			'publickey-credentials-get=()'
		);
		// The admin carries its own CSP; the site's is deliberately removed.
		expect(response.headers.has('Content-Security-Policy')).toBe(false);
		expect(response.headers.get('Cache-Control')).toBe('private, no-store');
		expect(response.headers.get('X-Frame-Options')).toBe('DENY');
		expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
	});

	it('leaves the WebAuthn block in place on public pages', async () => {
		installFakeCache();
		const response = await runMiddleware(makeContext('/about'), respondWith());

		expect(response.headers.get('Permissions-Policy')).toContain('publickey-credentials-get=()');
		expect(response.headers.get('Cache-Control')).toBe('private, max-age=0, must-revalidate');
	});
});

describe('edge cache policy', () => {
	it('never stores HTML in the Worker cache even though the zone rule can override private', async () => {
		installFakeCache();
		vi.stubEnv('DEV', false);
		try {
			const first = await runMiddleware(makeContext('/about'), respondWith());
			const second = await runMiddleware(makeContext('/about'), respondWith());

			// This proves only the Worker half: `private` makes safeToStore refuse
			// the put, so neither request is marked HIT. It says nothing about
			// Cloudflare's zone cache, whose Cache Rule overrides `private`; the
			// smoke test's www check is the end-to-end detector for a zone copy
			// answering before this redirect can run.
			for (const response of [first, second]) {
				expect(response.headers.get('Cache-Control')).toBe('private, max-age=0, must-revalidate');
				expect(response.headers.has('X-Edge-Cache')).toBe(false);
			}
		} finally {
			vi.unstubAllEnvs();
			delete (globalThis as { caches?: unknown }).caches;
		}
	});

	it('keeps a token-bearing preview out of both caches', async () => {
		installFakeCache();
		vi.stubEnv('DEV', false);
		try {
			const response = await runMiddleware(
				makeContext('/about?_preview=revoked-token'),
				respondWith({ 'Cache-Control': 'public, max-age=3600' })
			);

			// no-store is the one value the zone rule cannot override, and the
			// returned policy is what a browser receiving it directly must see.
			expect(response.headers.get('Cache-Control')).toBe('private, no-store');
			expect(response.headers.has('X-Edge-Cache')).toBe(false);
		} finally {
			vi.unstubAllEnvs();
			delete (globalThis as { caches?: unknown }).caches;
		}
	});

	it('keeps an editor render out of both caches, route policy or not', async () => {
		installFakeCache();
		vi.stubEnv('DEV', false);
		try {
			const response = await runMiddleware(
				makeContext('/about', { user: { role: 30 } }),
				respondWith({ 'Cache-Control': 'public, max-age=3600' })
			);

			// The toolbar and inline-allowing CSP only exist for this browser;
			// the zone rule would otherwise hold the render for its TTL.
			expect(response.headers.get('Cache-Control')).toBe('private, no-store');
			expect(response.headers.get('Content-Security-Policy')).toContain(
				"script-src 'self' 'unsafe-inline'"
			);
			expect(response.headers.has('X-Edge-Cache')).toBe(false);
		} finally {
			vi.unstubAllEnvs();
			delete (globalThis as { caches?: unknown }).caches;
		}
	});

	it('still caches a route that asks for a public policy', async () => {
		const browserPolicy = 'public, max-age=3600';
		installFakeCache();
		vi.stubEnv('DEV', false);
		try {
			const miss = await runMiddleware(
				makeContext('/rss.xml'),
				respondWith({ 'Cache-Control': browserPolicy })
			);
			expect(miss.headers.get('X-Edge-Cache')).toBe('MISS');
			expect(miss.headers.get('Cache-Control')).toBe(browserPolicy);

			const hit = await runMiddleware(
				makeContext('/rss.xml'),
				respondWith({ 'Cache-Control': browserPolicy })
			);
			expect(hit.headers.get('X-Edge-Cache')).toBe('HIT');
			expect(hit.headers.get('Cache-Control')).toBe(browserPolicy);
			expect(hit.headers.has('X-Edge-Browser-Cache-Control')).toBe(false);
		} finally {
			vi.unstubAllEnvs();
			delete (globalThis as { caches?: unknown }).caches;
		}
	});
});
