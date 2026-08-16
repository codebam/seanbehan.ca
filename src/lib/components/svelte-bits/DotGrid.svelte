<!--
	DotGrid — a field of dots that warms and scatters around the pointer.

	Port of https://sveltebits.xyz/r/dot-grid.json. Upstream uses GSAP for one
	thing: the push-and-return tween on a displaced dot. That is a critically
	damped decay followed by an elastic settle, which is ~15 lines of integration
	in the draw loop that is already running — so the tween is local and the
	dependency is gone.

	Colours are token names resolved against the host, so the field follows the
	palette instead of pinning one theme's orange.
-->
<script lang="ts">
	type Dot = {
		cx: number;
		cy: number;
		/** Current displacement, and the velocity carrying it back to zero */
		ox: number;
		oy: number;
		vx: number;
		vy: number;
	};

	type Props = {
		dotSize?: number;
		gap?: number;
		/** Custom property names, resolved against this element */
		baseColor?: string;
		activeColor?: string;
		proximity?: number;
		/** Pointer speed, px/s, above which dots are pushed rather than only lit */
		speedTrigger?: number;
		shockRadius?: number;
		shockStrength?: number;
		class?: string;
	};

	let {
		dotSize = 4,
		gap = 30,
		baseColor = '--line-strong',
		activeColor = '--accent',
		proximity = 140,
		/* px/s. An ordinary slow drag runs 150–250 px/s, so the old 120 meant the
		   field was being kicked constantly by a pointer that was, to the reader,
		   moving gently. Scattering is for a flick. */
		speedTrigger = 400,
		shockRadius = 200,
		shockStrength = 3,
		class: className = ''
	}: Props = $props();

	let host: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	function rgbOf(token: string): [number, number, number] {
		const value = token.startsWith('--') ? getComputedStyle(host).getPropertyValue(token) : token;
		const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value.trim());
		return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [128, 128, 128];
	}

	$effect(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const still = matchMedia('(prefers-reduced-motion: reduce)');
		const scheme = matchMedia('(prefers-color-scheme: dark)');

		let dots: Dot[] = [];
		let width = 0;
		let height = 0;
		let base = rgbOf(baseColor);
		let active = rgbOf(activeColor);
		const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, speed: 0, t: 0, lx: 0, ly: 0 };

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const build = () => {
			const rect = host.getBoundingClientRect();
			width = rect.width;
			height = rect.height;
			canvas.width = Math.max(1, Math.floor(width * dpr));
			canvas.height = Math.max(1, Math.floor(height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const cell = dotSize + gap;
			const cols = Math.max(1, Math.floor((width + gap) / cell));
			const rows = Math.max(1, Math.floor((height + gap) / cell));
			const startX = (width - (cell * cols - gap)) / 2 + dotSize / 2;
			const startY = (height - (cell * rows - gap)) / 2 + dotSize / 2;

			dots = [];
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					dots.push({ cx: startX + x * cell, cy: startY + y * cell, ox: 0, oy: 0, vx: 0, vy: 0 });
				}
			}
		};
		const observer = new ResizeObserver(build);
		observer.observe(host);
		build();

		/* Spring back to rest: underdamped, so a kicked dot swings past zero once
		   and settles over roughly a second. Stiffer than this and the return
		   snaps, which is what made a slow pass over the band look like it was
		   flicking rather than drifting. */
		const STIFFNESS = 45;
		const DAMPING = 7;
		/* A dot already travelling this fast is mid-swing, so a new pass leaves it
		   alone. Without the guard every pointer event re-kicks the same dots and
		   the field never gets to finish a movement. */
		const BUSY_SPEED = 60;

		let raf = 0;
		let last = performance.now();
		const draw = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;

			ctx.clearRect(0, 0, width, height);
			for (const dot of dots) {
				if (dot.ox || dot.oy || dot.vx || dot.vy) {
					dot.vx += (-STIFFNESS * dot.ox - DAMPING * dot.vx) * dt;
					dot.vy += (-STIFFNESS * dot.oy - DAMPING * dot.vy) * dt;
					dot.ox += dot.vx * dt;
					dot.oy += dot.vy * dt;
					if (Math.abs(dot.ox) < 0.01 && Math.abs(dot.vx) < 0.01) {
						dot.ox = 0;
						dot.vx = 0;
					}
					if (Math.abs(dot.oy) < 0.01 && Math.abs(dot.vy) < 0.01) {
						dot.oy = 0;
						dot.vy = 0;
					}
				}

				const dx = dot.cx - pointer.x;
				const dy = dot.cy - pointer.y;
				const distance = Math.hypot(dx, dy);
				const t = distance < proximity ? 1 - distance / proximity : 0;

				ctx.beginPath();
				ctx.arc(dot.cx + dot.ox, dot.cy + dot.oy, dotSize / 2 + t * 1.4, 0, Math.PI * 2);
				ctx.fillStyle = `rgb(${Math.round(base[0] + (active[0] - base[0]) * t)},${Math.round(
					base[1] + (active[1] - base[1]) * t
				)},${Math.round(base[2] + (active[2] - base[2]) * t)})`;
				// The resting dot is already the faintest line colour in the palette;
				// fading it further only made the field read as screen dirt.
				ctx.globalAlpha = 0.85 + t * 0.15;
				ctx.fill();
			}
			ctx.globalAlpha = 1;

			if (!still.matches) raf = requestAnimationFrame(draw);
		};

		/* A kick is an impulse on velocity, never a jump in position. Setting the
		   offset directly — which is what the first pass did — teleports the dot
		   and leaves the spring to chase it back, so every pointer event reads as
		   a snap instead of a push. */
		const kick = (dot: Dot, dx: number, dy: number, strength: number) => {
			const distance = Math.hypot(dx, dy) || 1;
			dot.vx += (dx / distance) * strength;
			dot.vy += (dy / distance) * strength;
		};

		const onMove = (event: PointerEvent) => {
			if (still.matches) return;
			const rect = canvas.getBoundingClientRect();
			const now = performance.now();
			// High-rate pointers deliver events a couple of milliseconds apart, and
			// dividing a one-pixel move by that produces a speed spike out of a
			// hand that is barely moving. The floor on dt and the running average
			// are what keep a slow pass reading as slow.
			const dt = Math.max(8, pointer.t ? now - pointer.t : 16);
			const vx = ((event.clientX - pointer.lx) / dt) * 1000;
			const vy = ((event.clientY - pointer.ly) / dt) * 1000;
			pointer.t = now;
			pointer.lx = event.clientX;
			pointer.ly = event.clientY;
			pointer.speed = pointer.speed * 0.6 + Math.hypot(vx, vy) * 0.4;
			pointer.x = event.clientX - rect.left;
			pointer.y = event.clientY - rect.top;

			if (pointer.speed <= speedTrigger) return;
			// Past the trigger the kick scales with how much faster than it the
			// pointer is going, so a flick scatters and a merely brisk pass barely
			// registers — there is no cliff at the trigger itself.
			const force = Math.min(1, (pointer.speed - speedTrigger) / speedTrigger);
			for (const dot of dots) {
				const dx = dot.cx - pointer.x;
				const dy = dot.cy - pointer.y;
				const distance = Math.hypot(dx, dy);
				if (distance >= proximity) continue;
				if (Math.hypot(dot.vx, dot.vy) > BUSY_SPEED) continue;
				kick(dot, dx, dy, force * (1 - distance / proximity) * 90);
			}
		};

		const onLeave = () => {
			pointer.x = -9999;
			pointer.y = -9999;
		};

		const onClick = (event: PointerEvent) => {
			if (still.matches) return;
			const rect = canvas.getBoundingClientRect();
			const cx = event.clientX - rect.left;
			const cy = event.clientY - rect.top;
			for (const dot of dots) {
				const dx = dot.cx - cx;
				const dy = dot.cy - cy;
				const distance = Math.hypot(dx, dy);
				if (distance >= shockRadius) continue;
				// A click is deliberate, so it overrides the busy guard: the whole
				// radius moves at once, which is the point of the shockwave.
				kick(dot, dx, dy, (1 - distance / shockRadius) * shockStrength * 60);
			}
		};

		// Listeners go on the band rather than on this canvas: the content column
		// is painted over the field, so a pointer crossing the numbers never
		// reaches the canvas itself and the dots would sit dead exactly where the
		// reader is looking. Still not the window — the field only answers to a
		// pointer that is over the band.
		const surface = host.parentElement ?? host;
		surface.addEventListener('pointermove', onMove, { passive: true });
		surface.addEventListener('pointerleave', onLeave);
		surface.addEventListener('pointerdown', onClick);

		const repaint = () => {
			base = rgbOf(baseColor);
			active = rgbOf(activeColor);
			if (still.matches) raf = requestAnimationFrame(draw);
		};
		scheme.addEventListener('change', repaint);
		still.addEventListener('change', repaint);

		const visible = new IntersectionObserver(
			([entry]) => {
				cancelAnimationFrame(raf);
				if (entry.isIntersecting) {
					last = performance.now();
					raf = requestAnimationFrame(draw);
				}
			},
			{ threshold: 0 }
		);
		visible.observe(host);

		return () => {
			cancelAnimationFrame(raf);
			observer.disconnect();
			visible.disconnect();
			surface.removeEventListener('pointermove', onMove);
			surface.removeEventListener('pointerleave', onLeave);
			surface.removeEventListener('pointerdown', onClick);
			scheme.removeEventListener('change', repaint);
			still.removeEventListener('change', repaint);
		};
	});
</script>

<div bind:this={host} class="dot-grid {className}">
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.dot-grid {
		position: absolute;
		inset: 0;
	}
	.dot-grid canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
