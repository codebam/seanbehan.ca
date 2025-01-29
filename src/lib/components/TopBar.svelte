<script>
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
</script>

<AppBar>
	{#snippet lead()}
		<a href="/">Home</a>
		<a href="/posts">Posts</a>
		<a href="/contact">Contact</a>
	{/snippet}
	{#snippet trail()}
		<a href="https://github.com/codebam">GitHub</a>
		<a href="https://mstdn.ca/@codebam">Mastodon</a>
	{/snippet}
	{#snippet headline()}
		<a class="text-xl font-bold" href="/">Sean Behan</a>
	{/snippet}
</AppBar>
