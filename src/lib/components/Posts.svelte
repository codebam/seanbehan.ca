<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import Post from '$lib/components/Post.svelte';
	import Fuse from 'fuse.js';
	const { posts } = $props<{ posts: { path: string; meta: { title: string; date: string } }[] }>();
	let query = $state('');
	let results = $state(posts);
	const options = { keys: ['meta.title'] };
	const fuse = new Fuse(posts, options);
	$effect(() => {
		let results_ = fuse.search<{ path: string; meta: { title: string; date: string } }>(query);
		results = results_.map((result) => ({ path: result.item.path, meta: result.item.meta }));
	});
</script>

<div class="flex flex-wrap justify-between">
	<Heading
		tag="h4"
		style="display: inline"
		class="ml-8 my-4 text-secondary dark:text-dark-secondary w-auto">Posts</Heading
	>
	<input
		class="p-2 m-2 rounded text-secondary bg-background dark:bg-dark-background-secondary dark:text-dark-secondary"
		bind:value={query}
		placeholder="search"
	/>
</div>
<ul>
	{#each results as post}
		<Post {post} />
	{/each}
	{#if results.length === 0}
		{#each posts as post}
			<Post {post} />
		{/each}
	{/if}
</ul>
