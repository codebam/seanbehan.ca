<script>
	import { onMount } from 'svelte';
	import { Heading } from 'flowbite-svelte';
	import { initComments } from "$lib/cactus.js";

	onMount(() => initComments({
				node: document.getElementById("comment-section"),
				defaultHomeserverUrl: "https://matrix.cactus.chat:8448",
				serverName: "cactus.chat",
				siteName: "seanbehan.ca",
				commentSectionId: data.title.split(" ").join("-")
	}));

	export let data;
</script>

<style>
#blogpost :global(a) {
	text-decoration: underline;
}
</style>

<svelte:head>
	<title>{data.title}</title>
	<link rel='stylesheet' href='/prism.css'>
	<link rel="stylesheet" href="https://latest.cactus.chat/style.css" type="text/css">
</svelte:head>
<article>
		<Heading class="text-secondary dark:text-dark-secondary" tag="h2">{data.title}</Heading>
		<Heading class="text-secondary dark:text-dark-secondary" tag="h5">{data.date}</Heading>
		<p id="blogpost" class="my-4 text-secondary dark:text-dark-secondary">{@html data.html}</p>
		<div id="comment-section"></div>
</article>
