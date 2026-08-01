<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { resolve } from '$app/paths';
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

	const ADSENSE_SRC =
		'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3287237463323384';

	onMount(() => {
		// Inject AdSense only after checking the cookie, never via markup.
		//
		// The site is prerendered, so a `{#if showAds}` in <svelte:head> cannot
		// work: there is no request to read the cookie from at render time, so the
		// tag shipped to everyone and the browser began executing it on first
		// paint. Flipping a flag in onMount afterwards cannot unload a script that
		// has already run — donors kept getting ads despite paying to remove them.
		if (dev) return;

		const cookies = document.cookie.split(';').map((c) => c.trim());
		if (cookies.some((c) => c.startsWith('disable_ads=true'))) return;

		const script = document.createElement('script');
		script.async = true;
		script.crossOrigin = 'anonymous';
		script.src = ADSENSE_SRC;
		document.head.appendChild(script);

		return () => script.remove();
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
					href={resolve('/contact')}
					class="text-sm text-[#6f6f6f] transition-colors duration-200 hover:text-[#f4f4f4]"
				>
					Contact
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
