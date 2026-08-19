<script lang="ts">
	import { base, resolve } from '$app/paths';
	import PostList from '$lib/components/PostList.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { site } from '$lib/site';
	import type { TagPageData } from './+page.server';

	const { data }: { data: TagPageData } = $props();
</script>

<svelte:head>
	<title>{data.tag} — {site.name}</title>
	<!-- This topic's own feed, so a reader's extension offers it in place of the
	     whole-site one while they are on the tag page. -->
	<link
		rel="alternate"
		type="application/rss+xml"
		title="{data.tag} — {site.name}"
		href="{base}/posts/tag/{data.slug}/rss.xml"
	/>
</svelte:head>

<section class="panel pt-14 pb-20 md:pt-16 md:pb-24">
	<div class="shell">
		<p class="enter eyebrow">
			<a href={resolve('/posts')} class="hover:underline">Writing</a> · {data.posts.length}
			{data.posts.length === 1 ? 'post' : 'posts'}
		</p>
		<h1 class="enter display display-xl mt-5" style="--enter-delay:0ms">{data.tag}</h1>
		<p class="enter link-accent mt-6" style="--enter-delay:80ms">
			<a href={resolve('/posts/tags')} class="hover:underline">All tags &rarr;</a>
		</p>

		<div class="mt-12" use:reveal>
			<PostList posts={data.posts} headingLevel={2} />
		</div>
	</div>
</section>
