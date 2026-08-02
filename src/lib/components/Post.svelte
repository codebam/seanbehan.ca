<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PostProps } from '$lib/types';

	const { post }: PostProps = $props();
	let tags = $derived(post.meta.tags ?? []);
	let slug = $derived(post.path.split('/').pop() ?? '');
</script>

<a
	href={resolve('/posts/[slug]', { slug })}
	class="group card relative flex h-full flex-col overflow-hidden p-6"
>
	<div class="spotlight"></div>

	<div class="relative z-10 flex h-full flex-col">
		<h3 class="mb-2 text-lg font-bold text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--accent-blue-light)]">
			{post.meta.title}
		</h3>
		<p class="mb-4 text-xs text-[var(--text-tertiary)]">
			{new Date(post.meta.date).toDateString()}
		</p>

		<div class="mt-auto flex flex-wrap gap-2">
			{#each tags as tag (tag)}
				<span class="tag">{tag}</span>
			{/each}
		</div>
	</div>
</a>