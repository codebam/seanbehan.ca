import { describe, expect, it } from 'vitest';
import { isNegotiablePath, negotiatedPath, requestedFormat } from './accept';

const url = (path: string) => new URL(`https://seanbehan.ca${path}`);
const withAccept = (accept: string, method = 'GET') =>
	new Request(url('/posts/nixos'), { method, headers: { Accept: accept } });

describe('requestedFormat — parsing edges', () => {
	it('rejects q values outside 0..1 rather than clamping them', () => {
		expect(requestedFormat('text/markdown;q=1.5, text/html;q=0.2')).toBeNull();
		expect(requestedFormat('text/markdown;q=-1, text/html;q=0.2')).toBeNull();
	});

	it('reads media types and q parameter names without case', () => {
		expect(requestedFormat('TEXT/MARKDOWN; Q=0.9')).toBe('md');
		expect(requestedFormat('APPLICATION/JSON; q=0.9')).toBe('json');
	});

	it('lets the last repeated q parameter win', () => {
		expect(requestedFormat('text/markdown;q=0.4;q=0.9, text/html;q=0.5')).toBe('md');
	});

	it('ignores empty tokens in the header', () => {
		expect(requestedFormat(',text/markdown,,')).toBe('md');
	});

	it('picks JSON when it strictly beats both markdown and HTML', () => {
		expect(requestedFormat('application/json;q=1, text/markdown;q=0.5, text/html;q=0.2')).toBe(
			'json'
		);
	});

	it('gives markdown the tie against JSON', () => {
		expect(requestedFormat('text/markdown;q=0.5, application/json;q=0.5, text/html;q=0.2')).toBe(
			'md'
		);
	});

	it('does not count a covering text range as a markdown claim', () => {
		expect(requestedFormat('text/*;q=0.9, application/json;q=0.5')).toBeNull();
	});
});

describe('isNegotiablePath — exact path shapes', () => {
	it('reads a slug segment literally, so callers must pass a pathname', () => {
		// The regex only excludes slashes: a query reads as part of the slug.
		expect(isNegotiablePath('/posts/nixos?x=1')).toBe(true);
		expect(isNegotiablePath('/posts/nixos/')).toBe(false);
	});

	it('matches the résumé only as an exact set member', () => {
		expect(isNegotiablePath('/resume')).toBe(true);
		expect(isNegotiablePath('/resume?x=1')).toBe(false);
	});

	it('does not lowercase the collection or uppercase the slug segment', () => {
		expect(isNegotiablePath('/posts/NixOS')).toBe(true);
		expect(isNegotiablePath('/POSTS/nixos')).toBe(false);
	});
});

describe('negotiatedPath — remaining method and suffix edges', () => {
	it('rewrites HEAD as well as GET', () => {
		expect(negotiatedPath(withAccept('text/markdown', 'HEAD'), url('/posts/nixos'))).toBe(
			'/posts/nixos.md'
		);
	});

	it('treats an uppercase suffix as already a variant', () => {
		expect(negotiatedPath(withAccept('text/markdown'), url('/posts/nixos.MD'))).toBeNull();
	});

	it('leaves a trailing-slash path untouched', () => {
		expect(negotiatedPath(withAccept('text/markdown'), url('/posts/nixos/'))).toBeNull();
	});

	it('keeps the query on both a page variant and the résumé variant', () => {
		expect(negotiatedPath(withAccept('application/json'), url('/pages/about-site?preview=1'))).toBe(
			'/pages/about-site.json?preview=1'
		);
		expect(negotiatedPath(withAccept('text/markdown'), url('/resume?preview=1'))).toBe(
			'/resume.md?preview=1'
		);
	});

	it('stays on HTML when a stronger HTML claim outranks the format', () => {
		expect(
			negotiatedPath(withAccept('text/markdown;q=0.5, text/html;q=0.9'), url('/posts/nixos'))
		).toBeNull();
	});
});
