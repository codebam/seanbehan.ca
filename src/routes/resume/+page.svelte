<script lang="ts">
	const RESUME_URL = 'https://pub-b1fc9705d9cd4b50885284c3ede52d27.r2.dev/resume.pdf';
</script>

<svelte:head>
	<title>Résumé — Sean Behan</title>
	<meta name="description" content="Résumé for Sean Behan, full-stack developer." />
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
		<a class="link-quiet" href="mailto:sean@seanbehan.ca">sean@seanbehan.ca</a>
		<a
			class="link-quiet"
			href="https://github.com/codebam"
			target="_blank"
			rel="noopener noreferrer">GitHub</a
		>
	</p>

	<!-- Fixed 8.5×11 ratio so the embed never letterboxes, and it is a plain
	     <object> rather than <embed> so the fallback link actually renders on
	     browsers with no PDF viewer (iOS Safari, most in-app browsers). -->
	<object
		data={RESUME_URL}
		type="application/pdf"
		title="Sean Behan résumé"
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
