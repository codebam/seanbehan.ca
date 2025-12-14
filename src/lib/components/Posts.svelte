<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import LazyPostAccordion from '$lib/components/LazyPostAccordion.svelte';
	import Fuse from 'fuse.js';
	import { debounce } from '$lib/utils';
	import type { PostsProps, Post as PostType } from '$lib/types';
	import { Search, Accordion } from 'carbon-components-svelte';

	const { posts, useAccordion = false }: PostsProps & { useAccordion?: boolean } = $props();
	let query = $state('');
	let results = $state<PostType[]>(posts);

	// Lazy initialize Fuse.js for better performance
	let fuse: Fuse<PostType> | null = null;

	const initializeFuse = () => {
		if (!fuse) {
			fuse = new Fuse(posts, {
				keys: ['meta.title'],
				threshold: 0.4,
				minMatchCharLength: 2
			});
		}
		return fuse;
	};

	const handleSearch = debounce((value: string) => {
		if (!value) {
			results = posts;
			return;
		}

		const fuseInstance = initializeFuse();
		results = fuseInstance.search(value).map((result) => result.item);
	}, 300);

	$effect(() => {
		handleSearch(query);
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
	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each results as post (post.path)}
			<Post {post} />
		{/each}
	</div>
{/if}
