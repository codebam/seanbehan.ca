<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { resolve } from '$app/paths';
	import Posts from '$lib/components/Posts.svelte';
	import { initAIBio } from '$lib/utils';
	import type { HomePageData } from '$lib/types';
	import { Tag } from 'carbon-components-svelte';

	const { data }: { data: HomePageData } = $props();

	let yearStarted = $derived(new Date().getFullYear() - 2018);

	onMount(() => {
		if (dev) return;
		let cleanupAIBio: (() => void) | undefined;
		try {
			cleanupAIBio = initAIBio('bio');
		} catch (error) {
			console.error('Failed to initialize AI bio:', error);
		}
		return () => cleanupAIBio?.();
	});
</script>

<svelte:head>
	<title>Sean Behan — Full-Stack Developer & Linux Enthusiast</title>
</svelte:head>

<!-- HERO SECTION -->
<section
	class="relative mt-0 mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--hero-start)] via-[var(--hero-mid)] to-[var(--hero-end)] px-4 py-10 shadow-2xl md:mt-2 md:mb-16 md:px-14 md:py-20"
>
	<!-- Animated grid overlay -->
	<div
		class="pointer-events-none absolute inset-0 opacity-[0.04]"
		style="background-image: radial-gradient(circle at 25px 25px, #fff 1px, transparent 0); background-size: 50px 50px;"
	></div>

	<!-- Ambient orbs -->
	<div
		class="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[var(--accent-blue)]/10 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -right-20 -bottom-32 h-80 w-80 rounded-full bg-[var(--accent-magenta)]/10 blur-3xl"
	></div>

	<div class="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-center">
		<!-- Profile image with animated glow -->
		<div class="shrink-0">
			<div class="relative mx-auto h-32 w-32 md:h-40 md:w-40">
				<div
					class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-[var(--accent-blue)] via-[var(--accent-blue-light)] to-[var(--accent-magenta)] opacity-40 blur-xl"
				></div>
				<div
					class="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent-blue)] via-[var(--accent-blue-light)] to-[var(--accent-magenta)] p-[3px]"
				>
					<img
						src="/profile.webp"
						alt="Sean Behan"
						class="h-full w-full rounded-full border-2 border-[var(--surface-base)] object-cover"
					/>
				</div>
			</div>
		</div>

		<!-- Hero text -->
		<div class="flex-1 text-center md:text-left">
			<div
				class="mb-2 inline-block rounded-full bg-[var(--accent-blue)]/15 px-4 py-1 text-xs font-semibold tracking-wider text-[var(--accent-blue-light)] uppercase"
			>
				{yearStarted}+ Years Building Software
			</div>

			<h1
				class="mb-3 text-4xl leading-tight font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl"
			>
				Sean Behan
			</h1>

			<div class="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
				<Tag type="blue" size="sm">Full-Stack Developer</Tag>
				<Tag type="green" size="sm">Linux Enthusiast</Tag>
				<Tag type="magenta" size="sm">Open Source</Tag>
				<Tag type="cyan" size="sm">Quick Learner</Tag>
			</div>

			<p
				id="bio"
				class="max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg"
			>
				As a full-stack developer, I specialize in creating and managing web applications using
				various programming languages and technologies. My primary focus lies within the Linux
				operating system, where I spend most of my time writing software and contributing to
				open-source projects. With my aptitude for quick learning, I am always eager to expand my
				knowledge base and explore new technologies to enhance my skills. This passion for
				continuous growth enables me to create innovative, efficient, and cutting-edge solutions for
				a wide range of projects.
			</p>

			<p class="mt-2 text-right text-xs text-[var(--text-tertiary)]">
				<a
					href="https://ai.clo...om"
					target="_blank"
					rel="noopener noreferrer"
					class="transition-colors hover:text-[var(--accent-blue)]"
				>
					@cf/google/gemma-4-26b-a4b-it
				</a>
			</p>

			<!-- CTA buttons -->
			<div class="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
				<a href={resolve('/posts')} class="btn-primary">
					<svg
						width="14"
						height="14"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
						/>
					</svg>
					Read My Posts
				</a>
				<a
					href="https://github.com/codebam"
					target="_blank"
					rel="noopener noreferrer"
					class="btn-secondary"
				>
					<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
						/>
					</svg>
					GitHub
				</a>
				<a
					href={resolve('/contact')}
					class="btn-secondary"
					style="--btn-accent: var(--accent-green);"
				>
					<svg
						width="14"
						height="14"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
						/>
					</svg>
					Contact Me
				</a>
			</div>
		</div>
	</div>
</section>

