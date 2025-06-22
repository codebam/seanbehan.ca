<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} - Error</title>
</svelte:head>

<div class="flex min-h-[50vh] flex-col items-center justify-center">
	<h1 class="mb-4 text-4xl font-bold">{$page.status}</h1>
	<p class="mb-8 text-xl">{$page.error?.message || 'Something went wrong'}</p>
	<a href="/" class="text-blue-500 hover:text-blue-700">Return to Home</a>
</div>
