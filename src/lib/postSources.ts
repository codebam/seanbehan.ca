/**
 * Raw markdown for the posts, keyed by module path.
 *
 * The compiled mdsvex module exposes metadata and a component, not the body
 * text, so anything that needs the words themselves needs this second view of
 * the same files. It lives here rather than in each caller because the two
 * readers of it — the post list and the post page — have to count the same
 * bytes, or the estimate changes when the reader clicks through.
 */
const postSources = import.meta.glob('/src/routes/posts/*.md', {
	query: '?raw',
	import: 'default'
});

/** Module path for a post slug, in the form the glob keys use. */
export const sourcePath = (slug: string) => `/src/routes/posts/${slug}.md`;

/**
 * Markdown body for a post, or an empty string if the file is not in the glob.
 * Missing is not an error here: the callers use this for a reading estimate,
 * which is decoration, and a post that cannot be counted should still render.
 */
export async function readSource(modulePath: string): Promise<string> {
	const load = postSources[modulePath];
	if (!load) return '';
	return (await load()) as string;
}
