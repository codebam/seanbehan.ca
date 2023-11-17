<script lang="ts">
	import { onMount } from 'svelte';
	import Posts from '$lib/components/Posts.svelte';
	import { P } from 'flowbite-svelte';
	import { initComments } from "$lib/cactus.js";

	onMount(() => initComments({
				node: document.getElementById("comment-section"),
				defaultHomeserverUrl: "https://matrix.cactus.chat:8448",
				serverName: "cactus.chat",
				siteName: "seanbehan.ca",
				commentSectionId: "main",
	}));

	export let data: {posts: {path: string, meta: {title: string, date: string}}[]};
</script>

<svelte:head>
	<title>Sean Behan</title>
	<link rel="stylesheet" href="https://latest.cactus.chat/style.css" type="text/css">
</svelte:head>

<div class="bg-background-secondary dark:bg-dark-background-secondary m-2 p-4
	drop-shadow border-2 border-background-tertiary
	dark:border-dark-background-tertiary rounded-3xl hover:border-quaternary
	hover:dark:border-dark-quaternary">
	<P class="mx-4 text-secondary dark:text-dark-secondary my-2">
		I am a passionate full-stack developer with a strong affinity for Linux, where I have spent countless hours writing
software and contributing to open-source projects. With a natural ability for swift learning, I constantly seek out new
challenges and opportunities to expand my knowledge base. This hunger for growth has not only made me an efficient
problem solver but also allowed me to collaborate effectively with diverse teams on various exciting projects
	</P>
</div>

<Posts posts={data.posts} />

<div id="comment-section"></div>

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
