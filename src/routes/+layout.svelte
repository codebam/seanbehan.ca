<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import 'carbon-components-svelte/css/g100.css';
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		Content,
		SkipToContent
	} from 'carbon-components-svelte';

	let { children } = $props<{
		children: Snippet;
	}>();

	let showAds = $state(true);

	onMount(() => {
		const cookies = document.cookie.split(';').map((c) => c.trim());
		const hasDisableAdsCookie = cookies.some((c) => c.startsWith('disable_ads=true'));
		showAds = !hasDisableAdsCookie;
	});
</script>

<svelte:head>
	{#if showAds}
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3287237463323384"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>

<Header companyName="Sean" platformName="Behan" href="/">
	<svelte:fragment slot="skipToContent">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
		<HeaderNavItem href="/" text="Home" />
		<HeaderNavItem href="/posts" text="Posts" />
		<HeaderNavItem href="/donate" text="Donate (Remove Ads)" />
		<HeaderNavItem href="/contact" text="Contact" />
		<HeaderNavItem href="https://github.com/codebam" text="GitHub" />
		<HeaderNavItem href="https://mstdn.ca/@codebam" text="Mastodon" />
	</HeaderNav>
</Header>

<Content>
	{@render children()}
</Content>
