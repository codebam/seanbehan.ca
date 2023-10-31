<script lang="ts">
	import { Heading, P, A  } from 'flowbite-svelte';
  export let posts: {path: string, meta: {title: string, date: string}}[];
</script>

<Heading tag="h4" class="mx-10 my-4 text-secondary dark:text-dark-secondary">Posts</Heading>
<ul>
  {#if posts}
    {#each posts as post}
      <li class="bg-background-secondary dark:bg-dark-background-secondary m-2 py-4 drop-shadow border-2 border-secondary dark:border-dark-secondary rounded-xl hover:border-quaternary hover:dark:border-dark-quaternary">
        <Heading tag="h5" class="underline text-primary dark:text-dark-primary mx-8">
          <A class="hover:text-tertiary dark:hover:text-dark-tertiary" href={post.path}>
            {post.meta.title}
          </A>
        </Heading>
        <P class="mx-8 text-secondary dark:text-dark-secondary">
          {new Date(post.meta.date).toDateString()}
        </P>
      </li>
    {/each}
  {/if}
</ul>
