/**
 * The one script that must run before the body paints: it marks the document
 * as script-capable so the contents list can fold on small screens from first
 * paint (`html.js` in posts/[slug].astro), with no post-JS layout shift.
 *
 * The snippet lives here, as a string, because Astro's security.csp hashes
 * only the scripts Astro itself emits — an author-written `<script is:inline>`
 * reaches the browser unhashed and the policy blocks it, which is exactly how
 * production lost the fold. astro.config.mjs computes this string's SHA-256
 * into scriptDirective.hashes and Base.astro renders the same string with
 * set:html, so the hash and the script cannot drift apart. Edit the string
 * here, never a copy in the template.
 */
export const JS_CLASS_SCRIPT = "document.documentElement.classList.add('js');";
