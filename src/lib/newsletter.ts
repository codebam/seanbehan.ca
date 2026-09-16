/**
 * The list service's return contract, and the banner each result draws.
 *
 * The subscribe form posts directly to lists.seanbehan.ca and comes back on a
 * 303 with one of these params. The form component reads them when the page
 * renders; there is no JavaScript between the redirect and the message.
 */

/** The result params the list service writes onto its redirect. */
export const SUBSCRIBED_PARAM = 'subscribed';
export const SUBSCRIBE_ERROR_PARAM = 'subscribe_error';

export type SubscribeBanner = { tone: 'ok' | 'error'; text: string };

const BANNERS = {
	confirm: {
		tone: 'ok',
		text: 'Almost there — check your inbox for a confirmation email, and click the link to join the list.'
	},
	done: {
		tone: 'ok',
		text: 'You are on the list. Unsubscribe any time.'
	},
	invalid: {
		tone: 'error',
		text: 'That email address does not look right. Check it and try again.'
	},
	rate: {
		tone: 'error',
		text: 'Too many attempts from this connection. Try again in a few minutes.'
	},
	unavailable: {
		tone: 'error',
		text: 'The list is not answering right now. Try again in a moment.'
	},
	turnstile: {
		tone: 'error',
		text: 'The list asked for a verification challenge this form cannot complete. Use the sign-up page at lists.seanbehan.ca.'
	}
} as const satisfies Record<string, SubscribeBanner>;

/** What an unrecognised `subscribe_error` code says rather than nothing. */
const UNKNOWN_ERROR: SubscribeBanner = {
	tone: 'error',
	text: 'Something went wrong with that subscription. Try again in a moment.'
};

const bannerFor = (code: string | null): SubscribeBanner | null =>
	code && Object.hasOwn(BANNERS, code) ? BANNERS[code as keyof typeof BANNERS] : null;

/**
 * The banner a page should show, or null when the URL carries no result.
 *
 * An error wins over a success if both are somehow present: the reader needs
 * the correction more than the stale confirmation.
 */
export function subscribeBanner(params: URLSearchParams): SubscribeBanner | null {
	const error = params.get(SUBSCRIBE_ERROR_PARAM);
	if (error) return bannerFor(error) ?? UNKNOWN_ERROR;
	return bannerFor(params.get(SUBSCRIBED_PARAM));
}
