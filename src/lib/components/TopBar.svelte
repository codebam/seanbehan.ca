<script>
  import { Avatar, Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>

<Navbar class="bg-background dark:bg-background-dark">
  <NavBrand class="mr-8" href="/">
    <Avatar src="/profile.webp"
      class="mr-3" rounded alt="profile" />
    <span class="self-center whitespace-nowrap text-xl font-semibold text-primary dark:text-dark-primary">Sean Behan</span>
  </NavBrand>
  <NavUl>
    <NavLi class="text-primary dark:text-dark-primary" href="/">Home</NavLi>
    <NavLi class="text-primary dark:text-dark-primary" href="/posts">Posts</NavLi>
    <NavLi class="text-primary dark:text-dark-primary" href="/playlists">Playlists</NavLi>
    <NavLi class="text-primary dark:text-dark-primary" href="https://github.com/codebam">GitHub</NavLi>
    <NavLi class="text-primary dark:text-dark-primary" href="/contact">Contact</NavLi>
    <NavLi class="text-primary dark:text-dark-primary" href="/resume">Resume</NavLi>
    <NavLi class="text-primary dark:text-dark-primary" href="https://p.seanbehan.ca">Pastebin</NavLi>
    <NavLi class="text-primary dark:text-dark-primary" href="https://term.seanbehan.ca">Terminal</NavLi>
  </NavUl>
  <NavHamburger />
</Navbar>
