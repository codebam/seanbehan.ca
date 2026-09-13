import type { APIContext, APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { artifactMatches } from '../../lib/product';
import { site } from '../../lib/site';
import {
	createStripeClient,
	isCheckoutSessionId,
	isMissingStripeSession,
	retrieveProductAccess,
	safeErrorDetails
} from '../../lib/stripe';

const privateHeaders = {
	'Cache-Control': 'private, no-store',
	'Referrer-Policy': 'no-referrer',
	'X-Content-Type-Options': 'nosniff'
};

/**
 * Serve one of the site's HTML result pages while keeping the status code this
 * handler owns. A direct request to the page answers with the same status the
 * page sets itself; the wrapper is what guarantees it when this route rewrites
 * to the page rather than redirecting to it.
 */
const htmlError = async (rewrite: APIContext['rewrite'], path: string, status: number) => {
	const page = await rewrite(path);
	return new Response(page.body, {
		status,
		// Keep the commerce caching and referrer policy even if a rewrite ever
		// drops the page's own headers.
		headers: { ...page.headers, ...privateHeaders }
	});
};

export const GET: APIRoute = async ({ url, rewrite }) => {
	if (site.id !== 'codebam')
		return new Response('Not found', { status: 404, headers: privateHeaders });

	const sessionId = url.searchParams.get('session_id');
	if (!isCheckoutSessionId(sessionId)) {
		return htmlError(rewrite, '/checkout/link-invalid', 404);
	}

	try {
		const stripe = createStripeClient(env.STRIPE_SECRET_KEY);
		const access = await retrieveProductAccess(stripe, sessionId, env.STRIPE_PRICE_ID);
		if (access.status === 'pending') return htmlError(rewrite, '/checkout/payment-pending', 409);
		if (access.status === 'revoked') return htmlError(rewrite, '/checkout/access-revoked', 410);
		if (access.status !== 'paid') return htmlError(rewrite, '/checkout/link-invalid', 404);

		const artifact = await env.DOWNLOADS.get(access.release.artifactKey);
		if (!artifact || !artifactMatches(access.release, artifact)) {
			throw new Error(`Missing or invalid product artifact: ${access.release.artifactKey}`);
		}

		return new Response(artifact.body, {
			headers: {
				...privateHeaders,
				'Content-Type': 'application/zip',
				'Content-Disposition': `attachment; filename="${access.release.filename}"`,
				'Content-Length': String(artifact.size),
				ETag: artifact.httpEtag
			}
		});
	} catch (error) {
		// A session Stripe does not know is a bad link, not an outage: the
		// status decides which page the buyer lands on, never whether the
		// artifact is served. Every access check above still runs first.
		if (isMissingStripeSession(error)) return htmlError(rewrite, '/checkout/link-invalid', 404);

		console.error('Stripe product download failed', safeErrorDetails(error));
		return htmlError(rewrite, '/checkout/unavailable', 503);
	}
};
