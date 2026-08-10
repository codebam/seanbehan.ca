import { error } from '@sveltejs/kit';
import { getAllTags, getPostsByTag } from '$lib/getPosts';
import { slugifyTag } from '$lib/tags';
import type { Post } from '$lib/types';

export const prerender = true;

/**
 * The whole site is static, so this dynamic route is enumerated up front: every
 * tag in the posts becomes its own prerendered page. Anything outside that set
 * is simply not in the build and 404s on the host.
 */
export const entries = async () => (await getAllTags()).map((t) => ({ tag: t.slug }));

export interface TagPageData {
	/** Display form of the tag, keeping the casing the posts actually use. */
	tag: string;
	/** URL-safe slug, so links and <title> can round-trip cleanly. */
	slug: string;
	posts: Post[];
}

export const load = async ({ params }): Promise<TagPageData> => {
	const target = slugifyTag(params.tag);
	const posts = await getPostsByTag(target);

	if (posts.length === 0) {
		throw error(404, `No posts tagged “${params.tag}”.`);
	}

	// Prefer the real casing from a post that uses it ("NixOS", "Secure Boot")
	// over the bare slug for the heading; fall back to the slug if none shows.
	const display = posts[0].meta.tags?.find((t) => slugifyTag(t) === target) ?? params.tag;

	return { tag: display, slug: target, posts };
};
