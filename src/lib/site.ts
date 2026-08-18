import { SITES, siteFor } from './site.data.js';

/**
 * Which identity this build is for.
 *
 * One repo, one set of posts, two Cloudflare Pages projects. The variant is
 * chosen at build time by the PUBLIC_SITE environment variable, which Vite
 * inlines as __SITE_ID__ (see vite.config.ts) — so nothing about it reaches
 * the browser as a runtime lookup, and an unset variable keeps the build it
 * has always produced.
 *
 * Everything that differs between the two sites belongs in this file. If a
 * component needs a name, a domain, or an email, it reads it from here rather
 * than spelling it out, or the next variant has to hunt for it again.
 */
export interface SiteConfig {
	id: string;
	/** Origin, no trailing slash. Used for canonical URLs, RSS and the sitemap. */
	url: string;
	/** Wordmark in the header and the name in the copyright line. */
	name: string;
	/** Home page <title>. */
	title: string;
	/** Small caps line above the byline. */
	eyebrow: string;
	/** The line under it — who and where. */
	byline: string;
	/** Home page headline, split so the emphasised span stays markup. */
	headline: { before: string; emphasis: string; after: string };
	/** Home page opening paragraph. `{years}` is replaced with the year count. */
	intro: string;
	email: string;
	/** <meta name="description"> for the whole site. */
	description: string;
	ogTitle: string;
	ogDescription: string;
	/**
	 * Which section leads the home page under the hero. 'work' puts the project
	 * rows first; 'facts' keeps the numbers band there.
	 */
	leadWith: 'work' | 'facts';
	/** Whether the résumé is linked in the nav and listed in the sitemap. */
	showResume: boolean;
}

/**
 * The variant this build is for. The values live in site.data.js, which is
 * plain JavaScript so build tooling can read them with node — see the note at
 * the top of that file. Falling back rather than throwing is deliberate: an
 * unset or mistyped PUBLIC_SITE should produce the original site, not a failed
 * deploy.
 */
export const site: SiteConfig = siteFor(__SITE_ID__);

/** Every variant, for the places that need to reason about both. */
export { SITES };

/** Absolute URL for a path on this site, for canonical tags and feeds. */
export const absolute = (path: string) => `${site.url}${path === '/' ? '' : path}`;
