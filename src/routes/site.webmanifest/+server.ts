import { site } from '$lib/site';

export const prerender = true;

/**
 * Was a static file, which meant both variants installed to a home screen
 * under the same name. It is small and entirely identity, so it is generated
 * from the site config like everything else that differs.
 */
export const GET = async () => {
	const manifest = {
		name: site.title,
		short_name: site.name,
		description: site.description,
		start_url: '/',
		icons: [
			{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
			{ src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
			{ src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
		],
		theme_color: '#a8391f',
		background_color: '#faf8f4',
		display: 'standalone',
		scope: '/'
	};

	return new Response(JSON.stringify(manifest, null, '\t'), {
		headers: { 'Content-Type': 'application/manifest+json' }
	});
};
