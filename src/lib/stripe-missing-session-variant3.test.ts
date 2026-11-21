import { describe, expect, it } from 'vitest';
import { isMissingStripeSession } from './stripe';

describe('isMissingStripeSession', () => {
	it('classifies a 404 response as a missing Session', () => {
		expect(isMissingStripeSession({ statusCode: 404 })).toBe(true);
	});

	it('classifies a resource_missing code as a missing Session', () => {
		expect(isMissingStripeSession({ code: 'resource_missing' })).toBe(true);
		expect(isMissingStripeSession({ code: 'resource_missing', statusCode: 500 })).toBe(true);
	});

	it('keeps outages and unrelated errors on the outage path', () => {
		for (const error of [
			undefined,
			null,
			'resource_missing',
			new Error('resource_missing'),
			{ statusCode: 500 },
			{ statusCode: '404' },
			{ code: 'api_error' },
			{ code: 'RESOURCE_MISSING' }
		]) {
			expect(isMissingStripeSession(error)).toBe(false);
		}
	});
});
