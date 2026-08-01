<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>{$page.status} - Error</title>
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
	<h1 class="mb-2 text-6xl font-bold text-[#f4f4f4]">{$page.status}</h1>
	<p class="mb-8 text-lg text-[#6f6f6f]">{$page.error?.message || 'Something went wrong'}</p>
	<a href="{base}/" class="inline-flex items-center gap-2 rounded-lg bg-[#4589ff] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#a6c8ff] hover:text-[#161616]">
		Return Home
	</a>
</div>