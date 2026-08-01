import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
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
