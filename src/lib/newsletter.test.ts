import { describe, expect, it } from 'vitest';
import { subscribeBanner } from './newsletter';

describe('subscribeBanner', () => {
	it('maps the service’s success codes', () => {
		expect(subscribeBanner(new URLSearchParams('subscribed=confirm'))).toEqual({
			tone: 'ok',
			text: expect.stringMatching(/confirmation email/)
		});
		expect(subscribeBanner(new URLSearchParams('subscribed=done'))?.tone).toBe('ok');
	});

	it('maps every error code the list documents', () => {
		for (const code of ['invalid', 'rate', 'unavailable', 'turnstile']) {
			const banner = subscribeBanner(new URLSearchParams(`subscribe_error=${code}`));
			expect(banner?.tone, code).toBe('error');
			expect(banner?.text.length, code).toBeGreaterThan(0);
		}
	});

	it('shows something for an error code it does not know yet', () => {
		const banner = subscribeBanner(new URLSearchParams('subscribe_error=brand-new-code'));
		expect(banner?.tone).toBe('error');
		expect(banner?.text).toMatch(/Something went wrong/);
	});

	it('shows nothing without a known result', () => {
		expect(subscribeBanner(new URLSearchParams())).toBeNull();
		expect(subscribeBanner(new URLSearchParams('subscribed=whatever'))).toBeNull();
	});

	it('lets a fresh error beat a stale success', () => {
		const banner = subscribeBanner(new URLSearchParams('subscribed=done&subscribe_error=rate'));
		expect(banner?.tone).toBe('error');
		expect(banner?.text).toMatch(/Too many attempts/);
	});
});
