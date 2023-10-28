<script lang="ts">
	import { onMount } from 'svelte';
	export let data: {posts: {path: string, meta: {title: string, date: string}}[]};
	let response: string = "I’m a full stack developer. I code in TypeScript, Rust, C#, and Python. I have a passion for open source and Linux.";
	onMount(async () => {
		const json = await fetch("https://cloudflare-ai-api.codebam.workers.dev/api/question/custom", { method: "POST", body: JSON.stringify({system: ["your job is to explain what you know about Sean Behan is", `use seed ${crypto.randomUUID()}`, "Sean Behan is a programmer who codes in TypeScript, Rust, C#, Python", "Sean Behan has a passion for open source and Linux"], user: ["tell me what you know about Sean Behan"]})}).then((resp) => resp.json());
		response = json.response;
	});
</script>

<svelte:head>
	<title>Sean Behan</title>
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3287237463323384"
     crossorigin="anonymous"></script>
</svelte:head>

<code>{response}</code>

<ul>
	<h1>Posts</h1>
	{#each data.posts as post}
		<li>
			<h3 class="text-primary dark:text-dark-primary">
				<a href={post.path}>
					{post.meta.title}
				</a>
			</h3>
			<p class="text-secondary dark:text-dark-secondary">
				{new Date(post.meta.date).toDateString()}
			</p>
		</li>
	{/each}
</ul>

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
