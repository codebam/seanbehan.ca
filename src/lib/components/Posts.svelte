<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import Fuse from 'fuse.js';
	import { debounce } from '$lib/utils';

	const { posts } = $props<{ posts: { path: string; meta: { title: string; date: string } }[] }>();
	let query = $state('');
	let results = $state(posts);

	const fuse = new Fuse(posts, {
		keys: ['meta.title'],
		threshold: 0.4,
		minMatchCharLength: 2
	});

	const handleSearch = debounce((value: string) => {
		results = value 
			? fuse.search(value).map(result => result.item)
			: posts;
	}, 300);

	$effect(() => {
		handleSearch(query);
	});
</script>

<div class="flex flex-wrap justify-between">
	<input
		type="search"
		class="mt-2 p-2 text-black rounded-md"
		bind:value={query}
		placeholder="Search posts..."
		aria-label="Search posts"
	/>
</div>

{#if results.length === 0}
	<p class="text-secondary dark:text-dark-secondary mt-4">No posts found</p>
{:else}
	<ul>
		{#each results as post}
			<Post {post} />
		{/each}
	</ul>
{/if}
