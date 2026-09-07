#!/usr/bin/env node
/**
 * Ask a running site for every kind of page it serves and check what comes
 * back.
 *
 * The pages render on a Worker out of D1, so the things most likely to break —
 * a query, a template, the highlighter, the card renderer — only break at
 * request time. A unit test cannot see any of it; this can, against dev or
 * against the deployed site.
 *
 * Usage:
 *   node scripts/smoke.mjs [base-url]     (default http://localhost:4321)
 */

const base = (process.argv[2] ?? 'http://localhost:4321').replace(/\/$/, '');

/** Each check: a path, optional request headers, the status it must answer
    with, and what must be in it. */
const CHECKS = [
	{ path: '/', contains: ['Latest writing', 'Selected work'] },
	{ path: '/posts', contains: ['Writing', 'Search posts'] },
	{ path: '/posts/tags', contains: ['Tags'] },
	{ path: '/posts/tag/nixos', contains: ['NixOS', 'Subscribe via RSS'] },
	{ path: '/posts/nixos', contains: ['NixOS Flakes', 'shiki', 'On this page'] },
	// The machine-readable variants of that post: the suffixed routes directly,
	// and the header negotiation that reaches the same answer from the HTML URL.
	{
		path: '/posts/nixos.md',
		type: 'text/markdown',
		contains: ['# ', 'Published:', '```']
	},
	{
		path: '/posts/nixos.json',
		type: 'application/json',
		contains: ['"content"', '"content_url"', 'NixOS']
	},
	{
		path: '/posts/nixos',
		headers: { Accept: 'text/markdown' },
		type: 'text/markdown',
		contains: ['# ']
	},
	{
		path: '/posts/nixos',
		headers: { Accept: 'application/json' },
		type: 'application/json',
		contains: ['"url"']
	},
	{
		path: '/posts/nixos',
		headers: {
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
		},
		type: 'text/html',
		contains: ['NixOS Flakes']
	},
	{ path: '/contact', contains: ['Say', 'mailto:'] },
	// The résumé is the page whose words come from neither D1 nor the bundle: the
	// markup is read out of R2 at request time, so this is the check that notices
	// a bucket the site lost sight of — and /resume.pdf is the one route that
	// answers with bytes this Worker did not produce. Locally it wants
	// `npm run resume:seed` to have run once.
	{ path: '/resume', contains: ['resume-doc', 'SEAN BEHAN'] },
	// The résumé's markdown is the source CI uploaded beside the artifacts this
	// page and the PDF were built from, so the check is the file's own words.
	{ path: '/resume.md', type: 'text/markdown', contains: ['EXPERIENCE'] },
	{
		path: '/resume',
		headers: { Accept: 'text/markdown' },
		type: 'text/markdown',
		contains: ['EXPERIENCE']
	},
	{ path: '/resume.pdf', type: 'application/pdf' },
	{ path: '/rss.xml', contains: ['<rss version="2.0"', '<content:encoded>'] },
	{ path: '/posts/tag/nixos/rss.xml', contains: ['<rss version="2.0"'] },
	{ path: '/sitemap.xml', contains: ['<urlset', '/posts/nixos'] },
	{ path: '/robots.txt', contains: ['Sitemap:', 'Disallow: /_emdash/'] },
	// The agent briefing: the formats, the sections, and a recent list whose
	// links must be the markdown ones.
	{
		path: '/llms.txt',
		type: 'text/plain',
		contains: [
			'How to fetch this site',
			'## Recent writing',
			'](https://seanbehan.ca/posts/',
			'/resume.md'
		]
	},
	{ path: '/site.webmanifest', contains: ['"short_name"'] },
	{ path: '/.well-known/security.txt', contains: ['Contact: mailto:'] },
	{ path: '/og/nixos.png', type: 'image/png' },
	{ path: '/og/site.png', type: 'image/png' },
	{ path: '/no-such-page', status: 404 }
];

let failed = 0;

/**
 * One attempt at one check: the problems it found, or an empty list.
 *
 * A cold dev server compiles a route on its first request, and a request that
 * arrives mid-compile can be answered with a truncated body — so a failure is
 * retried once before it counts. Against a deployed site the first attempt is
 * the only one that ever runs.
 */
async function attempt(check) {
	const expected = check.status ?? 200;
	const url = `${base}${check.path}`;

	try {
		const res = await fetch(url, check.headers ? { headers: check.headers } : undefined);
		const problems = [];

		if (res.status !== expected) problems.push(`status ${res.status}, wanted ${expected}`);

		if (check.type && !res.headers.get('content-type')?.startsWith(check.type)) {
			problems.push(`content-type ${res.headers.get('content-type')}, wanted ${check.type}`);
		}

		if (check.contains) {
			const body = await res.text();
			for (const needle of check.contains) {
				if (!body.includes(needle)) problems.push(`missing “${needle}”`);
			}
		}

		return problems;
	} catch (error) {
		return [error.message];
	}
}

for (const check of CHECKS) {
	let problems = await attempt(check);

	if (problems.length) {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		problems = await attempt(check);
	}

	if (problems.length) {
		failed++;
		console.error(`FAIL ${check.path}\n     ${problems.join('\n     ')}`);
	} else {
		console.log(`ok   ${check.path}`);
	}
}

console.log(`\n${CHECKS.length - failed}/${CHECKS.length} checks passed against ${base}`);
process.exit(failed ? 1 : 0);
