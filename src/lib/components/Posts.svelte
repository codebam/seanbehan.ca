<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import Fuse from 'fuse.js';
	import type { PostsProps } from '$lib/types';

	const { posts }: PostsProps = $props();
	let query = $state('');
	let debouncedQuery = $state('');

	$effect(() => {
		const pending = query;
		const timer = setTimeout(() => {
			debouncedQuery = pending;
		}, 300);
		return () => clearTimeout(timer);
	});

	// Descriptions and tags are searched too, so "wireshark" or "systemd" finds
	// the post even when the title never says it. Title still outranks both.
	let fuse = $derived(
		new Fuse(posts, {
			keys: [
				{ name: 'meta.title', weight: 3 },
				{ name: 'meta.description', weight: 1 },
				{ name: 'meta.tags', weight: 1 }
			],
			threshold: 0.4,
			minMatchCharLength: 2
		})
	);

	let results = $derived.by(() => {
		if (!debouncedQuery) return posts;
		return fuse.search(debouncedQuery).map((result) => result.item);
	});
</script>

<div class="relative mb-2">
	<svg
		class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--dim)]"
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
		placeholder="Search posts…"
		aria-label="Search posts"
		class="input pl-9"
	/>
</div>

{#if results.length === 0}
	<p class="border-t border-[var(--line)] py-10 text-[var(--muted)]">
		No posts match “{debouncedQuery}”.
	</p>
{:else}
	<PostList posts={results} showTags headingLevel={2} />
{/if}
