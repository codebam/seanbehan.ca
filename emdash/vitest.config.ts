import { defineConfig } from 'vitest/config';

/**
 * The unit tests cover the plain modules under src/lib — the post adapter, the
 * feed, the identity table, reading time. The pages themselves are exercised by
 * the smoke test in scripts/smoke.mjs against a running server, which is a
 * truer check for templates that render on a Worker out of D1.
 */
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'node'
	}
});
