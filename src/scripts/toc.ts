/**
 * Collapsible contents on small screens.
 *
 * The fold itself is CSS: `html.js details[data-toc] > ol` is hidden below
 * 48rem from first paint (html.js is set in the head before the body), so
 * there is no post-JS layout shift. Without JS the server-rendered open list
 * stays as written. This script aligns the native details state with that
 * visual fold and mirrors `open` onto .expanded; desktop always shows the list.
 */

const details = document.querySelector<HTMLDetailsElement>('[data-toc]');
const summary = details?.querySelector('summary');

if (details && summary && window.matchMedia) {
	const wide = window.matchMedia('(min-width: 48rem)');
	const sync = () => details.classList.toggle('expanded', details.open);
	details.addEventListener('toggle', sync);

	// The server keeps the list open for no-JS readers. Close the native details
	// on small screens too, so assistive technology agrees with the CSS fold.
	if (!wide.matches) details.open = false;
	sync();

	wide.addEventListener('change', (event) => {
		if (event.matches) details.open = true;
		sync();
	});
}

export {};
