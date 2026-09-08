/**
 * Copy button on each code block.
 *
 * The posts are technical; a reader who has found the one snippet they came
 * for should be able to lift it without hand-selecting. The button is injected
 * after load: a button that cannot work is worse than none, so with JS off the
 * block simply stays a plain `<pre>`.
 *
 * One delegated listener on the article container rather than one per block —
 * the number of blocks varies post to post, and the listener has to survive
 * whatever the highlighter emitted inside them.
 */
import { copyText } from './clipboard';

function decorate(container: HTMLElement) {
	// <pre> only inside the article body, so an injected button never lands on a
	// block outside a code fence's reach.
	for (const pre of Array.from(container.querySelectorAll('pre'))) {
		// Already wrapped (a re-run on a second load event); leave it.
		if (pre.parentElement?.classList.contains('code-block')) continue;

		const block = document.createElement('div');
		block.className = 'code-block';
		pre.before(block);

		// Announced rather than only labelled: a screen reader that just pressed
		// the button needs the outcome spoken, not the name re-read.
		const status = document.createElement('span');
		status.className = 'sr-only';
		status.setAttribute('role', 'status');

		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'code-copy';
		button.textContent = 'Copy';

		block.append(button, status, pre);
	}
}

async function onCopyClick(event: MouseEvent) {
	const target = event.target instanceof Element ? event.target.closest('button.code-copy') : null;
	const button = target instanceof HTMLButtonElement ? target : null;
	if (!button || button.disabled) return;
	const pre = button.parentElement?.querySelector('pre');
	if (!pre) return;

	button.disabled = true;
	const status = button.parentElement?.querySelector('[role="status"]');
	// textContent rather than innerText: identical for a code block (the text is
	// what it is, no rendering to honour) and it exists everywhere.
	const copied = await copyText(pre.textContent ?? '');

	button.textContent = copied ? 'Copied' : 'Failed';
	button.classList.toggle('is-failed', !copied);
	if (status) status.textContent = copied ? 'Code copied' : 'Could not copy code';

	// The label reverts so a second copy (after the text changed, or by a
	// different reader of the same tab) still reads as an action.
	setTimeout(() => {
		button.textContent = 'Copy';
		button.classList.remove('is-failed');
		button.disabled = false;
	}, 1600);
}

const prose = document.querySelector<HTMLElement>('[data-prose]');
if (prose) {
	decorate(prose);
	prose.addEventListener('click', onCopyClick);
}
