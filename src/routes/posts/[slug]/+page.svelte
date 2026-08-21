<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import PostList from '$lib/components/PostList.svelte';
	import { site } from '$lib/site';
	import { slugifyTag } from '$lib/tags';
	import type { Post, PostPageData } from '$lib/types';

	const {
		data
	}: {
		data: {
			post: PostPageData['post'];
			newer: Post | null;
			older: Post | null;
			related: Post[];
			publishedTagSlugs: string[];
		};
	} = $props();

	const slugOf = (post: Post) => post.path.split('/').pop() ?? '';

	/**
	 * The contents list, shown only where it earns the space. Four sections is
	 * the point where a post stops being scannable in one screen — below that
	 * the list is longer than the scroll it saves.
	 */
	const TOC_MIN_SECTIONS = 4;
	let headings = $derived(data.post.headings ?? []);
	let toc = $derived(headings.length >= TOC_MIN_SECTIONS ? headings : []);
	/**
	 * Indentation is relative, not absolute: most posts here head their sections
	 * with `###` and never use `##` at all, and those lists would otherwise be
	 * indented in their entirety with nothing to sit under.
	 */
	let topLevel = $derived(Math.min(...headings.map((h) => h.level), 3));

	let meta = $derived(data.post.meta);
	let published = $derived(
		new Date(meta.date).toLocaleDateString('en-CA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);

	// ── Copy button on each code block ──
	// The posts are technical; a reader who has found the one snippet they came
	// for should be able to lift it without hand-selecting. The button is
	// injected after hydration: a button that cannot work is worse than none,
	// so with JS off the block simply stays a plain <pre>. One delegated
	// listener on the article container rather than one per block — the blocks
	// are in the rendered HTML string Svelte does not manage, and the number of
	// them varies post to post.
	let prose: HTMLDivElement | undefined;

	onMount(() => {
		const container = prose;
		if (!container) return;

		// <pre> only inside the article body, so an injected button never
		// lands on a block the reader wrote outside a code fence's reach.
		for (const pre of Array.from(container.querySelectorAll('pre'))) {
			// Already wrapped (a test re-render or a double mount); leave it.
			if (pre.parentElement?.classList.contains('code-block')) continue;

			const block = document.createElement('div');
			block.className = 'code-block';
			pre.before(block);

			// Announced rather than only labelled: a screen reader that just
			// pressed the button needs the outcome spoken, not the name
			// re-read.
			const status = document.createElement('span');
			status.className = 'sr-only';
			status.setAttribute('role', 'status');

			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'code-copy';
			button.textContent = 'Copy';

			block.append(button, status, pre);
		}

		// One delegated listener on the container rather than one per block:
		// the blocks are in the rendered HTML string Svelte does not manage,
		// and their number varies post to post. Attached in JS (not as an
		// onclick attribute) so the container stays a plain, non-interactive
		// element in the accessibility tree.
		container.addEventListener('click', onCopyClick);
		return () => container.removeEventListener('click', onCopyClick);
	});

	function copyFallback(text: string): boolean {
		const area = document.createElement('textarea');
		area.value = text;
		area.setAttribute('readonly', '');
		// Off the layout but still selectable: select() refuses a
		// display:none box.
		area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
		document.body.append(area);
		area.select();
		let copied = false;
		try {
			document.execCommand('copy');
			copied = true;
		} catch {
			// An execCommand that cannot copy simply did not.
		}
		area.remove();
		return copied;
	}

	async function copyText(text: string): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// Insecure context, or a clipboard denial — the fallback still gets
			// the text onto the clipboard where the API will not.
			return copyFallback(text);
		}
	}

	async function onCopyClick(event: MouseEvent) {
		const target =
			event.target instanceof Element ? event.target.closest('button.code-copy') : null;
		const button = target instanceof HTMLButtonElement ? target : null;
		if (!button || button.disabled) return;
		const pre = button.parentElement?.querySelector('pre');
		if (!pre) return;

		button.disabled = true;
		const status = button.parentElement?.querySelector('[role="status"]');
		// textContent rather than innerText: identical for a code block (the
		// text is what it is, no rendering to honour) and it exists everywhere.
		const copied = await copyText(pre.textContent ?? '');

		button.textContent = copied ? 'Copied' : 'Failed';
		button.classList.toggle('is-failed', !copied);
		if (status) status.textContent = copied ? 'Code copied' : 'Could not copy code';

		// The label reverts so a second copy (after the text changed, or by a
		// different reader of the same tab) still reads as an action.
		setTimeout(() => {
			button.textContent = 'Copy';
			button.classList.remove('is-failed');
			button.disabled = false;
		}, 1600);
	}
</script>

<!-- Description, og:*, article:* and the BlogPosting JSON-LD all come from the
     layout, which reads this page's `post` out of page data — emitting them
     here as well produced two of each tag. -->
<svelte:head>
	<title>{meta.title} — {site.name}</title>
</svelte:head>

<!-- Reading progress: a 2px accent strip across the top of the viewport, driven
     entirely by a scroll timeline in app.css. No scroll listener, and it is
     hidden outright for reduced-motion readers. -->
<div class="read-progress" aria-hidden="true"></div>

