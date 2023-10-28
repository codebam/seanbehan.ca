<script>
  export let data;
</script>

<style>
	ul {
		list-style-type: none;
		padding-left: 0;
	}
</style>


<svelte:head>
	<title>Posts</title>
</svelte:head>
<h1>Posts</h1>
<ul>
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
