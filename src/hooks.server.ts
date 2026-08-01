import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	if (dev) {
		response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
	}
	return response;
};
