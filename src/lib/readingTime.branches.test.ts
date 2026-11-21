import { describe, it, expect } from 'vitest';
import { countWords, splitWords, weightedReadingMinutes } from './readingTime';

describe('countWords secondary branches', () => {
	it('counts non-ASCII letters and digits as words', () => {
		expect(countWords('café 東京 123 — &')).toBe(3);
	});
});

describe('splitWords secondary branches', () => {
	it('strips HTML tags out of the prose count', () => {
		expect(splitWords('<p>Hello <em>world</em></p>')).toEqual({ prose: 2, code: 0 });
	});

	it('keeps image alt text but drops the URL', () => {
		expect(splitWords('See ![the diagram](/img/a.webp) now')).toEqual({ prose: 4, code: 0 });
	});

	it('accepts CRLF frontmatter', () => {
		expect(splitWords('---\r\ntitle: Ignored\r\n---\r\nreal words here').prose).toBe(3);
	});

	it('counts a fenced block once, not again as inline code', () => {
		expect(splitWords('```sh\nalpha beta\n```\nprose here')).toEqual({ prose: 2, code: 2 });
	});
});

describe('weightedReadingMinutes secondary branches', () => {
	it('weights a code-only body at half and still rounds up', () => {
		expect(weightedReadingMinutes(0, 200)).toBe(1);
		expect(weightedReadingMinutes(0, 400)).toBe(1);
		expect(weightedReadingMinutes(0, 402)).toBe(2);
	});

	it('rounds a fractional weighted total up to the next minute', () => {
		// 199 prose words + 3 code words at half weight = 200.5.
		expect(weightedReadingMinutes(199, 3)).toBe(2);
	});
});
