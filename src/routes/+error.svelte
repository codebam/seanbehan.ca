<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>{$page.status} - Error</title>
</svelte:head>

<div class="flex min-h-[50vh] flex-col items-center justify-center">
	<h1 class="mb-4 text-4xl font-bold">{$page.status}</h1>
	<p class="mb-8 text-xl">{$page.error?.message || 'Something went wrong'}</p>
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href="{base}/" class="text-blue-500 hover:text-blue-700">Return to Home</a>
</div>
