<script lang="ts">
	import { resolve } from '$app/paths';
	import PostList from '$lib/components/PostList.svelte';
	import CountUp from '$lib/components/svelte-bits/CountUp.svelte';
	import DotGrid from '$lib/components/svelte-bits/DotGrid.svelte';
	import Grainient from '$lib/components/svelte-bits/Grainient.svelte';
	import StarBorder from '$lib/components/svelte-bits/StarBorder.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { site } from '$lib/site';
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
	let starCount = $derived(starTotal >= 100 ? Math.floor(starTotal / 50) * 50 : starTotal);
	let starSuffix = $derived(starTotal >= 100 ? '+' : '');

	let latest = $derived(data.posts.slice(0, 6));

	let intro = $derived(site.intro.replace('{years}', String(yearsBuilding)));
</script>

<svelte:head>
	<title>{site.title}</title>
</svelte:head>

<!-- HERO — page surface, over an ambient wash

	Grainient is decorative and sits behind everything, masked out before the
	fold ends so the band below starts on flat paper. It is the one place on the
	site where something moves on its own; every reading surface stays still. -->
<section class="hero panel relative overflow-hidden pt-14 pb-20 md:pt-16 md:pb-24">
	<div class="wash" aria-hidden="true">
		<Grainient />
	</div>

	<div class="shell relative">
		<!-- Byline: the photo identifies the author rather than decorating the page,
		     which leaves the headline the full column width. -->
		<div class="enter flex items-center gap-3.5">
			<!-- avatar.webp is the 2x crop of profile.webp at the size this actually
			     renders (1.4 kB against 13 kB). The full 460px profile.webp is the
			     contact photo and the Person image in JSON-LD. -->
			<img
				src="/avatar.webp"
				alt={site.name}
				width="56"
				height="56"
				fetchpriority="high"
				class="h-14 w-14 shrink-0 rounded-full object-cover"
			/>
			<div>
				<p class="eyebrow">{site.eyebrow}</p>
				<p class="mt-0.5 text-[0.95rem] text-[var(--muted)]">{site.byline}</p>
			</div>
		</div>

		<h1 class="enter display display-xl mt-9 max-w-[20ch]" style="--enter-delay:0ms">
			{site.headline.before}<em>{site.headline.emphasis}</em>{site.headline.after}
		</h1>

		<p
			class="enter mt-8 max-w-[52ch] text-[1.15rem] leading-[1.55] text-[var(--body)] md:text-[1.35rem]"
			style="--enter-delay:80ms"
		>
			{intro}
		</p>

		<div class="enter mt-9 flex flex-wrap items-center gap-x-7 gap-y-4" style="--enter-delay:140ms">
			<StarBorder>
				<a href={resolve('/posts')} class="btn">Read the writing</a>
			</StarBorder>
			<a
				href="https://github.com/codebam"
				target="_blank"
				rel="noopener noreferrer"
				class="link-quiet">GitHub</a
			>
			<a href="mailto:{site.email}" class="link-quiet">{site.email}</a>
		</div>
	</div>
</section>

<!--
	The order of the two sections below is the difference between the variants.
	seanbehan.ca leads with the numbers band and reads as a profile; codebam.ca
	leads with the project rows and reads as a body of work. Both are declared
	as snippets so the ordering is a single condition rather than two copies of
	the markup drifting apart.
