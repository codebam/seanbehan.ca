<script lang="ts">
  export let posts: {path: string, meta: {title: string, date: string}}[];
</script>

<h1 class="mx-8 my-4">Posts</h1>
<ul>
  {#if posts}
    {#each posts as post}
      <li class="m-2 py-4 drop-shadow border-2 border-secondary dark:border-dark-secondary rounded-xl hover:border-quaternary hover:dark:border-dark-quaternary">
        <h3 class="underline text-primary dark:text-dark-primary mx-8">
          <a class="hover:text-tertiary dark:hover:text-dark-tertiary" href={post.path}>
            {post.meta.title}
          </a>
        </h3>
        <p class="mx-8 text-secondary dark:text-dark-secondary">
          {new Date(post.meta.date).toDateString()}
        </p>
      </li>
    {/each}
  {/if}
</ul>
