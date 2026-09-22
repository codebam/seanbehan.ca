/**
 * One social card per post, drawn on demand.
 *
 * Every post used to share the site's author photo as its og:image, so a link
 * to any of them looked identical in a timeline. A card carries the title,
 * which is the only thing that distinguishes one link from another.
 *
 * On the SvelteKit site these were PNGs a build script wrote from the markdown
 * frontmatter. The titles live in D1 now and can change without a deploy, so a
 * card generated at build time would be a picture of what a post used to be
 * called. It is rendered here instead — satori lays the text out from the two
 * font files we hand it and resvg rasterises the result, both as WASM the
 * Worker can run.
 *
 * Cards are only ever fetched by a scraper, which re-reads them when the page
 * changes rather than on a schedule, so the response is cached for a month.
 * There are two stores, and each needs its own policy to answer:
 *
 *  - The Worker's Cache API keeps the rendered PNG for the month. The route's
 *    `max-age` becomes the stored TTL and `X-Edge-Browser-Cache-Control` puts
 *    the browser-facing value back on a HIT; measured live, the second GET is
 *    `X-Edge-Cache: HIT`, so satori and resvg do not run again.
 *  - Cloudflare's zone cache only holds a Worker response for a path its Cache
 *    Rule marks eligible. The rule that shipped matched extensionless and
 *    .html paths only, so a card always reported `cf-cache-status: BYPASS` and
 *    every request still woke the Worker; a cold card's Cache API write is not
 *    visible to a request that arrives before it propagates either, so a
 *    scraper's immediate retry can render twice. tools/cloudflare/cache-rule.sh
 *    writes a host-scoped rule for `/og/<slug>.png` as well now; that takes
 *    effect when the zone rule is applied, not at deploy time.
 */

import type { APIRoute } from 'astro';
import { ImageResponse } from '@cf-wasm/og';
import { env } from 'cloudflare:workers';
import { getEmDashEntry } from 'emdash';
import { PRODUCT } from '../../lib/product';
import { featuredProjects } from '../../lib/projects';
import { site } from '../../lib/site';
import { displayTag } from '../../lib/tags';

const WIDTH = 1200;
const HEIGHT = 630;

// The light palette from app.css, and the values to change when it does. The
// cards are a fixed surface — a social preview has no reader theme to follow —
// so the light values are the values. ACCENT is the warm editorial token
// rather than the interactive blue: a card has nothing to click, and this is
// the one mark it makes about itself.
const BG = '#fffcf0';
const TEXT = '#100f0f';
const MUTED = '#6f6e69';
const ACCENT = '#bc5215';
const LINE = '#cecdc3';

/**
 * Long titles step down a size rather than wrapping into a fourth line, which
 * is where the card stops reading as a headline. The thresholds are character
 * counts because the card is one line of copy at a known width — measuring the
 * string properly would mean shaping it twice.
 */
const titleSize = (title: string) => (title.length > 68 ? 56 : title.length > 40 ? 68 : 82);

interface Card {
	title: string;
	tagLine: string;
	host: string;
}

const card = (post: Card) => ({
	type: 'div',
	props: {
		style: {
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			background: BG,
			padding: '68px 76px',
			borderTop: `6px solid ${ACCENT}`
		},
		children: [
			{
				type: 'div',
				props: {
					style: { display: 'flex', fontFamily: 'Inter', fontSize: 30, color: MUTED },
					children: site.name
				}
			},
			{
				type: 'div',
				props: {
					style: {
						display: 'flex',
						fontFamily: 'Newsreader',
						fontSize: titleSize(post.title),
						lineHeight: 1.16,
						color: TEXT,
						// Pixels, not `ch`: satori does not implement font-relative
						// lengths and silently resolves them to something far narrower,
						// which wrapped every title to two or three words a line.
						maxWidth: 940
					},
					children: post.title
				}
			},
			{
				type: 'div',
				props: {
					style: {
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						borderTop: `1px solid ${LINE}`,
						paddingTop: 26,
						fontFamily: 'Inter',
						fontSize: 26,
						color: MUTED
					},
					children: [
						{
							type: 'div',
							props: { style: { display: 'flex', color: ACCENT }, children: post.tagLine }
						},
						{ type: 'div', props: { style: { display: 'flex' }, children: post.host } }
					]
				}
			}
		]
	}
});

