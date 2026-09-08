/**
 * Putting text on the clipboard, with the fallback the platform still needs.
 *
 * Two scripts inject copy buttons — one over code blocks, one over the contact
 * address — and both need the same two-step write: the async Clipboard API
 * first, and a hidden textarea plus `execCommand` behind it, because the API
 * throws outright in an insecure context and some browsers still deny it to a
 * page the reader did not just click. A button that reports success without
 * having copied anything is worse than no button, so this returns whether it
 * worked and leaves the wording to the caller.
 */

function copyFallback(text: string): boolean {
	const area = document.createElement('textarea');
	area.value = text;
	area.setAttribute('readonly', '');
	// Off the layout but still selectable: select() refuses a display:none box.
	area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
	document.body.append(area);
	area.select();
	let copied = false;
	try {
		document.execCommand('copy');
		copied = true;
	} catch {
		// An execCommand that cannot copy simply did not.
	}
	area.remove();
	return copied;
}

export async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		// Insecure context, or a clipboard denial — the fallback still gets the
		// text onto the clipboard where the API will not.
		return copyFallback(text);
	}
}
