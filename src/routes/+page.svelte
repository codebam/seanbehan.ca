<script lang="ts">
	import { onMount } from 'svelte';
	import Posts from '$lib/components/Posts.svelte';
	import { initComments } from '$lib/cactus.js';

	onMount(() => {
		initComments({
			node: document.getElementById('comment-section'),
			defaultHomeserverUrl: 'https://matrix.cactus.chat:8448',
			serverName: 'cactus.chat',
			siteName: 'seanbehan.ca',
			commentSectionId: 'main'
		});
		const url = new URL('https://damp-recipe-a17d.codebam.workers.dev/');
		url.searchParams.set('model', '@cf/meta/llama-3.2-11b-vision-instruct');
		url.searchParams.set('system', 'pretend you are Sean Behan.');
		url.searchParams.set(
			'content',
			"Generate me a 1 paragraph website intro for the following, WITHOUT saying here's a possible intro paragraph. My name is Sean Behan. My email address is contact@seanbehan.ca. My GitHub is codebam. I am a full stack developer. I spend most of my time on Linux writing software and contributing to open source. I'm a quick learner and enjoy learning new things. I am currently looking for work."
		);
		const source = new EventSource(url.toString());
		const el = document.getElementById('bio') || { innerHTML: '' };
		let start = true;
		source.onmessage = (event) => {
			if (start) {
				el.innerHTML = '';
				start = false;
			}
			if (event.data === '[DONE]') {
				source.close();
				return;
			}
			const data = JSON.parse(event.data);
			if (data.response) {
				el.innerHTML += data.response;
			}
		};
	});

	export let data: { posts: { path: string; meta: { title: string; date: string } }[] };
</script>

<svelte:head>
	<title>Sean Behan</title>
	<link rel="stylesheet" href="/cactus.css" type="text/css" />
</svelte:head>

<div>
	<p id="bio" class="my-2">
		As a full-stack developer, I specialize in creating and managing web applications using various
		programming languages and technologies. My primary focus lies within the Linux operating system,
		where I spend most of my time writing software and contributing to open-source projects. With my
		aptitude for quick learning, I am always eager to expand my knowledge base and explore new
		technologies to enhance my skills. This passion for continuous growth enables me to create
		innovative, efficient, and cutting-edge solutions for a wide range of projects.
	</p>
	<p class="flex justify-end">
		<a href="https://ai.cloudflare.com">@cf/meta/llama-3.2-11b-vision-instruct</a>
	</p>
</div>

<Posts posts={data.posts} />

<div>
	<div id="comment-section"></div>
</div>

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
