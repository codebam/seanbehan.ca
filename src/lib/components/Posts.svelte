<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import LazyPostAccordion from '$lib/components/LazyPostAccordion.svelte';
	import Fuse from 'fuse.js';
	import type { PostsProps } from '$lib/types';
	import { Search, Accordion } from 'carbon-components-svelte';

	const { posts, useAccordion = false }: PostsProps & { useAccordion?: boolean } = $props();
	let query = $state('');
	let debouncedQuery = $state('');

	$effect(() => {
		// Read `query` here, in the effect body. Svelte only tracks what an effect
		// reads synchronously, so reading it inside the setTimeout callback instead
		// would leave the effect with no dependencies — it would run once on mount
		// and never again, pinning debouncedQuery to ''.
		const pending = query;
		const timer = setTimeout(() => {
			debouncedQuery = pending;
		}, 300);
		return () => clearTimeout(timer);
	});

	let fuse = $derived(
		new Fuse(posts, {
			keys: ['meta.title'],
			threshold: 0.4,
			minMatchCharLength: 2
		})
	);

	let results = $derived.by(() => {
		if (!debouncedQuery) return posts;
		return fuse.search(debouncedQuery).map((result) => result.item);
	});
</script>

<div class="m-2">
	<Search bind:value={query} placeholder="Search posts..." labelText="Search posts" />
</div>

{#if results.length === 0}
	<p class="text-secondary dark:text-dark-secondary mt-4">No posts found</p>
{:else if useAccordion}
	<Accordion>
		{#each results as post (post.path)}
			<LazyPostAccordion {post} />
		{/each}
	</Accordion>
{:else}
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each results as post (post.path)}
			<Post {post} />
		{/each}
	</div>
{/if}
