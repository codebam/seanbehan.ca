<script>
	import { Heading } from 'flowbite-svelte';
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
	<script type="text/javascript" src="https://latest.cactus.chat/cactus.js"></script>
	<link rel="stylesheet" href="https://latest.cactus.chat/style.css" type="text/css">
</svelte:head>
<article>
		<Heading class="text-secondary dark:text-dark-secondary" tag="h2">{data.title}</Heading>
		<Heading class="text-secondary dark:text-dark-secondary" tag="h5">{data.date}</Heading>
		<p id="blogpost" class="my-4 text-secondary dark:text-dark-secondary">{@html data.html}</p>
		<div id="comment-section"></div>
		<script>
			setTimeout(() => initComments({
				node: document.getElementById("comment-section"),
				defaultHomeserverUrl: "https://matrix.cactus.chat:8448",
				serverName: "cactus.chat",
				siteName: "seanbehan.ca",
				commentSectionId: "main"
			}), 1000)
		</script>
</article>
