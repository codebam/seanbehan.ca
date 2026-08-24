/**
 * Scroll reveal: fade a block up by a few pixels the first time it enters the
 * viewport, then stop watching it.
 *
 * On the SvelteKit site this was a Svelte action; here it is one script that
 * claims every `data-reveal` element on the page, so a template opts in with an
 * attribute and no page has to ship a component for an animation.
 *
 * The hidden state is applied from here rather than from the stylesheet, so a
 * visitor with no JS — or a crawler — sees fully rendered content instead of a
 * page of invisible blocks waiting on an observer that never runs. For the same
 * reason anything already on screen at load is revealed without animating: the
 * first paint should not flicker.
 */

const prefersReducedMotion = () =>
	typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal() {
	if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const node = entry.target as HTMLElement;
				node.classList.remove('reveal-pending');
				node.classList.add('reveal-in');
				observer.unobserve(node);
			}
		},
		{ rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
	);

	for (const node of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
		// Anything already on screen is left alone. The observer would reveal it
		// too, but only on its first callback — so on a slow phone a band that was
		// in the first viewport sits invisible for a second or more after the page
		// has otherwise painted. That is a late visual change in the viewport
		// Lighthouse measures, and it was most of the gap between First
		// Contentful Paint and Speed Index.
		//
		// The read is safe here: the only thing this writes is opacity and
		// transform, neither of which invalidates layout, so no thrash.
		if (node.getBoundingClientRect().top < window.innerHeight) continue;

		const delay = node.dataset.revealDelay;
		if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);
		node.classList.add('reveal-pending');
		observer.observe(node);
	}
}

initReveal();
