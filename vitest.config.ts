import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	// The build inlines __SITE_ID__ from vite.config.ts's define; vitest has its
	// own config, so repeat it here (defaulting to the seanbehan.ca variant)
	// rather than leaving a bare identifier that throws on import of $lib/site.
	define: {
		__SITE_ID__: JSON.stringify('seanbehan')
	},
	// Without the browser condition, importing a component pulls in Svelte's
	// server build and mount() throws, so components cannot be rendered in tests.
	resolve: {
		conditions: ['browser']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		setupFiles: ['src/test-setup.ts'],
		globals: true
	}
});
