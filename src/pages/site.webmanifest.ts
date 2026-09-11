/**
 * Was a static file, which meant both variants installed to a home screen
 * under the same name. It is small and entirely identity, so it is generated
 * from the site config like everything else that differs.
 */
import type { APIRoute } from 'astro';
import { site } from '../lib/site';

export const GET: APIRoute = async () => {
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
		// The same pair as the theme-color metas in Base.astro; app.css owns the
		// values, so this is the surface to change when the palette does.
		theme_color: '#ffffff',
		background_color: '#ffffff',
		theme_colors: [
			{ color: '#ffffff', media: '(prefers-color-scheme: light)' },
			{ color: '#0b1220', media: '(prefers-color-scheme: dark)' }
		],
		display: 'standalone',
		scope: '/'
	};

	return new Response(JSON.stringify(manifest, null, '\t'), {
		headers: { 'Content-Type': 'application/manifest+json' }
	});
};
