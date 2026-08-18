<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { site } from '$lib/site';
</script>

<svelte:head>
	<title>{page.status} — {site.name}</title>
</svelte:head>

<section class="panel shell flex min-h-[55vh] flex-col justify-center py-20">
	<p class="eyebrow">Error {page.status}</p>
	<h1 class="display display-xl mt-5 max-w-[18ch]">
		{page.status === 404 ? 'That page is not here.' : 'Something went wrong.'}
	</h1>
	<p class="mt-4 max-w-[50ch] text-[1.05rem] text-[var(--body)]">
		{page.error?.message ?? 'No further detail available.'}
	</p>
	<p class="mt-8 flex flex-wrap gap-x-6 gap-y-3">
		<a href={resolve('/')} class="btn">Back home</a>
		<a href={resolve('/posts')} class="link-quiet self-center">Read the writing</a>
	</p>
</section>
