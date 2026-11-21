import { describe, expect, it } from 'vitest';
import { isCheckoutSessionId, isMissingStripeSession, safeErrorDetails } from './stripe';

describe('isCheckoutSessionId', () => {
	it('accepts the exact 16-character lower bound and rejects one below it', () => {
		expect(isCheckoutSessionId('cs_' + 'a'.repeat(13))).toBe(true);
		expect(isCheckoutSessionId('cs_' + 'a'.repeat(12))).toBe(false);
	});

	it('accepts the exact 255-character upper bound and rejects one above it', () => {
		expect(isCheckoutSessionId('cs_' + 'a'.repeat(252))).toBe(true);
		expect(isCheckoutSessionId('cs_' + 'a'.repeat(253))).toBe(false);
	});

	it('matches the cs_ prefix case-sensitively', () => {
		expect(isCheckoutSessionId('CS_abcdefghijklmnop')).toBe(false);
		expect(isCheckoutSessionId('cs_abcdefghijklmnop')).toBe(true);
	});

	it('rejects an empty string', () => {
		expect(isCheckoutSessionId('')).toBe(false);
	});
});

describe('safeErrorDetails', () => {
	it('falls back to a generic name for non-object throws', () => {
		expect(safeErrorDetails('boom')).toEqual({ name: 'UnknownError' });
		expect(safeErrorDetails(42)).toEqual({ name: 'UnknownError' });
		expect(safeErrorDetails(null)).toEqual({ name: 'UnknownError' });
		expect(safeErrorDetails(undefined)).toEqual({ name: 'UnknownError' });
	});

	it('defaults a missing or non-string name', () => {
		expect(safeErrorDetails({})).toEqual({ name: 'UnknownError' });
		expect(safeErrorDetails({ name: 500 })).toEqual({ name: 'UnknownError' });
	});

	it('keeps only well-typed whitelisted fields', () => {
		expect(
			safeErrorDetails({ name: 'StripeError', type: 400, code: 42, statusCode: '404' })
		).toEqual({ name: 'StripeError' });
	});

	it('keeps a valid subset of optional fields', () => {
		expect(
			safeErrorDetails({ name: 'StripeCardError', code: 'card_declined', statusCode: 402 })
		).toEqual({ name: 'StripeCardError', code: 'card_declined', statusCode: 402 });
	});

	it('drops every field outside the whitelist', () => {
		const error = Object.assign(new Error('secret message'), {
			payload: 'customer@example.com',
			stack: 'secret stack',
			request: { apiKey: 'sk_live_x' },
			headers: { authorization: 'Bearer secret' }
		});
		expect(safeErrorDetails(error)).toEqual({ name: 'Error' });
	});
});

describe('isMissingStripeSession', () => {
	it('recognises a 404 status code', () => {
		expect(isMissingStripeSession({ statusCode: 404 })).toBe(true);
	});

	it('recognises the resource_missing code', () => {
		expect(isMissingStripeSession({ code: 'resource_missing' })).toBe(true);
	});

	it('does not treat other Stripe failures as a missing session', () => {
		expect(isMissingStripeSession({ statusCode: 500 })).toBe(false);
		expect(isMissingStripeSession({ code: 'card_declined' })).toBe(false);
		expect(isMissingStripeSession({ statusCode: 402, code: 'card_declined' })).toBe(false);
	});

	it('does not treat non-object or empty throws as a missing session', () => {
		expect(isMissingStripeSession(null)).toBe(false);
		expect(isMissingStripeSession('resource_missing')).toBe(false);
		expect(isMissingStripeSession({})).toBe(false);
	});

	it('compares fields strictly, so a stringified 404 is not a miss', () => {
		expect(isMissingStripeSession({ statusCode: '404' })).toBe(false);
	});
});
