<!--
	StarBorder — two radial sweeps that trace the top and bottom edge of a pill.

	Port of https://sveltebits.xyz/r/star-border.json. The sweep mechanics and
	keyframes are upstream's; what changed is that the component no longer paints
	its own black-to-grey button. It wraps whatever it is given, so the site's
	`.btn` stays the button — one definition of what a primary action looks like,
	with a rim light around it.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		class?: string;
		/** Any CSS colour; the accent by default. */
		color?: string;
		/** One full pass of a sweep. Slow is the point — this is ambient. */
		speed?: string;
		thickness?: number;
	};

	let {
		children,
		class: className = '',
		color = 'var(--accent)',
		speed = '7s',
		thickness = 1
	}: Props = $props();

	const sweep = $derived(`radial-gradient(circle, ${color}, transparent 10%)`);
</script>

<span class="star-border {className}" style:padding="{thickness}px 0">
	<span
		class="sweep bottom"
		aria-hidden="true"
		style:background={sweep}
		style:animation-duration={speed}
	></span>
	<span
		class="sweep top"
		aria-hidden="true"
		style:background={sweep}
		style:animation-duration={speed}
	></span>
	{@render children?.()}
</span>

<style>
	.star-border {
		position: relative;
		display: inline-block;
		overflow: hidden;
		border-radius: 999px;
		isolation: isolate;
	}

	.sweep {
		position: absolute;
		width: 300%;
		height: 50%;
		opacity: 0.7;
		border-radius: 999px;
		z-index: -1;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-direction: alternate;
	}
	.sweep.bottom {
		bottom: -11px;
		right: -250%;
		animation-name: sweep-bottom;
	}
	.sweep.top {
		top: -10px;
		left: -250%;
		animation-name: sweep-top;
	}

	@keyframes sweep-bottom {
		0% {
			transform: translate(0%, 0%);
			opacity: 1;
		}
		100% {
			transform: translate(-100%, 0%);
			opacity: 0;
		}
	}
	@keyframes sweep-top {
		0% {
			transform: translate(0%, 0%);
			opacity: 1;
		}
		100% {
			transform: translate(100%, 0%);
			opacity: 0;
		}
	}

	/* A loop is exactly what a reader asking for reduced motion does not want,
	   and the button reads fine without it. */
	@media (prefers-reduced-motion: reduce) {
		.sweep {
			display: none;
		}
	}
</style>
