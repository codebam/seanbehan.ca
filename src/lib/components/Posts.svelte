<script lang="ts">
	import { Heading, P, A  } from 'flowbite-svelte';
  export let posts: {path: string, meta: {title: string, date: string}}[];
</script>

<Heading tag="h4" class="ml-8 my-4 text-secondary dark:text-dark-secondary w-auto">Posts</Heading>
<ul>
  {#if posts}
    {#each posts as post}
      <li class="bg-background-secondary dark:bg-dark-background-secondary m-2
        py-4 pr-4 drop-shadow border-2 border-background-tertiary dark:border-dark-background-tertiary
        rounded-full hover:border-quaternary hover:dark:border-dark-quaternary w-auto">
        <Heading tag="h5" class="underline text-primary dark:text-dark-primary ml-8 w-auto">
          <A class="hover:text-tertiary dark:hover:text-dark-tertiary" href={post.path}>
            {post.meta.title}
          </A>
        </Heading>
        <P class="ml-8 text-secondary dark:text-dark-secondary w-auto">
          {new Date(post.meta.date).toDateString()}
        </P>
      </li>
    {/each}
  {/if}
</ul>
