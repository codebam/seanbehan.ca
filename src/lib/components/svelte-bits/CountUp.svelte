<!--
	CountUp — a number that counts to its value the first time it is seen.

	Port of https://sveltebits.xyz/r/count-up.json, with `motion`'s spring
	replaced by the same spring integrated locally. `damping` and `stiffness` are
	derived from `duration` exactly as upstream does, so a given duration lands
	the same way.

	The final value is rendered on the server and stays in the DOM until the
	observer fires, so the band reads correctly with no JS and never flashes a
	zero.
-->
<script lang="ts">
	type Props = {
		to: number;
		from?: number;
		/** Seconds. Drives the spring constants, not a fixed timeline. */
		duration?: number;
		/** Appended to every rendered value — `+` for "150+" */
		suffix?: string;
		separator?: string;
		class?: string;
	};

	let {
		to,
		from = 0,
		duration = 1.4,
		suffix = '',
		separator = '',
		class: className = ''
	}: Props = $props();

	let el: HTMLSpanElement | undefined = $state();

	const format = (value: number) => {
		const text = Intl.NumberFormat('en-CA', {
			useGrouping: !!separator,
			maximumFractionDigits: 0
		}).format(value);
		return (separator ? text.replace(/,/g, separator) : text) + suffix;
	};

	$effect(() => {
		const node = el;
		if (!node) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const damping = 20 + 40 * (1 / duration);
		const stiffness = 100 * (1 / duration);

		let raf = 0;
		const run = () => {
			let value = from;
			let velocity = 0;
			let last = performance.now();
			node.textContent = format(from);

			const step = (now: number) => {
				const dt = Math.min(0.05, (now - last) / 1000);
				last = now;
				velocity += (stiffness * (to - value) - damping * velocity) * dt;
				value += velocity * dt;
				if (Math.abs(to - value) < 0.5 && Math.abs(velocity) < 0.5) {
					node.textContent = format(to);
					return;
				}
				node.textContent = format(value);
				raf = requestAnimationFrame(step);
			};
			raf = requestAnimationFrame(step);
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				run();
			},
			{ threshold: 0.6 }
		);
		observer.observe(node);

		return () => {
			cancelAnimationFrame(raf);
			observer.disconnect();
		};
	});
</script>

<span bind:this={el} class={className}>{format(to)}</span>
