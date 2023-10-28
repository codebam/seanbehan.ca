<script lang="ts">
import Posts from '$lib/components/Posts.svelte';
export let data: {posts: {path: string, meta: {title: string, date: string}}[]};
</script>

<svelte:head>
	<title>Sean Behan</title>
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3287237463323384"
     crossorigin="anonymous"></script>
</svelte:head>

<p>I’m a full stack developer. I code in TypeScript, Rust, C#, and Python. I
have a passion for open source and Linux.</p>

<Posts posts={data.posts} />

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
