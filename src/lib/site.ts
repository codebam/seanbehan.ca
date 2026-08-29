import { SITES, siteFor } from './site.data.js';

/**
 * Which identity this build is for.
 *
 * One repo, one set of posts, two Cloudflare Workers. The variant is chosen
 * by the PUBLIC_SITE environment variable at build time; an unset variable
 * keeps the build it has always produced.
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
	about: {
		eyebrow: string;
		headline: string;
		intro: string;
	};
}

export const LEGAL_NAME = 'Sean Behan';
export const HANDLE = 'codebam';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/sean-behan';

/** Started building software in January 2014. Whole elapsed years from that month. */
const CAREER_START = Date.UTC(2014, 0, 1);
const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
export const yearsBuilding = (now = Date.now()) => Math.floor((now - CAREER_START) / MS_PER_YEAR);

/**
 * The variant this build is for. The values live in site.data.js, which is
 * plain JavaScript so build tooling can read them with node — see the note at
 * the top of that file. Falling back rather than throwing is deliberate: an
 * unset or mistyped PUBLIC_SITE should produce the original site, not a failed
 * deploy.
 *
 * Read straight from `import.meta.env` rather than through a Vite `define`:
 * Astro exposes PUBLIC_-prefixed variables itself, and the pages that need the
 * identity render on the Worker, where a build-time constant would freeze the
 * value for both projects deployed from this repo.
 */
export const site: SiteConfig = siteFor(import.meta.env.PUBLIC_SITE);

/** Every variant, for the places that need to reason about both. */
export { SITES };

/** Absolute URL for a path on this site, for canonical tags and feeds. */
export const absolute = (path: string) => {
	if (/^https?:\/\//.test(path)) return path;
	const normalized = path === '/' ? '' : path.replace(/\/+$/, '');
	return `${site.url}${normalized}`;
};

/** The other origin this repo publishes. */
export const sibling = site.id === 'seanbehan' ? SITES.codebam : SITES.seanbehan;

/**
 * seanbehan.ca is the publishing origin. The codebam Worker redirects writing
 * there, but this remains the fallback canonical for previews and any response
 * rendered before that redirect policy runs.
 */
export const canonicalUrl = (path: string, opts?: { post?: boolean; draft?: boolean }) => {
	const normalized = path === '/' ? '' : path.replace(/\/+$/, '');
	if (opts?.post && !opts.draft) return `${SITES.seanbehan.url}${normalized}`;
	return absolute(normalized || '/');
};

/** Writing has one home even though both front doors advertise it. */
export const writingHref = (path: string) =>
	site.id === 'codebam' ? `${SITES.seanbehan.url}${path}` : path;

/** Project case studies belong to the code-first origin. */
export const projectHref = (path: string) =>
	site.id === 'seanbehan' ? `${SITES.codebam.url}${path}` : path;

/** Commercial work ships under the code-first identity. */
export const codebamHref = (path: string) =>
	site.id === 'seanbehan' ? `${SITES.codebam.url}${path}` : path;
