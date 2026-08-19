<script lang="ts">
	import { site } from '$lib/site';

	const RESUME_URL = 'https://pub-b1fc9705d9cd4b50885284c3ede52d27.r2.dev/resume.pdf';

	const CAREER_START = Date.UTC(2014, 0, 1);
	const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
	let yearsBuilding = $derived(Math.floor((Date.now() - CAREER_START) / MS_PER_YEAR));
	let intro = $derived(site.intro.replace('{years}', String(yearsBuilding)));
</script>

<svelte:head>
	<title>Résumé — {site.name}</title>
</svelte:head>

<section class="panel shell pt-14 pb-20 md:pt-16">
	<p class="enter eyebrow">Full-stack developer &middot; Ontario, Canada</p>
	<h1 class="enter display display-xl mt-5" style="--enter-delay:0ms">Résumé</h1>

	<p
		class="enter mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.95rem]"
		style="--enter-delay:80ms"
	>
		<!-- Absolute R2 asset, so resolve() does not apply -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="btn" href={RESUME_URL} download="sean-behan-resume.pdf">Download PDF</a>
		<a class="link-quiet" href="mailto:{site.email}">{site.email}</a>
		<a
			class="link-quiet"
			href="https://github.com/codebam"
			target="_blank"
			rel="noopener noreferrer">GitHub</a
		>
	</p>

	<div class="enter mt-10 max-w-[68ch] text-[1.05rem] leading-relaxed text-[var(--body)]">
		<p>
			Full-stack developer in Ontario. {intro}
		</p>
		<ul class="mt-5 list-disc space-y-2 pl-5">
			<li>Rust, TypeScript, NixOS. Daily-driver Linux, Cloudflare Workers at the edge.</li>
			<li>
				Open source: a Wayland compositor (Viewport), a Telegram bot framework on Workers, an
				encrypted pastebin.
			</li>
			<li>Writing on Linux, containers, NixOS, and building software that ships.</li>
		</ul>
		<p class="mt-5 text-sm text-[var(--muted)]">
			The PDF below is the formatted résumé. This summary is here for search and for browsers that
			will not render the object.
		</p>
	</div>

	<!-- Fixed 8.5×11 ratio so the embed never letterboxes, and it is a plain
	     <object> rather than <embed> so the fallback link actually renders on
	     browsers with no PDF viewer (iOS Safari, most in-app browsers). -->
	<object
		data={RESUME_URL}
		type="application/pdf"
		title="{site.name} résumé"
		class="mt-10 aspect-[8.5/11] w-full rounded border border-[var(--line)] bg-[var(--panel)]"
	>
		<div class="p-8 text-[var(--body)]">
			<p>Your browser cannot display the PDF inline.</p>
			<p class="mt-2">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a class="link-accent" href={RESUME_URL}>Open the résumé &rarr;</a>
			</p>
		</div>
	</object>
</section>
