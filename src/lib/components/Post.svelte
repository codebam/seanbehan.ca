<script lang="ts">
	import type { PostProps } from '$lib/types';
	import { ClickableTile, Tag } from 'carbon-components-svelte';

	const { post }: PostProps = $props();
	let tags = $derived(post.meta.tags ?? []);
</script>

<ClickableTile href={post.path} class="h-full">
	<div class="flex h-full flex-col justify-between">
		<div>
			<h2 class="mb-2 text-2xl font-bold">
				{post.meta.title}
			</h2>
			<p class="mb-4">
				{new Date(post.meta.date).toDateString()}
			</p>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each tags as tag (tag)}
				<Tag type="blue" size="sm">{tag}</Tag>
			{/each}
		</div>
	</div>
</ClickableTile>
