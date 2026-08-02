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
		class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
	</svg>
	<input
		type="search"
		bind:value={query}
		placeholder="Search posts..."
		aria-label="Search posts"
		class="w-full rounded-xl border border-[var(--border-subtle)]/60 bg-gradient-to-br from-[var(--surface-card)] to-[var(--surface-card-alt)] py-3 pr-4 pl-11 text-sm text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-tertiary)] hover:border-[var(--accent-blue)]/30 focus:border-[var(--accent-blue)]/50 focus:ring-2 focus:ring-[var(--accent-blue)]/20 focus:outline-none"
	/>
</div>

{#if results.length === 0}
	<div class="card p-8 text-center">
		<p class="text-sm text-[var(--text-tertiary)]">No posts found</p>
	</div>
{:else if useAccordion}
	<Accordion>
		{#each results as post (post.path)}
			<LazyPostAccordion {post} />
		{/each}
	</Accordion>
{:else}
	<div class="grid gap-2 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
		border: 1px solid color-mix(in srgb, var(--border-subtle) 60%, transparent);
		border-radius: 1rem;
		overflow: hidden;
		background-image: linear-gradient(to bottom right, var(--surface-card), var(--surface-card-alt));
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	:global(.bx--accordion__item:hover) {
		border-color: color-mix(in srgb, var(--accent-blue) 30%, transparent);
		box-shadow: 0 10px 15px -3px color-mix(in srgb, var(--accent-blue) 5%, transparent);
	}

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