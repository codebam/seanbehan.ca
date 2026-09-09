/**
 * The robots.txt body.
 *
 * A route rather than a file in public/, because the `Sitemap:` directive has
 * to be absolute and the two variants are served from different origins — a
 * static file could only ever name one of them, and pointing codebam.ca's
 * robots at seanbehan.ca's sitemap is worse than omitting the line.
 *
 * The body is built here rather than in the route so it can be unit-tested:
 * it used to emit two separate `User-agent: *` groups, which RFC 9309 says to
 * merge but not every crawler does. One group per user-agent is the shape they
 * all agree on.
 */
import { site, absolute } from './site';

/** SEO scrapers and backlink crawlers: bandwidth out, nothing back. */
const BLOCKED = [
	'SemrushBot',
	'SemrushBot-SA',
	'AhrefsBot',
	'dotbot',
	'rogerbot',
	'BLEXBot',
	'AspiegelBot',
	'ZoominfoBot',
	'Yandex',
	'MJ12bot'
];

export function robotsTxt(): string {
	return `# ${site.name} — everything is crawlable by default; the blocks below are
# scrapers that cost bandwidth and send nothing back.
# The CMS is not content: its admin, API and preview routes have nothing a
# crawler should index and everything a crawler should stay out of.
User-agent: *
Allow: /
Disallow: /_emdash/

${BLOCKED.map((bot) => `User-agent: ${bot}\nDisallow: /`).join('\n')}

Sitemap: ${absolute('/sitemap.xml')}
`;
}
