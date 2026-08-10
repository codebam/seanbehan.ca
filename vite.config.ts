import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// @types/node is not a dependency and tsconfig pins `types` to
// @cloudflare/workers-types, so declare the one global this file needs instead
// of pulling in a package for it.
declare const process: { env: Record<string, string | undefined> };

// Which identity to build (see src/lib/site.ts). A define rather than
// $env/static/public because .env is gitignored: a missing PUBLIC_SITE would
// make that import a build error, and the default has to be the seanbehan.ca
// build that already ships.
const siteId = process.env.PUBLIC_SITE ?? 'seanbehan';

// Printed because the failure mode is silent. A build with the variable
// missing produces a complete, working site — just the wrong one — and the
// only way to tell from the outside is to read the deployed HTML. This line
// puts the answer in the build log instead. `npm run build:codebam` sets the
// variable in the command itself, which does not depend on the host wiring
// build-time environment variables through to Vite at all.
console.log(`[site] building "${siteId}"`);

export default defineConfig({
	plugins: [enhancedImages(), tailwindcss(), sveltekit()],
	define: {
		__SITE_ID__: JSON.stringify(siteId)
	},
	build: {
		// Use default minification (esbuild)
		minify: true
	}
});
