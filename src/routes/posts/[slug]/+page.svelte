<script>
	export let data;
</script>

<style>
	article {
		text-align: left;
	}
</style>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>
<article>
	<h1>{data.title}</h1>
	<p>Published: {data.date}</p>
	{@html data.html}
</article>
