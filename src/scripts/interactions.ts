/**
 * Pointer-driven micro-interactions shared by the home page.
 *
 * Markup and hover states remain complete without this script. It only writes
 * normalized custom properties, letting each component decide how much motion
 * is appropriate for its surface.
 */

const reducedMotion =
	typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = typeof matchMedia !== 'function' || matchMedia('(hover: hover)').matches;

if (!reducedMotion && finePointer) {
	let frame = 0;
	let latest: PointerEvent | undefined;
	let activeScene: HTMLElement | null = null;
	let activeGlow: HTMLElement | null = null;
	let activeMagnet: HTMLElement | null = null;

	const resetScene = (scene: HTMLElement | null) => {
		scene?.style.setProperty('--scene-x', '0');
		scene?.style.setProperty('--scene-y', '0');
	};
	const resetGlow = (row: HTMLElement | null) => {
		if (row) delete row.dataset.glowActive;
	};
	const resetMagnet = (target: HTMLElement | null) => {
		target?.style.setProperty('--magnet-x', '0px');
		target?.style.setProperty('--magnet-y', '0px');
	};

	const paint = () => {
		frame = 0;
		const event = latest;
		if (!event) return;
		const origin = event.target as Element | null;

		const scene = origin?.closest<HTMLElement>('[data-pointer-scene]') ?? null;
		if (scene !== activeScene) resetScene(activeScene);
		activeScene = scene;
		if (scene) {
			const rect = scene.getBoundingClientRect();
			scene.style.setProperty(
				'--scene-x',
				String(((event.clientX - rect.left) / rect.width - 0.5) * 2)
			);
			scene.style.setProperty(
				'--scene-y',
				String(((event.clientY - rect.top) / rect.height - 0.5) * 2)
			);
		}

		const glow = origin?.closest<HTMLElement>('[data-pointer-glow]') ?? null;
		if (glow !== activeGlow) resetGlow(activeGlow);
		activeGlow = glow;
		if (glow) {
			const rect = glow.getBoundingClientRect();
			glow.style.setProperty('--glow-x', `${event.clientX - rect.left}px`);
			glow.style.setProperty('--glow-y', `${event.clientY - rect.top}px`);
			glow.dataset.glowActive = 'true';
		}

		const magnet = origin?.closest<HTMLElement>('[data-magnetic]') ?? null;
		if (magnet !== activeMagnet) resetMagnet(activeMagnet);
		activeMagnet = magnet;
		if (magnet) {
			const rect = magnet.getBoundingClientRect();
			const x = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
			const y = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
			magnet.style.setProperty('--magnet-x', `${x.toFixed(2)}px`);
			magnet.style.setProperty('--magnet-y', `${y.toFixed(2)}px`);
		}
	};

	document.addEventListener(
		'pointermove',
		(event) => {
			latest = event;
			if (!frame) frame = requestAnimationFrame(paint);
		},
		{ passive: true }
	);

	// pointerleave does not bubble, so one document-level pointerout resets an
	// effect only when the pointer has actually left its marked surface.
	document.addEventListener(
		'pointerout',
		(event) => {
			const next = event.relatedTarget as Node | null;
			if (activeScene && (!next || !activeScene.contains(next))) {
				resetScene(activeScene);
				activeScene = null;
			}
			if (activeGlow && (!next || !activeGlow.contains(next))) {
				resetGlow(activeGlow);
				activeGlow = null;
			}
			if (activeMagnet && (!next || !activeMagnet.contains(next))) {
				resetMagnet(activeMagnet);
				activeMagnet = null;
			}
		},
		{ passive: true }
	);
}
