<script lang="ts">
	import Posts from '$lib/components/Posts.svelte';
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions/reveal';
	import { site } from '$lib/site';
	import type { PostsPageData } from '$lib/types';

	const { data }: { data: PostsPageData } = $props();
</script>

<svelte:head>
	<title>Writing — {site.name}</title>
</svelte:head>

<section class="panel pt-14 pb-20 md:pt-16 md:pb-24">
	<div class="shell">
		<p class="enter eyebrow">{data.posts.length} posts</p>
		<h1 class="enter display display-xl mt-5" style="--enter-delay:0ms">Writing</h1>
		<p
			class="enter mt-6 max-w-[52ch] text-[1.15rem] leading-[1.55] text-[var(--body)] md:text-[1.3rem]"
		>
			Notes from whatever I am taking apart — Linux and NixOS, containers and systemd, Rust, and the
			edge.
		</p>

		<!-- The tag index used to be reachable only from an individual tag page,
		     which left it orphaned from the one page a reader starts on. -->
		<p class="enter link-accent mt-6" style="--enter-delay:120ms">
			<a href={resolve('/posts/tags')} class="hover:underline">Browse by tag &rarr;</a>
		</p>

		<div class="mt-12" use:reveal>
			<Posts posts={data.posts} />
		</div>
	</div>
</section>
