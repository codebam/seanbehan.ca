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

/** Each check: a path, the status it must answer with, and what must be in it. */
const CHECKS = [
	{ path: '/', contains: ['Latest writing', 'Selected work'] },
	{ path: '/posts', contains: ['Writing', 'Search posts'] },
	{ path: '/posts/tags', contains: ['Tags'] },
	{ path: '/posts/tag/nixos', contains: ['NixOS', 'Subscribe via RSS'] },
	{ path: '/posts/nixos', contains: ['NixOS Flakes', 'shiki', 'On this page'] },
	{ path: '/contact', contains: ['Say', 'mailto:'] },
	{ path: '/rss.xml', contains: ['<rss version="2.0"', '<content:encoded>'] },
	{ path: '/posts/tag/nixos/rss.xml', contains: ['<rss version="2.0"'] },
	{ path: '/sitemap.xml', contains: ['<urlset', '/posts/nixos'] },
	{ path: '/robots.txt', contains: ['Sitemap:', 'Disallow: /_emdash/'] },
	{ path: '/site.webmanifest', contains: ['"short_name"'] },
	{ path: '/.well-known/security.txt', contains: ['Contact: mailto:'] },
	{ path: '/og/nixos.png', type: 'image/png' },
	{ path: '/og/site.png', type: 'image/png' },
	{ path: '/no-such-page', status: 404 }
];

let failed = 0;

for (const check of CHECKS) {
	const expected = check.status ?? 200;
	const url = `${base}${check.path}`;

	try {
		const res = await fetch(url);
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

		if (problems.length) {
			failed++;
			console.error(`FAIL ${check.path}\n     ${problems.join('\n     ')}`);
		} else {
			console.log(`ok   ${check.path}`);
		}
	} catch (error) {
		failed++;
		console.error(`FAIL ${check.path}\n     ${error.message}`);
	}
}

console.log(`\n${CHECKS.length - failed}/${CHECKS.length} checks passed against ${base}`);
process.exit(failed ? 1 : 0);
