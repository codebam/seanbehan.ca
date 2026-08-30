import Stripe from 'stripe';
import { PRODUCT, entitledRelease, type ProductRelease } from './product';

export const STRIPE_INTEGRATION = 'codebam-store-v1';

export type ProductAccess =
	| {
			status: 'paid';
			session: Stripe.Checkout.Session;
			release: ProductRelease;
			paymentIntentId: string;
			email: string | null;
	  }
	| { status: 'pending' | 'invalid' | 'revoked' };

interface RunResult {
	success: boolean;
	meta: { changes?: number };
}

interface PreparedStatement {
	bind(...values: unknown[]): PreparedStatement;
	run(): Promise<RunResult>;
	first<T>(): Promise<T | null>;
}

export interface CommerceDatabase {
	prepare(query: string): PreparedStatement;
}

export interface FulfillmentClaim {
	checkoutSessionId: string;
	paymentIntentId: string;
	stripeEventId: string;
	releaseVersion: string;
}

export function createStripeClient(secretKey: string): Stripe {
	if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured');

	return new Stripe(secretKey, {
		httpClient: Stripe.createFetchHttpClient(),
		maxNetworkRetries: 2,
		appInfo: {
			name: 'codebam.ca',
			version: '1.0.0',
			url: PRODUCT.url
		}
	});
}

