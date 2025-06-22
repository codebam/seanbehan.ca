import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [enhancedImages(), tailwindcss(), sveltekit()],
	build: {
		// Use default minification (esbuild)
		minify: true,
		// Generate source maps for production debugging
		sourcemap: true
	}
});
