<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { Post } from '$lib/types';

	interface Props {
		post: Post;
	}

	const { post }: Props = $props();

	let value = $state<string[]>([]);
	let content = $state<string | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function loadContent() {
		if (content || loading) return;

		loading = true;
		error = null;

		try {
			const response = await fetch(`/api/posts/${post.path.split('/').pop()}/content`);

			if (!response.ok) {
				throw new Error(`Failed to load content: ${response.status}`);
			}

			const data = await response.json() as { html: string; meta: any };
			content = data.html;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load content';
			console.error('Error loading post content:', err);
		} finally {
			loading = false;
		}
	}

	function handleValueChange(e: { value: string[] }) {
		value = e.value;
		if (value.includes(post.path) && !content) {
			loadContent();
		}
	}

	const tags = post.meta.tags ?? [];
</script>

<Accordion {value} onValueChange={handleValueChange} collapsible>
	<Accordion.Item value={post.path}>
		{#snippet control()}
			<div class="flex w-full justify-between items-center">
				<div class="flex-1">
					<h2 class="text-xl font-bold text-left">
						{post.meta.title}
					</h2>
					<p class="text-sm text-surface-600 dark:text-surface-400 text-left">
						{new Date(post.meta.date).toDateString()}
					</p>
				</div>
				<div class="flex flex-wrap gap-1 ml-4">
					{#each tags as tag}
						<span class="badge variant-filled-primary text-xs">
							{tag}
						</span>
					{/each}
				</div>
			</div>
		{/snippet}

		{#snippet panel()}
			{#if loading}
				<div class="flex justify-center items-center p-8">
					<div class="spinner"></div>
					<span class="ml-2">Loading content...</span>
				</div>
			{:else if error}
				<div class="alert variant-filled-error">
					<p>Error: {error}</p>
					<button class="btn variant-filled" onclick={() => loadContent()}>
						Try Again
					</button>
				</div>
			{:else if content}
				<article class="prose prose-lg max-w-none dark:prose-invert">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html content}
				</article>
			{:else}
				<div class="flex justify-center items-center p-4">
					<button class="btn variant-filled-primary" onclick={() => loadContent()}>
						Load Content
					</button>
				</div>
			{/if}
		{/snippet}
	</Accordion.Item>
</Accordion>

<style>
	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #f3f3f3;
		border-top: 2px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>
