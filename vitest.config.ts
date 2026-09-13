import { defineConfig } from 'vitest/config';

/**
 * The unit tests cover the plain modules under src/lib — the post adapter, the
 * feed, the identity table, reading time. The pages themselves are exercised by
 * the smoke test in scripts/smoke.mjs against a running server, which is a
 * truer check for templates that render on a Worker out of D1.
 *
 * scripts/*.test.mjs is deliberately not in `include`: it imports node:test,
 * and Vitest runs its tests without collecting a suite, so the file is
 * reported as a failure even though every assertion passes. `npm run
 * test:run` composes the two runners instead, so "tests pass" covers both.
 */
export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'node'
	}
});
