<script>
  export let data;
</script>

<style>
	ul {
		list-style-type: none;
	}
</style>

<h1>Posts</h1>

<ul>
	{#each data.posts as post}
		<li>
			<h2>
				<a href={post.path}>
					{post.meta.title}
				</a>
			</h2>
			Published {post.meta.date}
		</li>
	{/each}
</ul>
