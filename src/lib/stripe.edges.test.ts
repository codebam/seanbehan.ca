import { describe, expect, it } from 'vitest';
import { isCheckoutSessionId, safeErrorDetails } from './stripe';

const sessionId = (suffixLength: number) => `cs_${'a'.repeat(suffixLength)}`;

describe('isCheckoutSessionId boundaries', () => {
	it('accepts the shortest and longest IDs inside the 16..255 window', () => {
		expect(isCheckoutSessionId(sessionId(13))).toBe(true);
		expect(isCheckoutSessionId(sessionId(252))).toBe(true);
	});

	it('rejects IDs just outside the window', () => {
		expect(isCheckoutSessionId(sessionId(12))).toBe(false);
		expect(isCheckoutSessionId(sessionId(253))).toBe(false);
	});

	it('rejects the bare prefix, an empty string and a wrong-case prefix', () => {
		expect(isCheckoutSessionId('cs_')).toBe(false);
		expect(isCheckoutSessionId('')).toBe(false);
		expect(isCheckoutSessionId(`CS_${'a'.repeat(13)}`)).toBe(false);
	});

	it('rejects another Stripe ID type that is long enough', () => {
		expect(isCheckoutSessionId(`pi_${'a'.repeat(13)}`)).toBe(false);
	});
});

describe('safeErrorDetails coercion edges', () => {
	it('falls back to UnknownError for every non-object throw', () => {
		for (const thrown of [undefined, null, 'boom', 42, true]) {
			expect(safeErrorDetails(thrown)).toEqual({ name: 'UnknownError' });
		}
	});

	it('falls back when name is not a string but keeps a valid type', () => {
		expect(safeErrorDetails({ name: 500, type: 'api_error' })).toEqual({
			name: 'UnknownError',
			type: 'api_error'
		});
	});

	it('omits non-string type and code instead of stringifying them', () => {
		expect(safeErrorDetails({ name: 'Error', type: 42, code: { nested: 'secret' } })).toEqual({
			name: 'Error'
		});
	});

	it('keeps statusCode only when it is a number', () => {
		expect(safeErrorDetails({ name: 'Error', statusCode: '404' })).toEqual({ name: 'Error' });
		expect(safeErrorDetails({ name: 'Error', statusCode: 0 })).toEqual({
			name: 'Error',
			statusCode: 0
		});
	});

	it('reads only the name off a real Error, leaving its message out of logs', () => {
		expect(safeErrorDetails(new Error('contains a secret'))).toEqual({ name: 'Error' });
	});
});
