<script lang="ts">
	import type { PostProps } from '$lib/types';

	const { post }: PostProps = $props();
</script>

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
