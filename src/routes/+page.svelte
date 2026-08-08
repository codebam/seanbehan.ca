<script lang="ts">
	import { resolve } from '$app/paths';
	import PostList from '$lib/components/PostList.svelte';
	import type { HomePageData } from '$lib/types';

	const { data }: { data: HomePageData } = $props();

	/**
	 * Started building software in January 2014. Counted in whole elapsed years
	 * from that month rather than by subtracting calendar years, so the number
	 * only ticks over in January instead of every January 1st being wrong until
	 * then.
	 */
	const CAREER_START = Date.UTC(2014, 0, 1);
	const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
	let yearsBuilding = $derived(Math.floor((Date.now() - CAREER_START) / MS_PER_YEAR));

	/** Stars across the featured repos, rounded down to a round number. */
	let starTotal = $derived(data.projects.reduce((sum, p) => sum + p.stars, 0));
	let starLabel = $derived(
		starTotal >= 100 ? `${Math.floor(starTotal / 50) * 50}+` : `${starTotal}`
	);

	let latest = $derived(data.posts.slice(0, 6));
</script>

<svelte:head>
	<title>Sean Behan — Full-stack developer</title>
</svelte:head>

<!-- HERO — page surface -->
<section class="panel pt-14 pb-20 md:pt-16 md:pb-24">
	<div class="shell">
		<!-- Byline: the photo identifies the author rather than decorating the page,
		     which leaves the headline the full column width. -->
		<div class="flex items-center gap-3.5">
			<img
				src="/profile.webp"
				alt="Sean Behan"
				width="56"
				height="56"
				class="h-14 w-14 shrink-0 rounded-full object-cover"
			/>
			<div>
				<p class="eyebrow">Full-stack developer &middot; Linux</p>
				<p class="mt-0.5 text-[0.95rem] text-[var(--muted)]">Sean Behan &middot; Ontario, Canada</p>
			</div>
		</div>

		<h1 class="display display-xl mt-9 max-w-[20ch]">
			I build software that lives <em>close to the metal</em> and ships to the edge.
		</h1>

		<p class="mt-8 max-w-[52ch] text-[1.15rem] leading-[1.55] text-[var(--body)] md:text-[1.35rem]">
			{yearsBuilding} years of web applications, from database to frontend. I daily-drive NixOS, write
			Rust and TypeScript, and build everything in the open — a Wayland compositor, bots on Cloudflare
			Workers, and an encrypted pastebin.
		</p>

		<div class="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
			<a href={resolve('/posts')} class="btn">Read the writing</a>
			<a href="https://github.com/codebam" rel="noopener noreferrer" class="link-quiet">GitHub</a>
			<a href="mailto:sean@seanbehan.ca" class="link-quiet">sean@seanbehan.ca</a>
		</div>
	</div>
</section>

<!-- FACTS — tinted band -->
<section class="panel-alt py-12 md:py-14">
	<div class="shell grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
		{#each [{ n: `${yearsBuilding}+`, l: 'years building software' }, { n: `${data.posts.length}`, l: 'technical posts' }, { n: starLabel, l: 'GitHub stars' }, { n: 'Rust', l: '+ TypeScript, Nix' }] as fact (fact.l)}
			<div>
				<div class="display text-[2.4rem] md:text-[2.9rem]">{fact.n}</div>
				<div class="mt-1 text-sm text-[var(--muted)]">{fact.l}</div>
			</div>
		{/each}
	</div>
</section>

<!-- SELECTED WORK — inverted panel -->
<section id="work" class="panel-invert scroll-mt-4 py-20 md:py-24">
	<div class="shell">
		<div class="flex items-baseline justify-between gap-4">
			<h2 class="display display-lg">Selected work</h2>
			<a
				href="https://github.com/codebam?tab=repositories"
				rel="noopener noreferrer"
				class="link-accent whitespace-nowrap">All repositories &rarr;</a
			>
		</div>

		<div class="mt-12">
			{#each data.projects as project (project.repo)}
				<article
					class="grid gap-x-8 gap-y-2 border-t border-[var(--line)] py-8 md:grid-cols-[110px_1fr_auto]"
				>
					<div class="text-[0.95rem] text-[var(--muted)] md:pt-1.5">{project.since} &mdash;</div>

					<div>
						<h3 class="text-[1.45rem] font-medium tracking-tight">{project.title}</h3>
						<p class="mt-2.5 max-w-[58ch] text-[1.05rem] leading-relaxed text-[var(--body)]">
							{project.description}
						</p>

						<p class="mt-3.5 text-[0.92rem]">
							<span class="tag-lang">{project.language}</span>
							<span class="tag">&nbsp;&middot; {project.tags.join(' · ')}</span>
						</p>

						<p class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.98rem]">
							<a
								href="https://github.com/codebam/{project.repo}"
								rel="noopener noreferrer"
								class="link-quiet">Source</a
							>
							{#if project.homepage}
								<!-- Absolute external URLs from $lib/projects, so resolve() does not apply -->
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
								<a href={project.homepage} rel="noopener noreferrer" class="link-accent"
									>{project.homepageLabel} &rarr;</a
								>
							{/if}
						</p>
					</div>

					{#if project.stars > 0}
						<div
							class="text-[0.95rem] text-[var(--muted)] md:pt-1.5 md:text-right"
							title="{project.stars} {project.stars === 1 ? 'star' : 'stars'} on GitHub"
						>
							&#9733; {project.stars}
						</div>
					{/if}
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- LATEST WRITING — back to the page surface -->
<section class="panel py-20 md:py-24">
	<div class="shell">
		<div class="flex items-baseline justify-between gap-4">
			<h2 class="display display-lg">Latest writing</h2>
			<a href={resolve('/posts')} class="link-accent whitespace-nowrap"
				>All {data.posts.length} posts &rarr;</a
			>
		</div>

		<div class="mt-10">
			<PostList posts={latest} columns={2} />
		</div>
	</div>
</section>
