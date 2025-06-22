import type { PostMeta, PostsPageData } from '$lib/types';

export const load = async (): Promise<PostsPageData> => {
	const posts = await Promise.all(
		Object.entries(import.meta.glob('/src/routes/posts/*.md')).map(async ([path, resolver]) => {
			const module = (await resolver()) as { metadata: PostMeta };
			const { metadata } = module;
			const postPath = path.slice(11, -3);
			return { meta: metadata, path: postPath };
		})
	);
	const sortedPosts = posts.sort((a, b) => {
		return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
	});
	return { posts: sortedPosts };
};
