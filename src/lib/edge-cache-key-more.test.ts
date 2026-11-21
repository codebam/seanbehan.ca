import { describe, expect, it } from 'vitest';
import { edgeCacheKey } from './edgeCache';

/**
 * URL-to-Request cases that edgeCache.test.ts leaves open: the Request itself,
 * non-standard origins, fragments, and routes at the edge of each regex.
 */
describe('edgeCacheKey request shape', () => {
	it('builds a bodyless GET request', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/about'));

		expect(key.method).toBe('GET');
		expect(key.body).toBeNull();
	});

	it('keeps the scheme and port in the origin and the host prefix', () => {
		const key = edgeCacheKey(new URL('http://localhost:4321/posts'));

		expect(key.url).toBe('http://localhost:4321/__host/localhost:4321/posts');
	});

	it('ignores the fragment', () => {
		const plain = edgeCacheKey(new URL('https://seanbehan.ca/posts?q=nixos'));
		const withFragment = edgeCacheKey(new URL('https://seanbehan.ca/posts?q=nixos#section'));

		expect(withFragment.url).toBe(plain.url);
	});
});

describe('edgeCacheKey route boundaries', () => {
	it('drops the query from a trailing-slash archive URL', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/posts/?q=nixos'));

		expect(key.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/posts/');
	});

	it('drops the query from a post beneath the archive root', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/posts/example?q=nixos'));

		expect(key.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/posts/example');
	});

	it('recognises a nested image endpoint', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/media/_image?w=320&nonce=9'));

		expect(key.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/media/_image?w=320');
	});

	it('omits the query when a search term folds to nothing', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/search.json?q=%20%20&nonce=1'));

		expect(key.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/search.json');
	});
});

describe('edgeCacheKey image parameters', () => {
	it('keeps height and format in the canonical parameter order', () => {
		const key = edgeCacheKey(
			new URL('https://seanbehan.ca/_image?f=png&h=480&href=%2Fm.jpg&w=640')
		);

		expect(key.url).toBe(
			'https://seanbehan.ca/__host/seanbehan.ca/_image?href=%2Fm.jpg&w=640&h=480&f=png'
		);
	});

	it('copies image quality verbatim rather than folding its case', () => {
		const key = edgeCacheKey(new URL('https://seanbehan.ca/_image?href=x&q=HIGH'));

		expect(key.url).toBe('https://seanbehan.ca/__host/seanbehan.ca/_image?href=x&q=HIGH');
	});
});
