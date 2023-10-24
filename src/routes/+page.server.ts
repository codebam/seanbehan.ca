import getPosts from '$lib/getPosts';

export const load = async () => {
	const posts = await getPosts();
	return { posts };
};
