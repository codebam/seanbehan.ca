<script lang="ts">
	import { onMount } from 'svelte';
	import { initComments } from '$lib/cactus.js';
	import { safeGetElementById } from '$lib/utils';
	import type { PostPageData } from '$lib/types';

	const { data }: { data: { post: PostPageData['post'] } } = $props();

	let mounted = $state(false);

	$effect(() => {
		if (!mounted) return;

		try {
			const commentNode = safeGetElementById('comment-section');
			if (commentNode) {
				initComments({
					node: commentNode,
					defaultHomeserverUrl: 'https://matrix.cactus.chat:8448',
					serverName: 'cactus.chat',
					siteName: 'seanbehan.ca',
					commentSectionId: data.post.meta.title.split(' ').join('-')
				});
			}
		} catch (error) {
			console.error('Failed to initialize comments:', error);
		}
	});

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>{data.post.meta.title}</title>
	<link rel="stylesheet" href="https://prismjs.catppuccin.com/mocha.css" />
	<link rel="stylesheet" href="/cactus.css" type="text/css" />
</svelte:head>
<article>
	<h2 class="text-secondary dark:text-dark-secondary text-xl font-bold">{data.post.meta.title}</h2>
	<h5 class="text-secondary dark:text-dark-secondary">
		{new Date(data.post.meta.date).toDateString()}
	</h5>
	<!-- Note: {@html} is safe here as content is processed by mdsvex from trusted markdown files -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div id="blogpost" class="prose text-secondary dark:text-dark-secondary my-4">
		{@html data.post.html}
	</div>
</article>
<div>
	<div id="comment-section"></div>
</div>
