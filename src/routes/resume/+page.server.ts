import { error } from '@sveltejs/kit';
import { site } from '$lib/site';

/**
 * The codebam variant does not pitch a résumé: it is omitted from the nav and
 * the sitemap. The route itself still existed, so the URL 200'd with a page
 * titled "Résumé — codebam". Unknown on that variant, the same way an
 * unpublished tag is unknown. prerender follows the same flag so a
 * codebam build does not visit the route (a 404 during prerender is a
 * failed deploy). load() still throws so a stray hit in dev 404s too.
 */
export const prerender = site.showResume;

export const load = () => {
	if (!site.showResume) throw error(404, 'Not found.');
	return {
		description: `Résumé for ${site.name}, full-stack developer.`,
		ogTitle: `Résumé — ${site.name}`
	};
};
