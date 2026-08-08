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

<article class="panel pt-14 pb-20 md:pt-16">
	<div class="shell">
		<header class="border-b border-[var(--line)] pb-10">
			<p class="eyebrow">
				<a href={resolve('/posts')} class="hover:underline">Writing</a>
			</p>

			<h1 class="display mt-5 max-w-[24ch] text-[2.4rem] md:text-[3.4rem]">{meta.title}</h1>

			{#if meta.description}
				<p
					class="mt-5 max-w-[54ch] text-[1.15rem] leading-[1.55] text-[var(--body)] md:text-[1.3rem]"
				>
					{meta.description}
				</p>
			{/if}

			<p class="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
				<time datetime={meta.date}>{published}</time>
				{#if meta.tags?.length}
					<span class="text-[var(--dim)]">&middot;</span>
					<span>{meta.tags.join(' · ')}</span>
				{/if}
			</p>
		</header>

		<div class="prose mt-12 max-w-[68ch] text-[1.05rem]">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.post.html}
		</div>

		<footer class="mt-16 border-t border-[var(--line)] pt-6 text-sm">
			<a href={resolve('/posts')} class="link-accent">&larr; All posts</a>
		</footer>
	</div>
</article>
