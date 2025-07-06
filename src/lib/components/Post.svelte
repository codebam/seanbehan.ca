<script lang="ts">
	import type { PostProps } from '$lib/types';

	const { post }: PostProps = $props();
	const tags = post.meta.tags ?? [];
</script>

<li class="bg-surface-100-900 m-2 my-2 flex justify-between rounded-md p-1">
	<div>
		<a href={post.path}>
			<h2 class="text-2xl font-bold">
				{post.meta.title}
			</h2>
		</a>
		<p class="mt-1">
			{new Date(post.meta.date).toDateString()}
		</p>
	</div>
	<ul>
		{#each tags as tag}
			<div class="bg-primary-900 m-2 rounded-md p-1 text-primary-50">
				{tag}
			</div>
		{/each}
	</ul>
</li>
