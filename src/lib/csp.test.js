import { describe, expect, it } from 'vitest';
import { CSP_DIRECTIVES, EDITOR_CSP, EDITOR_INLINE_DIRECTIVES } from './csp.js';

/**
 * The anonymous policy and the editor policy are both security headers, so a
 * change to either is a browser-visible behaviour change. The two lists are
 * pinned separately: the editor only swaps the hashed inline directives, and
 * the baseline's source restrictions must survive that swap unchanged.
 */
describe('CSP_DIRECTIVES', () => {
	it('pins the anonymous baseline', () => {
		expect(CSP_DIRECTIVES).toEqual([
			"default-src 'self'",
			"img-src 'self' data:",
			"font-src 'self'",
			"connect-src 'self' https://cloudflareinsights.com",
			"object-src 'none'",
			"frame-src 'none'",
			"frame-ancestors 'none'",
			"base-uri 'self'",
			"form-action 'self' https://checkout.stripe.com https://lists.seanbehan.ca",
			"manifest-src 'self'"
		]);
	});

	it('leaves inline script and style out of the baseline', () => {
		expect(CSP_DIRECTIVES.some((directive) => directive.startsWith('script-src'))).toBe(false);
		expect(CSP_DIRECTIVES.some((directive) => directive.startsWith('style-src'))).toBe(false);
	});
});

describe('EDITOR_CSP', () => {
	it('adds only the documented inline allowances', () => {
		expect(EDITOR_INLINE_DIRECTIVES).toEqual([
			"script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
			"style-src 'self' 'unsafe-inline'"
		]);
	});

	it('is the baseline plus those allowances, in that order', () => {
		expect(EDITOR_CSP).toBe([...CSP_DIRECTIVES, ...EDITOR_INLINE_DIRECTIVES].join('; '));
		const parts = EDITOR_CSP.split('; ');
		expect(parts.filter((part) => part.startsWith('script-src'))).toEqual([
			EDITOR_INLINE_DIRECTIVES[0]
		]);
		expect(parts.filter((part) => part.startsWith('style-src'))).toEqual([
			EDITOR_INLINE_DIRECTIVES[1]
		]);
	});
});
