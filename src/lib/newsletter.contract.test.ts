import { describe, expect, it } from 'vitest';
import { SUBSCRIBED_PARAM, SUBSCRIBE_ERROR_PARAM, subscribeBanner } from './newsletter';

describe('the subscribe redirect contract', () => {
	it('uses the param names the list service writes onto its redirect', () => {
		expect(SUBSCRIBED_PARAM).toBe('subscribed');
		expect(SUBSCRIBE_ERROR_PARAM).toBe('subscribe_error');
	});

	it('pins the exact text of each success banner', () => {
		expect(subscribeBanner(new URLSearchParams('subscribed=confirm'))).toEqual({
			tone: 'ok',
			text: 'Almost there — check your inbox for a confirmation email, and click the link to join the list.'
		});
		expect(subscribeBanner(new URLSearchParams('subscribed=done'))).toEqual({
			tone: 'ok',
			text: 'You are on the list. Unsubscribe any time.'
		});
	});

	it('pins the exact text of each documented error banner', () => {
		const texts: Record<string, string> = {
			invalid: 'That email address does not look right. Check it and try again.',
			rate: 'Too many attempts from this connection. Try again in a few minutes.',
			unavailable: 'The list is not answering right now. Try again in a moment.',
			turnstile:
				'The list asked for a verification challenge this form cannot complete. Use the sign-up page at lists.seanbehan.ca.'
		};
		for (const [code, text] of Object.entries(texts)) {
			expect(subscribeBanner(new URLSearchParams(`subscribe_error=${code}`)), code).toEqual({
				tone: 'error',
				text
			});
		}
	});

	it('does not mistake an inherited object key for a banner code', () => {
		for (const code of ['toString', 'constructor', '__proto__']) {
			expect(subscribeBanner(new URLSearchParams(`subscribed=${code}`)), code).toBeNull();
		}
	});

	it('falls through to a success when the error param is empty', () => {
		expect(subscribeBanner(new URLSearchParams('subscribe_error=&subscribed=done'))).toEqual({
			tone: 'ok',
			text: 'You are on the list. Unsubscribe any time.'
		});
	});

	it('lets an unrecognised error beat a recognised success', () => {
		expect(
			subscribeBanner(new URLSearchParams('subscribed=confirm&subscribe_error=brand-new-code'))
		).toEqual({
			tone: 'error',
			text: 'Something went wrong with that subscription. Try again in a moment.'
		});
	});
});
