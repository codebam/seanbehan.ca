import { describe, expect, it } from 'vitest';
import { getClientIp, rateLimitResponse } from './rateLimit';

/**
 * Only the pure helpers: the D1 window is already exercised in rateLimit.test.ts.
 * These cases pick up the header and response details that test leaves open.
 */
const withCf = (headers: Record<string, string>) => {
	const request = new Request('https://codebam.ca/checkout/download', { headers });
	Object.defineProperty(request, 'cf', { value: { colo: 'YYZ' } });
	return request;
};

describe('getClientIp', () => {
	it('returns null when no address header is present at all', () => {
		expect(getClientIp(withCf({}))).toBeNull();
	});

	it('prefers CF-Connecting-IP even when X-Forwarded-For holds a different address', () => {
		const request = withCf({
			'CF-Connecting-IP': '203.0.113.7',
			'X-Forwarded-For': '198.51.100.9'
		});

		expect(getClientIp(request)).toBe('203.0.113.7');
	});

	it('does not fall through to X-Forwarded-For when the direct header is junk', () => {
		const request = withCf({
			'CF-Connecting-IP': 'not an address',
			'X-Forwarded-For': '198.51.100.9'
		});

		expect(getClientIp(request)).toBeNull();
	});

	it('trims the direct header before validating it', () => {
		expect(getClientIp(withCf({ 'CF-Connecting-IP': '  2001:db8::1  ' }))).toBe('2001:db8::1');
	});

	it('uses the trimmed first forwarded entry when no direct header is present', () => {
		const request = withCf({ 'X-Forwarded-For': '  198.51.100.9 , 203.0.113.7' });

		expect(getClientIp(request)).toBe('198.51.100.9');
	});

	it('rejects a candidate past the IPv6 length bound', () => {
		expect(getClientIp(withCf({ 'CF-Connecting-IP': `2001:${'f'.repeat(50)}` }))).toBeNull();
	});
});

describe('rateLimitResponse', () => {
	it('answers 429 with the retry hint, no-store policy and the fixed body', async () => {
		const response = rateLimitResponse(7);

		expect(response.status).toBe(429);
		expect(response.headers.get('Retry-After')).toBe('7');
		expect(response.headers.get('Cache-Control')).toBe('private, no-store');
		expect(await response.text()).toBe('Too Many Requests');
	});
});
