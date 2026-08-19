<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { base, resolve } from '$app/paths';
	import {
		site,
		absolute,
		sibling,
		canonicalUrl,
		alternateUrl,
		LEGAL_NAME,
		HANDLE,
		LINKEDIN_URL
	} from '$lib/site';
	import type { BlogPost } from '$lib/types';
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

	/**
	 * Cross-fade between pages where the browser supports it. Skipped outright
	 * for reduced-motion readers rather than animated faster, since the point of
	 * the transition is the animation and nothing else.
	 */
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const currentYear = new Date().getFullYear();

	const nav = site.showResume
		? ([
				{ href: '/posts', label: 'Writing' },
				{ href: '/resume', label: 'Résumé' }
			] as const)
		: ([{ href: '/posts', label: 'Writing' }] as const);

	/**
	 * Social metadata is resolved here rather than per page, because a page that
	 * emitted its own og:title got two of them — svelte:head appends, it does
	 * not replace what an ancestor layout already wrote. The post page passes
	 * its metadata down through page data instead.
	 */
	let post = $derived(page.data?.post as BlogPost | undefined);

	/**
	 * Posts are identical on both origins, so they canonical to seanbehan.ca.
	 * Home, contact, and the rest differ per variant and stay self-canonical.
	 */
	let canonical = $derived(
		canonicalUrl(page.url.pathname, { post: Boolean(post), draft: post?.meta.draft })
	);
	let alternate = $derived(
		alternateUrl(page.url.pathname, { post: Boolean(post), draft: post?.meta.draft })
	);
	let metaDescription = $derived(
		post?.meta.description ?? post?.meta.title ?? page.data.description ?? site.description
	);
	/** Inner pages pass their own title so a share of /posts is not just the site name. */
	let ogTitle = $derived(post ? post.meta.title : (page.data.ogTitle ?? site.ogTitle));
	/**
	 * A post gets the card generated for it at build time (tools/og), unless it
	 * names an image of its own. Everything else — home, contact, the archive —
	 * uses the site card, not the author photo: a 460px headshot is the wrong
	 * aspect for a large-image preview.
	 */
	let ogImage = $derived(
		absolute(post ? (post.meta.image ?? `/og/${post.path.split('/').pop()}.png`) : '/og/site.png')
	);

	/**
	 * Structured data. The home page describes the site and the person behind
	 * it; a post describes itself as a BlogPosting. Everything else inherits the
	 * WebSite node, which is what carries the name a search result shows.
	 */
	let jsonLd = $derived.by(() => {
		const sameAs = [
			sibling.url,
			'https://github.com/codebam',
			'https://mstdn.ca/@codebam',
			...(site.showResume ? [LINKEDIN_URL] : [])
		];
		const person = {
			'@type': 'Person',
			name: LEGAL_NAME,
			alternateName: HANDLE,
			url: site.url,
			email: `mailto:${site.email}`,
			image: absolute('/profile.webp'),
			sameAs
		};

		const website = {
			'@type': 'WebSite',
			'@id': `${site.url}/#website`,
			url: site.url,
			name: site.name,
			description: site.description,
			inLanguage: 'en',
			publisher: person
		};

		if (!post) {
			return page.url.pathname === '/'
				? { '@context': 'https://schema.org', '@graph': [website, person] }
				: { '@context': 'https://schema.org', ...website };
		}

		return {
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			'@id': canonical,
			mainEntityOfPage: canonical,
			url: canonical,
			headline: post.meta.title,
			...(post.meta.description ? { description: post.meta.description } : {}),
			datePublished: post.meta.date,
			...(post.meta.updated ? { dateModified: post.meta.updated } : {}),
			...(post.meta.tags?.length ? { keywords: post.meta.tags.join(', ') } : {}),
			image: ogImage,
			inLanguage: 'en',
			author: person,
			publisher: person,
			isPartOf: { '@id': `${site.url}/#website` }
		};
	});

	// The closing tag is split so it does not end this component's own <script>
	// block, and every `<` inside the JSON is escaped so no string in the data
	// can close the element early.
	let jsonLdScript = $derived(
		`<script type="application/ld+json">` +
			JSON.stringify(jsonLd).replace(/</g, '\\u003c') +
			'<' +
			'/script>'
	);

	/** Projects live in a section of the home page rather than a route of their own. */
	const workHref = `${resolve('/')}#work`;

	/** A nav item is current for its own page and anything beneath it. */
	const isCurrent = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
</script>

