<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import '@fontsource-variable/inter';
	import TopBar from '$lib/components/TopBar.svelte';
	let { children } = $props<{
		children: Snippet;
	}>();
</script>

<svelte:head>
	<script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3287237463323384"
		crossorigin="anonymous"
	></script>
</svelte:head>

<TopBar></TopBar>
<main class="mx-2">
	{@render children()}
</main>
<footer class="mx-2">
	<a href="https://github.com/codebam/seanbehan.ca">source code</a>
</footer>
