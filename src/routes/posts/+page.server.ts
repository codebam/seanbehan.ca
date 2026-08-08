import getPosts from '$lib/getPosts';
import type { PostsPageData } from '$lib/types';

export const load = async (): Promise<PostsPageData> => ({ posts: await getPosts() });
