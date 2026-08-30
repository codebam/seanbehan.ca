import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { artifactMatches } from '../../lib/product';
import { site } from '../../lib/site';
import {
	createStripeClient,
	isCheckoutSessionId,
	retrieveProductAccess,
	safeErrorDetails
} from '../../lib/stripe';

const privateHeaders = {
	'Cache-Control': 'private, no-store',
	'Referrer-Policy': 'no-referrer',
	'X-Content-Type-Options': 'nosniff'
};

export const GET: APIRoute = async ({ url }) => {
	if (site.id !== 'codebam')
		return new Response('Not found', { status: 404, headers: privateHeaders });

	const sessionId = url.searchParams.get('session_id');
	if (!isCheckoutSessionId(sessionId)) {
		return new Response('Download link is invalid.', { status: 400, headers: privateHeaders });
	}

	try {
		const stripe = createStripeClient(env.STRIPE_SECRET_KEY);
		const access = await retrieveProductAccess(stripe, sessionId, env.STRIPE_PRICE_ID);
		if (access.status !== 'paid') {
			return new Response('This download is not available.', {
				status: access.status === 'pending' ? 409 : 404,
				headers: privateHeaders
			});
		}

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
		console.error('Stripe product download failed', safeErrorDetails(error));
		return new Response('Download is temporarily unavailable. Please try again.', {
			status: 503,
			headers: privateHeaders
		});
	}
};
