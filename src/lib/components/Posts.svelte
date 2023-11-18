<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import Post from '$lib/components/Post.svelte';
	export let posts: { path: string; meta: { title: string; date: string } }[];
</script>

<Heading tag="h4" class="ml-8 my-4 text-secondary dark:text-dark-secondary w-auto">Posts</Heading>
<ul>
	{#if posts}
		{#each posts as post}
			<Post {post} />
		{/each}
	{/if}
</ul>
