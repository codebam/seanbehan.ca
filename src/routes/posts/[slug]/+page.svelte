<script>
	import { Section, BlogTemplate } from 'flowbite-svelte-blocks';
	export let data;
let blog = {
	...data,
	id: '',
	title: data.title,
	author: {
		name: 'Sean Behan',
		title: '',
		profilePicture: 'https://avatars.githubusercontent.com/u/6035884?v=4'
	},
	content: data.html
};
</script>

<svelte:head>
	<title>{data.title}</title>
	<link rel='stylesheet' href='/prism.css'>
</svelte:head>
<article>
	<Section>
		<BlogTemplate {blog} />
	</Section>
</article>
