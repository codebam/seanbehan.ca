import { describe, expect, it } from 'vitest';
import { negotiatedPath } from './accept';

const url = (path: string) => new URL(`https://seanbehan.ca${path}`);
const request = (accept: string | null, method = 'GET', at = '/posts/nixos') =>
	new Request(new URL(at, 'https://seanbehan.ca'), {
		method,
		headers: accept === null ? {} : { Accept: accept }
	});

describe('negotiatedPath — request method', () => {
	it('answers HEAD with the same variant GET gets', () => {
		expect(
			negotiatedPath(request('text/markdown', 'HEAD', '/posts/nixos'), url('/posts/nixos'))
		).toBe('/posts/nixos.md');
		expect(
			negotiatedPath(
				request('application/json', 'HEAD', '/pages/about-site'),
				url('/pages/about-site')
			)
		).toBe('/pages/about-site.json');
		// A safe method alone is not a request for another format.
		expect(negotiatedPath(request(null, 'HEAD'), url('/posts/nixos'))).toBeNull();
	});

	it('refuses every verb except GET and HEAD', () => {
		for (const method of ['PUT', 'PATCH', 'DELETE']) {
			expect(negotiatedPath(request('text/markdown', method), url('/posts/nixos'))).toBeNull();
		}
	});
});

describe('negotiatedPath — URL query', () => {
	it('carries the query through a JSON rewrite', () => {
		const path = '/pages/about-site?preview=draft';
		expect(negotiatedPath(request('application/json', 'GET', path), url(path))).toBe(
			'/pages/about-site.json?preview=draft'
		);
	});

	it('carries the query through the résumé markdown rewrite', () => {
		const path = '/resume?from=nav';
		expect(negotiatedPath(request('text/markdown', 'GET', path), url(path))).toBe(
			'/resume.md?from=nav'
		);
	});

	it('keeps every parameter exactly as the URL spelled it', () => {
		const path = '/posts/nixos?a=1&b=two%20words&empty=';
		expect(negotiatedPath(request('text/markdown', 'GET', path), url(path))).toBe(
			'/posts/nixos.md?a=1&b=two%20words&empty='
		);
	});

	it('leaves a suffixed path alone even when it carries a query', () => {
		const path = '/posts/nixos.md?preview=1';
		expect(negotiatedPath(request('text/markdown', 'GET', path), url(path))).toBeNull();
	});
});

describe('negotiatedPath — argument roles', () => {
	it('reads the path and query from the URL, the method and header from the request', () => {
		// Built at the résumé with an md header, but handed a post URL with its
		// own query: the rewrite follows the URL it was given, not request.url.
		const req = request('text/markdown', 'HEAD', '/resume?from=nav');
		expect(negotiatedPath(req, url('/posts/nixos?preview=1'))).toBe('/posts/nixos.md?preview=1');
	});
});
