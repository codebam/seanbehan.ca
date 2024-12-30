<script>
	import { onMount } from 'svelte';
	import { initComments } from '$lib/cactus.js';

	onMount(() =>
		initComments({
			node: document.getElementById('comment-section'),
			defaultHomeserverUrl: 'https://matrix.cactus.chat:8448',
			serverName: 'cactus.chat',
			siteName: 'seanbehan.ca',
			commentSectionId: data.title.split(' ').join('-')
		})
	);

	export let data;
</script>

<svelte:head>
	<title>{data.title}</title>
	<link rel="stylesheet" href="/prism.css" />
	<link
		rel="stylesheet"
		href="https://gateway.pinata.cloud/ipfs/QmSiWN27KZZ1XE32jKwifBnS3nWTUcFGNArKzur2nmDgoL/v0.13.0/style.css"
		type="text/css"
	/>
</svelte:head>
<article>
	<h2 class="text-secondary dark:text-dark-secondary">{data.title}</h2>
	<h5 class="text-secondary dark:text-dark-secondary">{data.date}</h5>
	<p id="blogpost" class="text-secondary dark:text-dark-secondary my-4">{@html data.html}</p>
</article>
<div>
	<div id="comment-section"></div>
</div>

<style>
	#blogpost :global(a) {
		text-decoration: underline;
	}
</style>
