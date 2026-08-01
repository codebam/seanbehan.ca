<script lang="ts">
	import type { PostProps } from '$lib/types';
	import { ClickableTile, Tag } from 'carbon-components-svelte';

	const { post }: PostProps = $props();
	let tags = $derived(post.meta.tags ?? []);
</script>

<ClickableTile
	href={post.path}
	class="!rounded-xl !transition-all !duration-200 hover:!translate-y-[-2px] hover:!shadow-lg"
>
	<div class="flex h-full flex-col justify-between p-1">
		<div>
			<h2 class="mb-2 text-xl font-bold text-[#f4f4f4]">
				{post.meta.title}
			</h2>
			<p class="mb-4 text-sm text-[#6f6f6f]">
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
