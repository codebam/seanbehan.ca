import { describe, expect, it } from 'vitest';
import { edgeCacheKey } from './edgeCache';

describe('edgeCacheKey', () => {
	it('keeps image transformation parameters distinct', () => {
		const first = edgeCacheKey(
			new URL('https://seanbehan.ca/_image?href=%2Fmedia%2Fphoto.jpg&w=640&f=webp')
		);
		const second = edgeCacheKey(
			new URL('https://seanbehan.ca/_image?href=%2Fmedia%2Fother.jpg&w=1280&f=webp')
		);

		expect(first.url).not.toBe(second.url);
		expect(first.url).toContain('w=640');
	});

	it('keeps search queries that change the response', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/search.json?q=nixos'));

		expect(key.url).toBe('https://seanbehan.ca/search.json?q=nixos');
	});

	it('drops irrelevant query strings from page keys', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/posts/example?nonce=1'));

		expect(key.url).toBe('https://seanbehan.ca/posts/example');
	});
});
