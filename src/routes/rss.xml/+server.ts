import getPosts from '$lib/getPosts';
import type { Post } from '$lib/types';

export const prerender = true;

const SITE_URL = 'https://seanbehan.ca';
const SITE_TITLE = 'Sean Behan';
const SITE_DESCRIPTION = "Sean Behan's website and blog";

export const GET = async () => {
	const posts = await getPosts();
	const body = generateRSSFeed(posts);
	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};

function generateRSSFeed(posts: Post[]): string {
	return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml" />
		<title>${SITE_TITLE}</title>
		<link>${SITE_URL}</link>
		<description>${SITE_DESCRIPTION}</description>
		<language>en-US</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		${posts.map((post) => generateRSSItem(post)).join('\n')}
	</channel>
</rss>`;
}

function generateRSSItem(post: Post): string {
	return `<item>
		<guid isPermaLink="true">${SITE_URL}${post.path}</guid>
		<title><![CDATA[${post.meta.title}]]></title>
		<link>${SITE_URL}${post.path}</link>
		<pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
		${post.meta.tags ? `<category>${post.meta.tags.join('</category><category>')}</category>` : ''}
	</item>`;
}
