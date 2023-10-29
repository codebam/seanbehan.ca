<script>
	import '@fontsource-variable/inter';
	import '../app.postcss';
	import TopBar from '$lib/components/TopBar.svelte';
</script>

<TopBar />
<main>
	<slot />
</main>
<footer class="m-4"><a href="https://github.com/codebam/seanbehan.ca">source code</a></footer>
