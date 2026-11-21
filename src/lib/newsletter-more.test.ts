import { describe, expect, it } from 'vitest';
import { subscribeBanner } from './newsletter';

const UNKNOWN: { tone: 'error'; text: string } = {
	tone: 'error',
	text: 'Something went wrong with that subscription. Try again in a moment.'
};

describe('subscribeBanner: exact copy', () => {
	it('says exactly what each success code promises', () => {
		expect(subscribeBanner(new URLSearchParams('subscribed=confirm'))).toEqual({
			tone: 'ok',
			text: 'Almost there — check your inbox for a confirmation email, and click the link to join the list.'
		});
		expect(subscribeBanner(new URLSearchParams('subscribed=done'))).toEqual({
			tone: 'ok',
			text: 'You are on the list. Unsubscribe any time.'
		});
	});

	it('says exactly what each error code means', () => {
		const cases: [string, string][] = [
			['invalid', 'That email address does not look right. Check it and try again.'],
			['rate', 'Too many attempts from this connection. Try again in a few minutes.'],
			['unavailable', 'The list is not answering right now. Try again in a moment.'],
			[
				'turnstile',
				'The list asked for a verification challenge this form cannot complete. Use the sign-up page at lists.seanbehan.ca.'
			]
		];
		for (const [code, text] of cases) {
			expect(subscribeBanner(new URLSearchParams(`subscribe_error=${code}`)), code).toEqual({
				tone: 'error',
				text
			});
		}
	});
});

describe('subscribeBanner: lookup edges', () => {
	it('does not mistake inherited object keys for documented codes', () => {
		// bannerFor uses Object.hasOwn: a plain-object lookup would answer to
		// toString or constructor and hand the reader a function as a banner.
		for (const code of ['toString', 'constructor', '__proto__', 'hasOwnProperty']) {
			expect(subscribeBanner(new URLSearchParams(`subscribed=${code}`)), code).toBeNull();
			expect(subscribeBanner(new URLSearchParams(`subscribe_error=${code}`)), code).toEqual(
				UNKNOWN
			);
		}
	});

	it('ignores an empty error value and still reads the success code', () => {
		expect(subscribeBanner(new URLSearchParams('subscribe_error='))).toBeNull();
		expect(subscribeBanner(new URLSearchParams('subscribe_error=&subscribed=done'))?.tone).toBe(
			'ok'
		);
	});

	it('lets an unrecognised error beat a valid success', () => {
		expect(
			subscribeBanner(new URLSearchParams('subscribed=done&subscribe_error=brand-new'))
		).toEqual(UNKNOWN);
	});

	it('matches codes exactly, without case folding or trimming', () => {
		for (const raw of ['CONFIRM', '%20confirm', 'confirm%20']) {
			expect(subscribeBanner(new URLSearchParams(`subscribed=${raw}`)), raw).toBeNull();
		}
	});

	it('uses the first value when a code is repeated', () => {
		expect(
			subscribeBanner(new URLSearchParams('subscribed=confirm&subscribed=done'))?.text
		).toMatch(/confirmation email/);
	});
});
