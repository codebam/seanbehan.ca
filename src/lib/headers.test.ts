// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The same security headers are set in two places: the project-root `_headers`
 * file, which Cloudflare applies to prerendered pages served straight off the
 * CDN, and SECURITY_HEADERS in src/hooks.server.ts, which covers everything the
 * Worker itself produces. Both files say they must stay in sync; this is what
 * makes that true, because a header added to one and forgotten in the other
 * fails silently on exactly one half of the site.
 *
 * Cache-Control is excluded: the two deliberately differ in intent (the Worker
 * respects a route's own value, `_headers` overrides per path), and the paths
 * below the blanket rule set their own.
 */
const IGNORED = new Set(['cache-control']);

/** The `/*` block of _headers, as { header: value }. */
function blanketHeaders(): Record<string, string> {
	const text = readFileSync(resolve('_headers'), 'utf8');
	const headers: Record<string, string> = {};

	let inBlanket = false;
	for (const line of text.split('\n')) {
		if (!line.startsWith(' ') && !line.startsWith('\t')) {
			inBlanket = line.trim() === '/*';
			continue;
		}
		if (!inBlanket) continue;

		const [name, ...rest] = line.trim().split(':');
		if (!rest.length) continue;
		headers[name.trim().toLowerCase()] = rest.join(':').trim();
	}
	return headers;
}

/** SECURITY_HEADERS from hooks.server.ts, read as source rather than imported. */
function hookHeaders(): Record<string, string> {
	const source = readFileSync(resolve('src/hooks.server.ts'), 'utf8');
	const block = source.match(/const SECURITY_HEADERS = \{([\s\S]*?)\n\} as const;/);
	expect(block, 'SECURITY_HEADERS not found in src/hooks.server.ts').not.toBeNull();

	const headers: Record<string, string> = {};
	for (const [, name, value] of block![1].matchAll(/'([\w-]+)':\s*\n?\s*'([^']*)'/g)) {
		headers[name.toLowerCase()] = value;
	}
	return headers;
}

describe('security headers', () => {
	const fromFile = blanketHeaders();
	const fromHook = hookHeaders();

	const names = [...new Set([...Object.keys(fromFile), ...Object.keys(fromHook)])].filter(
		(name) => !IGNORED.has(name)
	);

	it('declares the same set in _headers and hooks.server.ts', () => {
		expect(names.length).toBeGreaterThan(0);
		for (const name of names) {
			expect(fromFile[name], `${name}: missing from _headers`).toBeDefined();
			expect(fromHook[name], `${name}: missing from hooks.server.ts`).toBeDefined();
		}
	});

	it('gives each one the same value in both', () => {
		for (const name of names) {
			expect(fromHook[name], `${name}: value differs between the two`).toBe(fromFile[name]);
		}
	});
});
