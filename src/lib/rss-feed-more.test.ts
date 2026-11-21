import { describe, expect, it } from 'vitest';
import { generateRSSFeed } from './rssFeed';
import type { PostSummary } from './types';

const makePost = (path: string, title: string): PostSummary => ({
	path,
	slug: path.split('/').pop() ?? '',
	meta: {
		title,
		date: '2026-01-01',
		draft: false,
		tags: []
	}
});

describe('generateRSSFeed item shape', () => {
	it('emits one <item> per post in the feed', () => {
		const feed = generateRSSFeed(
			[makePost('/posts/one', 'One'), makePost('/posts/two', 'Two')],
			new Map()
		);

		expect(feed.match(/<item>/g)).toHaveLength(2);
		expect(feed.match(/<\/item>/g)).toHaveLength(2);
	});

	it('wraps the item title in CDATA, keeping ampersands literal, and links to the post', () => {
		const feed = generateRSSFeed([makePost('/posts/one', 'Cats & Dogs')], new Map());

		// Inside CDATA the editor's ampersand is literal text, unlike the
		// channel fields that go through escapeXml.
		expect(feed).toContain('<title><![CDATA[Cats & Dogs]]></title>');
		expect(feed).toContain('<link>https://seanbehan.ca/posts/one</link>');
	});
});
