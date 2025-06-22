import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [enhancedImages(), tailwindcss(), sveltekit()],
	build: {
		// Optimize bundle size
		rollupOptions: {
			output: {
				manualChunks: {
					// Separate vendor chunks for better caching
					vendor: ['svelte', 'fuse.js'],
					ui: ['@skeletonlabs/skeleton']
				}
			}
		},
		// Enable minification
		minify: 'terser',
		// Generate source maps for production debugging
		sourcemap: true
	},
	// Optimize dependencies
	optimizeDeps: {
		include: ['fuse.js']
	}
});
