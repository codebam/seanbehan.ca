<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import LazyPostAccordion from '$lib/components/LazyPostAccordion.svelte';
	import Fuse from 'fuse.js';
	import { debounce } from '$lib/utils';
	import type { PostsProps, Post as PostType } from '$lib/types';

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

<div class="m-2 flex flex-wrap justify-between">
	<input
		type="search"
		class="mt-2 rounded-md p-2 text-black"
		bind:value={query}
		placeholder="Search posts..."
		aria-label="Search posts"
	/>
</div>

{#if results.length === 0}
	<p class="text-secondary dark:text-dark-secondary mt-4">No posts found</p>
{:else if useAccordion}
	<div class="space-y-2">
		{#each results as post (post.path)}
			<LazyPostAccordion {post} />
		{/each}
	</div>
{:else}
	<ul class="grid md:grid-cols-2 lg:grid-cols-3">
		{#each results as post (post.path)}
			<Post {post} />
		{/each}
	</ul>
{/if}
