/**
 * Content-Security-Policy, one source of truth for the two audiences.
 *
 * `CSP_DIRECTIVES` is the site's baseline. Anonymous readers get exactly this:
 * Astro (from `security.csp` in astro.config.mjs) adds a build-time SHA-256
 * hash per inline `<script>`/`<style>` it itself emits, and everything else
 * stays on 'self'.
 *
 * `EDITOR_CSP` is what pages an editor is looking at get. Those carry
 * EmDash's visual-editing toolbar — an inline `<script>` and `<style>` the
 * CMS's middleware injects *after* Astro has hashed the page, so it cannot
 * carry a hash. A hash in the same directive would also invalidate
 * 'unsafe-inline' on its own (CSP3: a hash/nonce suppresses the inline
 * keyword), so the hashed inline handling is replaced wholesale rather than
 * layered on. The baseline above is kept verbatim; only the two inline
 * directives change, so an editor's browser is no more permissive about
 * script/style *sources* than a reader's.
 *
 * This is why the editor policy is applied in src/middleware (per response,
 * keyed on locals.user) rather than here or in the admin panel: the toolbar
 * is the one place a public page — a page the anonymous policy is written to
 * protect — legitimately must run inline code that the build did not see.
 */

export const CSP_DIRECTIVES = [
	"default-src 'self'",
	// Media uploaded through the CMS is served from this origin;
	// data: covers the inline SVG icons.
	"img-src 'self' data:",
	"font-src 'self'",
	"connect-src 'self'",
	// The résumé is embedded as an <object> from a Cloudflare R2 bucket.
	"object-src 'self' https://pub-b1fc9705d9cd4b50885284c3ede52d27.r2.dev",
	"frame-src 'none'",
	"frame-ancestors 'none'",
	"base-uri 'self'",
	"form-action 'self' https://checkout.stripe.com",
	"manifest-src 'self'"
];

/** 'style' attribute and inline `<script>`/`<style>` are allowed. */
export const EDITOR_INLINE_DIRECTIVES = [
	"script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'"
];

export const EDITOR_CSP = [...CSP_DIRECTIVES, ...EDITOR_INLINE_DIRECTIVES].join('; ');
