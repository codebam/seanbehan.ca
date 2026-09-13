import { describe, expect, it } from 'vitest';
import { IMAGE_SIZES, imageAttributes } from './image';

describe('imageAttributes', () => {
	it('reads the media URL and reports a missing alt as null', () => {
		expect(imageAttributes({ asset: { url: '/img/a.webp' } })).toEqual({
			src: '/img/a.webp',
			alt: null
		});
	});

	it('keeps an explicit empty alt distinct from a missing one', () => {
		const decorative = imageAttributes({ asset: { url: '/img/a.webp' }, alt: '' })!;
		const missing = imageAttributes({ asset: { url: '/img/a.webp' } })!;
		expect(decorative.alt).toBe('');
		expect(missing.alt).toBeNull();
	});

	it('accepts the older src field for backward compatibility', () => {
		expect(imageAttributes({ src: '/img/a.webp', alt: 'A' })).toEqual({
			src: '/img/a.webp',
			alt: 'A'
		});
	});

	it('keeps positive integer width and height', () => {
		expect(imageAttributes({ asset: { url: '/img/a.webp' }, width: 843, height: 381 })).toEqual({
			src: '/img/a.webp',
			alt: null,
			width: 843,
			height: 381
		});
	});

	it('drops a dimension that is not a positive integer', () => {
		const attrs = imageAttributes({
			asset: { url: '/img/a.webp' },
			width: 843.5,
			height: 0
		});

		expect(attrs).not.toHaveProperty('width');
		expect(attrs).not.toHaveProperty('height');
	});

	it('builds srcset and sizes from the variants, smallest first', () => {
		expect(
			imageAttributes({
				asset: { url: '/img/original.webp' },
				width: 2560,
				height: 1440,
				variants: [
					{ url: '/img/a-1600.webp', width: 1600 },
					{ url: '/img/a-800.webp', width: 800 },
					{ url: '/img/a-1200.webp', width: 1200 }
				]
			})
		).toEqual({
			src: '/img/original.webp',
			alt: null,
			width: 2560,
			height: 1440,
			srcset: '/img/a-800.webp 800w, /img/a-1200.webp 1200w, /img/a-1600.webp 1600w',
			sizes: IMAGE_SIZES
		});
	});

	it('accepts the dimension as a numeric string', () => {
		expect(
			imageAttributes({
				asset: { url: '/img/a.webp' },
				width: '843',
				height: '381'
			})
		).toEqual({ src: '/img/a.webp', alt: null, width: 843, height: 381 });
	});

	it('renders nothing when the block has no URL', () => {
		expect(imageAttributes({ alt: 'A' })).toBeNull();
		expect(imageAttributes(undefined)).toBeNull();
		expect(imageAttributes({ asset: { url: '' }, src: '' })).toBeNull();
	});

	it('leaves out variants that are missing a URL or width', () => {
		const attrs = imageAttributes({
			asset: { url: '/img/a.webp' },
			variants: [{ url: '', width: 800 }, { url: '/img/b.webp' }, { url: '/img/c.webp', width: 0 }]
		});

		expect(attrs).toEqual({ src: '/img/a.webp', alt: null });
	});
});
