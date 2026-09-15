import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	consumeRateLimit,
	getClientIp,
	rateLimitResponse,
	type RateLimitDatabase,
	type RateLimitStatement
} from './rateLimit';

/**
 * The migration is read, not repeated: this exercises the exact SQL that
 * `wrangler d1 migrations apply` will run in production.
 *
 * The adapter below sits on node:sqlite rather than better-sqlite3, which is
 * not a dependency of this repo. scripts/repair-post-paragraphs.test.mjs uses
 * the same module to exercise its SQL, and the D1 contract the limiter needs
 * (bind, first, run) is small enough to stand in for exactly.
 */
const MIGRATION = readFileSync(
	new URL('../../migrations/site/0002_site_rate_limits.sql', import.meta.url),
	'utf8'
);

class SqliteStatement implements RateLimitStatement {
	constructor(
		private readonly db: DatabaseSync,
		private readonly query: string,
		private readonly values: (string | number)[] = []
	) {}

	bind(...values: unknown[]): SqliteStatement {
		return new SqliteStatement(this.db, this.query, values as (string | number)[]);
	}

	async first<T>(): Promise<T | null> {
		const row = this.db.prepare(this.query).get(...this.values);
		return (row as unknown as T | undefined) ?? null;
	}

	async run(): Promise<unknown> {
		this.db.prepare(this.query).run(...this.values);
		return { success: true };
	}
}

class SqliteRateLimitDatabase implements RateLimitDatabase {
	private readonly db = new DatabaseSync(':memory:');

	constructor() {
		this.db.exec(MIGRATION);
	}

	prepare(query: string): RateLimitStatement {
		return new SqliteStatement(this.db, query);
	}

	close(): void {
		this.db.close();
	}

	/** The table's live rows, for asserting what the sweep kept. */
	windows(): { windowStart: number; count: number }[] {
		return this.db
			.prepare(
				'SELECT window_start AS windowStart, count FROM site_rate_limits ORDER BY window_start'
			)
			.all() as unknown as { windowStart: number; count: number }[];
	}
}

const openDatabases: SqliteRateLimitDatabase[] = [];

const openDatabase = (): SqliteRateLimitDatabase => {
	const db = new SqliteRateLimitDatabase();
	openDatabases.push(db);
	return db;
};

beforeEach(() => {
	// The limiter sweeps expired windows on 1% of calls; pin the roll so a
	// counter assertion can never trip over it.
	vi.spyOn(Math, 'random').mockReturnValue(0.5);
});

afterEach(() => {
	vi.restoreAllMocks();
	for (const db of openDatabases.splice(0)) db.close();
});