/**
 * Product and project pages are hand-written templates, not CMS entries, so
 * their cards come from the same static modules those pages render. The slug
 * is the URL segment the pages pass to `Base image=`, and deriving the title
 * here means a rename moves the card with it instead of leaving a stale
 * drawing behind.
 */
function staticCardPayload(slug: string, host: string): Card | undefined {
	if (slug === PRODUCT.id) {
		return {
			title: PRODUCT.name,
			tagLine: `Product · $${PRODUCT.price} ${PRODUCT.currency}`,
			host
		};
	}
	const project = featuredProjects.find((candidate) => candidate.slug === slug);
	if (!project) return undefined;
	return {
		title: project.title,
		tagLine: `${project.language} · ${project.since}`,
		host
	};
}

/**
 * Newsreader for the title, Inter for everything else — the site's own
 * pairing, but the static @fontsource cuts rather than the variable files the
 * site serves: satori reads the `fvar` table of a variable font wrong and
 * throws, and a card needs one weight of each face anyway. `.woff` rather than
 * `.woff2` because satori reads ttf, otf and woff.
 *
 * The title stays in the serif even though the site's headings are Inter now:
 * a card is a headline to be read, which is the job the serif still does on
 * the article body and the résumé, and there is no bold cut of Inter here to
 * set it in.
 */
async function fonts(origin: string) {
	/*
	 * Read through the ASSETS binding, not by fetching the site's own URL. A
	 * deployed Worker asking for its own hostname leaves the datacentre and comes
	 * back through the edge, which Cloudflare refuses as a subrequest loop — the
	 * cards worked in dev and 500'd in production for exactly that reason. The
	 * binding hands back the same file without a network hop.
	 *
	 * The binding comes from `cloudflare:workers` rather than
	 * `Astro.locals.runtime.env`, which Astro 6 removed.
	 */
	const load = async (file: string) => {
		const url = new URL(`/fonts/${file}`, origin);
		const res = await env.ASSETS.fetch(url);
		if (!res.ok) throw new Error(`og: ${file} is not being served (${res.status})`);
		return res.arrayBuffer();
	};

	const [inter, newsreader] = await Promise.all([
		load('og-inter.woff'),
		load('og-newsreader.woff')
	]);

	return [
		{ name: 'Inter', data: inter, weight: 400 as const, style: 'normal' as const },
		{ name: 'Newsreader', data: newsreader, weight: 400 as const, style: 'normal' as const }
	];
}

export const GET: APIRoute = async ({ params, url }) => {
	const slug = params.slug!;
	const host = site.url.replace(/^https?:\/\//, '');

	let payload: Card;

	// Product and project pages have no D1 entry to look up — they are static
	// templates — so they are answered before the database is touched. That is
	// what lets a card be generated on a cold Worker with no content around.
	const staticCard = staticCardPayload(slug, host);
	if (staticCard) {
		payload = staticCard;
	} else if (slug === 'site') {
		payload = { title: site.ogTitle, tagLine: site.ogDescription, host };
	} else {
		// Drafts get a card too: a draft is still reachable by URL, and a shared
		// link to one should look like the rest of the site.
		const { entry, cacheHint } = await getEmDashEntry('posts', slug);
		// The card is a rendering of the entry, so it belongs to the entry's
		// tags: a purge for that post should take its card with it.
		if (typeof Astro !== 'undefined' && Astro.cache?.enabled) Astro.cache.set(cacheHint);
		if (!entry?.data.title) return new Response('Not found', { status: 404 });

		const tags = ((entry.data.terms?.tag ?? []) as { slug: string }[])
			.slice(0, 3)
			.map((term) => displayTag(term.slug));

		payload = {
			title: entry.data.title,
			tagLine: tags.join(' · '),
			host
		};
	}

	return new ImageResponse(card(payload) as never, {
		width: WIDTH,
		height: HEIGHT,
		fonts: await fonts(url.origin),
		headers: { 'Cache-Control': 'public, max-age=2592000, s-maxage=2592000' }
	});
};
