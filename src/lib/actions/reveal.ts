/**
 * Scroll reveal: fade a block up by a few pixels the first time it enters the
 * viewport, then stop watching it.
 *
 * The hidden state is applied from here rather than from the stylesheet, so a
 * visitor with no JS — or a crawler — sees fully rendered content instead of a
 * page of invisible blocks waiting on an observer that never runs. For the same
 * reason anything already on screen at mount is revealed without animating: the
 * first paint should not flicker.
 */

interface RevealOptions {
	/** Stagger, in ms, for items revealed as part of a group */
	delay?: number;
	/** How far into the viewport the element must come before it fires */
	margin?: string;
}

const prefersReducedMotion = () =>
	typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

	const { delay = 0, margin = '0px 0px -10% 0px' } = options;

	// Anything already on screen when the action runs is left alone. The observer
	// would reveal it too, but only on its first callback — which is after
	// hydration, so on a slow phone a band that was in the first viewport sits
	// invisible for a second or more after the page has otherwise painted. That
	// is a late visual change in the viewport Lighthouse measures, and it was
	// most of the gap between First Contentful Paint and Speed Index.
	//
	// The read is safe to do here: the only thing this action writes is opacity
	// and transform, neither of which invalidates layout, so no thrash.
	if (node.getBoundingClientRect().top < window.innerHeight) return;

	node.classList.add('reveal-pending');
	if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);

	const show = () => {
		node.classList.remove('reveal-pending');
		node.classList.add('reveal-in');
	};

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				show();
				observer.disconnect();
			}
		},
		{ rootMargin: margin, threshold: 0.05 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
