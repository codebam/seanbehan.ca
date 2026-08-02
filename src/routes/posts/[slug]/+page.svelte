<script lang="ts">
	import type { PostPageData } from '$lib/types';
	import { Grid, Row, Column } from 'carbon-components-svelte';

	const { data }: { data: { post: PostPageData['post'] } } = $props();
</script>

<svelte:head>
	<title>{data.post.meta.title}</title>
</svelte:head>
<Grid>
	<Row>
		<Column>
			<article class="animate-fade-in-up">
				<header class="mb-8 border-b border-[#393939] pb-6">
					<h2 class="mb-3 text-3xl font-bold tracking-tight text-[#f4f4f4] md:text-4xl">
						{data.post.meta.title}
					</h2>
					<div class="flex flex-wrap items-center gap-4 text-sm text-[#6f6f6f]">
						<span>
							{new Date(data.post.meta.date).toDateString()}
						</span>
						{#if data.post.meta.tags?.length}
							<span>
								{data.post.meta.tags.join(', ')}
							</span>
						{/if}
					</div>
				</header>
				<div id="blogpost" class="prose prose-invert blog-content mb-8 max-w-none">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html data.post.html}
				</div>
			</article>
		</Column>
	</Row>
</Grid>

<style>
	:global(.blog-content h1) {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}
	:global(.blog-content h2) {
		font-size: 1.75rem;
		font-weight: bold;
		margin-bottom: 1rem;
		margin-top: 2.5rem;
	}
	:global(.blog-content h3) {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
		margin-top: 2rem;
	}
	:global(.blog-content p) {
		margin-bottom: 1.25rem;
		line-height: 1.75;
		color: #c6c6c6;
	}
	:global(.blog-content ul) {
		list-style-type: disc;
		margin-left: 1.5rem;
		margin-bottom: 1.25rem;
	}
	:global(.blog-content ol) {
		list-style-type: decimal;
		margin-left: 1.5rem;
		margin-bottom: 1.25rem;
	}
	:global(.blog-content pre) {
		margin-bottom: 1.5rem;
		border-radius: 8px;
		background: #1c1c1c !important;
		border: 1px solid #393939;
	}
	:global(.blog-content code) {
		font-size: 0.875em;
	}
	:global(.blog-content a) {
		color: #4589ff;
		text-decoration: none;
		transition: color 0.2s;
	}
	:global(.blog-content a:hover) {
		color: #a6c8ff;
		text-decoration: underline;
	}
	:global(.blog-content blockquote) {
		border-left: 4px solid #4589ff;
		padding-left: 1rem;
		font-style: italic;
		margin-bottom: 1.5rem;
		color: #8d8d8d;
	}
	:global(.blog-content hr) {
		border-color: #393939;
		margin: 2rem 0;
	}
	:global(.blog-content img) {
		border-radius: 8px;
		border: 1px solid #393939;
		max-width: 100%;
		height: auto;
	}
	:global(.blog-content table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
	}
	:global(.blog-content th) {
		background: #262626;
		color: #f4f4f4;
		padding: 0.5rem 1rem;
		text-align: left;
		border: 1px solid #393939;
	}
	:global(.blog-content td) {
		padding: 0.5rem 1rem;
		border: 1px solid #393939;
		color: #c6c6c6;
	}
</style>
