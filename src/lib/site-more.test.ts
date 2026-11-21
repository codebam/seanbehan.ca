import { describe, expect, it } from 'vitest';
import { SITES } from './site.data.js';
import { HANDLE, LEGAL_NAME, LINKEDIN_URL, absolute, sibling } from './site';

// site.test.ts pins the canonical/href helpers and the two variants' copy.
// These are the remaining pure exports: URL absolutising, the sibling pick,
// and the identity constants the chrome quotes verbatim. The default build
// has no PUBLIC_SITE, so `site` is the seanbehan variant and its origin is the
// one `absolute` prefixes below.
describe('absolute', () => {
	it('leaves URLs that already carry a scheme untouched', () => {
		expect(absolute('https://github.com/codebam')).toBe('https://github.com/codebam');
		expect(absolute('mailto:sean@seanbehan.ca')).toBe('mailto:sean@seanbehan.ca');
	});

	it('does not corrupt a data URL with the site origin', () => {
		// A body image written this way used to come out as
		// https://seanbehan.cadata:image/png;… in the markdown and JSON exports.
		const image = 'data:image/png;base64,iVBORw0KGgo=';
		expect(absolute(image)).toBe(image);
	});

	it('leaves protocol-relative URLs alone', () => {
		expect(absolute('//cdn.example.com/image.png')).toBe('//cdn.example.com/image.png');
	});

	it('prefixes the site origin to a rooted path', () => {
		expect(absolute('/posts/nixos')).toBe(`${SITES.seanbehan.url}/posts/nixos`);
	});

	it('adds the missing leading slash to a relative path', () => {
		expect(absolute('posts/nixos')).toBe(`${SITES.seanbehan.url}/posts/nixos`);
	});

	it('keeps a fragment or query attached to the origin', () => {
		expect(absolute('#work')).toBe(`${SITES.seanbehan.url}#work`);
		expect(absolute('?ref=rss')).toBe(`${SITES.seanbehan.url}?ref=rss`);
	});

	it('resolves the bare root to the origin with no trailing slash', () => {
		expect(absolute('/')).toBe(SITES.seanbehan.url);
	});

	it('strips trailing slashes from app paths', () => {
		expect(absolute('/posts/')).toBe(`${SITES.seanbehan.url}/posts`);
		expect(absolute('/posts///')).toBe(`${SITES.seanbehan.url}/posts`);
	});
});

describe('sibling', () => {
	it('points the seanbehan build at the handle origin', () => {
		expect(sibling).toBe(SITES.codebam);
		expect(sibling.id).toBe('codebam');
		expect(sibling.url).toBe('https://codebam.ca');
	});
});

describe('identity constants', () => {
	it('quotes the legal name, handle and profile URL verbatim', () => {
		expect(LEGAL_NAME).toBe('Sean Behan');
		expect(HANDLE).toBe('codebam');
		expect(LINKEDIN_URL).toBe('https://www.linkedin.com/in/sean-behan');
	});
});
