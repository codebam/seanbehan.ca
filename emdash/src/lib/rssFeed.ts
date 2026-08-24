import { site } from './site';
import type { PostSummary } from './types';

/**
 * Escape a string for safe interpolation into XML text or an attribute value.
 * Everything that is not wrapped in CDATA has to go through this, or a stray
 * ampersand in a tag, link or title breaks the feed.
 */
export function escapeXml(value: string): string {
	return value
		.replace(/&/g, '\u0026amp;')
		.replace(/</g, '\u0026lt;')
		.replace(/>/g, '\u0026gt;')
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
	posts: PostSummary[],
	postHtml: Map<string, string>,
	options: FeedOptions = {}
): string {
	const selfUrl = `${SITE_URL}${options.path ?? RSS_PATH}`;
	return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />
		<title>${escapeXml(options.title ?? SITE_TITLE)}</title>
		<link>${escapeXml(options.link ? `${SITE_URL}${options.link}` : SITE_URL)}</link>
		<description>${escapeXml(options.description ?? SITE_DESCRIPTION)}</description>
		<language>en-CA</language>
		<!-- RSS wants an address here and readers show the name beside it. -->
		<managingEditor>${escapeXml(`${site.email} (${site.name})`)}</managingEditor>
		<webMaster>${escapeXml(`${site.email} (${site.name})`)}</webMaster>
		<lastBuildDate>${escapeXml(new Date().toUTCString())}</lastBuildDate>
		${posts.map((post) => generateRSSItem(post, postHtml.get(post.path))).join('\n')}
	</channel>
</rss>`;
}

function generateRSSItem(post: PostSummary, html: string | undefined): string {
	const url = `${SITE_URL}${post.path}`;
	const categories = post.meta.tags
		.map((tag) => `<category>${escapeXml(tag)}</category>`)
		.join('');
	return `<item>
		<guid isPermaLink="true">${escapeXml(url)}</guid>
		<title><![CDATA[${post.meta.title}]]></title>
		${post.meta.description ? `<description><![CDATA[${post.meta.description}]]></description>` : ''}
		<link>${escapeXml(url)}</link>
		<pubDate>${escapeXml(new Date(post.meta.date).toUTCString())}</pubDate>
		${categories}
		${html ? `<content:encoded><![CDATA[${absolutizeUrls(html, SITE_URL)}]]></content:encoded>` : ''}
	</item>`;
}
