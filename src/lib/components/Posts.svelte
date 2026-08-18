<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import { browser } from '$app/environment';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Fuse from 'fuse.js';
	import type { PostsProps } from '$lib/types';

	const { posts }: PostsProps = $props();

	/**
	 * The query lives in the URL as `?q=`, so a search survives a reload, can be
	 * linked to, and comes back when a reader follows a result and returns. The
	 * initial value is read once — after that this component owns the field and
	 * writes the URL, rather than the other way round.
	 */
	const initialQuery = browser ? (page.url.searchParams.get('q') ?? '') : '';
	let query = $state(initialQuery);
	let debouncedQuery = $state(initialQuery);

	$effect(() => {
		const pending = query;
		const timer = setTimeout(() => {
			debouncedQuery = pending;
		}, 300);
		return () => clearTimeout(timer);
	});

	/**
	 * Written on the debounced value, not on every keystroke, and with
	 * replaceState rather than pushState: a search is one destination that keeps
	 * changing, so it should take one history entry, not one per letter.
	 */
	$effect(() => {
		if (!browser) return;
		const url = new URL(page.url);
		if ((url.searchParams.get('q') ?? '') === debouncedQuery) return;
		if (debouncedQuery) url.searchParams.set('q', debouncedQuery);
		else url.searchParams.delete('q');
		try {
			// The URL is the page's own, with one search param changed — there is no
			// route to resolve here.
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			replaceState(url, page.state);
		} catch {
			// replaceState throws if the router has not started — the component
			// rendered outside a running app, which is what the tests do. The URL
			// is a convenience here; the search itself does not depend on it.
		}
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
