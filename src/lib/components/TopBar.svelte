<script>
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
	const activeClass =
		'text-tertiary dark:text-dark-tertiary hover:text-primary hover:dark:text-dark-primary';
	const nonActiveClass =
		'text-primary dark:text-dark-primary hover:text-tertiary hover:dark:text-dark-tertiary';
</script>

<Navbar class="bg-background dark:bg-dark-background">
	<NavBrand class="mr-8" href="/">
		<enhanced:img src="/static/profile.webp" class="mr-3 rounded h-12 w-12" alt="profile" />
		<span
			class="self-center whitespace-nowrap text-xl font-semibold text-primary dark:text-dark-primary hover:text-tertiary hover:dark:text-dark-tertiary"
			>Sean Behan</span
		>
	</NavBrand>
	<NavUl {activeUrl} {activeClass} {nonActiveClass}>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/playlists">Playlists</NavLi>
		<NavLi href="https://github.com/codebam">GitHub</NavLi>
		<NavLi href="/contact">Contact</NavLi>
		<NavLi href="https://pub-b1fc9705d9cd4b50885284c3ede52d27.r2.dev/resume.pdf">Resume</NavLi>
		<NavLi href="https://p.seanbehan.ca">Pastebin</NavLi>
		<NavLi href="https://term.seanbehan.ca">Terminal</NavLi>
	</NavUl>
	<NavHamburger />
</Navbar>
