<script>
	import { BlogTemplate } from 'flowbite-svelte-blocks';
	export let data;
let blog = {
	...data,
	id: '',
	title: data.title,
	author: {
		name: 'Sean Behan',
		title: '',
		profilePicture: '/profile.png'
	},
	content: data.html
};
</script>

<svelte:head>
	<title>{data.title}</title>
	<link rel='stylesheet' href='/prism.css'>
</svelte:head>
<article>
		<BlogTemplate {blog} />
</article>
