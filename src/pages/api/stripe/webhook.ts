import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import Stripe from 'stripe';
import { PRODUCT } from '../../../lib/product';
import { site } from '../../../lib/site';
import {
	STRIPE_INTEGRATION,
	claimFulfillment,
	completeFulfillment,
	createStripeClient,
	failFulfillment,
	fulfillmentEmail,
	retrieveProductAccess,
	safeErrorDetails
} from '../../../lib/stripe';

const MAX_EVENT_BYTES = 1024 * 1024;
const headers = { 'Cache-Control': 'private, no-store' };

async function readBody(request: Request): Promise<Uint8Array | null> {
	if (!request.body) return new Uint8Array();

	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let length = 0;

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		length += value.byteLength;
		if (length > MAX_EVENT_BYTES) {
			await reader.cancel();
			return null;
		}
		chunks.push(value);
	}

	const payload = new Uint8Array(length);
	let offset = 0;
	for (const chunk of chunks) {
		payload.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return payload;
}

export const POST: APIRoute = async ({ request }) => {
	if (site.id !== 'codebam') return new Response('Not found', { status: 404, headers });
	if (Number(request.headers.get('Content-Length') ?? 0) > MAX_EVENT_BYTES) {
		return new Response('Payload too large', { status: 413, headers });
	}

	const signature = request.headers.get('Stripe-Signature');
	if (!signature) return new Response('Missing signature', { status: 400, headers });

	let event: Stripe.Event;
	let stripe: Stripe;
	try {
		const payload = await readBody(request);
		if (!payload) return new Response('Payload too large', { status: 413, headers });

		stripe = createStripeClient(env.STRIPE_SECRET_KEY);
		event = await stripe.webhooks.constructEventAsync(
			payload,
			signature,
			env.STRIPE_WEBHOOK_SECRET,
			undefined,
			Stripe.createSubtleCryptoProvider()
		);
	} catch (error) {
		console.error('Stripe webhook signature verification failed', safeErrorDetails(error));
		return new Response('Invalid signature', { status: 400, headers });
	}

	if (
		event.type !== 'checkout.session.completed' &&
		event.type !== 'checkout.session.async_payment_succeeded'
	) {
		return new Response(null, { status: 200, headers });
	}

	const checkoutSession = event.data.object as Stripe.Checkout.Session;
	if (
		checkoutSession.metadata?.integration !== STRIPE_INTEGRATION ||
		checkoutSession.metadata?.product !== PRODUCT.id
	) {
		return new Response(null, { status: 200, headers });
	}

	try {
		const access = await retrieveProductAccess(stripe, checkoutSession.id, env.STRIPE_PRICE_ID);
		if (access.status !== 'paid') {
			if (access.status === 'pending' || access.status === 'revoked') {
				return new Response(null, { status: 200, headers });
			}
			throw new Error('Matching Checkout Session is invalid');
		}
		if (!access.email) throw new Error('Paid Checkout Session has no customer email');

		const claim = await claimFulfillment(env.DB, {
			checkoutSessionId: checkoutSession.id,
			paymentIntentId: access.paymentIntentId,
			stripeEventId: event.id,
			releaseVersion: access.release.version
		});
		if (claim === 'fulfilled') return new Response(null, { status: 200, headers });
		if (claim === 'busy') return new Response('Fulfillment in progress', { status: 503, headers });

		try {
			const message = fulfillmentEmail(
				checkoutSession.id,
				access.release,
				import.meta.env.DEV ? new URL(request.url).origin : undefined
			);
			const result = await env.ORDER_EMAIL.send({
				to: access.email,
				from: { email: 'products@codebam.ca', name: 'codebam' },
				replyTo: 'codebam@codebam.ca',
				...message
			});
			await completeFulfillment(env.DB, checkoutSession.id, result.messageId);
		} catch (error) {
			await failFulfillment(
				env.DB,
				checkoutSession.id,
				error instanceof Error ? error.name : 'UnknownError'
			);
			throw error;
		}

		return new Response(null, { status: 200, headers });
	} catch (error) {
		console.error('Stripe webhook fulfillment failed', safeErrorDetails(error));
		return new Response('Fulfillment failed', { status: 500, headers });
	}
};
