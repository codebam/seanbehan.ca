/**
 * Star counts and creation years for the featured projects.
 *
 * Not `language` — that stays curated, because linguist reports pastebin-r2 as
 * HTML when the interesting part is the TypeScript worker.
 *
 * On the SvelteKit site this ran once per deploy, because the home page was
 * prerendered. The page is server-rendered now, so the same four requests would
 * otherwise ride along with every visit. They are cached instead: the Worker's
 * own cache holds each response for six hours, and a module-level memo covers
 * the requests an isolate serves back to back.
 *
 * Any failure — rate limit, outage, offline build — falls back to the values
 * committed in projects.ts, so a flaky third party never costs the page its
 * project rows.
 */

import type { FeaturedProject } from './types';

const CACHE_SECONDS = 6 * 60 * 60;

let memo: { at: number; projects: FeaturedProject[] } | null = null;

export async function withLiveStats(projects: FeaturedProject[]): Promise<FeaturedProject[]> {
	if (memo && Date.now() - memo.at < CACHE_SECONDS * 1000) return memo.projects;

	const withStats = await Promise.all(
		projects.map(async (project) => {
			try {
				const res = await fetch(`https://api.github.com/repos/codebam/${project.repo}`, {
					headers: {
						Accept: 'application/vnd.github+json',
						'User-Agent': 'seanbehan.ca'
					},
					// Read by the Workers runtime; ignored elsewhere, which is why the
					// memo above exists as well.
					cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true }
				} as RequestInit);
				if (!res.ok) return project;

				const repo = (await res.json()) as { stargazers_count?: number; created_at?: string };
				return {
					...project,
					stars: repo.stargazers_count ?? project.stars,
					since: repo.created_at?.slice(0, 4) ?? project.since
				};
			} catch {
				return project;
			}
		})
	);

	memo = { at: Date.now(), projects: withStats };
	return withStats;
}
