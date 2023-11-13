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
		As a full stack developer, I am passionate about creating innovative
		solutions for real-world problems. When I'm not working on client projects,
		you can find me most of the time on Linux, writing software and
		contributing to open source projects. With a strong work ethic and a quick
		learning mindset, I enjoy tackling new challenges and continually improving
		my skills.  Whether it's learning a new language, exploring new
		technologies or working on my own personal projects, I am always eager to
		learn and grow as a developer.
	</P>
</div>

<Posts posts={data.posts} />

<div id="comment-section"></div>

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