describe('consumeRateLimit', () => {
	it('allows the limit inside one window and denies the call after it', async () => {
		const db = openDatabase();
		const options = { key: 'checkout:203.0.113.7', limit: 3, windowSeconds: 60, now: 1_000_000 };

		for (let attempt = 1; attempt <= 3; attempt += 1) {
			const result = await consumeRateLimit(db, options);
			expect(result.allowed).toBe(true);
			expect(result.count).toBe(attempt);
			expect(result.limit).toBe(3);
		}

		const denied = await consumeRateLimit(db, options);
		expect(denied.allowed).toBe(false);
		expect(denied.count).toBe(4);
		// 1_000_000 is 40s into a window that started at 999_960.
		expect(denied.retryAfterSeconds).toBe(20);
		expect(denied.retryAfterSeconds).toBeGreaterThanOrEqual(1);
		expect(denied.retryAfterSeconds).toBeLessThanOrEqual(60);
	});

	it('starts a fresh counter in the next window', async () => {
		const db = openDatabase();
		const options = { key: 'checkout:203.0.113.7', limit: 1, windowSeconds: 60, now: 1_000_030 };

		expect((await consumeRateLimit(db, options)).allowed).toBe(true);
		expect((await consumeRateLimit(db, options)).allowed).toBe(false);

		const next = await consumeRateLimit(db, { ...options, now: options.now + 60 });
		expect(next.allowed).toBe(true);
		expect(next.count).toBe(1);
	});

	it('keeps different keys in different buckets', async () => {
		const db = openDatabase();
		const base = { limit: 1, windowSeconds: 60, now: 5_000 };

		expect((await consumeRateLimit(db, { ...base, key: 'checkout:198.51.100.1' })).allowed).toBe(
			true
		);
		expect((await consumeRateLimit(db, { ...base, key: 'checkout:198.51.100.1' })).allowed).toBe(
			false
		);
		expect((await consumeRateLimit(db, { ...base, key: 'checkout:198.51.100.2' })).allowed).toBe(
			true
		);
	});

	it('prunes windows older than an hour when the sweep rolls', async () => {
		const db = openDatabase();
		const options = { key: 'checkout:203.0.113.7', limit: 10, windowSeconds: 60 };

		await consumeRateLimit(db, { ...options, now: 1_000_000 });
		// 1,000,000 + an hour + a window: the first row is past the sweep age.
		vi.mocked(Math.random).mockReturnValue(0);
		await consumeRateLimit(db, { ...options, now: 4_600_060 });

		expect(db.windows()).toEqual([{ windowStart: 4_600_020, count: 1 }]);
	});

	it('fails open when the database errors', async () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		// A real D1 failure rejects rather than throwing from prepare, so the
		// async path is the one worth pinning.
		const statement: RateLimitStatement = {
			bind: () => statement,
			first: async () => {
				throw new Error('D1 unavailable');
			},
			run: async () => ({ success: true })
		};
		const db: RateLimitDatabase = { prepare: () => statement };

		const result = await consumeRateLimit(db, {
			key: 'checkout:203.0.113.7',
			limit: 10,
			windowSeconds: 60,
			now: 1_000_000
		});

		expect(result).toEqual({ allowed: true, count: 0, limit: 10, retryAfterSeconds: 0 });
		expect(error).toHaveBeenCalledWith('rate limit check failed', expect.any(Error));
	});
});

const requestWith = (headers: Record<string, string>, cf?: unknown) => {
	const request = new Request('https://codebam.ca/checkout/download', { headers });
	if (cf !== undefined) Object.defineProperty(request, 'cf', { value: cf });
	return request;
};

describe('getClientIp', () => {
	it('returns null when request.cf is absent, even with an address header', () => {
		expect(getClientIp(requestWith({ 'CF-Connecting-IP': '203.0.113.7' }))).toBeNull();
		expect(getClientIp(requestWith({ 'X-Forwarded-For': '203.0.113.7' }))).toBeNull();
	});

	it('prefers CF-Connecting-IP to the first X-Forwarded-For entry', () => {
		const request = requestWith(
			{
				'CF-Connecting-IP': '203.0.113.7',
				'X-Forwarded-For': '198.51.100.9, 203.0.113.7'
			},
			{ colo: 'YYZ' }
		);

		expect(getClientIp(request)).toBe('203.0.113.7');
	});

	it('falls back to the first forwarded entry and rejects junk', () => {
		expect(
			getClientIp(requestWith({ 'X-Forwarded-For': '198.51.100.9, 203.0.113.7' }, { colo: 'YYZ' }))
		).toBe('198.51.100.9');
		expect(
			getClientIp(requestWith({ 'CF-Connecting-IP': 'not an address' }, { colo: 'YYZ' }))
		).toBeNull();
		expect(getClientIp(requestWith({ 'CF-Connecting-IP': '2001:db8::1' }, { colo: 'YYZ' }))).toBe(
			'2001:db8::1'
		);
	});
});

describe('rateLimitResponse', () => {
	it('answers 429 with the retry hint and no-store', () => {
		const response = rateLimitResponse(42);
		expect(response.status).toBe(429);
		expect(response.headers.get('Retry-After')).toBe('42');
		expect(response.headers.get('Cache-Control')).toBe('private, no-store');
	});
});
