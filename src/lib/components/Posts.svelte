<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import LazyPostAccordion from '$lib/components/LazyPostAccordion.svelte';
	import Fuse from 'fuse.js';
	import type { PostsProps } from '$lib/types';
	import { Accordion } from 'carbon-components-svelte';

	const { posts, useAccordion = false }: PostsProps & { useAccordion?: boolean } = $props();
	let query = $state('');
	let debouncedQuery = $state('');

	$effect(() => {
		// Read `query` here, in the effect body. Svelte only tracks what an effect
		// reads synchronously, so reading it inside the setTimeout callback instead
		// would leave the effect with no dependencies — it would run once on mount
		// and never again, pinning debouncedQuery to ''.
		const pending = query;
		const timer = setTimeout(() => {
			debouncedQuery = pending;
		}, 300);
		return () => clearTimeout(timer);
	});

	let fuse = $derived(
		new Fuse(posts, {
			keys: ['meta.title'],
			threshold: 0.4,
			minMatchCharLength: 2
		})
	);

	let results = $derived.by(() => {
		if (!debouncedQuery) return posts;
		return fuse.search(debouncedQuery).map((result) => result.item);
	});
</script>

<div class="relative mb-6">
	<svg
		class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#6f6f6f]"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
		/>
	</svg>
	<input
		type="search"
		bind:value={query}
		placeholder="Search posts..."
		aria-label="Search posts"
		class="w-full rounded-xl border border-[#393939]/60 bg-gradient-to-br from-[#1c1c1c] to-[#262626] py-3 pr-4 pl-11 text-sm text-[#f4f4f4] transition-all duration-200 placeholder:text-[#6f6f6f] hover:border-[#4589ff]/30 focus:border-[#4589ff]/50 focus:ring-2 focus:ring-[#4589ff]/20 focus:outline-none"
	/>
</div>

{#if results.length === 0}
	<div
		class="rounded-2xl border border-[#393939]/60 bg-gradient-to-br from-[#1c1c1c] to-[#262626] p-8 text-center"
	>
		<p class="text-sm text-[#6f6f6f]">No posts found</p>
	</div>
{:else if useAccordion}
	<Accordion>
		{#each results as post (post.path)}
			<LazyPostAccordion {post} />
		{/each}
	</Accordion>
{:else}
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each results as post (post.path)}
			<Post {post} />
		{/each}
	</div>
{/if}

<style>
	/* Carbon's accordion is a flat bordered list. Restyle it into the same card
	   language the post grid and project cards use, so /posts and the home page
	   read as one system. */
	:global(.bx--accordion) {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	:global(.bx--accordion__item) {
		border: 1px solid rgb(57 57 57 / 0.6);
		border-radius: 1rem;
		overflow: hidden;
		background-image: linear-gradient(to bottom right, #1c1c1c, #262626);
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	:global(.bx--accordion__item:hover) {
		border-color: rgb(69 137 255 / 0.3);
		box-shadow: 0 10px 15px -3px rgb(69 137 255 / 0.05);
	}

	/* Carbon draws its own separator lines; the card border replaces them. */
	:global(.bx--accordion__item::before) {
		display: none;
	}

	:global(.bx--accordion__heading) {
		padding: 0.75rem 1.25rem;
	}

	:global(.bx--accordion__heading:hover::before) {
		background-color: transparent;
	}

	:global(.bx--accordion__content) {
		padding-right: 1.5rem;
		padding-left: 1.5rem;
	}
</style>
