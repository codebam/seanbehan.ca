import { describe, expect, it } from 'vitest';
import { isMissingStripeSession } from './stripe';

describe('isMissingStripeSession', () => {
	it('recognises a 404 status code as a missing Session', () => {
		expect(isMissingStripeSession({ statusCode: 404 })).toBe(true);
	});

	it('recognises the resource_missing code as a missing Session', () => {
		expect(isMissingStripeSession({ code: 'resource_missing' })).toBe(true);
	});

	it('recognises a missing Session carrying both signals', () => {
		expect(isMissingStripeSession({ statusCode: 404, code: 'resource_missing' })).toBe(true);
	});

	it('keeps other Stripe errors on the outage path', () => {
		expect(isMissingStripeSession({ statusCode: 500, code: 'api_error' })).toBe(false);
		expect(isMissingStripeSession({ statusCode: 400, code: 'invalid_request_error' })).toBe(false);
		expect(isMissingStripeSession({})).toBe(false);
	});

	it('does not treat primitives or null as a missing Session', () => {
		for (const value of [null, undefined, 'resource_missing', 404, true]) {
			expect(isMissingStripeSession(value)).toBe(false);
		}
	});

	it('compares both signals strictly', () => {
		expect(isMissingStripeSession({ statusCode: '404' })).toBe(false);
		expect(isMissingStripeSession({ code: 'RESOURCE_MISSING' })).toBe(false);
	});
});
