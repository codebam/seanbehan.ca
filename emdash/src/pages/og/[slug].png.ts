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
 * changes rather than on a schedule, so the response is cached for a month and
 * kept in the Worker's own cache between renders.
 */

import type { APIRoute } from 'astro';
import { ImageResponse } from '@cf-wasm/og';
import { getEmDashEntry } from 'emdash';
import { site } from '../../lib/site';
import { displayTag } from '../../lib/tags';

const WIDTH = 1200;
const HEIGHT = 630;

// The light palette from app.css. The cards are a fixed surface — a social
// preview has no reader theme to follow — so the light values are the values.
const BG = '#faf8f4';
const TEXT = '#17181a';
const MUTED = '#6c6a66';
const ACCENT = '#a8391f';
const LINE = '#e3ded4';

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
			borderTop: `14px solid ${ACCENT}`
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
						borderTop: `2px solid ${LINE}`,
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
 * Newsreader for the title, Inter for everything else — the site's own
 * pairing, but the static @fontsource cuts rather than the variable files the
 * site serves: satori reads the `fvar` table of a variable font wrong and
 * throws, and a card needs one weight of each face anyway. `.woff` rather than
 * `.woff2` because satori reads ttf, otf and woff.
 */
async function fonts(origin: string) {
	const load = async (file: string) => {
		const res = await fetch(new URL(`/fonts/${file}`, origin));
		if (!res.ok) throw new Error(`og: ${file} is not being served (${res.status})`);
		return new Uint8Array(await res.arrayBuffer());
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

	if (slug === 'site') {
		payload = { title: site.ogTitle, tagLine: site.ogDescription, host };
	} else {
		// Drafts get a card too: a draft is still reachable by URL, and a shared
		// link to one should look like the rest of the site.
		const { entry } = await getEmDashEntry('posts', slug);
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
		headers: { 'Cache-Control': 'public, max-age=2592000' }
	});
};
