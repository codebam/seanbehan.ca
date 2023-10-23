<script>
	export let data;
</script>

<style>
	article {
		text-align: left;
	}
</style>

<article>
	<h1>{data.title}</h1>
	<p>Published: {data.date}</p>
	{@html data.html}
</article>
