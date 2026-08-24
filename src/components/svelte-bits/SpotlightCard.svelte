<!--
	SpotlightCard — a soft pool of light that follows the pointer across a card.

	Port of https://sveltebits.xyz/r/spotlight-card.json. Upstream hard-codes a
	dark card (`bg-neutral-900`, `rounded-3xl`, `p-8`) and a white spotlight; here
	the element brings its own surface and the light is the site accent, so the
	same component works on a post row and would work on a panel.

	`as` exists because the post list's cards are links: the spotlight has to be
	the anchor itself, not a div wrapped around one, or the grid gains a layer
	and the whole row stops being one click target.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		/** Element to render. `a` for a linked card. */
		as?: string;
		class?: string;
		/** Any CSS colour; defaults to the accent wash so it reads in both themes. */
		spotlightColor?: string;
		size?: string;
		[key: string]: unknown;
	};

	let {
		children,
		as = 'div',
		class: className = '',
		spotlightColor = 'color-mix(in srgb, var(--accent) 12%, transparent)',
		size = '260px',
		...rest
	}: Props = $props();

	let x = $state(0);
	let y = $state(0);
	let lit = $state(false);

	function track(event: PointerEvent) {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		x = event.clientX - rect.left;
		y = event.clientY - rect.top;
	}

	/** Keyboard arrival has no pointer to follow, so the light sits in the middle. */
	function centre(event: FocusEvent) {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		x = rect.width / 2;
		y = rect.height / 2;
		lit = true;
	}
</script>

<svelte:element
	this={as}
	class="spotlight {className}"
	onpointermove={track}
	onpointerenter={() => (lit = true)}
	onpointerleave={() => (lit = false)}
	onfocusin={centre}
	onfocusout={() => (lit = false)}
	{...rest}
>
	<span
		class="pool"
		aria-hidden="true"
		style="opacity:{lit
			? 1
			: 0};background:radial-gradient({size} circle at {x}px {y}px, {spotlightColor}, transparent 72%);"
	></span>
	{@render children?.()}
</svelte:element>

<style>
	.spotlight {
		position: relative;
		isolation: isolate;
	}
	.pool {
		position: absolute;
		/* Bleeds past the row's own padding, so the light looks like it falls on
		   the page rather than being clipped to a box the reader cannot see. */
		inset: 0 -1rem;
		z-index: -1;
		pointer-events: none;
		border-radius: 10px;
		transition: opacity 0.35s ease;
	}
	@media (prefers-reduced-motion: reduce) {
		.pool {
			display: none;
		}
	}
</style>
