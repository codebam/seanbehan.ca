import { describe, expect, it } from 'vitest';
import { absolutizeUrls, escapeCdata, escapeXml } from './rssFeed';

// rssFeed.test.ts checks each helper on one combined input and exercises them
// through the feed. These cases pin the parts that a single combined string
// cannot isolate: which character becomes which entity, what CDATA leaves
// literal, and how srcset treats a list that mixes absolute and local URLs.

describe('escapeXml — one special character at a time', () => {
	it.each([
		['&', '&amp;'],
		['<', '&lt;'],
		['>', '&gt;'],
		['"', '&quot;'],
		["'", '&apos;']
	])('escapes %j on its own', (value, expected) => {
		expect(escapeXml(value)).toBe(expected);
	});

	it('leaves text with no XML-special characters untouched', () => {
		expect(escapeXml('A plain title — no entities here')).toBe('A plain title — no entities here');
	});

	it('escapes an already-written entity again', () => {
		expect(escapeXml('Rock &amp; Roll')).toBe('Rock &amp;amp; Roll');
	});

	it('returns an empty string unchanged', () => {
		expect(escapeXml('')).toBe('');
	});
});

describe('escapeCdata — inputs the feed test does not produce', () => {
	it('leaves entity-looking text literal inside CDATA', () => {
		const value = '& < > " \' &amp;';

		expect(escapeCdata(value)).toBe(value);
	});

	it('splits every terminator, not just the first', () => {
		expect(escapeCdata('a]]>b]]>c')).toBe('a]]]]><![CDATA[>b]]]]><![CDATA[>c');
	});

	it('handles a value that is only a terminator', () => {
		expect(escapeCdata(']]>')).toBe(']]]]><![CDATA[>');
	});

	it('returns an empty string unchanged', () => {
		expect(escapeCdata('')).toBe('');
	});
});

describe('absolutizeUrls — srcset cases the feed test does not cover', () => {
	it('prefixes only the root-relative entries in a mixed srcset', () => {
		const html = '<img srcset="https://cdn.example/a.webp 1x, /img/b.webp 2x"/>';

		expect(absolutizeUrls(html, 'https://seanbehan.ca')).toBe(
			'<img srcset="https://cdn.example/a.webp 1x, https://seanbehan.ca/img/b.webp 2x"/>'
		);
	});

	it('prefixes a lone root-relative srcset entry with a width descriptor', () => {
		expect(absolutizeUrls('<source srcset="/img/wide.webp 960w"/>', 'https://seanbehan.ca')).toBe(
			'<source srcset="https://seanbehan.ca/img/wide.webp 960w"/>'
		);
	});
});
