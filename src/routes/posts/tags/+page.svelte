<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions/reveal';
	import { site } from '$lib/site';
	import type { TagsPageData } from './+page.server';

	const { data }: { data: TagsPageData } = $props();
</script>

<svelte:head>
	<title>Tags — {site.name}</title>
</svelte:head>

<section class="panel pt-14 pb-20 md:pt-16 md:pb-24">
	<div class="shell">
		<p class="enter eyebrow">
			<a href={resolve('/posts')} class="hover:underline">Writing</a> · {data.tags.length} tags
		</p>
		<h1 class="enter display display-xl mt-5" style="--enter-delay:0ms">Tags</h1>
		<p
			class="enter mt-6 max-w-[52ch] text-[1.15rem] leading-[1.55] text-[var(--body)] md:text-[1.3rem]"
			style="--enter-delay:80ms"
		>
			Every topic I write about, with how many posts sit under each heading.
		</p>

		<div class="mt-12 flex flex-wrap gap-3" use:reveal>
			{#each data.tags as t (t.slug)}
				<a href={resolve('/posts/tag/[tag]', { tag: t.slug })} class="chip">
					{t.tag}<span class="count">{t.count}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	/* A stackable topic chip: quiet until hovered, with the post count tucked
	   in as the secondary value. The pill reads as a grouping affordance, so
	   the whole thing is the link rather than the word alone. */
	.chip {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.4rem 0.95rem;
		font-size: 0.92rem;
		color: var(--text);
		transition:
			border-color 0.2s ease,
			color 0.2s ease;
	}
	.chip:hover,
	.chip:focus-visible {
		border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
		color: var(--accent);
	}
	.chip .count {
		font-size: 0.78rem;
		color: var(--muted);
	}
</style>
