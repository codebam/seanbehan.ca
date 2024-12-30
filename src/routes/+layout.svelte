<script>
	import '../app.css';
	import '@fontsource-variable/inter';
	import { autoModeWatcher } from '@skeletonlabs/skeleton';
	import TopBar from '$lib/components/TopBar.svelte';
</script>

<svelte:head>
	<script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3287237463323384"
		crossorigin="anonymous"
	></script>
	{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}
</svelte:head>

<TopBar></TopBar>
<main>
	<slot></slot>
</main>
<footer class="m-4 underline">
	<a href="https://github.com/codebam/seanbehan.ca">source code</a>
</footer>
