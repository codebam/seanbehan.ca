import { describe, expect, it } from 'vitest';
import { SUBSCRIBE_ERROR_PARAM, SUBSCRIBED_PARAM, subscribeBanner } from './newsletter';

// newsletter.test.ts pins the documented codes and their tones. These are the
// remaining pure edges of the redirect contract: the param names themselves,
// the Object.hasOwn guard against inherited keys, empty values, case
// sensitivity, and an unknown error arriving beside a valid success.
describe('result param names', () => {
	it('names the two params the list service writes onto the redirect', () => {
		expect(SUBSCRIBED_PARAM).toBe('subscribed');
		expect(SUBSCRIBE_ERROR_PARAM).toBe('subscribe_error');
	});
});

describe('banner lookup guard', () => {
	it('does not treat an inherited object key as a banner code', () => {
		for (const code of ['constructor', '__proto__', 'toString', 'hasOwnProperty']) {
			expect(subscribeBanner(new URLSearchParams(`${SUBSCRIBED_PARAM}=${code}`)), code).toBeNull();
			expect(
				subscribeBanner(new URLSearchParams(`${SUBSCRIBE_ERROR_PARAM}=${code}`)),
				code
			).toEqual({ tone: 'error', text: expect.stringMatching(/Something went wrong/) });
		}
	});
});

describe('empty and differently-cased results', () => {
	it('shows nothing for an empty success value', () => {
		expect(subscribeBanner(new URLSearchParams('subscribed='))).toBeNull();
	});

	it('falls through an empty error to a valid success', () => {
		expect(subscribeBanner(new URLSearchParams('subscribe_error=&subscribed=done'))).toEqual({
			tone: 'ok',
			text: expect.stringMatching(/on the list/)
		});
	});

	it('matches codes case-sensitively', () => {
		expect(subscribeBanner(new URLSearchParams('subscribed=CONFIRM'))).toBeNull();
		expect(subscribeBanner(new URLSearchParams('subscribe_error=RATE'))).toEqual({
			tone: 'error',
			text: expect.stringMatching(/Something went wrong/)
		});
	});
});

describe('unknown error precedence', () => {
	it('beats a stale success even when its code is not recognised', () => {
		const banner = subscribeBanner(
			new URLSearchParams('subscribed=done&subscribe_error=brand-new-code')
		);
		expect(banner).toEqual({
			tone: 'error',
			text: expect.stringMatching(/Something went wrong/)
		});
	});
});
