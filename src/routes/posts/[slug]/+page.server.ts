import { render } from 'svelte/server';

export async function load({ params }) {
	const post = await import(`../${params.slug}.md`);
	const { title, date } = post.metadata;
	const { html } = render(post.default);
	return {
		html,
		title,
		date
	};
}
