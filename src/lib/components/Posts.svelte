<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import Fuse from 'fuse.js';
	const { posts } = $props<{ posts: { path: string; meta: { title: string; date: string } }[] }>();
	let query = $state('');
	const options = { keys: ['meta.title'] };
	const fuse = new Fuse(posts, options);
	let results = $state(posts);
</script>

<div class="flex flex-wrap justify-between">
	<input
		class="m-2 p-2 text-black"
		bind:value={query}
		placeholder="search"
		onkeypress={() =>
			(results = fuse
				.search<{ path: string; meta: { title: string; date: string } }>(query)
				.map((result) => ({ path: result.item.path, meta: result.item.meta })))}
	/>
</div>
<ul class="mx-2">
	{#each results as post}
		<Post {post} />
	{/each}
</ul>
