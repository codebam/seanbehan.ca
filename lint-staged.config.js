/**
 * Staged files are formatted before they are committed; the type check runs
 * over the whole project because Astro's checker has no per-file mode.
 *
 * --concurrent false in the hook runs these in order: Prettier rewriting a
 * file while astro check reads it produced spurious failures.
 */
export default {
	'*.{js,ts,mjs,astro,svelte,css,json,md}': ['prettier --write'],
	'*.{ts,astro,svelte}': [() => 'astro check']
};
