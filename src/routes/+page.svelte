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
		Hi there! My name is Sean Behan, and I'm a full stack developer with a passion for
		Linux and open source software. With a quick learning mindset and a penchant for
		problem-solving, I thrive in an environment where I can constantly learn new things and
		contribute to the greater good of the tech community.
	</P>
</div>

<div class="bg-background-secondary dark:bg-dark-background-secondary m-2 p-4
	drop-shadow border-2 border-background-tertiary
	dark:border-dark-background-tertiary rounded-3xl hover:border-quaternary
	hover:dark:border-dark-quaternary">
	<P class="mx-4 text-secondary dark:text-dark-secondary my-2">
		When I'm not tinkering with the latest gadgets or experimenting with new programming 
		languages, you can find me writing software and contributing to open source projects. I
		love the challenge of working on a variety of projects and collaborating with other 
		developers to create something truly amazing.
	</P>
</div>

<div class="bg-background-secondary dark:bg-dark-background-secondary m-2 p-4
	drop-shadow border-2 border-background-tertiary
	dark:border-dark-background-tertiary rounded-3xl hover:border-quaternary
	hover:dark:border-dark-quaternary">
	<P class="mx-4 text-secondary dark:text-dark-secondary my-2">
		With my background in full stack development and my experience with Linux, I'm 
		confident in my ability to tackle any project that comes my way. Whether it's building 
		a new web application or diving deep into the inner workings of a complex system, I'm 
		always up for the challenge. So if you need someone who is quick on their feet and 
		knows their way around a terminal, look no further! I'm here to help and ready to take 
		on whatever comes next.
	</P>
</div>

<Posts posts={data.posts} />

<div id="comment-section"></div>

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
