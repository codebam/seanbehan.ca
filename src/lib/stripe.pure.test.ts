import Stripe from 'stripe';
import { describe, expect, it } from 'vitest';
import { createStripeClient, isMissingStripeSession } from './stripe';

describe('isMissingStripeSession', () => {
	it('reads a 404 as a dead download link, not an outage', () => {
		expect(isMissingStripeSession({ statusCode: 404 })).toBe(true);
	});

	it('reads Stripe’s resource_missing code the same way', () => {
		expect(isMissingStripeSession({ code: 'resource_missing' })).toBe(true);
	});

	it('keeps other failures on the outage path', () => {
		expect(isMissingStripeSession({ statusCode: 503 })).toBe(false);
		expect(isMissingStripeSession({ code: 'api_error' })).toBe(false);
	});

	it('does not treat primitives or a plain Error as Stripe metadata', () => {
		for (const error of [null, undefined, 404, 'resource_missing', new Error('resource_missing')]) {
			expect(isMissingStripeSession(error)).toBe(false);
		}
	});
});

describe('createStripeClient', () => {
	it('refuses an empty key instead of building a client', () => {
		expect(() => createStripeClient('')).toThrow('STRIPE_SECRET_KEY is not configured');
	});

	it('builds a client from a key alone, with no runtime binding', () => {
		expect(createStripeClient('sk_test_dummy')).toBeInstanceOf(Stripe);
	});
});
