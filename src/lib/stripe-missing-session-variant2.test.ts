import { describe, expect, it } from 'vitest';
import { isMissingStripeSession } from './stripe';

describe('isMissingStripeSession', () => {
	it('recognises a Stripe 404 or resource_missing as a missing Checkout Session', () => {
		expect(isMissingStripeSession({ statusCode: 404 })).toBe(true);
		expect(isMissingStripeSession({ code: 'resource_missing' })).toBe(true);
		expect(isMissingStripeSession({ statusCode: 404, code: 'resource_missing' })).toBe(true);
	});

	it('keeps outages and unrelated failures on the outage path', () => {
		expect(isMissingStripeSession({ statusCode: 500, code: 'api_error' })).toBe(false);
		expect(isMissingStripeSession({ statusCode: 400, code: 'resource_missing_other' })).toBe(false);
		expect(isMissingStripeSession({ statusCode: '404' })).toBe(false);
		expect(isMissingStripeSession({})).toBe(false);
	});

	it('treats non-object throws as unknown errors', () => {
		expect(isMissingStripeSession(null)).toBe(false);
		expect(isMissingStripeSession(undefined)).toBe(false);
		expect(isMissingStripeSession(404)).toBe(false);
		expect(isMissingStripeSession('resource_missing')).toBe(false);
	});
});
