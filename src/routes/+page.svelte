<script lang="ts">
  export let data: {posts: {path: string, meta: {title: string, date: string}}[]};
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
<p>I’m a full stack developer. I code in TypeScript, Rust, C#, and Python.</p>
<p>I have a passion for open source and Linux.</p>

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
