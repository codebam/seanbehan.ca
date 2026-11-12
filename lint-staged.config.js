/**
 * Staged files are formatted before they are committed; the type check runs
 * over the whole project because tsc has no per-file mode that understands
 * .astro files without the content mapper.
 *
 * --concurrent false in the hook runs these in order: Prettier rewriting a
 * file while tsc reads it produced spurious failures.
 */
export default {
	'*.{js,ts,mjs,astro,css,json,md}': ['prettier --write'],
	'*.{ts,astro}': [() => 'npm run check']
};
