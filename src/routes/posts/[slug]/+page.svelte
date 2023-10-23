<script>
	export let data;
</script>

<article>
	<h1>{data.title}</h1>
	<p>Published: {data.date}</p>
	{@html data.html}
</article>
