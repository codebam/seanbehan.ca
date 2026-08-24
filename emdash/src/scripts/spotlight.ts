/**
 * A soft pool of light that follows the pointer across a card.
 *
 * The SvelteKit site did this with a component per card. Every post row is one
 * of those cards, so on the archive that was two dozen islands' worth of
 * hydration for a hover effect. Here one delegated listener writes the pointer
 * position onto whichever `.spotlight` element the pointer is over, as custom
 * properties the stylesheet reads — no per-card state, and nothing to hydrate.
 *
 * Reduced-motion readers get nothing: the pool is hidden in CSS, and the
 * listeners below never write anything they would see.
 */

const setPool = (card: HTMLElement, event: PointerEvent | null) => {
	const rect = card.getBoundingClientRect();
	const x = event ? event.clientX - rect.left : rect.width / 2;
	const y = event ? event.clientY - rect.top : rect.height / 2;
	card.style.setProperty('--spot-x', `${x}px`);
	card.style.setProperty('--spot-y', `${y}px`);
};

export function initSpotlight() {
	if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	}

	document.addEventListener(
		'pointermove',
		(event) => {
			const card = (event.target as Element | null)?.closest?.('.spotlight');
			if (!(card instanceof HTMLElement)) return;
			setPool(card, event);
			card.dataset.lit = 'true';
		},
		{ passive: true }
	);

	document.addEventListener(
		'pointerleave',
		(event) => {
			const card = (event.target as Element | null)?.closest?.('.spotlight');
			if (card instanceof HTMLElement) delete card.dataset.lit;
		},
		{ capture: true, passive: true }
	);

	// Keyboard arrival has no pointer to follow, so the light sits in the middle.
	document.addEventListener('focusin', (event) => {
		const card = (event.target as Element | null)?.closest?.('.spotlight');
		if (!(card instanceof HTMLElement)) return;
		setPool(card, null);
		card.dataset.lit = 'true';
	});

	document.addEventListener('focusout', (event) => {
		const card = (event.target as Element | null)?.closest?.('.spotlight');
		if (card instanceof HTMLElement) delete card.dataset.lit;
	});
}

initSpotlight();
