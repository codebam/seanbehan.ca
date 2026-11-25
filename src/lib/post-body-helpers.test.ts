import { describe, expect, it } from 'vitest';
import { bodyWordCounts, plainText, prepareBody } from './posts';

const block = (style: string, text: string) => ({
	_type: 'block',
	_key: `k-${style}-${text}`,
	style,
	children: [{ _type: 'span', text }]
});

describe('plainText', () => {
	it('is empty for an empty body', () => {
		expect(plainText([])).toBe('');
	});

	it('joins every string span in a block and skips the rest', () => {
		const body = [
			{
				_type: 'block',
				style: 'normal',
				children: [
					{ _type: 'span', text: 'one' },
					{ _type: 'span', text: 42 },
					{ _type: 'span', text: 'two' },
					{ _type: 'span' }
				]
			}
		];

		expect(plainText(body)).toBe('one two');
	});

	it('ignores non-block nodes such as images', () => {
		const body = [
			{ _type: 'image', url: 'https://example.test/pic.jpg' },
			block('normal', 'a caption')
		];
		expect(plainText(body)).toBe('a caption');
	});
});

describe('bodyWordCounts', () => {
	it('is zero for an empty body', () => {
		expect(bodyWordCounts([])).toEqual({ prose: 0, code: 0 });
	});

	it('ignores non-block nodes and children whose text is not a string', () => {
		const body = [
			{ _type: 'image', url: 'https://example.test/pic.jpg' },
			{
				_type: 'block',
				style: 'normal',
				children: [{ text: 'hello' }, { text: 5 }]
			}
		];

		expect(bodyWordCounts(body)).toEqual({ prose: 1, code: 0 });
	});

	it('counts every string span in a prose block', () => {
		const body = [
			{
				_type: 'block',
				style: 'normal',
				children: [{ text: 'one' }, { text: 'two three' }]
			}
		];

		expect(bodyWordCounts(body)).toEqual({ prose: 3, code: 0 });
	});

	it('ignores a code block whose code is not a string', () => {
		const body = [block('normal', 'kept'), { _type: 'code', code: ['not', 'a', 'string'] }];
		expect(bodyWordCounts(body)).toEqual({ prose: 1, code: 0 });
	});
});

describe('prepareBody', () => {
	it('returns empty blocks and headings for a non-array or empty body', () => {
		expect(prepareBody(undefined)).toEqual({ blocks: [], headings: [] });
		expect(prepareBody([])).toEqual({ blocks: [], headings: [] });
	});

	it('skips a heading whose text is only whitespace', () => {
		const { blocks, headings } = prepareBody([block('h2', '   ')]);
		expect(headings).toEqual([]);
		expect(blocks[0]).not.toHaveProperty('headingId');
		expect(blocks[0]).toHaveProperty('style', 'h2');
	});

	it('does not treat an out-of-range style as a heading', () => {
		const { blocks, headings } = prepareBody([block('h7', 'Not a heading')]);
		expect(headings).toEqual([]);
		expect(blocks[0]).not.toHaveProperty('headingId');
	});

	it('slugifies the heading text into its fragment', () => {
		const { headings } = prepareBody([block('h2', 'Hello, World!')]);
		expect(headings).toEqual([{ id: 'hello-world', text: 'Hello, World!', level: 2 }]);
	});

	it('gives a third repeated heading its own fragment', () => {
		const { headings } = prepareBody([
			block('h3', 'Conclusion'),
			block('h3', 'Conclusion'),
			block('h3', 'Conclusion')
		]);
		expect(headings.map((heading) => heading.id)).toEqual([
			'conclusion',
			'conclusion-1',
			'conclusion-2'
		]);
	});

	it('avoids a natural slug that collides with a generated duplicate', () => {
		const { headings } = prepareBody([
			block('h2', 'Overview'),
			block('h2', 'Overview'),
			block('h2', 'Overview-1')
		]);
		expect(headings.map((heading) => heading.id)).toEqual([
			'overview',
			'overview-1',
			'overview-1-1'
		]);
	});

	it('re-bases an all-h6 body to h2 like any other shallowest level', () => {
		const { blocks, headings } = prepareBody([block('h6', 'One'), block('h6', 'Two')]);
		expect(headings.map((heading) => heading.level)).toEqual([2, 2]);
		expect(blocks.map((b) => (b as { style?: string }).style)).toEqual(['h2', 'h2']);
	});
});
