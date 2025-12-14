<script lang="ts">
	import { onMount } from 'svelte';
	import Posts from '$lib/components/Posts.svelte';
	import { initComments } from '$lib/cactus.js';
	import { initAIBio, safeGetElementById } from '$lib/utils';
	import type { PostsPageData } from '$lib/types';
	import { Grid, Row, Column } from 'carbon-components-svelte';

	const { data }: { data: PostsPageData } = $props();

	/**
	 * Initialize comments system and AI-generated bio
	 */
	onMount(() => {
		let cleanupAIBio: (() => void) | undefined;

		// Initialize comments system
		try {
			const commentNode = safeGetElementById('comment-section');
			if (commentNode) {
				initComments({
					node: commentNode,
					defaultHomeserverUrl: 'https://matrix.cactus.chat:8448',
					serverName: 'cactus.chat',
					siteName: 'seanbehan.ca',
					commentSectionId: 'main'
				});
			}
		} catch (error) {
			console.error('Failed to initialize comments:', error);
		}

		// Initialize AI-generated bio
		try {
			cleanupAIBio = initAIBio('bio');
		} catch (error) {
			console.error('Failed to initialize AI bio:', error);
		}

		// Cleanup function
		return () => {
			cleanupAIBio?.();
		};
	});
</script>

<svelte:head>
	<title>Sean Behan</title>
	<link rel="stylesheet" href="/cactus.css" type="text/css" />
</svelte:head>

<Grid>
	<Row>
		<Column>
			<div>
				<p id="bio" class="my-2">
					As a full-stack developer, I specialize in creating and managing web applications using various
					programming languages and technologies. My primary focus lies within the Linux operating system,
					where I spend most of my time writing software and contributing to open-source projects. With my
					aptitude for quick learning, I am always eager to expand my knowledge base and explore new
					technologies to enhance my skills. This passion for continuous growth enables me to create
					innovative, efficient, and cutting-edge solutions for a wide range of projects.
				</p>
				<p class="flex justify-end">
					<a href="https://ai.cloudflare.com">@cf/meta/llama-3.2-11b-vision-instruct</a>
				</p>
			</div>
		</Column>
	</Row>
	<Row>
		<Column>
			<Posts posts={data.posts} />
		</Column>
	</Row>
	<Row>
		<Column>
			<div id="comment-section"></div>
		</Column>
	</Row>
</Grid>

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
