<script lang="ts">
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{$page.status} - Error</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-[50vh]">
    <h1 class="text-4xl font-bold mb-4">{$page.status}</h1>
    <p class="text-xl mb-8">{$page.error?.message || 'Something went wrong'}</p>
    <a href="/" class="text-blue-500 hover:text-blue-700">Return to Home</a>
</div>