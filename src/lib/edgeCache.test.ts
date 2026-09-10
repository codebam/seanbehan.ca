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

	it('keys the archive on its search term', () => {
		const searched = edgeCacheKey(new URL('https://seanbehan.ca/posts?q=nixos'));
		const plain = edgeCacheKey(new URL('https://seanbehan.ca/posts'));

		expect(searched.url).toBe('https://seanbehan.ca/posts?q=nixos');
		expect(plain.url).toBe('https://seanbehan.ca/posts');
		expect(searched.url).not.toBe(plain.url);
	});

	it('folds the query it keys the archive on, and ignores the rest of the URL', () => {
		const noisy = edgeCacheKey(
			new URL('https://seanbehan.ca/posts?utm_source=x&nonce=7&q=%20NixOS%20%20Flakes%20')
		);

		expect(noisy.url).toBe('https://seanbehan.ca/posts?q=nixos%20flakes');
	});

	it('caps the length of a search key so a flood cannot multiply entries', () => {
		const long = edgeCacheKey(new URL(`https://seanbehan.ca/posts?q=${'a'.repeat(500)}`));

		expect(new URL(long.url).searchParams.get('q')).toHaveLength(64);
	});
});
