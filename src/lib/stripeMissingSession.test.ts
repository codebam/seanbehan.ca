import { describe, expect, it } from 'vitest';
import { isMissingStripeSession } from './stripe';

describe('isMissingStripeSession', () => {
	it('treats a 404 as a vanished Session, not an outage', () => {
		expect(isMissingStripeSession({ statusCode: 404 })).toBe(true);
	});

	it('recognises Stripe’s resource_missing code', () => {
		expect(isMissingStripeSession({ code: 'resource_missing' })).toBe(true);
	});

	it('leaves server errors and rate limits on the outage path', () => {
		expect(isMissingStripeSession({ statusCode: 500 })).toBe(false);
		expect(isMissingStripeSession({ statusCode: 503 })).toBe(false);
		expect(isMissingStripeSession({ code: 'rate_limit' })).toBe(false);
		expect(isMissingStripeSession({ code: 'api_connection_error' })).toBe(false);
	});

	it('matches the exact status and code, not lookalikes', () => {
		expect(isMissingStripeSession({ statusCode: '404' })).toBe(false);
		expect(isMissingStripeSession({ code: 'resource_missing_soon' })).toBe(false);
	});

	it('never throws on a non-object throw', () => {
		expect(isMissingStripeSession(null)).toBe(false);
		expect(isMissingStripeSession(undefined)).toBe(false);
		expect(isMissingStripeSession('resource_missing')).toBe(false);
		expect(isMissingStripeSession(404)).toBe(false);
	});
});
