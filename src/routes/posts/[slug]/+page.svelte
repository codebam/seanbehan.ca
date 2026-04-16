<script lang="ts">
	import { onMount } from 'svelte';
	import { safeGetElementById } from '$lib/utils';
	import type { PostPageData } from '$lib/types';
	import { Grid, Row, Column } from 'carbon-components-svelte';

	const { data }: { data: { post: PostPageData['post'] } } = $props();
</script>

<svelte:head>
	<title>{data.post.meta.title}</title>
	<link rel="stylesheet" href="https://prismjs.catppuccin.com/mocha.css" />
	<link rel="stylesheet" href="/cactus.css" type="text/css" />
</svelte:head>
<Grid>
	<Row>
		<Column>
			<article>
				<h2 class="mb-2 text-3xl font-bold">{data.post.meta.title}</h2>
				<h5 class="mb-4 text-gray-400">
					{new Date(data.post.meta.date).toDateString()}
				</h5>
				<!-- Note: {@html} is safe here as content is processed by mdsvex from trusted markdown files -->
				<div id="blogpost" class="blog-content mb-8">
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
		margin-top: 2rem;
	}
	:global(.blog-content h3) {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
		margin-top: 1.5rem;
	}
	:global(.blog-content p) {
		margin-bottom: 1.25rem;
		line-height: 1.6;
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
		border-radius: 4px;
	}
	:global(.blog-content a) {
		color: #4589ff;
		text-decoration: none;
	}
	:global(.blog-content a:hover) {
		text-decoration: underline;
	}
	:global(.blog-content blockquote) {
		border-left: 4px solid #4589ff;
		padding-left: 1rem;
		font-style: italic;
		margin-bottom: 1.5rem;
	}
</style>