<svelte:head>
	<meta name="description" content={metaDescription} />
	<meta property="og:title" content={ogTitle} />
	<meta
		property="og:description"
		content={post ? metaDescription : (page.data.description ?? site.ogDescription)}
	/>
	<meta property="og:type" content={post ? 'article' : 'website'} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content="en_CA" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:alt" content={post ? post.meta.title : site.name} />
	<!-- Generated cards are all 1200×630, including the site card. -->
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={ogTitle} />
	<meta
		name="twitter:description"
		content={post ? metaDescription : (page.data.description ?? site.ogDescription)}
	/>
	<meta name="twitter:image" content={ogImage} />
	{#if post?.meta.draft}
		<!-- Drafts are shareable by URL and absent from the sitemap; this keeps
		     a crawler that stumbles on one from indexing it. -->
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	{#if post}
		<meta property="article:author" content={site.name} />
		<meta property="article:published_time" content={post.meta.date} />
		{#if post.meta.updated}
			<meta property="article:modified_time" content={post.meta.updated} />
		{/if}
		{#each post.meta.tags ?? [] as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
	<!-- Built above rather than written here: Svelte compiles a literal <script>
	     in markup as a component script. Its hash is added to the page's CSP by
	     tools/csp/hash-jsonld.mjs after the build. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdScript}
	<link rel="canonical" href={canonical} />
	{#if alternate}
		<link rel="alternate" href={alternate} />
	{/if}
	<link rel="sitemap" type="application/xml" title="Sitemap" href="{base}/sitemap.xml" />
	<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="{base}/rss.xml" />
</svelte:head>

<a href="#main" class="skip-link">Skip to content</a>

<header class="border-b border-[var(--line)]">
	<div class="shell flex items-center gap-6 py-5 md:py-6">
		<a
			href={resolve('/')}
			class="wordmark display mr-auto text-[1.2rem] whitespace-nowrap"
			aria-current={page.url.pathname === '/' ? 'page' : undefined}
		>
			{site.name}
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

<!-- Full-bleed: each page owns its own panels and .shell columns, so a section
     can run edge to edge on its own background. -->
<main id="main">
	{@render children()}
</main>

<footer class="panel-invert">
	<div
		class="shell flex flex-wrap items-center gap-x-6 gap-y-3 py-10 text-sm text-[var(--muted)] md:py-12"
	>
		<span>&copy; {currentYear} {site.name}</span>
		<!-- Prerendered endpoint, not a route resolve() knows about -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="footer-link" href="{base}/rss.xml">RSS</a>
		<a
			class="footer-link"
			href="https://github.com/codebam"
			target="_blank"
			rel="me noopener noreferrer">GitHub</a
		>
		<a
			class="footer-link"
			href="https://mstdn.ca/@codebam"
			target="_blank"
			rel="me noopener noreferrer">Mastodon</a
		>
		<a class="footer-link" href="mailto:{site.email}">{site.email}</a>
		<!-- Colour inherited from the row: --dim failed AA here (3.3:1 against the
		     inverted panel) and is no longer used for type. -->
		<span class="ml-auto">Built with SvelteKit, hosted on Cloudflare</span>
	</div>
</footer>

<style>
	/* Nav and footer links carry the same underline wipe as `.link-quiet`: it
	   grows from the left on hover and retracts to the left on the way out, so
	   the label itself never shifts and the row height never changes. */
	.nav-link {
		position: relative;
		color: var(--muted);
		transition: color 0.2s ease;
	}
	.nav-link::after,
	.footer-link::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -4px;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.28s var(--ease-out-soft);
	}
	.nav-link:hover,
	.footer-link:hover {
		color: var(--accent);
	}
	.nav-link:hover::after,
	.nav-link:focus-visible::after,
	.footer-link:hover::after,
	.footer-link:focus-visible::after {
		transform: scaleX(1);
	}
	/* Current section stays legible without a heavier weight shifting layout */
	.nav-link[aria-current='page'] {
		color: var(--text);
	}
	/* The current page keeps its rule up permanently, in the accent, so hover
	   state and location state never look like the same thing. */
	.nav-link[aria-current='page']::after {
		background: var(--accent);
		transform: scaleX(1);
	}

	.footer-link {
		position: relative;
		color: var(--muted);
		transition: color 0.2s ease;
	}

	/* The wordmark's own small flourish: the accent dot after the name grows in
	   on hover. Cheap, and it makes the home link feel like a target. */
	.wordmark {
		position: relative;
		transition: color 0.2s ease;
	}
	.wordmark::after {
		content: '';
		display: inline-block;
		width: 5px;
		height: 5px;
		margin-left: 4px;
		border-radius: 999px;
		background: var(--accent);
		transform: scale(0);
		transition: transform 0.3s var(--ease-out-soft);
	}
	.wordmark:hover::after,
	.wordmark:focus-visible::after,
	.wordmark[aria-current='page']::after {
		transform: scale(1);
	}

	/* Clipped rather than parked off-left: some screen readers still announce
	   content at left: -9999px, and overflow:hidden parents can clip the focus
	   target. Visible only once focused. */
	.skip-link {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
	.skip-link:focus {
		left: 0;
		top: 0;
		z-index: 50;
		width: auto;
		height: auto;
		margin: 0;
		overflow: visible;
		clip: auto;
		clip-path: none;
		white-space: normal;
		background: var(--panel);
		color: var(--text);
		border: 1px solid var(--line-strong);
		border-radius: 0 0 8px 0;
		padding: 0.6rem 1rem;
		font-size: 0.9rem;
	}
</style>
