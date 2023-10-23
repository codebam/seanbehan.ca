export const load = async () => {
	const posts = await Promise.all(
		Object.entries(import.meta.glob('/src/routes/posts/*.md')).map(async ([path, resolver]) => {
			const { metadata } = await resolver();
			const postPath = path.slice(11, -3);
			return { meta: metadata, path: postPath };
		})
	);
	const sortedPosts = posts.sort((a, b) => {
		return new Date(b.meta.date) - new Date(a.meta.date);
	});
	return { posts: sortedPosts };
};
