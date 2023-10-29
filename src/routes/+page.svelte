<script lang="ts">
import Posts from '$lib/components/Posts.svelte';
export let data: {posts: {path: string, meta: {title: string, date: string}}[]};
</script>

<svelte:head>
	<title>Sean Behan</title>
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3287237463323384"
     crossorigin="anonymous"></script>
</svelte:head>

<p>Hello and welcome to my website! I'm Sean Behan, a full stack developer with extensive experience who is passionate about building scalable and original applications. I am prepared to take on any project that comes my way because I have a solid background in computer science and a wide range of expertise in a variety of programming languages, such as TypeScript, Rust, C#, and Python. Along with my technical proficiency, I have a strong passion for Linux and open source, and I have previously contributed to a number of open-source projects. I firmly think that cooperation and information sharing are beneficial, and I'm always excited to collaborate with and pick up tips from other developers.</p>

<Posts posts={data.posts} />

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
