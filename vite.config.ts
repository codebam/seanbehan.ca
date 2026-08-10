import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// @types/node is not a dependency and tsconfig pins `types` to
// @cloudflare/workers-types, so declare the one global this file needs instead
// of pulling in a package for it.
declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
	plugins: [enhancedImages(), tailwindcss(), sveltekit()],
	define: {
		// Which identity to build (see src/lib/site.ts). A define rather than
		// $env/static/public because .env is gitignored: a missing PUBLIC_SITE
		// would make that import a build error, and the default here has to be
		// the seanbehan.ca build that already ships.
		__SITE_ID__: JSON.stringify(process.env.PUBLIC_SITE ?? 'seanbehan')
	},
	build: {
		// Use default minification (esbuild)
		minify: true
	}
});
