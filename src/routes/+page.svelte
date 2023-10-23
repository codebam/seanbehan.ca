<script>
  export let data;
</script>

<p>I’m a full stack developer. I code in TypeScript, Rust, C#, and Python.</p>
<p>I have a passion for open source and Linux.</p>

<h2>Posts</h2>
<ul>
	{#each data.posts as post}
		<li>
			<h3>
				<a href={post.path}>
					{post.meta.title}
				</a>
			</h3>
			Published {post.meta.date}
		</li>
	{/each}
</ul>
