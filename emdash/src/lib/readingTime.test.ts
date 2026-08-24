import { describe, it, expect } from 'vitest';
import { countWords, splitWords, readingMinutes } from './readingTime';

const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');
const fence = (n: number) => `\`\`\`sh\n${words(n)}\n\`\`\``;

describe('countWords', () => {
	it('counts plain prose', () => {
		expect(countWords('one two three')).toBe(3);
	});

	it('does not count punctuation-only tokens', () => {
		expect(countWords('## Heading\n\n- one\n- two')).toBe(3);
	});
});

describe('splitWords', () => {
	it('ignores frontmatter', () => {
		expect(splitWords('---\ntitle: A Post About Things\ndraft: false\n---\none two').prose).toBe(2);
	});

	it('separates fenced code from prose', () => {
		expect(splitWords('one\n\n```sh\nnix build --flake .#thing\n```\n\ntwo')).toEqual({
			prose: 2,
			code: 4
		});
	});

	it('separates inline code from prose', () => {
		// The fence language tag counts as a code word, so use inline here.
		expect(splitWords('run `npm run build` now')).toEqual({ prose: 2, code: 3 });
	});

	it('keeps link text and drops the URL', () => {
		expect(splitWords('see [the docs](https://example.com/a/b/c)').prose).toBe(3);
	});
});

describe('readingMinutes', () => {
	it('rounds up a partial minute', () => {
		expect(readingMinutes(words(201))).toBe(2);
	});

	it('does not round up an exact minute', () => {
		expect(readingMinutes(words(400))).toBe(2);
	});

	it('returns at least 1 minute for a short post', () => {
		expect(readingMinutes('three whole words')).toBe(1);
	});

	it('returns at least 1 minute for an empty body', () => {
		expect(readingMinutes('')).toBe(1);
	});

	// 200 prose words is 1 minute on its own. Adding 400 code words adds
	// 400 * 0.5 = 200 weighted words, so exactly one more minute.
	it('charges half a minute per 200 code words', () => {
		expect(readingMinutes(words(200))).toBe(1);
		expect(readingMinutes(`${words(200)}\n\n${fence(400)}`)).toBe(2);
	});

	it('does not charge full prose rate for a wall of code', () => {
		// 5000 code words would be 25 minutes at prose rate; at 0.5 it is 13.
		expect(readingMinutes(fence(5000))).toBe(13);
	});
});