-->
{#if site.leadWith === 'work'}
	{@render work()}
	{@render facts()}
{:else}
	{@render facts()}
	{@render work()}
{/if}

{#snippet facts()}
	<!-- FACTS — tinted band over a dot field that answers the pointer.
	     The numbers count once, the first time the band is seen; the fourth cell
	     is a word, so it is spelled out rather than forced into the component. -->
	<section class="facts panel-alt relative overflow-hidden py-12 md:py-14">
		<DotGrid />

		<div class="shell relative grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
			{#each [{ n: yearsBuilding, suffix: '+', l: 'years building software' }, { n: data.posts.length, suffix: '', l: 'technical posts' }, { n: starCount, suffix: starSuffix, l: 'GitHub stars' }, { n: 'Rust', suffix: '', l: '+ TypeScript, Nix' }] as fact, i (fact.l)}
				<div use:reveal={{ delay: i * 60 }}>
					<div class="display text-[2.4rem] tabular-nums md:text-[2.9rem]">
						{#if typeof fact.n === 'number'}
							<CountUp to={fact.n} suffix={fact.suffix} duration={1.2 + i * 0.15} />
						{:else}
							{fact.n}
						{/if}
					</div>
					<div class="mt-1 text-sm text-[var(--muted)]">{fact.l}</div>
				</div>
			{/each}
		</div>
	</section>
{/snippet}

{#snippet work()}
	<!-- SELECTED WORK — inverted panel -->
	<section id="work" class="panel-invert scroll-mt-4 py-20 md:py-24">
		<div class="shell">
			<div class="flex items-baseline justify-between gap-4" use:reveal>
				<h2 class="display display-lg">Selected work</h2>
				<a
					href="https://github.com/codebam?tab=repositories"
					target="_blank"
					rel="noopener noreferrer"
					class="link-accent whitespace-nowrap"
					>All repositories <span class="arrow">&rarr;</span></a
				>
			</div>

			<div class="mt-12">
				{#each data.projects as project, i (project.repo)}
					<article
						class="work-row grid gap-x-8 gap-y-2 border-t border-[var(--line)] py-8 md:grid-cols-[110px_1fr_auto]"
						use:reveal={{ delay: Math.min(i, 4) * 70 }}
					>
						<div class="text-[0.95rem] text-[var(--muted)] md:pt-1.5">{project.since} &mdash;</div>

						<div>
							<h3 class="title text-[1.45rem] font-medium tracking-tight">{project.title}</h3>
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
									target="_blank"
									rel="noopener noreferrer"
									class="link-quiet">Source</a
								>
								{#if project.homepage}
									<!-- Absolute external URLs from $lib/projects, so resolve() does not apply -->
									<!-- eslint-disable svelte/no-navigation-without-resolve -->
									<a
										href={project.homepage}
										target="_blank"
										rel="noopener noreferrer"
										class="link-accent">{project.homepageLabel} <span class="arrow">&rarr;</span></a
									>
									<!-- eslint-enable svelte/no-navigation-without-resolve -->
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
{/snippet}

<!-- LATEST WRITING — back to the page surface -->
<section class="panel py-20 md:py-24">
	<div class="shell">
		<div class="flex items-baseline justify-between gap-4" use:reveal>
			<h2 class="display display-lg">Latest writing</h2>
			<a href={resolve('/posts')} class="link-accent whitespace-nowrap"
				>All {data.posts.length} posts <span class="arrow">&rarr;</span></a
			>
		</div>

		<div class="mt-10" use:reveal={{ delay: 60 }}>
			<PostList posts={latest} columns={2} />
		</div>
	</div>
</section>

<style>
	/* The wash is held at low opacity and faded out over the last third of the
	   hero, so the headline sits on something close to paper and the boundary
	   with the band below is a colour change rather than a visible edge. The
	   mask is what keeps it ambient instead of a hero image. */
	.hero .wash {
		position: absolute;
		inset: 0;
		opacity: 0.5;
		mask-image: linear-gradient(180deg, #000 0%, #000 55%, transparent 100%);
	}
	@media (prefers-color-scheme: dark) {
		/* The dark palette has far less headroom between the accent and the page,
		   so the same opacity that reads as a wash in light reads as a wall here. */
		.hero .wash {
			opacity: 0.32;
		}
	}

	/* A work row is not a link, so it gets the lightest possible hover: the
	   rule above it warms to the accent and the title follows. No lift, no
	   shadow — the row is a reading surface first. */
	.work-row {
		transition: border-color 0.3s ease;
	}
	.work-row:hover {
		border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
	}
	.work-row .title {
		transition: color 0.25s ease;
	}
	.work-row:hover .title {
		color: var(--accent);
	}
</style>
