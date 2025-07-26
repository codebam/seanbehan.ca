---
title: 'Search bar in Sveltekit'
date: 2023-12-06T20:29:41.990Z
tags:
  - svelte
  - sveltekit
  - javascript
  - typescript
  - serverless
  - cloudflare
draft: false
---

### Introduction

In this post I'm going to show you how I made the search bar on the posts page
and main page of my website.

### Implementing the Search Bar

I used a library called `fuse.js` for fuzzy searching for titles, here's how it
works.

```typescript
<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import Post from '$lib/components/Post.svelte';
	import Fuse from 'fuse.js';
	import { afterUpdate } from 'svelte';
	export let posts: { path: string; meta: { title: string; date: string } }[];
	let query = '*';
	let results = posts;
	const options = { keys: ['meta.title'] };
	const fuse = new Fuse(posts, options);
	afterUpdate(() => {
		let results_ = fuse.search(query);
		results = results_.map((result) => ({ path: result.item.path, meta: result.item.meta }));
	});
</script>

<Heading
	tag="h4"
	style="display: inline"
	class="ml-8 my-4 text-secondary dark:text-dark-secondary w-auto">Posts</Heading
>
<input class="text-secondary" bind:value={query} />
<ul>
	{#each results as post}
		<Post {post} />
	{/each}
	{#if results.length === 0}
		{#each posts as post}
			<Post {post} />
		{/each}
	{/if}
</ul>
```

### How it Works

You can see I initialize the query to `'*'`. All this really does is sets the
search field to `*` instead of being empty. Then in the input element I bind to
the value of query so that when the user types in the field the value of query
will change.

I do some more initialization of `fuse.js` to search and then I register
`afterUpdate()`. This allows me to search only when the page changes.

Finally I added some logic to display all the posts if there are no results,
like for example when the page loads.

All this together looks like the search bar you see on `/posts` and `/`.
