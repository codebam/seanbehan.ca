<script lang="ts">
	import type { PostPageData } from '$lib/types';

	const { data }: { data: { post: PostPageData['post'] } } = $props();
</script>

<svelte:head>
	<title>{data.post.meta.title}</title>
	<meta name="description" content={data.post.meta.description ?? data.post.meta.title} />
	<meta property="og:title" content={data.post.meta.title} />
	<meta property="og:description" content={data.post.meta.description ?? data.post.meta.title} />
	<meta property="og:type" content="article" />
	<meta property="article:published_time" content={data.post.meta.date} />
</svelte:head>

<article class="animate-fade-in-up">
	<header class="mb-8 border-b border-[var(--border-subtle)] pb-6">
		<h2 class="mb-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
			{data.post.meta.title}
		</h2>
		<div class="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
			<span>
				{new Date(data.post.meta.date).toDateString()}
			</span>
			{#if data.post.meta.tags?.length}
				<span>
					{data.post.meta.tags.join(', ')}
				</span>
			{/if}
		</div>
	</header>
	<div id="blogpost" class="prose prose-invert blog-content mb-8 max-w-none">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html data.post.html}
	</div>
</article>
