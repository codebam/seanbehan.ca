<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode } from 'flowbite-svelte';
</script>

<Navbar class="bg-background dark:bg-background-dark">
  <NavBrand href="/">
    <img src="https://avatars.githubusercontent.com/u/6035884?v=4" class="mr-3
      h-6 sm:h-9 rounded-lg" alt="profile" />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Sean Behan</span>
  </NavBrand>
  <NavUl>
    <NavLi href="/">Home</NavLi>
    <NavLi href="/posts">Posts</NavLi>
    <NavLi href="/playlists">Playlists</NavLi>
    <NavLi href="https://github.com/codebam">GitHub</NavLi>
    <NavLi href="/contact">Contact</NavLi>
    <NavLi href="/resume">Resume</NavLi>
    <NavLi href="https://p.seanbehan.ca">Pastebin</NavLi>
    <NavLi href="https://term.seanbehan.ca">Terminal</NavLi>
  </NavUl>
  <DarkMode />
  <NavHamburger />
</Navbar>
