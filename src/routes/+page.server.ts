import { dev } from '$app/environment';
import getPosts from '$lib/getPosts';
import { featuredProjects } from '$lib/projects';
import type { FeaturedProject } from '$lib/types';

/**
 * Refresh star counts from GitHub.
 *
 * Only stars — `language` stays curated, because linguist reports
 * pastebin-worker as HTML when the interesting part is the Rust worker.
 *
 * The site is prerendered, so in a real build this runs once per deploy and
 * visitors never pay for these requests. Any failure — rate limit, outage,
 * offline build — falls back to the values committed in $lib/projects, so the
 * build never breaks on a flaky third party.
 *
 * Skipped in dev, where load() runs per request and every page view would
 * otherwise fire four GitHub calls.
 */
async function withLiveStats(projects: FeaturedProject[]): Promise<FeaturedProject[]> {
	if (dev) return projects;

	return Promise.all(
		projects.map(async (project) => {
			try {
				const res = await fetch(`https://api.github.com/repos/codebam/${project.repo}`, {
					headers: {
						Accept: 'application/vnd.github+json',
						'User-Agent': 'seanbehan.ca'
					}
				});
				if (!res.ok) return project;

				const repo = (await res.json()) as { stargazers_count?: number };
				return { ...project, stars: repo.stargazers_count ?? project.stars };
			} catch {
				return project;
			}
		})
	);
}

export const load = async () => {
	const [posts, projects] = await Promise.all([getPosts(), withLiveStats(featuredProjects)]);
	return { posts, projects };
};
