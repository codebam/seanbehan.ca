/**
 * Mobile menu: keep the native <details> toggle (it works with JS off and
 * with the keyboard), but announce its state and let Escape dismiss it.
 * The summary's aria-expanded is synced from the details toggle, so a
 * screen reader hears open/closed without a custom button.
 */

const menu = document.querySelector<HTMLDetailsElement>('details.nav-menu');

if (menu) {
	const summary = menu.querySelector('summary');
	const panel = menu.querySelector('.nav-menu-panel');

	if (summary && panel) {
		if (!panel.id) panel.id = 'nav-menu-panel';
		summary.setAttribute('aria-controls', panel.id);
		const sync = () => summary.setAttribute('aria-expanded', String(menu.open));
		menu.addEventListener('toggle', sync);
		sync();

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && menu.open) {
				menu.open = false;
				summary.focus();
			}
		});
	}
}
