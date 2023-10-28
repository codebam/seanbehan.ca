<script>
  import { Avatar, Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode } from 'flowbite-svelte';
</script>

<Navbar class="bg-background dark:bg-background-dark">
  <NavBrand href="/">
    <Avatar src="/profile.webp"
      class="mr-3" rounded alt="profile" />
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
