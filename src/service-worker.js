/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE_CONFIG = {
	version: version,
	timeout: 10000,
	methods: ['GET', 'HEAD'],
	debug: process.env.NODE_ENV === 'development'
};

// Simplified cache management
class CacheManager {
	static async addAssets(assets) {
		const cache = await caches.open(`cache-${CACHE_CONFIG.version}`);
		await cache.addAll(assets);
	}

	static async cleanup() {
		const keys = await caches.keys();
		await Promise.all(
			keys.filter((key) => !key.includes(CACHE_CONFIG.version)).map((key) => caches.delete(key))
		);
	}
}

// Network utilities
const networkUtils = {
	isValidRequest(request) {
		return CACHE_CONFIG.methods.includes(request.method);
	},

	// Cross-origin no-cors fetches (ads, fonts, analytics) resolve to opaque
	// responses: status 0, ok false. Handling them here can only downgrade them,
	// so leave them to the browser entirely.
	isSameOrigin(url) {
		return url.origin === self.location.origin;
	},

	// Page content: full-page loads (mode 'navigate') and the __data.json payloads
	// SvelteKit fetches for client-side navigations. Both must hit the network first
	// or a stale page survives for the whole session.
	isPageContent(request, url) {
		return request.mode === 'navigate' || url.pathname.endsWith('__data.json');
	},

	async fetchWithTimeout(request) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), CACHE_CONFIG.timeout);

		try {
			const response = await fetch(request, { signal: controller.signal });
			clearTimeout(timeoutId);
			return response;
		} catch (error) {
			clearTimeout(timeoutId);
			throw error;
		}
	}
};

// Event handlers
self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			try {
				// CacheManager.addAssets opens the cache itself.
				await CacheManager.addAssets([...build, ...files]);
				await self.skipWaiting();
			} catch (error) {
				console.error('[Service Worker] Installation failed:', error);
				throw error;
			}
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			try {
				await CacheManager.cleanup();
				await self.clients.claim();
			} catch (error) {
				console.error('[Service Worker] Activation failed:', error);
				throw error;
			}
		})()
	);
});

self.addEventListener('fetch', (event) => {
	if (!networkUtils.isValidRequest(event.request)) return;
	if (!networkUtils.isSameOrigin(new URL(event.request.url))) return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(`cache-${CACHE_CONFIG.version}`);
			const url = new URL(event.request.url);

			// Network-first for page content, so a deploy or edit is never masked by
			// a cached copy. Cache is only a fallback for when the network is gone.
			if (networkUtils.isPageContent(event.request, url)) {
				try {
					const response = await networkUtils.fetchWithTimeout(event.request);
					if (response.ok) {
						if (CACHE_CONFIG.debug)
							console.log(`[Service Worker] Network response: ${url.pathname}`);
						await cache.put(event.request, response.clone());
						return response;
					}
					// A 404/500 from the server is the truth — don't paper over it with cache.
					return response;
				} catch (error) {
					if (CACHE_CONFIG.debug)
						console.log(`[Service Worker] Offline, falling back to cache: ${url.pathname}`, error);
					const cachedResponse = await cache.match(event.request);
					if (cachedResponse) return cachedResponse;
					return new Response('Network error', { status: 503, statusText: 'Service Unavailable' });
				}
			}

			// Static asset handling — build/files paths are content-hashed or
			// versioned, so cache-first is safe.
			if ([...build, ...files].includes(url.pathname)) {
				const cachedResponse = await cache.match(url.pathname);
				if (cachedResponse) {
					if (CACHE_CONFIG.debug)
						console.log(`[Service Worker] Serving from cache: ${url.pathname}`);
					return cachedResponse;
				}
			}

			// Try cache first for everything else
			const cachedResponse = await cache.match(event.request);
			if (cachedResponse) {
				if (CACHE_CONFIG.debug) console.log(`[Service Worker] Serving from cache: ${url.pathname}`);
				return cachedResponse;
			}

			// Network request
			try {
				const response = await networkUtils.fetchWithTimeout(event.request);
				if (response.ok) {
					if (CACHE_CONFIG.debug) console.log(`[Service Worker] Network response: ${url.pathname}`);
					await cache.put(event.request, response.clone());
					return response;
				}
				throw new Error(`Network response failed: ${response.status}`);
			} catch (error) {
				if (CACHE_CONFIG.debug)
					console.log(`[Service Worker] Network error: ${url.pathname}`, error);
				// If we have no cached response, return a basic error
				return new Response('Network error', { status: 503, statusText: 'Service Unavailable' });
			}
		})()
	);
});
