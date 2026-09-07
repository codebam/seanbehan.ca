import { describe, expect, it } from 'vitest';
import { negotiatedPath, requestedFormat } from './accept';

const url = (path: string) => new URL(`https://seanbehan.ca${path}`);
const get = (accept?: string, method = 'GET') =>
	new Request(url('/posts/nixos'), {
		method,
		headers: accept === undefined ? {} : { Accept: accept }
	});

// The strings real clients send, taken from their own defaults rather than
// from imagination.
const BROWSER =
	'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
const CURL = '*/*';

describe('requestedFormat', () => {
	it('leaves browsers and wildcards with the page they expect', () => {
		expect(requestedFormat(BROWSER)).toBeNull();
		expect(requestedFormat(CURL)).toBeNull();
		expect(requestedFormat(null)).toBeNull();
	});

	it('honours a header that names the format it wants', () => {
		expect(requestedFormat('text/markdown')).toBe('md');
		expect(requestedFormat('application/json')).toBe('json');
		expect(requestedFormat('text/markdown, */*;q=0.8')).toBe('md');
	});

	it('stays with HTML when HTML outscores the claim', () => {
		expect(requestedFormat('text/html, text/markdown;q=0.5')).toBeNull();
		expect(requestedFormat('text/markdown;q=0.5, */*')).toBeNull();
	});

	it('reads q=0 as a refusal, not a preference', () => {
		expect(requestedFormat('text/markdown;q=0, text/html')).toBeNull();
		expect(requestedFormat('text/html;q=0, text/markdown')).toBe('md');
	});

	it('drops ties onto markdown, the richer ask of the two', () => {
		expect(requestedFormat('text/markdown, application/json')).toBe('md');
	});

	it('ignores malformed q values', () => {
		expect(requestedFormat('text/markdown;q=nonsense')).toBeNull();
		expect(requestedFormat('text/markdown;Q=0.9')).toBe('md');
	});
});

describe('negotiatedPath', () => {
	it('suffixes the content-page paths when asked', () => {
		expect(negotiatedPath(get('text/markdown'), url('/posts/nixos'))).toBe('/posts/nixos.md');
		expect(negotiatedPath(get('application/json'), url('/pages/about-site'))).toBe(
			'/pages/about-site.json'
		);
	});

	it('keeps the query string for the variant', () => {
		const request = new Request(new URL('/posts/nixos?_preview=t', 'https://seanbehan.ca'), {
			headers: { Accept: 'text/markdown' }
		});
		expect(negotiatedPath(request, request.url ? new URL(request.url) : url('/x'))).toBe(
			'/posts/nixos.md?_preview=t'
		);
	});

	it('negotiates only pages that have more than one answer', () => {
		const accept = get('text/markdown');
		expect(negotiatedPath(accept, url('/posts'))).toBeNull();
		expect(negotiatedPath(accept, url('/posts/tag/nixos'))).toBeNull();
		expect(negotiatedPath(accept, url('/about'))).toBeNull();
		expect(negotiatedPath(accept, url('/resume'))).toBeNull();
		expect(negotiatedPath(accept, url('/projects/viewport'))).toBeNull();
	});

	it('does not suffix a suffix', () => {
		expect(negotiatedPath(get('text/markdown'), url('/posts/nixos.md'))).toBeNull();
		expect(negotiatedPath(get('application/json'), url('/posts/nixos.json'))).toBeNull();
	});

	it('answers only safe methods', () => {
		expect(negotiatedPath(get('text/markdown', 'POST'), url('/posts/nixos'))).toBeNull();
	});

	it('stays silent when the header is silent', () => {
		expect(negotiatedPath(get(BROWSER), url('/posts/nixos'))).toBeNull();
		expect(negotiatedPath(get(), url('/posts/nixos'))).toBeNull();
	});
});
