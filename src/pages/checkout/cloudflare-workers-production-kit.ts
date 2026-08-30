import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { PRODUCT, artifactMatches } from '../../lib/product';
import { SITES, site } from '../../lib/site';
import { checkoutSessionParams, createStripeClient, safeErrorDetails } from '../../lib/stripe';

const headers = {
	'Cache-Control': 'private, no-store',
	'Referrer-Policy': 'no-referrer'
};

export const POST: APIRoute = async ({ request, url }) => {
	if (site.id !== 'codebam') return new Response('Not found', { status: 404, headers });

	const origin = request.headers.get('Origin');
	const fetchSite = request.headers.get('Sec-Fetch-Site');
	if (
		(!import.meta.env.DEV && origin !== SITES.codebam.url) ||
		(origin && origin !== url.origin) ||
		(fetchSite && fetchSite !== 'same-origin') ||
		Number(request.headers.get('Content-Length') ?? 0) > 1024
	) {
		return new Response('Forbidden', { status: 403, headers });
	}

	try {
		const artifact = await env.DOWNLOADS.head(PRODUCT.currentRelease.artifactKey);
		if (!artifact || !artifactMatches(PRODUCT.currentRelease, artifact)) {
			throw new Error('Product artifact is missing or does not match the release manifest');
		}

		const stripe = createStripeClient(env.STRIPE_SECRET_KEY);
		const session = await stripe.checkout.sessions.create(
			checkoutSessionParams(env.STRIPE_PRICE_ID, import.meta.env.DEV ? url.origin : undefined)
		);
		if (!session.url) throw new Error('Stripe did not return a Checkout URL');

		return new Response(null, {
			status: 303,
			headers: { ...headers, Location: session.url }
		});
	} catch (error) {
		console.error('Stripe Checkout Session creation failed', safeErrorDetails(error));
		return new Response('Checkout is temporarily unavailable. Please try again.', {
			status: 503,
			headers
		});
	}
};
