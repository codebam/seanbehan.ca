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
	/**
	 * Whether this variant is hiring-shaped, and what it says about it.
	 *
	 * A reader deciding whether to make an offer cannot tell from a portfolio
	 * whether the person behind it is reachable, and "open to work" buried on
	 * the contact page answers that question too late. `null` is the handle
	 * variant, which pitches the code and has no status to declare.
	 */
	availability: { label: string; detail: string } | null;
	/** The hero's primary button. Resolved through `linkHref`. */
	primaryAction: SiteLink;
	/**
	 * Header nav, in order, excluding Contact — Contact is always last and is
	 * styled as the page's one imperative, so it is rendered by the frame.
	 *
	 * Four items, not six: at six the row wrapped to two lines on a phone, and
	 * the wrap put Résumé — the one page a hiring reader came for — on the
	 * second of them. Everything dropped is still in the footer.
	 */
	nav: SiteLink[];
	about: {
		eyebrow: string;
		headline: string;
		intro: string;
	};
	/**
	 * The home page's work history, newest first, between the numbers and
	 * the project rows. Follows `resume/resume.md` the way `projects.ts`
	 * does — the résumé is the source, and copy here that stops matching it
	 * is the copy that is wrong. `null` on the variant with no résumé to
	 * shorten, which renders no section rather than an empty heading.
	 */
	experience: SiteExperience[] | null;
}

/**
 * A link in the site's own chrome, and the origin it belongs to when that is
 * not this one. `via` names the resolver rather than spelling out an absolute
 * URL, so the two variants stay one table of copy and neither has to know
 * where the other lives.
 */
export interface SiteLink {
	label: string;
	href: string;
	via?: 'writing' | 'codebam';
}

/**
 * One dated row of the home page's work history.
 *
 * The résumé is the detailed telling; these rows are the same facts at one
 * line each, in the same order. See `experience` on SiteConfig.
 */
export interface SiteExperience {
	role: string;
	/** Employer, or `Open Source` for self-directed work. */
	org: string;
	/** The date range as the résumé writes it, e.g. `Apr. 2021 – Oct. 2021`. */
	period: string;
	/** One line, drawn from the same entry in resume/resume.md. */
	note: string;
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

/**
 * Whether an href leaves this origin for the repo's other one.
 *
 * The middleware redirects whole sections across (writing to seanbehan.ca,
 * projects and legal to codebam.ca), so chrome links built with writingHref,
 * projectHref and codebamHref silently change origin on one variant. Truly
 * external URLs are not siblings — GitHub already announces itself with a new
 * tab — only the family's own other front door counts.
 */
export const isSiblingHref = (href: string) =>
	/^https?:\/\//.test(href) &&
	!href.startsWith(site.url) &&
	Object.values(SITES).some(
		(variant) => href === variant.url || href.startsWith(`${variant.url}/`)
	);

/** The host a sibling href points at, for the marker's screen-reader note. */
export const siblingHost = (href: string) => new URL(href).host;

/** Commercial work ships under the code-first identity. */
export const codebamHref = (path: string) =>
	site.id === 'seanbehan' ? `${SITES.codebam.url}${path}` : path;

/**
 * Where a chrome link actually points.
 *
 * The nav and the hero's primary action are data in site.data.js so that the
 * two variants differ by copy rather than by branch; this is the half that
 * still has to know about origins. A link with no `via` is local to whichever
 * build is rendering it.
 */
export const linkHref = (link: SiteLink): string =>
	link.via === 'writing'
		? writingHref(link.href)
		: link.via === 'codebam'
			? codebamHref(link.href)
			: link.href;
