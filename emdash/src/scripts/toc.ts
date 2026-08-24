/**
 * Collapsible contents on small screens.
 *
 * A nine-item list above the first paragraph is a screen of navigation before a
 * single word of the article, so under 48rem the contents start folded. The
 * `open` attribute is in the server HTML: without JS the list stays permanently
 * open on every screen, and this is what folds it on a JS phone. Desktop is
 * forced open — and re-forced if the window grows across the breakpoint.
 */

const details = document.querySelector<HTMLDetailsElement>('[data-toc]');

if (details && window.matchMedia) {
	const wide = window.matchMedia('(min-width: 48rem)');
	if (!wide.matches) details.open = false;
	wide.addEventListener('change', () => {
		if (wide.matches) details.open = true;
	});
}
