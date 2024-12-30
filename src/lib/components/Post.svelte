<script lang="ts">
	export let post: { path: string; meta: { title: string; date: string } };
</script>

<ul>
	<li class="my-2 flex justify-between">
		<h5>
			<a href={post.path}>
				{post.meta.title}
			</a>
		</h5>
		<p>
			{new Date(post.meta.date).toDateString()}
		</p>
	</li>
</ul>
