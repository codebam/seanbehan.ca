import { describe, expect, it } from 'vitest';
import { requestedFormat } from './accept';

describe('requestedFormat edge cases', () => {
	it('rejects q values outside 0..1 instead of treating them as preferences', () => {
		expect(requestedFormat('text/markdown;q=1.5')).toBeNull();
		expect(requestedFormat('text/markdown;q=-0.1')).toBeNull();
		expect(requestedFormat('text/html;q=0, text/markdown;q=2')).toBeNull();
	});

	it('keeps a covering text/* range ahead of a lower-q markdown claim', () => {
		expect(requestedFormat('text/markdown;q=0.5, text/*')).toBeNull();
	});

	it('takes the highest q among repeated claims of the same type', () => {
		expect(requestedFormat('text/markdown;q=0.2, text/html;q=0.5, text/markdown;q=0.9')).toBe('md');
	});

	it('matches media types case-insensitively', () => {
		expect(requestedFormat('Text/Markdown')).toBe('md');
		expect(requestedFormat('APPLICATION/JSON')).toBe('json');
	});
});
