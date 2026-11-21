import { describe, expect, it } from 'vitest';
import { bodyMarkdown } from './markdown';

const span = (text: string) => ({ _type: 'span', _key: `s-${text}`, text, marks: [] });
const block = (style: string, children: unknown[], extra: Record<string, unknown> = {}) => ({
	_type: 'block',
	_key: `b-${style}`,
	style,
	children,
	...extra
});

describe('bodyMarkdown — block conversions', () => {
	it('is empty for a body that is an empty array', () => {
		// A non-array body is covered elsewhere; an array with no blocks still
		// has to reach the same empty answer rather than a bare newline.
		expect(bodyMarkdown([])).toBe('');
	});

	it('prefers an image asset URL over a feed src when both are present', () => {
		// fitBlocks reads asset.url first and only falls back to src; an older
		// body carrying both must not export the wrong one.
		expect(
			bodyMarkdown([
				{
					_type: 'image',
					_key: 'i',
					alt: 'A',
					asset: { url: '/img/from-asset.png' },
					src: '/img/from-src.png'
				}
			])
		).toBe('![A](https://seanbehan.ca/img/from-asset.png)\n');
	});

	it('keeps an image with no stored URL as an empty target', () => {
		// fitBlocks still hands the converter an image with asset.url '' when
		// neither field carried a URL; dropping it would lose the alt text.
		expect(bodyMarkdown([{ _type: 'image', _key: 'i', alt: 'A' }])).toBe('![A]()\n');
	});

	it('does not invent a filename line for an empty or non-string code filename', () => {
		// The guard is a non-empty string, not merely the presence of a field.
		const fence = '```sh\necho hi\n```\n';
		expect(
			bodyMarkdown([{ _type: 'code', _key: 'c', language: 'sh', code: 'echo hi', filename: '' }])
		).toBe(fence);
		expect(
			bodyMarkdown([{ _type: 'code', _key: 'c', language: 'sh', code: 'echo hi', filename: 42 }])
		).toBe(fence);
	});

	it('keeps the distance between re-based headings of different depths', () => {
		// prepareBody shifts every heading by the shallowest level's distance
		// from h2, so an h3/h4 archive exports as h2/h3, not two h2s.
		expect(bodyMarkdown([block('h3', [span('One')]), block('h4', [span('Two')])])).toBe(
			'## One\n\n### Two\n'
		);
	});

	it('keeps the prose either side of an unknown block', () => {
		const md = bodyMarkdown([
			block('normal', [span('before')]),
			{ _type: 'embed', _key: 'e', html: '<iframe></iframe>' },
			block('normal', [span('after')])
		]);
		expect(md).toContain('<!--ec:block');
		expect(md.indexOf('before')).toBeLessThan(md.indexOf('<!--ec:block'));
		expect(md.indexOf('<!--ec:block')).toBeLessThan(md.indexOf('after'));
	});
});
