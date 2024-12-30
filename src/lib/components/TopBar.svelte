<script>
	import { page } from '$app/stores';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
</script>

<TabGroup>
	<TabAnchor href="/" selected={$page.url.pathname === '/'}>Home</TabAnchor>
	<TabAnchor href="/posts" selected={$page.url.pathname === '/posts'}>Posts</TabAnchor>
	<TabAnchor href="/contact" selected={$page.url.pathname === '/contact'}>Contact</TabAnchor>
</TabGroup>
