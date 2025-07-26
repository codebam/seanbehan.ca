<script lang="ts">
	import type { Snippet } from 'svelte';
	let { data, children } = $props<{
		data: {
			title: string;
			date: string;
			html: string;
		};
		children: Snippet;
	}>();
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.title} />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.title} />
	<meta property="og:type" content="article" />
	<meta property="article:published_time" content={data.date} />
	<link rel="stylesheet" href="/mocha.css" />
	<link rel="stylesheet" href="/cactus.css" type="text/css" />
</svelte:head>

<main class="flex justify-center">
	<div class="w-full max-w-2xl">
		{@render children()}
	</div>
</main>
