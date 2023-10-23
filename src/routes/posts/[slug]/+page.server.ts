export async function load({ params }) {
	const post = await import(`../${params.slug}.md`);
	const { title, date } = post.metadata;
	const { html } = post.default.render();
	return {
		html,
		title,
		date
	};
}
