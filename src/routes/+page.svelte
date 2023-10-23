<script lang="ts">
  import TopBar from "$lib/components/TopBar.svelte";
  import Content from "$lib/components/Content.svelte";
</script>

<style>
  div {
    display: grid;
    grid-auto-flow: row;
  }
</style>

<div id="website">
  <TopBar />
  <Content />
</div>
