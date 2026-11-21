import { describe, expect, it } from 'vitest';
import { SUBSCRIBE_ERROR_PARAM, SUBSCRIBED_PARAM, subscribeBanner } from './newsletter';

const params = (value: string) => new URLSearchParams(value);

describe('newsletter result params', () => {
	it('exposes the two redirect param names the form writes', () => {
		expect(SUBSCRIBED_PARAM).toBe('subscribed');
		expect(SUBSCRIBE_ERROR_PARAM).toBe('subscribe_error');
	});
});

describe('subscribeBanner — uncovered edges', () => {
	it('keeps inherited object keys from masquerading as a known error code', () => {
		for (const code of ['__proto__', 'constructor', 'toString']) {
			const banner = subscribeBanner(params(`subscribe_error=${code}`));
			expect(banner?.tone, code).toBe('error');
			expect(banner?.text, code).toMatch(/^Something went wrong/);
		}
	});

	it('treats error codes as case- and whitespace-sensitive', () => {
		for (const code of ['RATE', 'Rate', '%20rate%20']) {
			expect(subscribeBanner(params(`subscribe_error=${code}`))?.text, code).toMatch(
				/^Something went wrong/
			);
		}
	});

	it('ignores an empty error code and still reads the success param', () => {
		expect(subscribeBanner(params('subscribe_error=&subscribed=done'))?.text).toBe(
			'You are on the list. Unsubscribe any time.'
		);
		expect(subscribeBanner(params('subscribe_error='))).toBeNull();
	});

	it('uses the first value when a param is repeated', () => {
		expect(subscribeBanner(params('subscribe_error=rate&subscribe_error=turnstile'))?.text).toMatch(
			/^Too many attempts/
		);
		expect(subscribeBanner(params('subscribe_error=turnstile&subscribe_error=rate'))?.text).toMatch(
			/^The list asked for a verification challenge/
		);
	});

	it('returns the exact confirmation wording for a fresh signup', () => {
		expect(subscribeBanner(params('subscribed=confirm'))).toEqual({
			tone: 'ok',
			text: 'Almost there — check your inbox for a confirmation email, and click the link to join the list.'
		});
	});
});
