<script>
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
</script>

<svelte:head>
	<title>Contact</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-8">
	<div class="mb-8 text-center">
		<h1 class="mb-4 text-4xl font-bold">Get in Touch</h1>
		<p class="text-surface-600 dark:text-surface-400 text-lg">
			Feel free to reach out through any of these channels
		</p>
	</div>

	<div class="mb-8 flex justify-center">
		<Avatar
			src="/profile.webp"
			name="Sean Behan profile photo"
		/>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<a
			href="mailto:contact@seanbehan.ca"
			class="bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 group flex items-center rounded-lg p-4 transition-colors"
		>
			<div
				class="bg-primary-500 mr-4 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
			>
				<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					></path>
				</svg>
			</div>
			<div>
				<h3 class="text-lg font-semibold">Email</h3>
				<p class="text-surface-600 dark:text-surface-400">contact@seanbehan.ca</p>
			</div>
		</a>

		<a
			href="https://github.com/codebam"
			class="bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 group flex items-center rounded-lg p-4 transition-colors"
		>
			<div
				class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 transition-transform group-hover:scale-110"
			>
				<svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
					/>
				</svg>
			</div>
			<div>
				<h3 class="text-lg font-semibold">GitHub</h3>
				<p class="text-surface-600 dark:text-surface-400">@codebam</p>
			</div>
		</a>

		<a
			href="https://www.linkedin.com/in/sean-behan"
			class="bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 group flex items-center rounded-lg p-4 transition-colors"
		>
			<div
				class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 transition-transform group-hover:scale-110"
			>
				<svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
					/>
				</svg>
			</div>
			<div>
				<h3 class="text-lg font-semibold">LinkedIn</h3>
				<p class="text-surface-600 dark:text-surface-400">Sean Behan</p>
			</div>
		</a>

		<a
			href="https://matrix.to/#/@codebam:envs.net"
			class="bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 group flex items-center rounded-lg p-4 transition-colors"
		>
			<div
				class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 transition-transform group-hover:scale-110"
			>
				<svg
					class="h-5 w-5"
					viewBox="0 0 520 520"
				>
					<path d="M13.7,11.9v496.2h35.7V520H0V0h49.4v11.9H13.7z" />
					<path
						d="M166.3,169.2v25.1h0.7c6.7-9.6,14.8-17,24.2-22.2c9.4-5.3,20.3-7.9,32.5-7.9c11.7,0,22.4,2.3,32.1,6.8  c9.7,4.5,17,12.6,22.1,24c5.5-8.1,13-15.3,22.4-21.5c9.4-6.2,20.6-9.3,33.5-9.3c9.8,0,18.9,1.2,27.3,3.6c8.4,2.4,15.5,6.2,21.5,11.5  c6,5.3,10.6,12.1,14,20.6c3.3,8.5,5,18.7,5,30.7v124.1h-50.9V249.6c0-6.2-0.2-12.1-0.7-17.6c-0.5-5.5-1.8-10.3-3.9-14.3  c-2.2-4.1-5.3-7.3-9.5-9.7c-4.2-2.4-9.9-3.6-17-3.6c-7.2,0-13,1.4-17.4,4.1c-4.4,2.8-7.9,6.3-10.4,10.8c-2.5,4.4-4.2,9.4-5,15.1  c-0.8,5.6-1.3,11.3-1.3,17v103.3h-50.9v-104c0-5.5-0.1-10.9-0.4-16.3c-0.2-5.4-1.3-10.3-3.1-14.9c-1.8-4.5-4.8-8.2-9-10.9  c-4.2-2.7-10.3-4.1-18.5-4.1c-2.4,0-5.6,0.5-9.5,1.6c-3.9,1.1-7.8,3.1-11.5,6.1c-3.7,3-6.9,7.3-9.5,12.9c-2.6,5.6-3.9,13-3.9,22.1  v107.6h-50.9V169.2H166.3z"
					/>
					<path d="M506.3,508.1V11.9h-35.7V0H520v520h-49.4v-11.9H506.3z" />
				</svg>
			</div>
			<div>
				<h3 class="text-lg font-semibold">Matrix</h3>
				<p class="text-surface-600 dark:text-surface-400">@codebam:envs.net</p>
			</div>
		</a>
	</div>

	<div class="mt-8 text-center">
		<a
			href="/publickey.txt"
			class="bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 inline-flex items-center rounded-lg px-6 py-3 transition-colors"
		>
			<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
				></path>
			</svg>
			PGP Public Key
		</a>
	</div>
</div>
