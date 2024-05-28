<script>
	import Posts from '$lib/components/Posts.svelte';
	export let data;
</script>

<svelte:head>
	<title>Posts</title>
</svelte:head>

<Posts posts={data.posts} />
