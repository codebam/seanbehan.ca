import { vi } from 'vitest';

// Mock the cactus.js module
vi.mock('$lib/cactus.js', () => ({
	initComments: vi.fn()
}));

// Mock EventSource for AI bio tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).EventSource = vi.fn(() => ({
	onmessage: null,
	onerror: null,
	close: vi.fn()
}));
