/**
 * Star counts and creation years for the featured projects.
 *
 * Not `language` — that stays curated, because linguist reports pastebin-r2 as
 * HTML when the interesting part is the TypeScript worker.
 *
 * Rows without a repository are left alone: there is nothing to ask about them,
 * and the year committed in projects.ts is the only one anyone has.
 *
 * On the SvelteKit site this ran once per deploy, because the home page was
 * prerendered. The page is server-rendered now, so the same handful of requests
 * would otherwise ride along with every visit. They are cached instead: the
 * Worker's own cache holds each response for six hours, and a module-level memo
 * covers the requests an isolate serves back to back.
 *
 * Any failure — rate limit, outage, offline build — falls back to the values
 * committed in projects.ts, so a flaky third party never costs the page its
 * project rows.
 */

import type { FeaturedProject } from './types';

const CACHE_SECONDS = 6 * 60 * 60;

/**
 * How long the home page will wait for GitHub before drawing the rows with the
 * committed numbers. A star count is decoration; the page is the product.
 */
const TIMEOUT_MS = 1500;

/**
 * What a cold isolate waits for the whole live-stats fetch before rendering
 * anyway. The per-fetch timeout above bounds each socket; this bounds the
 * page: on a slow GitHub day the committed numbers go out and the late answer
 * still warms the memo below for the next request.
 */
const BUDGET_MS = 600;

let memo: { at: number; projects: FeaturedProject[] } | null = null;

export async function withLiveStats(projects: FeaturedProject[]): Promise<FeaturedProject[]> {
	if (memo && Date.now() - memo.at < CACHE_SECONDS * 1000) return memo.projects;

	// Local dev has no trusted CA store, so every request to GitHub fails after
	// a TLS handshake that burns the page's whole stats budget. The committed
	// numbers are exactly what dev used to fall back to anyway; skip the wait.
	if (import.meta.env.DEV) return projects;

	// Claim the memo before the requests, not after: the page renders per
	// request now, and a cold isolate serving several at once would otherwise
	// send a GitHub call per visitor rather than one per repository.
	memo = { at: Date.now(), projects };

	const fetched = Promise.all(
		projects.map(async (project) => {
			if (!project.repo) return project;

			try {
				const res = await fetch(`https://api.github.com/repos/codebam/${project.repo}`, {
					headers: {
						Accept: 'application/vnd.github+json',
						'User-Agent': 'seanbehan.ca'
					},
					// Read by the Workers runtime; ignored elsewhere, which is why the
					// memo above exists as well.
					cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
					signal: AbortSignal.timeout(TIMEOUT_MS)
				} as RequestInit);
				if (!res.ok) return project;

				const repo = (await res.json()) as { stargazers_count?: number; created_at?: string };
				return {
					...project,
					stars: repo.stargazers_count ?? project.stars,
					since: repo.created_at?.slice(0, 4) ?? project.since
				};
			} catch {
				// A rate limit, an outage, a timeout, or a runtime with no trusted
				// CA store (which is every local `astro dev`). The committed values
				// are what the rows were drawn with before this function existed.
				return project;
			}
		})
	).then((withStats) => {
		memo = { at: Date.now(), projects: withStats };
		return withStats;
	});

	const budget = new Promise<FeaturedProject[]>((resolve) =>
		setTimeout(() => resolve(projects), BUDGET_MS)
	);

	return Promise.race([fetched, budget]);
}
