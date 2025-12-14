<script lang="ts">
	import type { Snippet } from 'svelte';
	import 'carbon-components-svelte/css/g100.css';
	import { Header, HeaderNav, HeaderNavItem, Content, SkipToContent } from 'carbon-components-svelte';
	
	let { children } = $props<{
		children: Snippet;
	}>();
</script>

<svelte:head>
	<script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3287237463323384"
		crossorigin="anonymous"
	></script>
</svelte:head>

<Header company="Sean" platformName="Behan" href="/">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
		<HeaderNavItem href="/" text="Home" />
		<HeaderNavItem href="/posts" text="Posts" />
		<HeaderNavItem href="/contact" text="Contact" />
		<HeaderNavItem href="https://github.com/codebam" text="GitHub" />
		<HeaderNavItem href="https://mstdn.ca/@codebam" text="Mastodon" />
	</HeaderNav>
</Header>

<Content>
	{@render children()}
</Content>
