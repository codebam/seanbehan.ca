import { describe, expect, it } from 'vitest';
import { isNegotiablePath, negotiatedPath, requestedFormat } from './accept';

const url = (path: string) => new URL(`https://seanbehan.ca${path}`);
const requestFor = (path: string, accept: string, method = 'GET') =>
	new Request(url(path), { method, headers: { Accept: accept } });

describe('requestedFormat — precedence edges', () => {
	it('lets a text/* wildcard hold HTML above a weaker claim', () => {
		expect(requestedFormat('text/*, text/markdown;q=0.5')).toBeNull();
		expect(requestedFormat('text/*;q=0.9, application/json;q=0.5')).toBeNull();
	});

	it('honours JSON when it outranks both HTML and markdown', () => {
		expect(requestedFormat('application/json, */*;q=0.8')).toBe('json');
		expect(requestedFormat('application/json;q=0.9, text/markdown;q=0.8')).toBe('json');
	});

	it('takes the highest q among repeated ranges of one type', () => {
		expect(requestedFormat('text/markdown;q=0.2, text/markdown;q=0.9, */*;q=0.5')).toBe('md');
	});

	it('normalizes type case and surrounding whitespace', () => {
		expect(requestedFormat('  TEXT/MARKDOWN ; q=0.9  ')).toBe('md');
	});

	it('rejects q values outside the 0..1 range', () => {
		expect(requestedFormat('text/markdown;q=1.5')).toBeNull();
		expect(requestedFormat('text/markdown;q=-0.2, text/html')).toBeNull();
	});

	it('treats an empty or comma-only header as no preference', () => {
		expect(requestedFormat('')).toBeNull();
		expect(requestedFormat(', ,')).toBeNull();
	});
});

describe('isNegotiablePath — more paths', () => {
	it('accepts other slugs in the two content collections', () => {
		expect(isNegotiablePath('/posts/some-post')).toBe(true);
		expect(isNegotiablePath('/pages/pricing-2024')).toBe(true);
	});

	it('rejects nested or empty detail slugs', () => {
		expect(isNegotiablePath('/posts/foo/bar')).toBe(false);
		expect(isNegotiablePath('/pages/foo/bar')).toBe(false);
		expect(isNegotiablePath('/posts/')).toBe(false);
	});

	it('is case-sensitive for paths but not for variant suffixes', () => {
		expect(isNegotiablePath('/Posts/nixos')).toBe(false);
		expect(isNegotiablePath('/posts/nixos.MD')).toBe(false);
		expect(isNegotiablePath('/posts/nixos.JSON')).toBe(false);
		expect(isNegotiablePath('/resume.json')).toBe(false);
	});
});

describe('negotiatedPath — remaining edges', () => {
	it('negotiates for HEAD as well as GET', () => {
		expect(
			negotiatedPath(requestFor('/posts/nixos', 'text/markdown', 'HEAD'), url('/posts/nixos'))
		).toBe('/posts/nixos.md');
	});

	it('leaves non-negotiable paths alone even when a format is asked for', () => {
		expect(negotiatedPath(requestFor('/', 'text/markdown'), url('/'))).toBeNull();
		expect(negotiatedPath(requestFor('/pages', 'application/json'), url('/pages'))).toBeNull();
		expect(
			negotiatedPath(requestFor('/posts/foo/bar', 'text/markdown'), url('/posts/foo/bar'))
		).toBeNull();
	});

	it('does not suffix an existing variant of any case, query included', () => {
		expect(
			negotiatedPath(requestFor('/posts/nixos.MD?x=1', 'text/markdown'), url('/posts/nixos.MD?x=1'))
		).toBeNull();
	});

	it('sends JSON to a multi-format page but never to the resume', () => {
		const accept = 'application/json, */*;q=0.8';
		expect(negotiatedPath(requestFor('/pages/about-site', accept), url('/pages/about-site'))).toBe(
			'/pages/about-site.json'
		);
		expect(negotiatedPath(requestFor('/resume', accept), url('/resume'))).toBeNull();
	});
});
