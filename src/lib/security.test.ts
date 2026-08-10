// @vitest-environment node
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Parse a CSP directive string into { directive: [values] }. */
function parseCsp(csp: string): Record<string, string[]> {
	const directives: Record<string, string[]> = {};
	for (const chunk of csp.split(';')) {
		const [name, ...values] = chunk.trim().split(/\s+/);
		if (name) directives[name] = values;
	}
	return directives;
}

/**
 * The Content-Security-Policy is injected by SvelteKit as a <meta> tag whose
 * script-src carries a per-build hash of the inline bootstrap script. This test
 * reads that real built output, so a future commit that adds an inline
 * <script> (analytics snippet, etc.) and papers over it with 'unsafe-inline'
 * fails here rather than making it to production.
 */
const PAGES = ['index.html', 'posts/nixos.html', 'posts/tag/nixos.html', 'resume.html'];

describe('built site Content-Security-Policy', () => {
	it('injects a meta CSP on every prerendered page that blocks unsafe-inline scripts', () => {
		// The policy lives in the built output; build it if a bare `npm run test:run`
		// was run before `npm run build`.
		const output = resolve('.svelte-kit/cloudflare/index.html');
		if (!existsSync(output)) {
			execSync('npm run build', { stdio: 'pipe' });
		}

		for (const page of PAGES) {
			const file = resolve(`.svelte-kit/cloudflare/${page}`);
			expect(existsSync(file), `${page}: built output missing (${file})`).toBe(true);

			const html = readFileSync(file, 'utf8');
			const match = html.match(
				/<meta[^>]*http-equiv="content-security-policy"[^>]*content="([^"]+)"/
			);
			expect(match, `${page}: missing Content-Security-Policy meta tag`).not.toBeNull();

			const directives = parseCsp(match![1]);

			expect(directives['script-src'], `${page}: missing script-src directive`).toBeDefined();
			const scriptSrc = directives['script-src']!.join(' ');
			// The whole point of the policy: inline script execution is gated behind
			// SvelteKit's per-build hash, never 'unsafe-inline'.
			expect(scriptSrc, `${page}: script-src must not allow unsafe-inline`).not.toContain(
				"'unsafe-inline'"
			);
			expect(
				directives['script-src']!.some((v) => v.startsWith("'sha256-")),
				`${page}: script-src should carry SvelteKit's hash of the inline bootstrap`
			).toBe(true);
		}
	});
});
