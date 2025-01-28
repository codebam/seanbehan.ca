<script>
	import { page } from '$app/stores';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	let group = $state($page.url.pathname);
</script>

<Tabs bind:value={group}>
	{#snippet list()}
		<Tabs.Control value="/"><a href="/">Home</a></Tabs.Control>
		<Tabs.Control value="/posts"><a href="/posts">Posts</a></Tabs.Control>
		<Tabs.Control value="/contact"><a href="/contact">Contact</a></Tabs.Control>
	{/snippet}
</Tabs>
