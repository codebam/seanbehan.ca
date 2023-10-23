<script lang="ts">
	import { onMount } from 'svelte';
	export let data: {posts: {path: string, meta: {title: string, date: string}}[]};
	let response: string = "I’m a full stack developer. I code in TypeScript, Rust, C#, and Python. I have a passion for open source and Linux.";
	onMount(async () => {
		const json = await fetch("https://cloudflare-ai-api.codebam.workers.dev/api/question/custom", { method: "POST", body: JSON.stringify({system: ["your job is to explain what you know about Sean Behan is", `use seed ${crypto.randomUUID()}`, "Sean Behan is a programmer who codes in TypeScript, Rust, C#, Python", "Sean Behan has a passion for open source and Linux"], user: ["tell me about Sean Behan"]})}).then((resp) => resp.json());
		response = json.response;
	});
</script>

<style>
	ul {
		list-style-type: none;
		padding-left: 0;
	}
</style>

<svelte:head>
	<title>Sean Behan</title>
</svelte:head>
<code>{response}</code>

<ul>
	{#each data.posts as post}
		<li>
			<h2>
				<a href={post.path}>
					{post.meta.title}
				</a>
			</h2>
			{post.meta.date}
		</li>
	{/each}
</ul>
