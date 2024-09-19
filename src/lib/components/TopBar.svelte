<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>

<Navbar class="bg-background dark:bg-dark-background">
	<NavBrand class="mr-8" href="/">
		<enhanced:img src="/static/profile.webp" class="mr-3 rounded h-12 w-12" alt="profile" />
		<span
			class="self-center whitespace-nowrap text-xl font-semibold text-primary dark:text-dark-primary hover:text-tertiary hover:dark:text-dark-tertiary"
			>Sean Behan</span
		>
	</NavBrand>
	<NavUl>
		<NavLi
			class="text-primary dark:text-dark-primary hover:text-tertiary hover:dark:text-dark-tertiary"
			href="/">Home</NavLi
		>
		<NavLi
			class="text-primary dark:text-dark-primary hover:text-tertiary hover:dark:text-dark-tertiary"
			href="/playlists">Playlists</NavLi
		>
		<NavLi
			class="text-primary dark:text-dark-primary hover:text-tertiary hover:dark:text-dark-tertiary"
			href="https://github.com/codebam">GitHub</NavLi
		>
		<NavLi
			class="text-primary dark:text-dark-primary hover:text-tertiary hover:dark:text-dark-tertiary"
			href="/contact">Contact</NavLi
		>
		<NavLi
			class="text-primary dark:text-dark-primary hover:text-tertiary hover:dark:text-dark-tertiary"
			href="https://pub-b1fc9705d9cd4b50885284c3ede52d27.r2.dev/resume.pdf">Resume</NavLi
		>
		<NavLi
			class="text-primary dark:text-dark-primary hover:text-tertiary hover:dark:text-dark-tertiary"
			href="https://p.seanbehan.ca">Pastebin</NavLi
		>
		<NavLi
			class="text-primary dark:text-dark-primary hover:text-tertiary hover:dark:text-dark-tertiary"
			href="https://term.seanbehan.ca">Terminal</NavLi
		>
	</NavUl>
	<NavHamburger />
</Navbar>
