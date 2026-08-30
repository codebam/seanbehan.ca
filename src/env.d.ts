/// <reference types="astro/client" />

interface SiteD1PreparedStatement {
	bind(...values: unknown[]): SiteD1PreparedStatement;
	run(): Promise<{ success: boolean; meta: { changes?: number } }>;
	first<T>(): Promise<T | null>;
}

/**
 * The `cloudflare:workers` module is how a route reaches the Worker's bindings
 * in Astro 6 — `Astro.locals.runtime.env` was removed. Bindings are declared
 * by hand rather than by referencing worker-configuration.d.ts: pulling the
 * full Workers types into scope here also puts them in scope for the client
 * scripts, where their `append` and `before` signatures shadow the DOM's and
 * every call to either stops type-checking.
 */
declare module 'cloudflare:workers' {
	export const env: {
		ASSETS: { fetch(input: URL | Request | string): Promise<Response> };
		DB: {
			prepare(query: string): SiteD1PreparedStatement;
		};
		DOWNLOADS: {
			head(key: string): Promise<{
				size: number;
				httpEtag: string;
				checksums: { md5?: ArrayBuffer };
			} | null>;
			get(key: string): Promise<{
				body: ReadableStream<Uint8Array>;
				size: number;
				httpEtag: string;
				checksums: { md5?: ArrayBuffer };
			} | null>;
		};
		ORDER_EMAIL: {
			send(message: {
				to: string;
				from: { email: string; name?: string };
				replyTo?: string;
				subject: string;
				text: string;
				html: string;
			}): Promise<{ messageId: string }>;
		};
		STRIPE_PRICE_ID: string;
		STRIPE_SECRET_KEY: string;
		STRIPE_WEBHOOK_SECRET: string;
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
