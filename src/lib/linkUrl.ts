import { sanitizeHref } from 'emdash';

/**
 * A safe `href` for the links collection.
 *
 * `links.url` is a plain string field, so any role that can edit content can
 * store a `javascript:`, `data:` or `vbscript:` scheme there. EmDash sanitizes
 * its own Portable Text links at render time (see its `Link.astro`), but these
 * rows are rendered by this site's template, so the same check has to happen at
 * this boundary too. Bad input becomes a harmless `#`; the helper exists so the
 * anchor and the sibling mark cannot sanitize differently.
 */
export function safeLinkUrl(value: unknown): string {
	if (typeof value !== 'string' || value === '') return '#';
	return sanitizeHref(value);
}
