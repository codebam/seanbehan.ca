<script>
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
</script>

<svelte:head>
	<title>Contact</title>
</svelte:head>

<div class="max-w-2xl mx-auto py-8 px-4">
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold mb-4">Get in Touch</h1>
		<p class="text-lg text-surface-600 dark:text-surface-400">
			Feel free to reach out through any of these channels
		</p>
	</div>

	<div class="flex justify-center mb-8">
		<Avatar 
			src="/profile.webp" 
			name="Sean Behan profile photo" 
			class="w-32 h-32 border-4 border-primary-500 shadow-lg"
		/>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<a 
			href="mailto:contact@seanbehan.ca"
			class="flex items-center p-4 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors group"
		>
			<div class="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
				<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
				</svg>
			</div>
			<div>
				<h3 class="font-semibold text-lg">Email</h3>
				<p class="text-surface-600 dark:text-surface-400">contact@seanbehan.ca</p>
			</div>
		</a>

		<a 
			href="https://github.com/codebam"
			class="flex items-center p-4 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors group"
		>
			<div class="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
				<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
				</svg>
			</div>
			<div>
				<h3 class="font-semibold text-lg">GitHub</h3>
				<p class="text-surface-600 dark:text-surface-400">@codebam</p>
			</div>
		</a>

		<a 
			href="https://www.linkedin.com/in/sean-behan"
			class="flex items-center p-4 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors group"
		>
			<div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
				<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
					<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
				</svg>
			</div>
			<div>
				<h3 class="font-semibold text-lg">LinkedIn</h3>
				<p class="text-surface-600 dark:text-surface-400">Sean Behan</p>
			</div>
		</a>

		<a 
			href="https://matrix.to/#/@codebam:fedora.im"
			class="flex items-center p-4 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors group"
		>
			<div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
				<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
					<path d="M.632.55v22.9H2.28V24H0V0h2.28v.55H.632zm7.043 7.26v1.157h.033c.309-.443.683-.784 1.117-1.024.434-.24.951-.36 1.550-.36.968 0 1.703.243 2.204.728.501.485.752 1.208.752 2.169v5.61h-2.28V11.52c0-.286-.01-.559-.032-.818a1.46 1.46 0 0 0-.18-.638 1.02 1.02 0 0 0-.472-.387c-.2-.086-.43-.129-.687-.129-.26 0-.505.069-.736.207a1.59 1.59 0 0 0-.588.568c-.158.238-.268.52-.33.843-.062.324-.093.677-.093 1.058v4.866H5.72V7.81h1.955zm8.39 6.825c0 .398.058.749.174 1.052.116.304.277.563.483.777.206.214.45.380.732.498.282.118.594.178.936.178.342 0 .684-.06.966-.178.282-.118.526-.284.732-.498.206-.214.367-.473.483-.777.116-.303.174-.654.174-1.052 0-.398-.058-.749-.174-1.052a2.1 2.1 0 0 0-.483-.777 2.375 2.375 0 0 0-.732-.498 2.617 2.617 0 0 0-.966-.178c-.342 0-.654.06-.936.178a2.375 2.375 0 0 0-.732.498 2.1 2.1 0 0 0-.483.777c-.116.303-.174.654-.174 1.052zm-1.97 0c0-.729.138-1.35.413-1.861.275-.512.635-.928 1.08-1.247.445-.32.942-.55 1.492-.69.55-.14 1.093-.21 1.627-.21.534 0 1.077.07 1.627.21.55.14 1.047.37 1.492.69.445.319.805.735 1.08 1.247.275.511.413 1.132.413 1.861 0 .729-.138 1.35-.413 1.861-.275.512-.635.928-1.08 1.247-.445.32-.942.55-1.492.69-.55.14-1.093.21-1.627.21-.534 0-1.077-.07-1.627-.21-.55-.14-1.047-.37-1.492-.69-.445-.319-.805-.735-1.08-1.247-.275-.511-.413-1.132-.413-1.861zm13.632 0c0 .398.058.749.174 1.052.116.304.277.563.483.777.206.214.45.380.732.498.282.118.594.178.936.178.342 0 .684-.06.966-.178.282-.118.526-.284.732-.498.206-.214.367-.473.483-.777.116-.303.174-.654.174-1.052 0-.398-.058-.749-.174-1.052a2.1 2.1 0 0 0-.483-.777 2.375 2.375 0 0 0-.732-.498 2.617 2.617 0 0 0-.966-.178c-.342 0-.654.06-.936.178a2.375 2.375 0 0 0-.732.498 2.1 2.1 0 0 0-.483.777c-.116.303-.174.654-.174 1.052zm-1.97 0c0-.729.138-1.35.413-1.861.275-.512.635-.928 1.08-1.247.445-.32.942-.55 1.492-.69.55-.14 1.093-.21 1.627-.21.534 0 1.077.07 1.627.21.55.14 1.047.37 1.492.69.445.319.805.735 1.08 1.247.275.511.413 1.132.413 1.861 0 .729-.138 1.35-.413 1.861-.275.512-.635.928-1.08 1.247-.445.32-.942.55-1.492.69-.55.14-1.093.21-1.627.21-.534 0-1.077-.07-1.627-.21-.55-.14-1.047-.37-1.492-.69-.445-.319-.805-.735-1.08-1.247-.275-.511-.413-1.132-.413-1.861zM21.72.55H24V0h-2.28v.55H23.37v22.9H21.72V24H24v-24h-2.28v.55z"/>
				</svg>
			</div>
			<div>
				<h3 class="font-semibold text-lg">Matrix</h3>
				<p class="text-surface-600 dark:text-surface-400">@codebam:fedora.im</p>
			</div>
		</a>
	</div>

	<div class="mt-8 text-center">
		<a 
			href="/publickey.txt"
			class="inline-flex items-center px-6 py-3 bg-surface-200 dark:bg-surface-700 rounded-lg hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
		>
			<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
			</svg>
			PGP Public Key
		</a>
	</div>
</div>
