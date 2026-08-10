import { describe, it, expect } from 'vitest';
import { generateRSSFeed, escapeXml, RSS_URL } from './rssFeed';
import type { Post } from './types';

// A representative post; its tags deliberately carry the two characters that
// would break the feed if they were interpolated unescaped.
const post: Post = {
	path: '/posts/example',
	meta: {
		title: 'Example Post',
		date: '2026-01-01',
		draft: false,
		description: 'A short description.',
		tags: ['Rock & Roll', 'a<b']
	},
	readingMinutes: 3
};

describe('escapeXml', () => {
	it('escapes the five XML-special characters', () => {
		expect(escapeXml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;');
	});
});

describe('generateRSSFeed', () => {
	it('points the atom self link at the real /rss.xml route', () => {
		const feed = generateRSSFeed([post], new Map());
		expect(feed).toContain('href="https://seanbehan.ca/rss.xml"');
		expect(feed).not.toContain('/rss"');
		expect(RSS_URL).toBe('https://seanbehan.ca/rss.xml');
	});

	it('escapes XML-special characters in tags', () => {
		const feed = generateRSSFeed([post], new Map());
		expect(feed).toContain('<category>Rock &amp; Roll</category>');
		expect(feed).toContain('<category>a&lt;b</category>');
		expect(feed).not.toContain('<category>Rock & Roll</category>');
		expect(feed).not.toContain('<category>a<b</category>');
	});

	it('emits one <category> element per tag', () => {
		const feed = generateRSSFeed([post], new Map());
		const matches = feed.match(/<category>/g);
		expect(matches).toHaveLength(2);
	});

	it('includes a non-empty <content:encoded> with the rendered html', () => {
		const feed = generateRSSFeed([post], new Map([['/posts/example', '<p>Full body</p>']]));
		expect(feed).toContain('<content:encoded><![CDATA[<p>Full body</p>]]></content:encoded>');
	});

	it('declares the content namespace on <rss>', () => {
		const feed = generateRSSFeed([], new Map());
		expect(feed).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
	});
});