export function checkoutSessionParams(
	priceId: string,
	returnOrigin = new URL(PRODUCT.url).origin
): Stripe.Checkout.SessionCreateParams {
	if (!priceId) throw new Error('STRIPE_PRICE_ID is not configured');
	const origin = new URL(returnOrigin).origin;

	return {
		mode: 'payment',
		line_items: [{ price: priceId, quantity: 1 }],
		managed_payments: { enabled: true },
		integration_identifier: STRIPE_INTEGRATION,
		metadata: {
			integration: STRIPE_INTEGRATION,
			product: PRODUCT.id,
			release: PRODUCT.currentRelease.version
		},
		origin_context: 'web',
		submit_type: 'pay',
		success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${origin}/products/${PRODUCT.id}`
	};
}

export function isCheckoutSessionId(value: string | null): value is string {
	return Boolean(value?.startsWith('cs_') && value.length >= 16 && value.length <= 255);
}

export function safeErrorDetails(error: unknown) {
	const value =
		typeof error === 'object' && error
			? (error as { name?: unknown; type?: unknown; code?: unknown; statusCode?: unknown })
			: {};
	return {
		name: typeof value.name === 'string' ? value.name : 'UnknownError',
		...(typeof value.type === 'string' ? { type: value.type } : {}),
		...(typeof value.code === 'string' ? { code: value.code } : {}),
		...(typeof value.statusCode === 'number' ? { statusCode: value.statusCode } : {})
	};
}

export function inspectProductSession(
	session: Stripe.Checkout.Session,
	priceId: string
): ProductAccess {
	const release = entitledRelease(session.metadata?.release, session.created);
	const lineItems = session.line_items;
	const lineItem = lineItems?.data[0];

	if (
		session.mode !== 'payment' ||
		session.managed_payments?.enabled !== true ||
		session.metadata?.integration !== STRIPE_INTEGRATION ||
		session.metadata?.product !== PRODUCT.id ||
		!release ||
		!lineItems ||
		lineItems.has_more ||
		lineItems.data.length !== 1 ||
		lineItem?.price?.id !== priceId ||
		lineItem.quantity !== 1
	) {
		return { status: 'invalid' };
	}

	if (session.status === 'open') return { status: 'pending' };
	if (session.status !== 'complete') return { status: 'invalid' };

	if (session.payment_status === 'unpaid') {
		const paymentIntent = session.payment_intent;
		if (
			paymentIntent &&
			typeof paymentIntent !== 'string' &&
			(paymentIntent.status === 'processing' || paymentIntent.status === 'requires_action')
		) {
			return { status: 'pending' };
		}
		return { status: 'invalid' };
	}
	if (session.payment_status !== 'paid') return { status: 'invalid' };

	const paymentIntent = session.payment_intent;
	if (!paymentIntent || typeof paymentIntent === 'string' || paymentIntent.status !== 'succeeded') {
		return { status: 'invalid' };
	}

	const charge = paymentIntent.latest_charge;
	if (!charge || typeof charge === 'string') return { status: 'invalid' };
	if (charge.refunded || charge.disputed || charge.amount_refunded > 0) {
		return { status: 'revoked' };
	}

	return {
		status: 'paid',
		session,
		release,
		paymentIntentId: paymentIntent.id,
		email: session.customer_details?.email ?? null
	};
}

export async function retrieveProductAccess(
	stripe: Stripe,
	sessionId: string,
	priceId: string
): Promise<ProductAccess> {
	const session = await stripe.checkout.sessions.retrieve(sessionId, {
		expand: ['line_items', 'payment_intent.latest_charge']
	});
	return inspectProductSession(session, priceId);
}

export function productDownloadUrl(
	sessionId: string,
	returnOrigin = new URL(PRODUCT.downloadUrl).origin
): string {
	const url = new URL(new URL(PRODUCT.downloadUrl).pathname, new URL(returnOrigin).origin);
	url.searchParams.set('session_id', sessionId);
	return url.toString();
}

export function fulfillmentEmail(
	sessionId: string,
	release: ProductRelease,
	returnOrigin?: string
) {
	const downloadUrl = productDownloadUrl(sessionId, returnOrigin);
	const subject = `Your ${PRODUCT.name} download`;
	const text = [
		'Thanks for your purchase.',
		'',
		`Download ${PRODUCT.name} v${release.version}:`,
		downloadUrl,
		'',
		`SHA-256: ${release.sha256}`,
		'',
		'This private link checks the payment each time it is used. Keep it with your receipt.',
		'Reply to this email if you need help.'
	].join('\n');
	const html = `<p>Thanks for your purchase.</p><p><a href="${downloadUrl}">Download ${PRODUCT.name} v${release.version}</a></p><p><strong>SHA-256:</strong> <code>${release.sha256}</code></p><p>This private link checks the payment each time it is used. Keep it with your receipt.</p><p>Reply to this email if you need help.</p>`;

	return { subject, text, html };
}

export async function claimFulfillment(
	database: CommerceDatabase,
	claim: FulfillmentClaim
): Promise<'claimed' | 'fulfilled' | 'busy'> {
	const result = await database
		.prepare(
			`INSERT INTO site_stripe_fulfillments (
				checkout_session_id, payment_intent_id, stripe_event_id, product_id,
				release_version, status, attempts, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, 'sending', 1, unixepoch(), unixepoch())
			ON CONFLICT(checkout_session_id) DO UPDATE SET
				stripe_event_id = excluded.stripe_event_id,
				status = 'sending',
				attempts = site_stripe_fulfillments.attempts + 1,
				last_error = NULL,
				updated_at = unixepoch()
			WHERE site_stripe_fulfillments.status = 'failed'
				OR (
					site_stripe_fulfillments.status = 'sending'
					AND site_stripe_fulfillments.updated_at <= unixepoch() - 600
				)`
		)
		.bind(
			claim.checkoutSessionId,
			claim.paymentIntentId,
			claim.stripeEventId,
			PRODUCT.id,
			claim.releaseVersion
		)
		.run();

	if (!result.success) throw new Error('Could not claim Stripe fulfillment');
	if (result.meta.changes === 1) return 'claimed';

	const existing = await database
		.prepare('SELECT status FROM site_stripe_fulfillments WHERE checkout_session_id = ?')
		.bind(claim.checkoutSessionId)
		.first<{ status: string }>();
	return existing?.status === 'fulfilled' ? 'fulfilled' : 'busy';
}

export async function completeFulfillment(
	database: CommerceDatabase,
	checkoutSessionId: string,
	messageId: string
): Promise<void> {
	const result = await database
		.prepare(
			`UPDATE site_stripe_fulfillments
			SET status = 'fulfilled', email_message_id = ?, fulfilled_at = unixepoch(), updated_at = unixepoch()
			WHERE checkout_session_id = ? AND status = 'sending'`
		)
		.bind(messageId, checkoutSessionId)
		.run();
	if (!result.success || result.meta.changes !== 1) {
		throw new Error('Could not complete Stripe fulfillment');
	}
}

export async function failFulfillment(
	database: CommerceDatabase,
	checkoutSessionId: string,
	errorName: string
): Promise<void> {
	await database
		.prepare(
			`UPDATE site_stripe_fulfillments
			SET status = 'failed', last_error = ?, updated_at = unixepoch()
			WHERE checkout_session_id = ? AND status = 'sending'`
		)
		.bind(errorName.slice(0, 100), checkoutSessionId)
		.run();
}
