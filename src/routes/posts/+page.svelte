<script lang="ts">
	import Posts from '$lib/components/Posts.svelte';
	import type { PostsPageData } from '$lib/types';

	const { data }: { data: PostsPageData } = $props();
</script>

<svelte:head>
	<title>Writing — Sean Behan</title>
	<meta name="description" content="Posts on Linux, NixOS, Rust, and Cloudflare Workers." />
</svelte:head>

<section class="pt-10 pb-14 md:pt-12 md:pb-16">
	<p class="eyebrow">{data.posts.length} posts</p>
	<h1 class="display mt-4 text-[2.4rem] md:text-[3rem]">Writing</h1>
	<p class="mt-4 max-w-[56ch] text-[1.05rem] leading-relaxed text-[var(--body)]">
		Notes from whatever I am taking apart — Linux and NixOS, containers and systemd, Rust, and the
		edge.
	</p>

	<div class="mt-9">
		<Posts posts={data.posts} />
	</div>
</section>
