<script>
	import '../app.postcss';
	import TopBar from '$lib/components/TopBar.svelte';
</script>

<TopBar />
<main>
	<slot />
</main>
<footer><a href="https://github.com/codebam/seanbehan.ca">source code</a></footer>
