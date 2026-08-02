<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { base, resolve } from '$app/paths';
	// app.css pulls in Tailwind, Inter font, carbon theme, and design tokens.
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
	<meta name="description" content="Sean Behan — Full-stack developer, Linux enthusiast, and open-source contributor. Personal blog about SvelteKit, Rust, NixOS, and building software." />
	<meta property="og:title" content="Sean Behan" />
	<meta property="og:description" content="Full-stack developer, Linux enthusiast, and open-source contributor." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://seanbehan.ca" />
	<link rel="canonical" href="https://seanbehan.ca" />
	<link rel="sitemap" type="application/xml" title="Sitemap" href="{base}/sitemap.xml" />
	<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="{base}/rss.xml" />
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
<footer class="border-t border-[var(--border-subtle)] bg-[var(--surface-base)] px-4 py-12">
	<div class="mx-auto max-w-6xl">
		<div class="flex flex-col items-center justify-between gap-6 md:flex-row">
			<!-- Brand -->
			<div class="text-center md:text-left">
				<p class="text-sm font-semibold text-[var(--text-primary)]">Sean Behan</p>
				<p class="mt-1 text-xs text-[var(--text-tertiary)]">Full-stack developer &amp; open-source enthusiast</p>
			</div>

			<!-- Social links -->
			<div class="flex flex-wrap items-center justify-center gap-6">
				<a
					href="https://github.com/codebam"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
				>
					GitHub
				</a>
				<a
					href="https://mstdn.ca/@codebam"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
				>
					Mastodon
				</a>
				<a
					href={resolve('/contact')}
					class="text-sm text-[var(--text-tertiary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
				>
					Contact
				</a>
			</div>
		</div>

		<div class="mt-8 border-t border-[var(--surface-card-alt)] pt-6 text-center">
			<p class="text-xs text-[var(--text-muted)]">
				&copy; {currentYear} Sean Behan. Built with SvelteKit &middot; Hosted on Cloudflare
			</p>
		</div>
	</div>
</footer>