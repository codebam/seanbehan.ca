/**
 * The site table, as plain JavaScript.
 *
 * It lives outside site.ts so that build tooling can read it with plain
 * `node` — tools/og/build-cards.mjs needs the name and origin of the variant
 * it is drawing cards for, and importing the TypeScript module would mean
 * either a compile step or a second copy of the identity that drifts.
 * site.ts owns the type and the selection; this file owns the values.
 *
 * @typedef {import('./site').SiteConfig} SiteConfig
 */

/** @type {SiteConfig} */
const seanbehan = {
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
/** @type {SiteConfig} */
const codebam = {
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

/**
 * Every variant, keyed by the value PUBLIC_SITE takes.
 * @type {Record<string, SiteConfig>}
 */
export const SITES = { seanbehan, codebam };

/**
 * Falling back rather than throwing is deliberate: an unset or mistyped
 * PUBLIC_SITE should produce the original site, not a failed deploy.
 */
export const siteFor = (/** @type {string | undefined} */ id) => SITES[id ?? ''] ?? seanbehan;
