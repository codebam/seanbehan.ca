/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];
const TIMEOUT_MS = 3000;

// Configuration
const CONFIG = {
    debug: process.env.NODE_ENV === 'development',
    cacheVersion: CACHE,
    networkTimeout: TIMEOUT_MS,
    cacheableRequests: ['GET', 'HEAD']
};

// Logger utility
const logger = {
    log: (...args) => CONFIG.debug && console.log('[Service Worker]', ...args),
    error: (...args) => console.error('[Service Worker]', ...args)
};

// Cache management
const cacheManager = {
    async add(cache, assets) {
        logger.log(`Caching ${assets.length} files`);
        await cache.addAll(assets);
        logger.log('Cache operation complete');
    },

    async cleanup() {
        const keys = await caches.keys();
        const deletions = keys
            .filter((key) => key !== CONFIG.cacheVersion)
            .map((key) => {
                logger.log(`Removing old cache: ${key}`);
                return caches.delete(key);
            });
        await Promise.all(deletions);
    }
};

// Network utilities
const networkUtils = {
    isValidRequest(request) {
        return CONFIG.cacheableRequests.includes(request.method);
    },

    async fetchWithTimeout(request) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.networkTimeout);

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
                const cache = await caches.open(CONFIG.cacheVersion);
                await cacheManager.add(cache, ASSETS);
                await self.skipWaiting();
            } catch (error) {
                logger.error('Installation failed:', error);
                throw error;
            }
        })()
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            try {
                await cacheManager.cleanup();
                await self.clients.claim();
            } catch (error) {
                logger.error('Activation failed:', error);
                throw error;
            }
        })()
    );
});

self.addEventListener('fetch', (event) => {
    if (!networkUtils.isValidRequest(event.request)) return;

    event.respondWith(
        (async () => {
            const cache = await caches.open(CONFIG.cacheVersion);
            const url = new URL(event.request.url);

            // Static asset handling
            if (ASSETS.includes(url.pathname)) {
                const cachedResponse = await cache.match(url.pathname);
                if (cachedResponse) {
                    logger.log(`Serving from cache: ${url.pathname}`);
                    return cachedResponse;
                }
            }

            // Network-first strategy
            try {
                const response = await networkUtils.fetchWithTimeout(event.request);
                if (response.ok) {
                    logger.log(`Network response: ${url.pathname}`);
                    await cache.put(event.request, response.clone());
                    return response;
                }
                throw new Error(`Network response failed: ${response.status}`);
            } catch (error) {
                logger.log(`Network error, falling back to cache: ${url.pathname}`, error);
                const cachedResponse = await cache.match(event.request);
                if (cachedResponse) return cachedResponse;
                throw error;
            }
        })()
    );
});
