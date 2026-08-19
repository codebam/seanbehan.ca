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

/**
 * Rewrite root-relative `src`/`href` in a post body to absolute URLs.
 *
 * A feed item is read somewhere else entirely — in a reader's own document, or
 * proxied through its server — so `/img/screenshot.webp` resolves against the
 * wrong origin or nothing at all, and the images simply did not appear. The
 * site's own pages want them relative, which is why this lives here and not in
 * the shared renderer.
 *
 * Protocol-relative (`//host/x`) is left alone: it is already absolute enough,
 * and prefixing the origin would corrupt it.
 */
export function absolutizeUrls(html: string, origin: string): string {
	return html.replace(/\b(src|href)="\/(?!\/)/g, `$1="${origin}/`);
}

const SITE_URL = site.url;
const SITE_TITLE = site.name;
const SITE_DESCRIPTION = `${site.name}'s website and blog`;

export const RSS_URL = `${SITE_URL}${RSS_PATH}`;

/** What tells one feed from another: the whole site, or a single tag. */
export interface FeedOptions {
	/** Path of this feed itself, for the atom self link. Defaults to /rss.xml. */
	path?: string;
	/** Channel title. Defaults to the site name. */
	title?: string;
	/** Channel description. Defaults to the site's own. */
	description?: string;
	/** Page the channel points at. Defaults to the site root. */
	link?: string;
}

/**
 * Build the whole RSS 2.0 document. `postHtml` maps a post's path (e.g.
 * `/posts/example`) to its rendered HTML, which becomes <content:encoded> so
 * readers show the full post rather than the one-line description.
 *
 * `options` is what the per-tag feeds vary: everything else about a topic feed
 * — the items, the escaping, the editor fields — is identical to the main one.
 */
export function generateRSSFeed(
	posts: Post[],
	postHtml: Map<string, string>,
	options: FeedOptions = {}
): string {
	const selfUrl = `${SITE_URL}${options.path ?? RSS_PATH}`;
	return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
\t<channel>
\t\t<atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />
\t\t<title>${escapeXml(options.title ?? SITE_TITLE)}</title>
\t\t<link>${escapeXml(options.link ? `${SITE_URL}${options.link}` : SITE_URL)}</link>
\t\t<description>${escapeXml(options.description ?? SITE_DESCRIPTION)}</description>
\t\t<language>en-US</language>
\t\t<!-- RSS wants an address here and readers show the name beside it. -->
\t\t<managingEditor>${escapeXml(`${site.email} (${site.name})`)}</managingEditor>
\t\t<webMaster>${escapeXml(`${site.email} (${site.name})`)}</webMaster>
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
\t\t${html ? `<content:encoded><![CDATA[${absolutizeUrls(html, SITE_URL)}]]></content:encoded>` : ''}
\t</item>`;
}