<article class="panel pt-14 pb-20 md:pt-16">
	<div class="shell">
		<header class="enter border-b border-[var(--line)] pb-10">
			<p class="eyebrow">
				<a href={resolve('/posts')} class="hover:underline">Writing</a>
			</p>

			<h1 class="display mt-5 max-w-[24ch] text-[2.4rem] md:text-[3.4rem]">{meta.title}</h1>

			{#if meta.description}
				<p
					class="mt-5 max-w-[54ch] text-[1.15rem] leading-[1.55] text-[var(--body)] md:text-[1.3rem]"
				>
					{meta.description}
				</p>
			{/if}

			<p class="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
				<time datetime={meta.date}>{published}</time>
				{#if data.post.readingMinutes}
					<span class="text-[var(--muted)]">&middot;</span>
					<span>{data.post.readingMinutes} min read</span>
				{/if}
				{#if meta.tags?.length}
					<span class="text-[var(--muted)]">&middot;</span>
					<span class="flex flex-wrap items-center gap-x-3">
						{#each meta.tags as tag (tag)}
							{#if data.publishedTagSlugs.includes(slugifyTag(tag))}
								<a
									href={resolve('/posts/tag/[tag]', { tag: slugifyTag(tag) })}
									class="hover:underline">{tag}</a
								>
							{:else}
								<span>{tag}</span>
							{/if}
						{/each}
					</span>
				{/if}
			</p>
		</header>

		{#if toc.length}
			<!-- Only on a post long enough to need it: a contents list above three
			     sections is a second copy of what the reader can already see. -->
			<nav
				class="enter toc mt-12 max-w-[68ch]"
				style="--enter-delay:40ms"
				aria-label="On this page"
			>
				<p class="eyebrow">On this page</p>
				<ol class="mt-4">
					{#each toc as heading (heading.id)}
						<li class:sub={heading.level > topLevel}>
							<a href="#{heading.id}">{heading.text}</a>
						</li>
					{/each}
				</ol>
			</nav>
		{/if}

		<div
			bind:this={prose}
			class="enter prose mt-12 max-w-[68ch] text-[1.05rem]"
			style="--enter-delay:60ms"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.post.html}
		</div>

		{#if data.related.length}
			<!-- Suggested by shared tags, not by recency: a reader who finished this
			     one is looking for more of the same subject, which is exactly what
			     the sibling links below cannot offer. -->
			<aside class="mt-16 border-t border-[var(--line)] pt-8">
				<h2 class="eyebrow">Related</h2>
				<div class="mt-6">
					<PostList posts={data.related} columns={2} headingLevel={3} />
				</div>
			</aside>
		{/if}

		<footer class="mt-16 border-t border-[var(--line)] pt-6 text-sm">
			<!-- The archive is newest first, so the older post is the one further
			     down it — labelled by direction in time rather than by list order,
			     which is what a reader is actually choosing between. -->
			<nav
				class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
				aria-label="More posts"
			>
				{#if data.older}
					<a
						href={resolve('/posts/[slug]', { slug: slugOf(data.older) })}
						class="sibling older max-w-[26ch]"
					>
						<span class="eyebrow"><span class="arrow">&larr;</span> Older</span>
						<span class="title">{data.older.meta.title}</span>
					</a>
				{/if}
				{#if data.newer}
					<a
						href={resolve('/posts/[slug]', { slug: slugOf(data.newer) })}
						class="sibling newer max-w-[26ch] sm:ml-auto sm:text-right"
					>
						<span class="eyebrow">Newer <span class="arrow">&rarr;</span></span>
						<span class="title">{data.newer.meta.title}</span>
					</a>
				{/if}
			</nav>

			<p class="mt-10">
				<a href={resolve('/posts')} class="link-accent back"
					><span class="arrow">&larr;</span> All posts</a
				>
			</p>
		</footer>
	</div>
</article>

<style>
	/* The contents list is a quiet block, not a sidebar: the site has one column
	   and a floating rail would fight the reading measure. */
	.toc ol {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		border-left: 2px solid var(--line);
		padding-left: 1.1rem;
	}
	.toc li.sub {
		padding-left: 1.1rem;
		font-size: 0.95rem;
	}
	.toc a {
		color: var(--body);
		transition: color 0.2s ease;
	}
	.toc a:hover,
	.toc a:focus-visible {
		color: var(--accent);
	}

	/* A sibling link is a two-line block, so the hover lands on the title rather
	   than the whole thing: the label above it is a direction, not a name. */
	.sibling {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.sibling .title {
		font-size: 1.05rem;
		color: var(--text);
		transition: color 0.25s ease;
	}
	.sibling:hover .title,
	.sibling:focus-visible .title {
		color: var(--accent);
	}
	/* Each arrow nudges the way its link travels. Keyed on the class rather than
	   position, because a post at either end of the archive has only one of the
	   two links and it would otherwise be nudged as though it were the other. */
	.sibling.newer:hover :global(.arrow),
	.sibling.newer:focus-visible :global(.arrow) {
		transform: translateX(3px);
	}
	.sibling.older:hover :global(.arrow),
	.sibling.older:focus-visible :global(.arrow) {
		transform: translateX(-3px);
	}

	/* The back arrow travels the other way, so its nudge has to as well. */
	.back:hover :global(.arrow),
	.back:focus-visible :global(.arrow) {
		transform: translateX(-3px);
	}
</style>
