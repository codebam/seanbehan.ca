import Stripe from 'stripe';
import { describe, expect, it } from 'vitest';
import { PRODUCT } from './product';
import {
	STRIPE_INTEGRATION,
	checkoutSessionParams,
	fulfillmentEmail,
	inspectProductSession,
	isCheckoutSessionId,
	productDownloadUrl,
	safeErrorDetails
} from './stripe';

const PRICE_ID = 'price_product';

const session = (overrides: Partial<Stripe.Checkout.Session> = {}): Stripe.Checkout.Session =>
	({
		id: 'cs_test_abcdefghijklmnop',
		created: Date.UTC(2026, 7, 30) / 1000,
		mode: 'payment',
		status: 'complete',
		payment_status: 'paid',
		managed_payments: { enabled: true },
		metadata: {
			integration: STRIPE_INTEGRATION,
			product: PRODUCT.id,
			release: '1.0.0'
		},
		line_items: {
			object: 'list',
			data: [{ price: { id: PRICE_ID }, quantity: 1 }],
			has_more: false,
			url: '/line-items'
		},
		payment_intent: {
			id: 'pi_paid',
			status: 'succeeded',
			latest_charge: {
				id: 'ch_paid',
				amount: 5900,
				amount_refunded: 0,
				refunded: false,
				disputed: false
			}
		},
		customer_details: { email: 'buyer@example.com' },
		...overrides
	}) as Stripe.Checkout.Session;

describe('checkoutSessionParams', () => {
	it('pins the product to one managed one-time Price', () => {
		const params = checkoutSessionParams(PRICE_ID);
		expect(params.mode).toBe('payment');
		expect(params.managed_payments).toEqual({ enabled: true });
		expect(params.line_items).toEqual([{ price: PRICE_ID, quantity: 1 }]);
		expect(params.metadata).toMatchObject({
			integration: STRIPE_INTEGRATION,
			product: PRODUCT.id,
			release: PRODUCT.currentRelease.version
		});
		expect(params.success_url).toBe(`${PRODUCT.successUrl}?session_id={CHECKOUT_SESSION_ID}`);
		expect(params.cancel_url).toBe(PRODUCT.url);
	});

	it('returns development purchases to the local origin', () => {
		const params = checkoutSessionParams(PRICE_ID, 'http://localhost:4321');
		expect(params.success_url).toBe(
			'http://localhost:4321/checkout/success?session_id={CHECKOUT_SESSION_ID}'
		);
		expect(params.cancel_url).toBe(
			'http://localhost:4321/products/cloudflare-workers-production-kit'
		);
	});
});

describe('inspectProductSession', () => {
	it('grants a paid, matching purchase', () => {
		const access = inspectProductSession(session(), PRICE_ID);
		expect(access.status).toBe('paid');
		if (access.status === 'paid') {
			expect(access.release.version).toBe('1.0.0');
			expect(access.email).toBe('buyer@example.com');
		}
	});

	it('waits for a delayed payment', () => {
		const delayed = session({ payment_status: 'unpaid' });
		delayed.payment_intent = {
			...(delayed.payment_intent as Stripe.PaymentIntent),
			status: 'processing'
		};
		expect(inspectProductSession(delayed, PRICE_ID)).toEqual({
			status: 'pending'
		});
	});

	it('rejects an expired unpaid Session', () => {
		expect(
			inspectProductSession(session({ status: 'expired', payment_status: 'unpaid' }), PRICE_ID)
		).toEqual({ status: 'invalid' });
	});

	it('rejects a failed asynchronous payment', () => {
		const failed = session({ payment_status: 'unpaid' });
		failed.payment_intent = {
			...(failed.payment_intent as Stripe.PaymentIntent),
			status: 'requires_payment_method'
		};
		expect(inspectProductSession(failed, PRICE_ID)).toEqual({ status: 'invalid' });
	});

	it('rejects a Session for another Price', () => {
		expect(inspectProductSession(session(), 'price_other')).toEqual({ status: 'invalid' });
	});

	it('revokes a refunded purchase', () => {
		const paid = session();
		const intent = paid.payment_intent as Stripe.PaymentIntent;
		paid.payment_intent = {
			...intent,
			latest_charge: {
				...(intent.latest_charge as Stripe.Charge),
				amount_refunded: 5900,
				refunded: true
			}
		};
		expect(inspectProductSession(paid, PRICE_ID)).toEqual({ status: 'revoked' });
	});

	it('revokes a partially refunded purchase', () => {
		const paid = session();
		const intent = paid.payment_intent as Stripe.PaymentIntent;
		paid.payment_intent = {
			...intent,
			latest_charge: {
				...(intent.latest_charge as Stripe.Charge),
				amount_refunded: 1000
			}
		};
		expect(inspectProductSession(paid, PRICE_ID)).toEqual({ status: 'revoked' });
	});

	it('fails closed when Stripe does not expand the Charge', () => {
		const paid = session();
		const intent = paid.payment_intent as Stripe.PaymentIntent;
		paid.payment_intent = { ...intent, latest_charge: 'ch_paid' };
		expect(inspectProductSession(paid, PRICE_ID)).toEqual({ status: 'invalid' });
	});
});

describe('checkout credentials', () => {
	it('accepts Stripe Checkout Session IDs only', () => {
		expect(isCheckoutSessionId('cs_test_abcdefghijklmnop')).toBe(true);
		expect(isCheckoutSessionId('pi_abcdefghijklmnop')).toBe(false);
		expect(isCheckoutSessionId(null)).toBe(false);
	});

	it('puts the paid Session credential in the fulfillment link', () => {
		const message = fulfillmentEmail('cs_test_abcdefghijklmnop', PRODUCT.currentRelease);
		expect(message.text).toContain('session_id=cs_test_abcdefghijklmnop');
		expect(message.text).toContain(PRODUCT.currentRelease.sha256);
	});

	it('uses the development origin for local fulfillment', () => {
		const sessionId = 'cs_test_abcdefghijklmnop';
		expect(productDownloadUrl(sessionId, 'http://localhost:4321')).toBe(
			`http://localhost:4321/checkout/download?session_id=${sessionId}`
		);
		expect(
			fulfillmentEmail(sessionId, PRODUCT.currentRelease, 'http://localhost:4321').text
		).toContain(`http://localhost:4321/checkout/download?session_id=${sessionId}`);
	});

	it('does not put Stripe payloads or credentials in error logs', () => {
		expect(
			safeErrorDetails({
				name: 'Error',
				type: 'StripeSignatureVerificationError',
				code: 'signature_invalid',
				statusCode: 400,
				message: 'contains a secret',
				payload: '{"customer_email":"buyer@example.com"}',
				header: 't=1,v1=secret'
			})
		).toEqual({
			name: 'Error',
			type: 'StripeSignatureVerificationError',
			code: 'signature_invalid',
			statusCode: 400
		});
	});
});
