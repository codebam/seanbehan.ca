import { describe, expect, it } from 'vitest';
import { absolute, site } from './site';

describe('absolute', () => {
	it('prefixes app paths with this origin', () => {
		expect(absolute('/posts/nixos')).toBe(`${site.url}/posts/nixos`);
		expect(absolute('posts/nixos')).toBe(`${site.url}/posts/nixos`);
	});

	it('never doubles the origin on already-absolute URLs', () => {
		expect(absolute('https://example.com/photo.png')).toBe('https://example.com/photo.png');
		expect(absolute('//cdn.example.com/photo.png')).toBe('//cdn.example.com/photo.png');
	});

	it('keeps data and mailto URLs intact', () => {
		// A body image stored as data:... became https://seanbehan.cadata:... in
		// the markdown and JSON exports before the scheme guard went in.
		expect(absolute('data:image/png;base64,AAAA')).toBe('data:image/png;base64,AAAA');
		expect(absolute('mailto:sean@seanbehan.ca')).toBe('mailto:sean@seanbehan.ca');
	});

	it('strips trailing slashes without losing the origin', () => {
		expect(absolute('/posts/')).toBe(`${site.url}/posts`);
		expect(absolute('/posts///')).toBe(`${site.url}/posts`);
		expect(absolute('/')).toBe(site.url);
	});

	it('leaves fragments and queries attached to the origin', () => {
		expect(absolute('#work')).toBe(`${site.url}#work`);
		expect(absolute('?q=rust')).toBe(`${site.url}?q=rust`);
	});
});
