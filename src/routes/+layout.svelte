<script>
  import TopBar from "$lib/components/TopBar.svelte";
</script>

<style>
  main {
    text-align: center;
  }
</style>

<TopBar />
<main>
  <slot />
</main>
<footer><a href="https://github.com/codebam">source code</a></footer>
