<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import { browser } from '$app/environment';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import type Fuse from 'fuse.js';
	import type { Post, PostsProps } from '$lib/types';

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

	/**
	 * Fuse is ~29 kB of the archive page's bundle and most readers never type a
	 * character, so it is fetched on the first keystroke rather than shipped
	 * with the page. Until it arrives the full list stands, which is what an
	 * empty query shows anyway.
	 *
	 * Descriptions and tags are searched too, so "wireshark" or "systemd" finds
	 * the post even when the title never says it. Title still outranks both.
	 */
	let fuse = $state<Fuse<Post> | null>(null);
	let loading = false;

	async function loadFuse() {
		if (fuse || loading) return;
		loading = true;
		const { default: FuseCtor } = await import('fuse.js');
		fuse = new FuseCtor(posts, {
			keys: [
				{ name: 'meta.title', weight: 3 },
				{ name: 'meta.description', weight: 1 },
				{ name: 'meta.tags', weight: 1 }
			],
			threshold: 0.4,
			minMatchCharLength: 2
		});
		loading = false;
	}

	// A query in the URL is a search the reader arrived with, so it needs the
	// index immediately rather than on a keystroke that may never come.
	$effect(() => {
		if (query) loadFuse();
	});

	let results = $derived.by(() => {
		if (!debouncedQuery || !fuse) return posts;
		return fuse.search(debouncedQuery).map((result) => result.item);
	});

	/**
	 * Announced rather than only drawn: the list swaps out under a screen reader
	 * with nothing said about it otherwise. Held to the debounced value so it is
	 * one announcement per search, not one per letter, and left empty when
	 * nothing matched — the visible empty state below is itself a live region,
	 * and two of them would say the same thing twice.
	 */
	let resultSummary = $derived(
		!debouncedQuery || results.length === 0
			? ''
			: `${results.length} ${results.length === 1 ? 'post matches' : 'posts match'} ${debouncedQuery}`
	);
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
		onfocus={loadFuse}
		placeholder="Search posts…"
		aria-label="Search posts"
		class="input pl-9"
	/>
</div>

<!-- Off-screen rather than hidden: `display: none` would take it out of the
     accessibility tree and nothing would be announced at all. -->
<p class="sr-only" role="status" aria-live="polite">{resultSummary}</p>

{#if results.length === 0}
	<p
		class="border-t border-[var(--line)] py-10 text-[var(--muted)]"
		role="status"
		aria-live="polite"
	>
		No posts match “{debouncedQuery}”.
	</p>
{:else}
	<PostList posts={results} showTags headingLevel={2} />
{/if}
