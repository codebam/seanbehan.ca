<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PostPageData } from '$lib/types';

	const { data }: { data: { post: PostPageData['post'] } } = $props();

	let meta = $derived(data.post.meta);
	let published = $derived(
		new Date(meta.date).toLocaleDateString('en-CA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<svelte:head>
	<title>{meta.title} — Sean Behan</title>
	<meta name="description" content={meta.description ?? meta.title} />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description ?? meta.title} />
	<meta property="og:type" content="article" />
	<meta property="article:published_time" content={meta.date} />
</svelte:head>

<article class="pt-10 pb-16 md:pt-12">
	<header class="border-b border-[var(--line)] pb-8">
		<p class="eyebrow">
			<a href={resolve('/posts')} class="hover:underline">Writing</a>
		</p>

		<h1 class="display mt-4 max-w-[26ch] text-[2.2rem] md:text-[2.9rem]">{meta.title}</h1>

		{#if meta.description}
			<p class="mt-4 max-w-[58ch] text-[1.1rem] leading-relaxed text-[var(--body)]">
				{meta.description}
			</p>
		{/if}

		<p class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
			<time datetime={meta.date}>{published}</time>
			{#if meta.tags?.length}
				<span class="text-[var(--dim)]">&middot;</span>
				<span>{meta.tags.join(' · ')}</span>
			{/if}
		</p>
	</header>

	<div class="prose mt-10 max-w-[68ch]">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html data.post.html}
	</div>

	<footer class="mt-14 border-t border-[var(--line)] pt-6 text-sm">
		<a href={resolve('/posts')} class="link-accent">&larr; All posts</a>
	</footer>
</article>
