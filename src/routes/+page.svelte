<script lang="ts">
import Posts from '$lib/components/Posts.svelte';
export let data: {posts: {path: string, meta: {title: string, date: string}}[]};
</script>

<svelte:head>
	<title>Sean Behan</title>
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3287237463323384"
     crossorigin="anonymous"></script>
</svelte:head>

<p>Welcome to my website! My name is Sean Behan, and I am a highly skilled full
stack developer with a passion for creating innovative and scalable software
solutions. With a strong background in computer science and a wealth of
experience in various programming languages, including TypeScript, Rust, C#, and
Python, I am well-equipped to tackle any project that comes my way.  In addition
to my technical expertise, I am also deeply committed to open source and Linux,
and I have contributed to several open-source projects in the past. I
believe in the power of collaboration and sharing knowledge, and I am always
eager to work with other developers and learn from them.  Whether you're looking
for a skilled developer to join your team or need help with a specific project,
I am here to help. Please feel free to explore my website and learn more
about my skills and experience. I look forward to hearing from you!</p>

<Posts posts={data.posts} />

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
