export const load = async () => {
	return {
		posts: await Promise.all(
			Object.entries(import.meta.glob('/src/routes/posts/*.md')).map(async ([path, resolver]) => {
				const { metadata } = await resolver();
				const postPath = path.slice(11, -3);
				return { meta: metadata, path: postPath };
			})
		)
	};
};
