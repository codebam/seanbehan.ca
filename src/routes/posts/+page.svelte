<script lang="ts">
	import Posts from '$lib/components/Posts.svelte';
	import type { PostsPageData } from '$lib/types';

	const { data }: { data: PostsPageData } = $props();
</script>

<svelte:head>
	<title>Writing — Sean Behan</title>
	<meta name="description" content="Posts on Linux, NixOS, Rust, and Cloudflare Workers." />
</svelte:head>

<section class="panel pt-14 pb-20 md:pt-16 md:pb-24">
	<div class="shell">
		<p class="eyebrow">{data.posts.length} posts</p>
		<h1 class="display display-xl mt-5">Writing</h1>
		<p class="mt-6 max-w-[52ch] text-[1.15rem] leading-[1.55] text-[var(--body)] md:text-[1.3rem]">
			Notes from whatever I am taking apart — Linux and NixOS, containers and systemd, Rust, and the
			edge.
		</p>

		<div class="mt-12">
			<Posts posts={data.posts} />
		</div>
	</div>
</section>
