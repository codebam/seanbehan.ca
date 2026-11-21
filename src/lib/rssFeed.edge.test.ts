import { describe, it, expect } from 'vitest';
import { absolutizeUrls } from './rssFeed';

const ORIGIN = 'https://seanbehan.ca';

describe('absolutizeUrls srcset edges', () => {
	it('prefixes a single root-relative entry at the start of a srcset', () => {
		expect(absolutizeUrls('<img srcset="/img/one.webp 1x"/>', ORIGIN)).toBe(
			'<img srcset="https://seanbehan.ca/img/one.webp 1x"/>'
		);
	});

	it('prefixes entries separated by a comma with no space', () => {
		expect(absolutizeUrls('<img srcset="/img/a.webp 1x,/img/b.webp 2x"/>', ORIGIN)).toBe(
			'<img srcset="https://seanbehan.ca/img/a.webp 1x,https://seanbehan.ca/img/b.webp 2x"/>'
		);
	});

	it('leaves a protocol-relative entry at the start alone but prefixes a later relative one', () => {
		expect(absolutizeUrls('<img srcset="//cdn/a.png 1x, /img/b.webp 2x"/>', ORIGIN)).toBe(
			'<img srcset="//cdn/a.png 1x, https://seanbehan.ca/img/b.webp 2x"/>'
		);
	});

	it('keeps absolute and protocol-relative entries while prefixing the spaced relative one', () => {
		const html = '<img srcset="https://cdn/x.png 1x,   /img/b.webp 2x, //cdn/y.png 3x"/>';

		expect(absolutizeUrls(html, ORIGIN)).toBe(
			'<img srcset="https://cdn/x.png 1x,   https://seanbehan.ca/img/b.webp 2x, //cdn/y.png 3x"/>'
		);
	});

	it('rewrites every srcset in the body', () => {
		const html = '<source srcset="/a.webp 1x"/><source srcset="/b.webp 1x"/>';

		expect(absolutizeUrls(html, ORIGIN)).toBe(
			'<source srcset="https://seanbehan.ca/a.webp 1x"/>' +
				'<source srcset="https://seanbehan.ca/b.webp 1x"/>'
		);
	});

	it('leaves an empty srcset empty and prefixes a bare root href', () => {
		expect(absolutizeUrls('<img srcset=""/><a href="/">home</a>', ORIGIN)).toBe(
			'<img srcset=""/><a href="https://seanbehan.ca/">home</a>'
		);
	});
});
