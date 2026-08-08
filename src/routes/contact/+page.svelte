<script lang="ts">
	const channels = [
		{
			label: 'Email',
			value: 'sean@seanbehan.ca',
			href: 'mailto:sean@seanbehan.ca',
			note: 'Best for anything that needs a reply'
		},
		{
			label: 'GitHub',
			value: '@codebam',
			href: 'https://github.com/codebam',
			note: 'Issues and pull requests welcome'
		},
		{
			label: 'Mastodon',
			value: '@codebam@mstdn.ca',
			href: 'https://mstdn.ca/@codebam',
			note: 'Where I post the small stuff'
		},
		{
			label: 'Matrix',
			value: '@codebam:mozilla.org',
			href: 'https://matrix.to/#/@codebam:mozilla.org',
			note: 'End-to-end encrypted chat'
		},
		{
			label: 'LinkedIn',
			value: 'Sean Behan',
			href: 'https://www.linkedin.com/in/sean-behan',
			note: 'For the recruiters'
		},
		{
			label: 'PGP',
			value: 'publickey.txt',
			href: '/publickey.txt',
			note: 'Encrypt anything sensitive'
		}
	];
</script>

<svelte:head>
	<title>Contact — Sean Behan</title>
	<meta name="description" content="Get in touch with Sean Behan — email, GitHub, Mastodon." />
</svelte:head>

<section class="pt-10 pb-16 md:pt-12">
	<p class="eyebrow">Open to work &middot; Ontario, Canada</p>

	<h1 class="display mt-4 max-w-[20ch] text-[2.4rem] md:text-[3.1rem]">
		Say <em>hello</em>.
	</h1>

	<div class="mt-8 grid items-start gap-8 md:grid-cols-[1fr_180px] md:gap-12">
		<p class="max-w-[52ch] text-[1.05rem] leading-relaxed text-[var(--body)]">
			Email is the surest way to reach me. If you are hiring, contracting, or want to talk about
			something I built, say what you need and I will get back to you.
		</p>
		<img
			src="/profile.webp"
			alt="Sean Behan"
			width="180"
			height="180"
			class="order-first aspect-square w-32 rounded object-cover md:order-none md:w-full"
		/>
	</div>

	<ul class="mt-12">
		{#each channels as channel (channel.label)}
			<li class="border-t border-[var(--line)]">
				<!-- Absolute or non-route URLs (mailto:, /publickey.txt), so resolve() does not apply -->
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<a
					href={channel.href}
					rel="noopener noreferrer"
					class="channel grid gap-x-6 gap-y-1 py-5 md:grid-cols-[110px_1fr_auto] md:items-baseline"
				>
					<span class="text-sm tracking-wide text-[var(--muted)] uppercase">{channel.label}</span>
					<span class="value text-[1.05rem]">{channel.value}</span>
					<span class="text-sm text-[var(--muted)] md:text-right">{channel.note}</span>
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</li>
		{/each}
	</ul>
</section>

<style>
	.channel .value {
		transition: color 0.2s ease;
	}
	.channel:hover .value {
		color: var(--accent);
	}
</style>
