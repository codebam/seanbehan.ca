import getPosts from '$lib/getPosts';
import { site } from '$lib/site';
import type { PostsPageData } from '$lib/types';

const DESCRIPTION = 'Posts on Linux, NixOS, Rust, and Cloudflare Workers.';

export const load = async (): Promise<PostsPageData> => ({
	posts: await getPosts(),
	description: DESCRIPTION,
	ogTitle: `Writing — ${site.name}`
});
