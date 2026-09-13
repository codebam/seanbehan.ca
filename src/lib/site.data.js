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
	title: 'Sean Behan — Senior full-stack developer',
	eyebrow: 'Senior full-stack developer · Linux',
	byline: 'Sean Behan · Ontario, Canada',
	headline: {
		before: 'I build software that lives ',
		emphasis: 'close to the metal',
		after: ' and ships to the edge.'
	},
	intro:
		'Professional web experience since 2018, from database to frontend. I daily-drive NixOS, write Rust and TypeScript, and ship most of what I build in the open — a Wayland compositor, bots on Cloudflare Workers, and a pastebin on R2. The paid Stream control plane is the exception.',
	email: 'sean@seanbehan.ca',
	// The two lines below are the ones a hiring reader meets before the page:
	// Google's snippet, the social card, the footer and /llms.txt all quote
	// them. Both name the place and the status, because a recruiter filtering
	// for "Toronto" or "open to work" has nothing else on the first screen to
	// read — and the stack keywords live in the description rather than the
	// card, where there is room for them.
	description:
		'Sean Behan — senior full-stack developer in Ontario, Canada. Rust, TypeScript, NixOS and Cloudflare Workers; open to full-time work, remote or GTA hybrid.',
	ogTitle: 'Sean Behan',
	// Kept near the length of the line it replaces: this string is the
	// social card's tagline, set at 26px beside the host on a 1200px card.
	ogDescription: 'Senior full-stack developer · Ontario, Canada · Open to work.',
	leadWith: 'facts',
	showResume: true,
	availability: {
		label: 'Open to work',
		detail: 'Full-time · remote, or hybrid in the Greater Toronto Area'
	},
	// This origin is the one an employer reads, so its first ask is the résumé
	// and its header leads with it. "Read the writing" moves to the quiet row
	// beside GitHub — still one click away, no longer the primary action.
	primaryAction: { label: 'View the résumé', href: '/resume' },
	nav: [
		{ label: 'Work', href: '/#work' },
		{ label: 'Résumé', href: '/resume' },
		{ label: 'Writing', href: '/posts', via: 'writing' },
		{ label: 'Services', href: '/services', via: 'codebam' }
	],
	// The home page's work history, condensed from resume/resume.md — that
	// file is the source, and this follows it the way projects.ts does: when
	// a date or a number here stops matching the résumé, this is the copy
	// that is wrong. Newest first.
	experience: [
		{
			role: 'Independent Developer',
			org: 'Open Source',
			period: '2021 – Present',
			note: 'Built and run Codebam Stream, a paid live-streaming control plane on Cloudflare; wrote the Telegram bot framework with 214 forks and 120 npm releases.'
		},
		{
			role: 'Frontend Web Developer',
			org: 'AssetDash',
			period: 'Apr. 2021 – Oct. 2021',
			note: 'Rebuilt the company site on Next.js, TypeScript and React with a Firebase backend; bounce rate down 15%, user engagement up 20%.'
		},
		{
			role: 'Assistant Automation Coordinator',
			org: 'Elections Canada',
			period: 'Oct. 2019',
			note: 'Kept polling-station computer systems online through the 2019 federal election alongside a team of 10+.'
		},
		{
			role: 'Development Intern',
			org: 'AVROD',
			period: 'Sept. 2019 – Apr. 2020',
			note: 'Built a web store with Django and MySQL as a course placement at the company.'
		},
		{
			role: 'IT Student Advisor',
			org: 'Trent University IT',
			period: 'May 2018 – Apr. 2020',
			note: 'Diagnosed and repaired student and faculty machines at the library front desk across Windows and macOS.'
		}
	],
	about: {
		eyebrow: 'Sean Behan · codebam',
		headline: 'I build systems from the database to the display server.',
		intro:
			'I am a senior full-stack developer in Ontario, Canada. I have worked across web applications, Linux infrastructure and open source since my first dated professional role in 2018, with a current focus on Rust, TypeScript, NixOS and Cloudflare Workers.'
	}
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
		before: 'Most of what I build ships ',
		emphasis: 'in the open',
		after: ' — compositors, workers, and the odd bot.'
	},
	intro:
		'Building software since 2018, most of it in public. I daily-drive NixOS, write Rust and TypeScript, and put the results on GitHub — a Wayland compositor, bots on Cloudflare Workers, and a pastebin on R2. The paid Stream control plane stays private.',
	email: 'codebam@codebam.ca',
	description:
		'codebam — open source in Rust, TypeScript and NixOS. A Wayland compositor, Cloudflare Workers, and writing about Linux.',
	ogTitle: 'codebam',
	ogDescription: 'Open source in Rust, TypeScript and NixOS.',
	leadWith: 'work',
	showResume: false,
	// Nobody is being hired through the handle's front door, so there is no
	// status to declare and nothing to point at but the work and the writing.
	availability: null,
	primaryAction: { label: 'Work with me', href: '/services' },
	nav: [
		{ label: 'Work', href: '/#work' },
		{ label: 'Products', href: '/products/cloudflare-workers-production-kit' },
		{ label: 'Writing', href: '/posts', via: 'writing' },
		{ label: 'Services', href: '/services' }
	],
	// No résumé on this origin, so there is no history to shorten into a
	// section; it renders nothing rather than an empty heading.
	experience: null,
	about: {
		eyebrow: '@codebam · Ontario, Canada',
		headline: 'The handle behind the repositories.',
		intro:
			'codebam is Sean Behan: a developer building open-source software in Rust and TypeScript. The work ranges from a Wayland compositor to small services designed around Cloudflare Workers, D1 and R2.'
	}
};

/**
 * Every variant, keyed by the value PUBLIC_SITE takes.
 * @type {Record<string, SiteConfig>}
 */
export const SITES = { seanbehan, codebam };

/**
 * Commercial facts only the operator can approve.
 *
 * A null field is deliberate: the services and contact pages render a
 * number-free fallback for it today, and the supplied string verbatim once it
 * is set here. Nothing in a template has to change when that happens, and no
 * price, timeline or reply window is invented to fill the gap.
 *
 * @typedef {{
 *   startingPrice: string | null,
 *   timeline: string | null,
 *   replyWindow: string | null
 * }} CommerceFacts
 */
/** @type {{ codebam: CommerceFacts }} */
export const COMMERCE = {
	codebam: {
		// OPERATOR: an honest starting price or band, e.g. 'Projects start at $2,000 CAD'.
		startingPrice: null,
		// OPERATOR: a typical timeline, e.g. 'Typically 2–4 weeks from an approved scope'.
		timeline: null,
		// OPERATOR: a reply window, e.g. 'Replies within 1–2 business days'.
		replyWindow: null
	}
};

/**
 * Falling back rather than throwing is deliberate: an unset or mistyped
 * PUBLIC_SITE should produce the original site, not a failed deploy.
 */
export const siteFor = (/** @type {string | undefined} */ id) => SITES[id ?? ''] ?? seanbehan;
