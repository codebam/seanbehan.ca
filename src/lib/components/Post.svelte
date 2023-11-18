<script lang="ts">
	import { Heading, P, A } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	export let post: { path: string; meta: { title: string; date: string } };

	const summary_id = crypto.randomUUID();

	onMount(() => {
		const url = new URL('https://broad-pine-2.codebam.workers.dev/');
		url.searchParams.set('q', post.meta.title);
		const source = new EventSource(url);
		const el = document.getElementById(summary_id);
		let start = true;
		source.onmessage = (event) => {
			if (start) {
				el.innerHTML = '';
				start = false;
			}
			if (event.data === '[DONE]') {
				source.close();
				return;
			}
			const data = JSON.parse(event.data);
			el.innerHTML += data.response;
		};
	});
</script>

<ul>
	<li
		class="bg-background-secondary dark:bg-dark-background-secondary m-2
        py-4 pr-4 drop-shadow border-2 border-background-tertiary dark:border-dark-background-tertiary
        rounded-3xl hover:border-quaternary hover:dark:border-dark-quaternary w-auto"
	>
		<Heading tag="h5" class="underline text-primary dark:text-dark-primary ml-8 w-auto">
			<A class="hover:text-tertiary dark:hover:text-dark-tertiary" href={post.path}>
				{post.meta.title}
			</A>
		</Heading>
		<P class="ml-8 text-secondary dark:text-dark-secondary w-auto">
			{new Date(post.meta.date).toDateString()}
		</P>
		<P class="ml-8 text-secondary dark:text-dark-secondary w-auto" id={summary_id}></P>
	</li>
</ul>
