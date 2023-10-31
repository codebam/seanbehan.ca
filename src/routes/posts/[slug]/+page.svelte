<script>
	import { Heading, P  } from 'flowbite-svelte';
	export let data;
</script>

<svelte:head>
	<title>{data.title}</title>
	<link rel='stylesheet' href='/prism.css'>
</svelte:head>
<article>
		<Heading class="text-secondary dark:text-dark-secondary" tag="h2">{data.title}</Heading>
		<Heading class="text-secondary dark:text-dark-secondary" tag="h5">{data.date}</Heading>
		<P class="my-4 text-secondary dark:text-dark-secondary">{@html data.html}</P>
</article>
