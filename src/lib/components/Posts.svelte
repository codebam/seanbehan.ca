<script lang="ts">
  export let posts: {path: string, meta: {title: string, date: string}}[];
</script>

<h1>Posts</h1>
<ul>
  {#if posts}
    {#each posts as post}
      <li>
        <h3 class="text-primary dark:text-dark-primary
          hover:text-secondary dark:hover:text-dark-secondary">
          <a href={post.path}>
            {post.meta.title}
          </a>
        </h3>
        <p class="text-secondary dark:text-dark-secondary">
          {new Date(post.meta.date).toDateString()}
        </p>
      </li>
    {/each}
  {/if}
</ul>
