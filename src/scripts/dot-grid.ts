type Dot = {
	cx: number;
	cy: number;
	ox: number;
	oy: number;
	vx: number;
	vy: number;
};

type DotGridConfig = {
	dotSize: number;
	gap: number;
	baseColor: string;
	activeColor: string;
	proximity: number;
	speedTrigger: number;
	shockRadius: number;
	shockStrength: number;
};

function initDotGrid(host: HTMLElement) {
	const canvas = host.querySelector('canvas');
	if (!(canvas instanceof HTMLCanvasElement)) return;
	const context = canvas.getContext('2d');
	if (!context) return;
	const ctx = context;
	const config = JSON.parse(host.dataset.config ?? '{}') as DotGridConfig;

	const rgbOf = (token: string): [number, number, number] => {
		const value = token.startsWith('--') ? getComputedStyle(host).getPropertyValue(token) : token;
		const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value.trim());
		return match
			? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)]
			: [128, 128, 128];
	};

	const still = matchMedia('(prefers-reduced-motion: reduce)');
	const scheme = matchMedia('(prefers-color-scheme: dark)');
	let dots: Dot[] = [];
	let width = 0;
	let height = 0;
	let base = rgbOf(config.baseColor);
	let active = rgbOf(config.activeColor);
	const pointer = { x: -9999, y: -9999, speed: 0, t: 0, lx: 0, ly: 0 };

	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const build = () => {
		const rect = host.getBoundingClientRect();
		width = rect.width;
		height = rect.height;
		canvas.width = Math.max(1, Math.floor(width * dpr));
		canvas.height = Math.max(1, Math.floor(height * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		const cell = config.dotSize + config.gap;
		const columns = Math.max(1, Math.floor((width + config.gap) / cell));
		const rows = Math.max(1, Math.floor((height + config.gap) / cell));
		const startX = (width - (cell * columns - config.gap)) / 2 + config.dotSize / 2;
		const startY = (height - (cell * rows - config.gap)) / 2 + config.dotSize / 2;

		dots = [];
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < columns; x++) {
				dots.push({ cx: startX + x * cell, cy: startY + y * cell, ox: 0, oy: 0, vx: 0, vy: 0 });
			}
		}
	};
	const resizeObserver = new ResizeObserver(build);
	resizeObserver.observe(host);
	build();

	/* An underdamped spring lets a kicked dot swing past zero once and settle
	   over roughly a second instead of snapping back. */
	const STIFFNESS = 45;
	const DAMPING = 7;
	const BUSY_SPEED = 60;
	let frame = 0;
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
				if (Math.abs(dot.ox) < 0.01 && Math.abs(dot.vx) < 0.01) dot.ox = dot.vx = 0;
				if (Math.abs(dot.oy) < 0.01 && Math.abs(dot.vy) < 0.01) dot.oy = dot.vy = 0;
			}

			const dx = dot.cx - pointer.x;
			const dy = dot.cy - pointer.y;
			const distance = Math.hypot(dx, dy);
			const amount = distance < config.proximity ? 1 - distance / config.proximity : 0;
			ctx.beginPath();
			ctx.arc(dot.cx + dot.ox, dot.cy + dot.oy, config.dotSize / 2 + amount * 1.4, 0, Math.PI * 2);
			ctx.fillStyle = `rgb(${Math.round(base[0] + (active[0] - base[0]) * amount)},${Math.round(
				base[1] + (active[1] - base[1]) * amount
			)},${Math.round(base[2] + (active[2] - base[2]) * amount)})`;
			ctx.globalAlpha = 0.85 + amount * 0.15;
			ctx.fill();
		}
		ctx.globalAlpha = 1;
		if (!still.matches) frame = requestAnimationFrame(draw);
	};

	const kick = (dot: Dot, dx: number, dy: number, strength: number) => {
		const distance = Math.hypot(dx, dy) || 1;
		dot.vx += (dx / distance) * strength;
		dot.vy += (dy / distance) * strength;
	};

	const onMove = (event: PointerEvent) => {
		if (still.matches) return;
		const rect = canvas.getBoundingClientRect();
		const now = performance.now();
		const dt = Math.max(8, pointer.t ? now - pointer.t : 16);
		const vx = ((event.clientX - pointer.lx) / dt) * 1000;
		const vy = ((event.clientY - pointer.ly) / dt) * 1000;
		pointer.t = now;
		pointer.lx = event.clientX;
		pointer.ly = event.clientY;
		pointer.speed = pointer.speed * 0.6 + Math.hypot(vx, vy) * 0.4;
		pointer.x = event.clientX - rect.left;
		pointer.y = event.clientY - rect.top;

		if (pointer.speed <= config.speedTrigger) return;
		const force = Math.min(1, (pointer.speed - config.speedTrigger) / config.speedTrigger);
		for (const dot of dots) {
			const dx = dot.cx - pointer.x;
			const dy = dot.cy - pointer.y;
			const distance = Math.hypot(dx, dy);
			if (distance >= config.proximity || Math.hypot(dot.vx, dot.vy) > BUSY_SPEED) continue;
			kick(dot, dx, dy, force * (1 - distance / config.proximity) * 90);
		}
	};

	const onLeave = () => {
		pointer.x = -9999;
		pointer.y = -9999;
	};

	const onClick = (event: PointerEvent) => {
		if (still.matches) return;
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		for (const dot of dots) {
			const dx = dot.cx - x;
			const dy = dot.cy - y;
			const distance = Math.hypot(dx, dy);
			if (distance < config.shockRadius) {
				kick(dot, dx, dy, (1 - distance / config.shockRadius) * config.shockStrength * 60);
			}
		}
	};

	// The content is painted over the canvas, so listen on the whole band.
	const surface = host.parentElement ?? host;
	surface.addEventListener('pointermove', onMove, { passive: true });
	surface.addEventListener('pointerleave', onLeave);
	surface.addEventListener('pointerdown', onClick);

	const repaint = () => {
		base = rgbOf(config.baseColor);
		active = rgbOf(config.activeColor);
		if (still.matches) frame = requestAnimationFrame(draw);
	};
	scheme.addEventListener('change', repaint);
	still.addEventListener('change', repaint);

	const visible = new IntersectionObserver(([entry]) => {
		cancelAnimationFrame(frame);
		if (entry.isIntersecting) {
			last = performance.now();
			frame = requestAnimationFrame(draw);
		}
	});
	visible.observe(host);
}

document.querySelectorAll<HTMLElement>('[data-dot-grid]').forEach(initDotGrid);
