import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess({}), mdsvex({ extensions: ['.md'] })],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),

		// SvelteKit registers the service worker in dev too, where its cache-first
		// strategy serves stale modules on reload. Register it ourselves in +layout.svelte
		// so it only runs in production builds.
		serviceWorker: {
			register: false
		}
	},

	extensions: ['.svelte', '.svx', '.md']
};

export default config;
