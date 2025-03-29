<script lang="ts">
	import { onMount } from 'svelte';
	import { initComments } from '$lib/cactus.js';

	const { data } = $props<{
		data: {
			title: string;
			date: string;
			html: string;
		}
	}>();

	let mounted = $state(false);

	$effect(() => {
		if (!mounted) return;
		
		initComments({
			node: document.getElementById('comment-section'),
			defaultHomeserverUrl: 'https://matrix.cactus.chat:8448',
			serverName: 'cactus.chat',
			siteName: 'seanbehan.ca',
			commentSectionId: data.title.split(' ').join('-')
		});
	});

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>{data.title}</title>
	<link rel="stylesheet" href="https://prismjs.catppuccin.com/mocha.css" />
	<link rel="stylesheet" href="/cactus.css" type="text/css" />
</svelte:head>
<article>
	<h2 class="text-secondary dark:text-dark-secondary">{data.title}</h2>
	<h5 class="text-secondary dark:text-dark-secondary">{data.date}</h5>
	<p id="blogpost" class="text-secondary dark:text-dark-secondary my-4">{@html data.html}</p>
</article>
<div>
	<div id="comment-section" />
</div>
