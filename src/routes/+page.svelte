<script lang="ts">
	import { onMount } from 'svelte';
	import Posts from '$lib/components/Posts.svelte';
	import { initAIBio } from '$lib/utils';
	import type { PostsPageData } from '$lib/types';
	import { Grid, Row, Column } from 'carbon-components-svelte';

	const { data }: { data: PostsPageData } = $props();

	/**
	 * Initialize AI-generated bio
	 */
	onMount(() => {
		let cleanupAIBio: (() => void) | undefined;

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
			<!-- Hero Section -->
			<section class="mb-12 mt-4 rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#262626] p-8 shadow-xl md:p-12">
				<div class="flex flex-col items-center gap-6 md:flex-row md:items-start">
					<!-- Profile Image -->
					<div class="shrink-0">
						<img
							src="/profile.webp"
							alt="Sean Behan"
							class="h-28 w-28 rounded-full border-2 border-[#4589ff]/30 object-cover shadow-lg ring-2 ring-[#4589ff]/10 md:h-36 md:w-36"
						/>
					</div>

					<!-- Bio Content -->
					<div class="flex-1 text-center md:text-left">
						<h1 class="mb-2 text-3xl font-bold tracking-tight text-[#f4f4f4] md:text-4xl">
							Sean Behan
						</h1>
						<div class="mb-3 flex flex-wrap justify-center gap-2 md:justify-start">
							<span class="inline-block rounded-full bg-[#4589ff]/10 px-3 py-1 text-xs font-medium text-[#4589ff]">
								Full-Stack Developer
							</span>
							<span class="inline-block rounded-full bg-[#42be65]/10 px-3 py-1 text-xs font-medium text-[#42be65]">
								Linux Enthusiast
							</span>
							<span class="inline-block rounded-full bg-[#ff7eb6]/10 px-3 py-1 text-xs font-medium text-[#ff7eb6]">
								Open Source
							</span>
						</div>
						<p id="bio" class="text-base leading-relaxed text-[#c6c6c6] md:text-lg">
							As a full-stack developer, I specialize in creating and managing web applications using
							various programming languages and technologies. My primary focus lies within the Linux
							operating system, where I spend most of my time writing software and contributing to
							open-source projects. With my aptitude for quick learning, I am always eager to expand my
							knowledge base and explore new technologies to enhance my skills. This passion for
							continuous growth enables me to create innovative, efficient, and cutting-edge solutions
							for a wide range of projects.
						</p>
						<p class="mt-2 text-right text-xs text-[#6f6f6f]">
							<a href="https://ai.clo...om" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-[#4589ff]">
								@cf/google/gemma-4-26b-a4b-it
							</a>
						</p>
					</div>
				</div>
			</section>

			<!-- Latest Posts Section -->
			<section class="mb-8">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-2xl font-bold text-[#f4f4f4]">Latest Posts</h2>
					<a href="/posts" class="text-sm font-medium text-[#4589ff] transition-colors hover:text-[#a6c8ff]">
						View all &rarr;
					</a>
				</div>
				<Posts posts={data.posts} />
			</section>
		</Column>
	</Row>
</Grid>

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>