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

const seanbehan: SiteConfig = {
	id: 'seanbehan',
	url: 'https://seanbehan.ca',
	name: 'Sean Behan',
	title: 'Sean Behan — Full-stack developer',
	eyebrow: 'Full-stack developer · Linux',
	byline: 'Sean Behan · Ontario, Canada',
	headline: {
		before: 'I build software that lives ',
		emphasis: 'close to the metal',
		after: ' and ships to the edge.'
	},
	intro:
		'{years} years of web applications, from database to frontend. I daily-drive NixOS, write Rust and TypeScript, and build everything in the open — a Wayland compositor, bots on Cloudflare Workers, and an encrypted pastebin.',
	email: 'sean@seanbehan.ca',
	description:
		'Sean Behan — full-stack developer working in Rust, TypeScript and NixOS. Writing about Linux, Cloudflare Workers, and building software.',
	ogTitle: 'Sean Behan',
	ogDescription: 'Full-stack developer. Rust, TypeScript, NixOS, and open source.',
	leadWith: 'facts',
	showResume: true
};

/**
 * The handle-first variant. Same posts, same projects, different front door:
 * the work leads, the résumé is not part of the pitch, and the name gives way
 * to the handle people actually find the code under.
 */
const codebam: SiteConfig = {
	id: 'codebam',
	url: 'https://codebam.ca',
	name: 'codebam',
	title: 'codebam — Rust, TypeScript, NixOS',
	eyebrow: 'Open source · Linux',
	byline: '@codebam · Ontario, Canada',
	headline: {
		before: 'Everything I build ships ',
		emphasis: 'in the open',
		after: ' — compositors, workers, and the odd bot.'
	},
	intro:
		'{years} years of building software, most of it public. I daily-drive NixOS, write Rust and TypeScript, and put the results on GitHub — a Wayland compositor, bots on Cloudflare Workers, and an encrypted pastebin.',
	email: 'codebam@codebam.ca',
	description:
		'codebam — open source in Rust, TypeScript and NixOS. A Wayland compositor, Cloudflare Workers, and writing about Linux.',
	ogTitle: 'codebam',
	ogDescription: 'Open source in Rust, TypeScript and NixOS.',
	leadWith: 'work',
	showResume: false
};

const SITES: Record<string, SiteConfig> = { seanbehan, codebam };

/**
 * Falling back rather than throwing is deliberate: an unset or mistyped
 * PUBLIC_SITE should produce the original site, not a failed deploy.
 */
export const site: SiteConfig = SITES[__SITE_ID__] ?? seanbehan;

/** Absolute URL for a path on this site, for canonical tags and feeds. */
export const absolute = (path: string) => `${site.url}${path === '/' ? '' : path}`;
