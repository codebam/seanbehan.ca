import { describe, it, expect } from 'vitest';
import { countWords, splitWords, readingMinutes, weightedReadingMinutes } from './readingTime';

const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');

describe('countWords — edge tokens', () => {
	it('returns zero for an empty or whitespace-only body', () => {
		expect(countWords('')).toBe(0);
		expect(countWords('  \n\t ')).toBe(0);
	});

	it('counts a long word as one token', () => {
		expect(countWords('x'.repeat(500))).toBe(1);
		expect(countWords(`${'x'.repeat(500)} ${'y'.repeat(500)}`)).toBe(2);
	});

	it('counts a fenced block as raw tokens, including its language tag', () => {
		expect(countWords('```sh\nfoo bar\n```')).toBe(3);
	});
});

describe('splitWords — code fence edges', () => {
	it('returns zero counts for an empty body', () => {
		expect(splitWords('')).toEqual({ prose: 0, code: 0 });
	});

	it('does not count a fence info string as a code word', () => {
		expect(splitWords('```typescript\n```')).toEqual({ prose: 0, code: 0 });
		expect(splitWords('```\nfoo bar\n```')).toEqual({ prose: 0, code: 2 });
	});

	it('counts several fences and inline spans without double counting', () => {
		expect(splitWords('a ```js\nx y\n``` b `c d` e')).toEqual({ prose: 3, code: 4 });
	});

	it('keeps a long token as a single word', () => {
		const long = 'z'.repeat(300);
		expect(splitWords(`${long} ${long}`)).toEqual({ prose: 2, code: 0 });
	});
});

describe('readingMinutes — long-word bodies', () => {
	it('charges by token count, not by character count', () => {
		const longWords = (n: number) => Array.from({ length: n }, () => 'q'.repeat(80)).join(' ');
		expect(readingMinutes(longWords(200))).toBe(1);
		expect(readingMinutes(longWords(201))).toBe(2);
	});
});

describe('weightedReadingMinutes — half-weight threshold', () => {
	it('rounds a code-only body just over the weighted minute up', () => {
		expect(weightedReadingMinutes(0, 400)).toBe(1);
		expect(weightedReadingMinutes(0, 401)).toBe(2);
	});
});
