<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Post } from '$lib/types';

	interface Props {
		posts: Post[];
		/** 2 for the home page's paired grid, 1 for the full archive list */
		columns?: 1 | 2;
		/** Topic tags are noise next to six posts, useful across twenty-four */
		showTags?: boolean;
	}

	const { posts, columns = 1, showTags = false }: Props = $props();

	const slugOf = (post: Post) => post.path.split('/').pop() ?? '';

	/** "Apr 2026" — the day is never what a reader is after in a list. */
	const monthYear = (date: string) =>
		new Date(date).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' });
</script>

<div class:paired={columns === 2}>
	{#each posts as post (post.path)}
		<a class="entry" href={resolve('/posts/[slug]', { slug: slugOf(post) })}>
			<time datetime={post.meta.date}>{monthYear(post.meta.date)}</time>
			<h3>{post.meta.title}</h3>
			{#if post.meta.description}
				<p>{post.meta.description}</p>
			{/if}
			{#if showTags && post.meta.tags?.length}
				<p class="tags">{post.meta.tags.join(' · ')}</p>
			{/if}
		</a>
	{/each}
</div>

<style>
	.paired {
		display: grid;
		gap: 0 3rem;
	}
	@media (width >= 48rem) {
		.paired {
			grid-template-columns: 1fr 1fr;
		}
	}

	.entry {
		display: block;
		padding: 1.25rem 0;
		border-top: 1px solid var(--line);
	}

	.entry time {
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.entry h3 {
		margin-top: 0.35rem;
		font-size: 1.2rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		transition: color 0.2s ease;
	}
	.entry:hover h3 {
		color: var(--accent);
	}

	.entry p {
		margin-top: 0.3rem;
		color: var(--body);
		font-size: 0.95rem;
		line-height: 1.6;
		max-width: 62ch;
	}

	.entry .tags {
		margin-top: 0.5rem;
		font-size: 0.82rem;
		color: var(--muted);
	}
</style>
