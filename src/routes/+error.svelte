<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>{$page.status} - Error</title>
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
	<h1 class="mb-2 text-6xl font-bold text-[var(--text-primary)]">{$page.status}</h1>
	<p class="mb-8 text-lg text-[var(--text-tertiary)]">{$page.error?.message || 'Something went wrong'}</p>
	<a
		href={resolve('/')}
		class="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-blue)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--accent-blue-light)] hover:text-[var(--surface-base)]"
	>
		Return Home
	</a>
</div>