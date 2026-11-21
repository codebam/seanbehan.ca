import { describe, expect, it } from 'vitest';
import { isNegotiablePath, requestedFormat } from './accept';

describe('requestedFormat quality edge cases', () => {
	it('rejects a preference outside the RFC 0..1 range', () => {
		expect(requestedFormat('text/markdown;q=1.5')).toBeNull();
		expect(requestedFormat('text/markdown;q=-0.2')).toBeNull();
		// An out-of-range HTML q is dropped rather than honoured, leaving
		// markdown as the only claim with a score.
		expect(requestedFormat('text/html;q=2, text/markdown')).toBe('md');
	});

	it('takes the highest q when a type is named more than once', () => {
		// A last-one-wins reading would score markdown at 0.2 and hand the
		// reader HTML instead.
		const header = 'text/markdown;q=0.9, text/markdown;q=0.2, text/html;q=0.5';
		expect(requestedFormat(header)).toBe('md');
	});

	it('compares media types without regard to case', () => {
		expect(requestedFormat('TEXT/MARKDOWN')).toBe('md');
		expect(requestedFormat('Application/JSON')).toBe('json');
	});
});

describe('isNegotiablePath variant suffixes', () => {
	it('recognises an existing variant regardless of case', () => {
		expect(isNegotiablePath('/posts/nixos.MD')).toBe(false);
		expect(isNegotiablePath('/pages/about-site.JSON')).toBe(false);
	});
});
