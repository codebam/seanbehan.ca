<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { base, resolve } from '$app/paths';
	// app.css pulls in Tailwind, both fonts, and the light/dark token set.
	import '../app.css';

	let { children } = $props<{
		children: Snippet;
	}>();

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

	const nav = [
		{ href: '/posts', label: 'Writing' },
		{ href: '/resume', label: 'Résumé' }
	] as const;

	/** Projects live in a section of the home page rather than a route of their own. */
	const workHref = `${resolve('/')}#work`;

	/** A nav item is current for its own page and anything beneath it. */
	const isCurrent = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
</script>

<svelte:head>
	<meta
		name="description"
		content="Sean Behan — full-stack developer working in Rust, TypeScript and NixOS. Writing about Linux, Cloudflare Workers, and building software."
	/>
	<meta property="og:title" content="Sean Behan" />
	<meta
		property="og:description"
		content="Full-stack developer. Rust, TypeScript, NixOS, and open source."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://seanbehan.ca" />
	<link rel="canonical" href="https://seanbehan.ca" />
	<link rel="sitemap" type="application/xml" title="Sitemap" href="{base}/sitemap.xml" />
	<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="{base}/rss.xml" />
</svelte:head>

<a href="#main" class="skip-link">Skip to content</a>

<header class="border-b border-[var(--line)]">
	<div class="mx-auto flex max-w-[940px] items-center gap-6 px-6 py-5 md:px-10 md:py-6">
		<a
			href={resolve('/')}
			class="display mr-auto text-[1.2rem] whitespace-nowrap"
			aria-current={page.url.pathname === '/' ? 'page' : undefined}
		>
			Sean&nbsp;Behan
		</a>

		<nav aria-label="Primary" class="flex items-center gap-5 md:gap-6">
			<!-- Hash link into the home page, which resolve() cannot express -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={workHref} class="nav-link text-sm md:text-[0.95rem]">Work</a>
			{#each nav as item (item.href)}
				<a
					href={resolve(item.href)}
					class="nav-link text-sm md:text-[0.95rem]"
					aria-current={isCurrent(item.href) ? 'page' : undefined}
				>
					{item.label}
				</a>
			{/each}
			<a href={resolve('/contact')} class="btn-outline shrink-0 max-sm:hidden">Get in touch</a>
			<a href={resolve('/contact')} class="nav-link text-sm sm:hidden">Contact</a>
		</nav>
	</div>
</header>

<main id="main" class="animate-fade-in-up mx-auto max-w-[940px] px-6 md:px-10">
	{@render children()}
</main>

<footer class="mt-4 border-t border-[var(--line)]">
	<div
		class="mx-auto flex max-w-[940px] flex-wrap items-center gap-x-6 gap-y-3 px-6 py-10 text-sm text-[var(--muted)] md:px-10 md:py-12"
	>
		<span>&copy; {currentYear} Sean Behan</span>
		<!-- Prerendered endpoint, not a route resolve() knows about -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="footer-link" href="{base}/rss.xml">RSS</a>
		<a class="footer-link" href="https://github.com/codebam" rel="me noopener noreferrer">GitHub</a>
		<a class="footer-link" href="https://mstdn.ca/@codebam" rel="me noopener noreferrer">Mastodon</a
		>
		<a class="footer-link" href="mailto:sean@seanbehan.ca">sean@seanbehan.ca</a>
		<span class="ml-auto text-[var(--dim)]">Built with SvelteKit, hosted on Cloudflare</span>
	</div>
</footer>

<style>
	.nav-link {
		color: var(--muted);
		transition: color 0.2s ease;
	}
	.nav-link:hover {
		color: var(--accent);
	}
	/* Current section stays legible without a heavier weight shifting layout */
	.nav-link[aria-current='page'] {
		color: var(--text);
	}

	.footer-link {
		color: var(--muted);
		transition: color 0.2s ease;
	}
	.footer-link:hover {
		color: var(--accent);
	}

	/* Visible only once focused, so keyboard users get the jump and nobody else
	   sees a stray link above the header. */
	.skip-link {
		position: absolute;
		left: -9999px;
		top: 0;
		z-index: 50;
		background: var(--panel);
		color: var(--text);
		border: 1px solid var(--line-strong);
		border-radius: 0 0 8px 0;
		padding: 0.6rem 1rem;
		font-size: 0.9rem;
	}
	.skip-link:focus {
		left: 0;
	}
</style>
