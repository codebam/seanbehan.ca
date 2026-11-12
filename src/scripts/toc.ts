/**
 * Collapsible contents on small screens.
 *
 * The fold itself is CSS: `html.js details[data-toc] > ol` is hidden below
 * 48rem from first paint (html.js is set in the head before the body), so
 * there is no post-JS layout shift. Without JS the server-rendered open list
 * stays as written. This script only tracks the reader's tap on the summary
 * as an .expanded class that shows the list again on small screens; desktop
 * always shows it, so it does nothing there.
 */

const details = document.querySelector<HTMLDetailsElement>('[data-toc]');
const summary = details?.querySelector('summary');

if (details && summary && window.matchMedia) {
	const wide = window.matchMedia('(min-width: 48rem)');
	summary.addEventListener('click', () => {
		if (!wide.matches) details.classList.toggle('expanded');
	});
}
