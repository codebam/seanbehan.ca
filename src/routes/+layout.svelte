<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	// app.css pulls in Tailwind and then carbon's g100 theme, in that order.
	import '../app.css';
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		Content,
		SkipToContent
	} from 'carbon-components-svelte';

	let { children } = $props<{
		children: Snippet;
	}>();

	let showAds = $state(true);

	onMount(() => {
		const cookies = document.cookie.split(';').map((c) => c.trim());
		const hasDisableAdsCookie = cookies.some((c) => c.startsWith('disable_ads=true'));
		showAds = !hasDisableAdsCookie;
	});

	onMount(async () => {
		if (!('serviceWorker' in navigator)) return;

		if (dev) {
			// Tear down any service worker left over from a production visit or an
			// older dev session — its cache-first fetch handler serves stale modules.
			const registrations = await navigator.serviceWorker.getRegistrations();
			const unregistered = await Promise.all(registrations.map((r) => r.unregister()));
			if ('caches' in window) {
				const keys = await caches.keys();
				await Promise.all(keys.map((key) => caches.delete(key)));
			}
			if (unregistered.some(Boolean)) location.reload();
			return;
		}

		navigator.serviceWorker.register('/service-worker.js');
	});

	const currentYear = new Date().getFullYear();
</script>

<svelte:head>
	{#if showAds}
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3287237463323384"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>

<Header companyName="Sean" platformName="Behan" href="/">
	<svelte:fragment slot="skipToContent">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
		<HeaderNavItem href="/" text="Home" />
		<HeaderNavItem href="/posts" text="Posts" />
		<HeaderNavItem href="/donate" text="Donate (Remove Ads)" />
		<HeaderNavItem href="/contact" text="Contact" />
		<HeaderNavItem href="https://github.com/codebam" text="GitHub" />
		<HeaderNavItem href="https://mstdn.ca/@codebam" text="Mastodon" />
	</HeaderNav>
</Header>

<Content>
	<main class="animate-fade-in-up mx-auto min-h-[60vh] max-w-6xl px-4 py-8">
		{@render children()}
	</main>
</Content>

<!-- Footer -->
<footer class="border-t border-[#393939] bg-[#161616] px-4 py-12">
	<div class="mx-auto max-w-6xl">
		<div class="flex flex-col items-center justify-between gap-6 md:flex-row">
			<!-- Brand -->
			<div class="text-center md:text-left">
				<p class="text-sm font-semibold text-[#f4f4f4]">Sean Behan</p>
				<p class="mt-1 text-xs text-[#6f6f6f]">Full-stack developer &amp; open-source enthusiast</p>
			</div>

			<!-- Social links -->
			<div class="flex flex-wrap items-center justify-center gap-6">
				<a
					href="https://github.com/codebam"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-[#6f6f6f] transition-colors duration-200 hover:text-[#f4f4f4]"
				>
					GitHub
				</a>
				<a
					href="https://mstdn.ca/@codebam"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-[#6f6f6f] transition-colors duration-200 hover:text-[#f4f4f4]"
				>
					Mastodon
				</a>
				<a
					href="/contact"
					class="text-sm text-[#6f6f6f] transition-colors duration-200 hover:text-[#f4f4f4]"
				>
					Contact
				</a>
				<a
					href="https://ai.clo...om"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-[#6f6f6f] transition-colors duration-200 hover:text-[#f4f4f4]"
				>
					AI Bio API
				</a>
			</div>
		</div>

		<div class="mt-8 border-t border-[#262626] pt-6 text-center">
			<p class="text-xs text-[#525252]">
				&copy; {currentYear} Sean Behan. Built with SvelteKit &middot; Hosted on Cloudflare
			</p>
		</div>
	</div>
</footer>
