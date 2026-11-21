import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FeaturedProject } from './types';

/**
 * The numbers in projects.ts are the fallback the page draws when GitHub is
 * slow or down; the merge only replaces the two fields the API actually knows
 * about. Each test loads a fresh module because live stats are memoised for six
 * hours at module scope, and DEV is flipped off to take a deployed page's path.
 */
const project = (overrides: Partial<FeaturedProject> = {}): FeaturedProject => ({
	slug: 'viewport',
	repo: 'viewport',
	since: '2026',
	title: 'Viewport',
	description: 'A Wayland compositor',
	language: 'Rust',
	stars: 4,
	mockup: {} as FeaturedProject['mockup'],
	mockupAlt: 'Screenshot of the compositor',
	tags: ['wayland'],
	challenge: 'Compose a shell in the browser',
	architecture: ['Smithay drives the session'],
	highlights: ['Zero-copy frames'],
	...overrides
});

const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });
const failingFetch = (error: Error) =>
	vi.fn(async () => {
		throw error;
	});

async function loadWithLiveStats() {
	vi.resetModules();
	const { withLiveStats } = await import('./github');
	return withLiveStats;
}

beforeEach(() => {
	vi.stubEnv('DEV', false);
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
});

describe('withLiveStats', () => {
	it('merges live star counts and creation years into the committed rows', async () => {
		const withLiveStats = await loadWithLiveStats();
		const fetchMock = vi.fn(async (url: string) => {
			if (url.endsWith('/viewport')) {
				return ok({ stargazers_count: 137, created_at: '2019-04-02T10:00:00Z' });
			}
			if (url.endsWith('/telegram-sdk')) return ok({ stargazers_count: 250 });
			throw new Error(`unexpected repository URL: ${url}`);
		});
		vi.stubGlobal('fetch', fetchMock);

		const input = [
			project(),
			project({ slug: 'telegram-sdk', repo: 'telegram-sdk', since: '2021', stars: 90 }),
			project({ slug: 'local', repo: undefined, stars: 3 })
		];
		const result = await withLiveStats(input);

		expect(result[0].stars).toBe(137);
		expect(result[0].since).toBe('2019');
		// A repo with no creation date keeps its committed year; the curated
		// language and copy never come from the API.
		expect(result[1].stars).toBe(250);
		expect(result[1].since).toBe('2021');
		expect(result[1].language).toBe('Rust');
		// No repository means nothing to ask, so that row is left alone.
		expect(result[2]).toEqual(input[2]);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.github.com/repos/codebam/viewport',
			expect.objectContaining({
				headers: expect.objectContaining({ Accept: 'application/vnd.github+json' })
			})
		);
	});

	it('returns the committed numbers when a request rejects', async () => {
		const withLiveStats = await loadWithLiveStats();
		vi.stubGlobal('fetch', failingFetch(new Error('network down')));

		const input = [project()];
		const result = await withLiveStats(input);

		expect(result).toEqual(input);
		expect(result[0].stars).toBe(4);
	});

	it('returns the committed numbers when a request times out', async () => {
		const withLiveStats = await loadWithLiveStats();
		// The per-request AbortSignal surfaces a timeout as a rejected fetch;
		// the page budget hands back the same rows if an answer arrives late.
		vi.stubGlobal(
			'fetch',
			failingFetch(new DOMException('The operation timed out', 'TimeoutError'))
		);

		const result = await withLiveStats([project()]);

		expect(result[0].stars).toBe(4);
		expect(result[0].since).toBe('2026');
	});

	it('leaves the input array untouched on both paths', async () => {
		const input = [project(), project({ slug: 'local', repo: undefined })];
		const before = structuredClone(input);

		let withLiveStats = await loadWithLiveStats();
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => ok({ stargazers_count: 999 }))
		);
		const live = await withLiveStats(input);
		expect(input).toEqual(before);
		expect(live).not.toBe(input);
		expect(live[0]).not.toBe(input[0]);

		withLiveStats = await loadWithLiveStats();
		vi.stubGlobal('fetch', failingFetch(new Error('network down')));
		const fallback = await withLiveStats(input);
		expect(input).toEqual(before);
		expect(fallback[0]).toBe(input[0]);
	});
});
