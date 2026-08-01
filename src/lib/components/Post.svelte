<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PostProps } from '$lib/types';

	const { post }: PostProps = $props();
	let tags = $derived(post.meta.tags ?? []);
	let slug = $derived(post.path.split('/').pop() ?? '');
</script>

<a
	href={resolve('/posts/[slug]', { slug })}
	class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#393939]/60 bg-gradient-to-br from-[#1c1c1c] to-[#262626] p-6 transition-all duration-300 hover:border-[#4589ff]/30 hover:shadow-lg hover:shadow-[#4589ff]/5"
>
	<div
		class="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#4589ff]/5 blur-2xl transition-all duration-500 group-hover:bg-[#4589ff]/10 group-hover:blur-3xl"
	></div>

	<div class="relative z-10 flex h-full flex-col">
		<!-- h3: these cards sit under the "Latest Posts" h2, matching the project cards -->
		<h3
			class="mb-2 text-lg font-bold text-[#f4f4f4] transition-colors duration-200 group-hover:text-[#a6c8ff]"
		>
			{post.meta.title}
		</h3>
		<p class="mb-4 text-xs text-[#6f6f6f]">
			{new Date(post.meta.date).toDateString()}
		</p>

		<div class="mt-auto flex flex-wrap gap-2">
			{#each tags as tag (tag)}
				<span class="rounded-full bg-[#393939]/60 px-2.5 py-0.5 text-xs text-[#8d8d8d]">
					{tag}
				</span>
			{/each}
		</div>
	</div>
</a>
