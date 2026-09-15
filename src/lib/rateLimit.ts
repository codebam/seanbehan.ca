/**
 * A fixed-window rate limit kept in D1.
 *
 * The WAF rule is the primary bound, but the free plan allows one rate-limit
 * rule per zone and that rule lives outside this repo. This is the second,
 * application-owned bound: it ships with the Worker and its migration, and it
 * names the exact routes it protects.
 *
 * It fails open on purpose. A D1 error must not stop a buyer from reaching
 * Stripe; the WAF rule still stands behind the window this limiter cannot
 * count.
 */

export interface RateLimitStatement {
	bind(...values: unknown[]): RateLimitStatement;
	first<T>(): Promise<T | null>;
	run(): Promise<unknown>;
}

export interface RateLimitDatabase {
	prepare(query: string): RateLimitStatement;
}

export interface RateLimitOptions {
	key: string;
	limit: number;
	windowSeconds: number;
	now?: number;
}

export interface RateLimitResult {
	allowed: boolean;
	count: number;
	limit: number;
	retryAfterSeconds: number;
}

/**
 * Cloudflare is the only writer of CF-Connecting-IP, and it appends the
 * connecting address to X-Forwarded-For, so the patterns only have to reject a
 * header that is not an address at all. The IPv6 bound keeps a client-supplied
 * line of hex from becoming an arbitrarily long bucket key.
 */
const IPV4_PATTERN = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const IPV6_PATTERN = /^[0-9a-fA-F:]{2,45}$/;

const looksLikeIp = (value: string): boolean =>
	IPV4_PATTERN.test(value) || (value.includes(':') && IPV6_PATTERN.test(value));

export function getClientIp(request: Request): string | null {
	// `request.cf` exists only on workerd. Without it — astro dev, or any other
	// local proxy — there is no trustworthy client key, so the caller skips
	// limiting instead of keying on a header the client can choose.
	const cf = (request as unknown as { cf?: unknown }).cf;
	if (!cf) return null;

	const direct = request.headers.get('CF-Connecting-IP')?.trim();
	const forwarded = request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim();
	const candidate = direct || forwarded;
	return candidate && looksLikeIp(candidate) ? candidate : null;
}

const UPSERT = `INSERT INTO site_rate_limits (bucket_key, window_start, count) VALUES (?, ?, 1)
ON CONFLICT(bucket_key, window_start) DO UPDATE SET count = site_rate_limits.count + 1
RETURNING count, window_start`;

const CLEANUP = 'DELETE FROM site_rate_limits WHERE window_start < ?';

/** One percent of calls also prune windows older than an hour. */
const CLEANUP_CHANCE = 0.01;
const CLEANUP_AGE_MS = 3600_000;

export async function consumeRateLimit(
	db: RateLimitDatabase,
	{ key, limit, windowSeconds, now = Date.now() }: RateLimitOptions
): Promise<RateLimitResult> {
	const windowStart = Math.floor(now / windowSeconds) * windowSeconds;

	try {
		const row = await db
			.prepare(UPSERT)
			.bind(key, windowStart)
			.first<{ count: number; window_start: number }>();
		if (!row) throw new Error('rate limit upsert returned no row');

		// The insert and the read are one statement, so two Workers in different
		// colos cannot both act on the same count.
		if (Math.random() < CLEANUP_CHANCE) {
			void db
				.prepare(CLEANUP)
				.bind(now - CLEANUP_AGE_MS)
				.run()
				.catch((error) => console.error('rate limit cleanup failed', error));
		}

		return {
			allowed: row.count <= limit,
			count: row.count,
			limit,
			retryAfterSeconds: Math.max(1, windowSeconds - (now - windowStart))
		};
	} catch (error) {
		console.error('rate limit check failed', error);
		return { allowed: true, count: 0, limit, retryAfterSeconds: 0 };
	}
}

export function rateLimitResponse(retryAfterSeconds: number): Response {
	return new Response('Too Many Requests', {
		status: 429,
		headers: {
			'Retry-After': String(retryAfterSeconds),
			'Cache-Control': 'private, no-store'
		}
	});
}
