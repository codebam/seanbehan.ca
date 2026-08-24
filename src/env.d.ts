/// <reference types="astro/client" />

/**
 * The `cloudflare:workers` module is how a route reaches the Worker's bindings
 * in Astro 6 — `Astro.locals.runtime.env` was removed. Only the asset binding
 * is used (by the social-card route, to load its fonts), and it is declared by
 * hand rather than by referencing worker-configuration.d.ts: pulling the full
 * Workers types into scope here also puts them in scope for the client
 * scripts, where their `append` and `before` signatures shadow the DOM's and
 * every call to either stops type-checking.
 */
declare module 'cloudflare:workers' {
	export const env: {
		ASSETS: { fetch(input: URL | Request | string): Promise<Response> };
	};
}

/**
 * `caches.default` is Cloudflare's unnamed per-datacentre cache, which the
 * middleware stores rendered pages in. It is not in the DOM's CacheStorage,
 * and the full Workers types cannot be pulled in here for the reason above.
 */
interface CacheStorage {
	readonly default: Cache;
}
