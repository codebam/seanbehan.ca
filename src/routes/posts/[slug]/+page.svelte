<script lang="ts">
	import { resolve } from '$app/paths';
	import { site } from '$lib/site';
	import { slugifyTag } from '$lib/tags';
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

<!-- Description, og:*, article:* and the BlogPosting JSON-LD all come from the
     layout, which reads this page's `post` out of page data — emitting them
     here as well produced two of each tag. -->
<svelte:head>
	<title>{meta.title} — {site.name}</title>
</svelte:head>

<!-- Reading progress: a 2px accent strip across the top of the viewport, driven
     entirely by a scroll timeline in app.css. No scroll listener, and it is
     hidden outright for reduced-motion readers. -->
<div class="read-progress" aria-hidden="true"></div>

<article class="panel pt-14 pb-20 md:pt-16">
	<div class="shell">
		<header class="enter border-b border-[var(--line)] pb-10">
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
				{#if data.post.readingMinutes}
					<span class="text-[var(--muted)]">&middot;</span>
					<span>{data.post.readingMinutes} min read</span>
				{/if}
				{#if meta.tags?.length}
					<span class="text-[var(--muted)]">&middot;</span>
					<span class="flex flex-wrap items-center gap-x-3">
						{#each meta.tags as tag (tag)}
							<a
								href={resolve('/posts/tag/[tag]', { tag: slugifyTag(tag) })}
								class="hover:underline">{tag}</a
							>
						{/each}
					</span>
				{/if}
			</p>
		</header>

		<div class="enter prose mt-12 max-w-[68ch] text-[1.05rem]" style="--enter-delay:60ms">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.post.html}
		</div>

		<footer class="mt-16 border-t border-[var(--line)] pt-6 text-sm">
			<a href={resolve('/posts')} class="link-accent back"
				><span class="arrow">&larr;</span> All posts</a
			>
		</footer>
	</div>
</article>

<style>
	/* The back arrow travels the other way, so its nudge has to as well. */
	.back:hover :global(.arrow),
	.back:focus-visible :global(.arrow) {
		transform: translateX(-3px);
	}
</style>
