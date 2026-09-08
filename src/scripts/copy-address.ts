/**
 * Copy button beside an address.
 *
 * The contact page's primary ask is an email, and `mailto:` is the only route
 * it offered: a hiring manager on webmail, on a shared inbox, or on a machine
 * with no mail handler at all clicks it and nothing happens, with nothing on
 * the page to tell them why. The address is now selectable and copyable beside
 * the link that was already there.
 *
 * The page leaves an empty `[data-copy-text]` placeholder rather than shipping
 * a button, for the reason the code blocks do: a button that cannot work is
 * worse than none, and with JS off the placeholder renders as nothing at all
 * while the `mailto:` link keeps doing its job.
 *
 * The button is a sibling of the link, never inside it — interactive content
 * may not nest, and an anchor wrapping a button swallows the click.
 */
import { copyText } from './clipboard';

function decorate(holder: HTMLElement) {
	const text = holder.dataset.copyText;
	if (!text || holder.querySelector('button')) return;

	// Announced rather than only labelled: a screen reader that just pressed the
	// button needs the outcome spoken, not the name re-read.
	const status = document.createElement('span');
	status.className = 'sr-only';
	status.setAttribute('role', 'status');

	const button = document.createElement('button');
	button.type = 'button';
	button.className = 'copy-address';
	button.textContent = 'Copy';

	holder.append(button, status);
}

async function onClick(event: MouseEvent) {
	const target =
		event.target instanceof Element ? event.target.closest('button.copy-address') : null;
	const button = target instanceof HTMLButtonElement ? target : null;
	if (!button || button.disabled) return;

	const holder = button.parentElement;
	const text = holder?.dataset.copyText;
	if (!text) return;

	button.disabled = true;
	const copied = await copyText(text);

	button.textContent = copied ? 'Copied' : 'Failed';
	button.classList.toggle('is-failed', !copied);
	holder
		?.querySelector('[role="status"]')
		?.replaceChildren(
			document.createTextNode(copied ? 'Address copied' : 'Could not copy the address')
		);

	// The label reverts so a second copy still reads as an action.
	setTimeout(() => {
		button.textContent = 'Copy';
		button.classList.remove('is-failed');
		button.disabled = false;
	}, 1600);
}

for (const holder of Array.from(document.querySelectorAll<HTMLElement>('[data-copy-text]'))) {
	decorate(holder);
	holder.addEventListener('click', onClick);
}
