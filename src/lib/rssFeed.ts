import { site } from './site';
import type { Post } from './types';

/**
 * Escape a string for safe interpolation into XML text or an attribute value.
 * Everything that is not wrapped in CDATA has to go through this, or a stray
 * ampersand in a tag, link or title breaks the feed.
 */
export function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

const RSS_PATH = '/rss.xml';

const SITE_URL = site.url;
const SITE_TITLE = site.name;
const SITE_DESCRIPTION = `${site.name}'s website and blog`;

export const RSS_URL = `${SITE_URL}${RSS_PATH}`;

/**
 * Build the whole RSS 2.0 document. `postHtml` maps a post's path (e.g.
 * `/posts/example`) to its rendered HTML, which becomes <content:encoded> so
 * readers show the full post rather than the one-line description.
 */
export function generateRSSFeed(posts: Post[], postHtml: Map<string, string>): string {
	return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
\t<channel>
\t\t<atom:link href="${escapeXml(RSS_URL)}" rel="self" type="application/rss+xml" />
\t\t<title>${escapeXml(SITE_TITLE)}</title>
\t\t<link>${escapeXml(SITE_URL)}</link>
\t\t<description>${escapeXml(SITE_DESCRIPTION)}</description>
\t\t<language>en-US</language>
\t\t<lastBuildDate>${escapeXml(new Date().toUTCString())}</lastBuildDate>
\t\t${posts.map((post) => generateRSSItem(post, postHtml.get(post.path))).join('\n')}
\t</channel>
</rss>`;
}

function generateRSSItem(post: Post, html: string | undefined): string {
	const url = `${SITE_URL}${post.path}`;
	const categories = (post.meta.tags ?? [])
		.map((tag) => `<category>${escapeXml(tag)}</category>`)
		.join('');
	return `<item>
\t\t<guid isPermaLink="true">${escapeXml(url)}</guid>
\t\t<title><![CDATA[${post.meta.title}]]></title>
\t\t${post.meta.description ? `<description><![CDATA[${post.meta.description}]]></description>` : ''}
\t\t<link>${escapeXml(url)}</link>
\t\t<pubDate>${escapeXml(new Date(post.meta.date).toUTCString())}</pubDate>
\t\t${categories}
\t\t${html ? `<content:encoded><![CDATA[${html}]]></content:encoded>` : ''}
\t</item>`;
}