<!-- HERO PANELS — What I Do -->
<div class="grid gap-2 md:grid-cols-3 md:gap-6">
	<div
		class="group card relative h-full overflow-hidden"
		style="--card-accent: var(--accent-blue);"
	>
		<div class="spotlight"></div>
		<div class="relative z-10">
			<div
				class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
				style="background: color-mix(in srgb, var(--card-accent) 10%, transparent);"
			>
				<svg
					width="20"
					height="20"
					fill="none"
					viewBox="0 0 24 24"
					stroke="var(--card-accent)"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Full-Stack Development</h3>
			<p class="text-sm leading-relaxed text-[var(--text-secondary)]">
				Building modern web applications from database to frontend. Experienced with SvelteKit,
				React, TypeScript, and Node.js — always choosing the right tool for the job.
			</p>
		</div>
	</div>

	<div
		class="group card relative h-full overflow-hidden"
		style="--card-accent: var(--accent-green);"
	>
		<div class="spotlight"></div>
		<div class="relative z-10">
			<div
				class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
				style="background: color-mix(in srgb, var(--card-accent) 10%, transparent);"
			>
				<svg
					width="20"
					height="20"
					fill="none"
					viewBox="0 0 24 24"
					stroke="var(--card-accent)"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Linux &amp; DevOps</h3>
			<p class="text-sm leading-relaxed text-[var(--text-secondary)]">
				Daily-driving Linux with NixOS, managing infrastructure with containers, systemd, and
				automation. Passionate about reproducible builds and declarative configuration.
			</p>
		</div>
	</div>

	<div
		class="group card relative h-full overflow-hidden"
		style="--card-accent: var(--accent-magenta);"
	>
		<div class="spotlight"></div>
		<div class="relative z-10">
			<div
				class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
				style="background: color-mix(in srgb, var(--card-accent) 10%, transparent);"
			>
				<svg
					width="20"
					height="20"
					fill="none"
					viewBox="0 0 24 24"
					stroke="var(--card-accent)"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-bold text-[var(--text-primary)]">Open Source</h3>
			<p class="text-sm leading-relaxed text-[var(--text-secondary)]">
				Active contributor and maintainer of open-source projects. Believer in collaborative
				development, transparent code, and sharing knowledge with the community.
			</p>
		</div>
	</div>
</div>

<!-- FEATURED PROJECTS -->
<section class="mt-16 mb-8">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-[var(--text-primary)]">Featured Projects</h2>
			<p class="mt-1 text-sm text-[var(--text-tertiary)]">Things I've built and maintain</p>
		</div>
		<a
			href="https://github.com/codebam?tab=repositories"
			target="_blank"
			rel="noopener noreferrer"
			class="link-arrow"
		>
			All repositories
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
				/>
			</svg>
		</a>
	</div>

	<div class="grid gap-2 md:grid-cols-2 md:gap-6">
		{#each data.projects as project (project.repo)}
			<article class="group card relative flex h-full flex-col overflow-hidden">
				<div class="spotlight"></div>

				<div class="relative z-10 flex h-full flex-col">
					<div class="mb-2 flex items-start justify-between gap-4">
						<h3 class="text-lg font-bold text-[var(--text-primary)]">{project.title}</h3>
						{#if project.stars > 0}
							<span
								class="inline-flex shrink-0 items-center gap-1 text-xs text-[var(--text-tertiary)]"
								title="{project.stars} {project.stars === 1 ? 'star' : 'stars'} on GitHub"
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 4.9 5.32.51c.5.05.7.68.32 1.02l-4.01 3.54 1.17 5.23c.11.49-.42.88-.85.62L12 16.6l-4.6 2.72c-.43.26-.96-.13-.85-.62l1.17-5.23-4.01-3.54c-.38-.34-.18-.97.32-1.02l5.32-.51 2.13-4.9Z"
									/>
								</svg>
								{project.stars}
							</span>
						{/if}
					</div>

					<p class="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
						{project.description}
					</p>

					<div class="mb-4 flex flex-wrap gap-2">
						<span
							class="rounded-full bg-[var(--accent-blue)]/10 px-2.5 py-0.5 text-xs text-[var(--accent-blue-light)]"
						>
							{project.language}
						</span>
						{#each project.tags as tag (tag)}
							<span class="tag">{tag}</span>
						{/each}
					</div>

					<div class="mt-auto flex flex-wrap gap-3">
						<a
							href="https://github.com/codebam/{project.repo}"
							target="_blank"
							rel="noopener noreferrer"
							class="btn-secondary btn-sm"
						>
							<svg
								width="14"
								height="14"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
								/>
							</svg>
							Source
						</a>
						{#if project.homepage}
							<!-- Absolute external URLs from $lib/projects, so resolve() does not apply -->
							<!-- eslint-disable svelte/no-navigation-without-resolve -->
							<a
								href={project.homepage}
								target="_blank"
								rel="noopener noreferrer"
								class="btn-primary btn-sm"
							>
								{project.homepageLabel}
								<svg
									width="12"
									height="12"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
									/>
								</svg>
							</a>
							<!-- eslint-enable svelte/no-navigation-without-resolve -->
						{/if}
					</div>
				</div>
			</article>
		{/each}
	</div>
</section>

<!-- LATEST POSTS -->
<section class="mt-16 mb-8">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-[var(--text-primary)]">Latest Posts</h2>
			<p class="mt-1 text-sm text-[var(--text-tertiary)]">
				Thoughts on tech, Linux, and building things
			</p>
		</div>
		<a href={resolve('/posts')} class="link-arrow">
			View all
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
				/>
			</svg>
		</a>
	</div>
	<Posts posts={data.posts} />
</section>

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
