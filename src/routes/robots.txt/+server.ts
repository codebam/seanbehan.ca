import { site, absolute } from '$lib/site';

export const prerender = true;

/**
 * A route rather than a file in static/, because the `Sitemap:` directive has
 * to be absolute and the two variants are served from different origins — a
 * static file could only ever name one of them, and pointing codebam.ca's
 * robots at seanbehan.ca's sitemap is worse than omitting the line.
 */

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

const body = `# ${site.name} — everything is crawlable by default; the blocks below are
# scrapers that cost bandwidth and send nothing back.
User-agent: *
Allow: /

${BLOCKED.map((bot) => `User-agent: ${bot}\nDisallow: /`).join('\n')}

Sitemap: ${absolute('/sitemap.xml')}
`;

export const GET = async () =>
	new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
