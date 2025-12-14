<script lang="ts">
	import { AccordionItem, Button, Loading, Tag } from 'carbon-components-svelte';
	import type { Post, PostMeta } from '$lib/types';

	interface Props {
		post: Post;
	}

	const { post }: Props = $props();

	let content = $state<string | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let open = $state(false);

	async function loadContent() {
		if (content || loading) return;

		loading = true;
		error = null;

		try {
			const response = await fetch(`/api/posts/${post.path.split('/').pop()}/content`);

			if (!response.ok) {
				throw new Error(`Failed to load content: ${response.status}`);
			}

			const data = (await response.json()) as { html: string; meta: PostMeta };
			content = data.html;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load content';
			console.error('Error loading post content:', err);
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (open && !content) {
			loadContent();
		}
	});

	const tags = post.meta.tags ?? [];
</script>

<AccordionItem bind:open>
	<svelte:fragment slot="title">
		<div class="flex w-full items-center justify-between mr-4">
			<div class="flex-1">
				<h5 class="font-bold m-0">
					{post.meta.title}
				</h5>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-sm text-gray-500">
					{new Date(post.meta.date).toDateString()}
				</span>
				<div class="hidden sm:flex gap-1">
					{#each tags as tag (tag)}
						<Tag type="blue" size="sm">{tag}</Tag>
					{/each}
				</div>
			</div>
		</div>
	</svelte:fragment>
	
	{#if loading}
		<div class="flex items-center justify-center p-4">
			<Loading withOverlay={false} small />
			<span class="ml-2">Loading content...</span>
		</div>
	{:else if error}
		<div class="p-4 text-red-500">
			<p>Error: {error}</p>
			<Button kind="danger" size="small" onclick={() => loadContent()}>Try Again</Button>
		</div>
	{:else if content}
		<article class="blog-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html content}
		</article>
	{:else}
		<div class="flex items-center justify-center p-4">
			<Button size="small" onclick={() => loadContent()}>
				Load Content
			</Button>
		</div>
	{/if}
</AccordionItem>

<style>
	:global(.blog-content h1) { font-size: 2rem; font-weight: bold; margin-bottom: 1rem; }
	:global(.blog-content h2) { font-size: 1.75rem; font-weight: bold; margin-bottom: 1rem; margin-top: 2rem; }
	:global(.blog-content h3) { font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; margin-top: 1.5rem; }
	:global(.blog-content p) { margin-bottom: 1.25rem; line-height: 1.6; }
	:global(.blog-content ul) { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.25rem; }
	:global(.blog-content ol) { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.25rem; }
	:global(.blog-content pre) { margin-bottom: 1.5rem; border-radius: 4px; }
	:global(.blog-content a) { color: #4589ff; text-decoration: none; }
	:global(.blog-content a:hover) { text-decoration: underline; }
	:global(.blog-content blockquote) { border-left: 4px solid #4589ff; padding-left: 1rem; font-style: italic; margin-bottom: 1.5rem; }
</style>
