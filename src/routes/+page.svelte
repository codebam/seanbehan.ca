<script lang="ts">
import Posts from '$lib/components/Posts.svelte';
import { P } from 'flowbite-svelte';
export let data: {posts: {path: string, meta: {title: string, date: string}}[]};
</script>

<svelte:head>
	<title>Sean Behan</title>
</svelte:head>

<div class="bg-background-secondary dark:bg-dark-background-secondary m-2 p-4
	drop-shadow border-2 border-background-tertiary
	dark:border-dark-background-tertiary rounded-3xl hover:border-quaternary
	hover:dark:border-dark-quaternary">
<P class="mx-4 text-secondary dark:text-dark-secondary my-2">
Welcome to my website! My name is Sean Behan, and I'm a passionate full stack
developer with a penchant for creating robust, scalable, and maintainable
software solutions. With proficiency in multiple programming languages,
including TypeScript, Rust, C#, and Python, I've honed my skills in crafting
efficient, well-structured code that meets the needs of diverse projects.</P>

<P class="mx-4 text-secondary dark:text-dark-secondary my-2">
In addition to my technical expertise, I'm an avid advocate for open source and
Linux, believing in the power of community-driven development and the importance
of accessible, transparent technology. My experience has taught me the value of
collaboration, and I thrive in environments that foster creative problem-solving
and teamwork.</P>

<P class="mx-4 text-secondary dark:text-dark-secondary my-2">
As you explore my website, you'll discover more about my background, skills, and
projects. Feel free to reach out if you have any questions or would like to
discuss potential collaborations. Let's create something amazing together!</P>
</div>

<Posts posts={data.posts} />

<a rel="me" style="display: none;" href="https://mstdn.ca/@codebam">mstdn.ca/@codebam</a>
