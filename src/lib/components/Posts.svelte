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
		const timer = setTimeout(() => {
			debouncedQuery = query;
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
