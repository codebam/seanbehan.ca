import { describe, expect, it, vi } from 'vitest';
import { edgeCacheKey } from './edgeCache';

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

	it('cannot let an apex key answer a www request', () => {
		const apex = edgeCacheKey(new URL('https://seanbehan.ca/posts'));
		const www = edgeCacheKey(new URL('https://www.seanbehan.ca/posts'));

		expect(apex.url).not.toBe(www.url);
		expect(apex.url).toContain('/__host/seanbehan.ca/posts');
		expect(www.url).toContain('/__host/www.seanbehan.ca/posts');
	});

	it('caps the length of a search key so a flood cannot multiply entries', () => {
		const long = edgeCacheKey(new URL(`https://seanbehan.ca/posts?q=${'a'.repeat(500)}`));

		expect(new URL(long.url).searchParams.get('q')).toHaveLength(64);
	});
});

describe('owningSite', () => {
	it('sends the résumé from codebam to the hiring origin', () => {
		expect(owningSite('/resume', 'codebam')).toBe('seanbehan');
		// The hiring origin already owns it; no redirect is another 200.
		expect(owningSite('/resume', 'seanbehan')).toBeNull();
	});

	it('keeps writing on one origin and commerce on the other', () => {
		expect(owningSite('/posts/silverblue', 'codebam')).toBe('seanbehan');
		expect(owningSite('/rss.xml', 'codebam')).toBe('seanbehan');
		expect(owningSite('/posts', 'seanbehan')).toBeNull();
		expect(owningSite('/products/cloudflare-workers-production-kit', 'seanbehan')).toBe('codebam');
		expect(owningSite('/projects/viewport', 'seanbehan')).toBe('codebam');
		expect(owningSite('/legal/privacy', 'seanbehan')).toBe('codebam');
		expect(owningSite('/product', 'seanbehan')).toBeNull();
	});
});

/**
 * The middleware reads `import.meta.env.DEV` to stay out of the way during
 * `astro dev`; the tests flip it off to exercise the cache path, and the
 * Cache API is not in Node, so a Map stands in for `caches.default`.
 */
const makeContext = (pathname: string) =>
	({
		url: new URL(`https://seanbehan.ca${pathname}`),
		request: new Request(`https://seanbehan.ca${pathname}`, {
			headers: { Accept: 'text/html' }
		}),
		locals: {}
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
		expect(response.headers.get('Cache-Control')).toBe(
			'public, max-age=0, s-maxage=600, must-revalidate'
		);
	});
});

describe('edge cache browser policy', () => {
	it('restores the route Cache-Control on a HIT instead of the edge TTL', async () => {
		const browserPolicy = 'public, max-age=0, s-maxage=600, must-revalidate';
		installFakeCache();
		vi.stubEnv('DEV', false);
		try {
			const miss = await runMiddleware(makeContext('/about'), respondWith());
			expect(miss.headers.get('X-Edge-Cache')).toBe('MISS');
			expect(miss.headers.get('Cache-Control')).toBe(browserPolicy);

			const hit = await runMiddleware(makeContext('/about'), respondWith());
			expect(hit.headers.get('X-Edge-Cache')).toBe('HIT');
			// The stored copy carries max-age=600 for the edge; the reader is
			// still told to revalidate on every visit.
			expect(hit.headers.get('Cache-Control')).toBe(browserPolicy);
			expect(hit.headers.has('X-Edge-Browser-Cache-Control')).toBe(false);
		} finally {
			vi.unstubAllEnvs();
			delete (globalThis as { caches?: unknown }).caches;
		}
	});
});
