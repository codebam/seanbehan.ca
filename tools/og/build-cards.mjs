#!/usr/bin/env node
/**
 * Draw one social card per post, into static/og.
 *
 * Every post used to share the site's author photo as its og:image, so a link
 * to any of them looked identical in a timeline. A card carries the title,
 * which is the only thing that distinguishes one link from another.
 *
 * The cards are generated rather than committed, and static/og is gitignored:
 * they are derived from the post frontmatter and the site config, so a title
 * edit should not need a binary committed alongside it. That means this has to
 * run everywhere the site is built, including CI, so it can depend on nothing
 * but node_modules — satori lays the text out from font buffers we hand it (no
 * system fonts) and sharp rasterizes the SVG it returns.
 */
import { mkdir, readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { siteFor } from '../../src/lib/site.data.js';

const POSTS_DIR = 'src/routes/posts';
const OUT_DIR = 'static/og';
const WIDTH = 1200;
const HEIGHT = 630;

// The light palette from app.css. The cards are a fixed surface — a social
// preview has no reader theme to follow — so the light values are the values.
const BG = '#faf8f4';
const TEXT = '#17181a';
const MUTED = '#6c6a66';
const ACCENT = '#a8391f';
const LINE = '#e3ded4';

const site = siteFor(process.env.PUBLIC_SITE);

/**
 * Frontmatter, read with a regex rather than a YAML parser: the posts use four
 * scalar keys and one list, all written the same way, and a parser is a
 * dependency for the sake of it. Anything unrecognised is simply not read.
 */
function frontmatter(source) {
	const block = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!block) return null;

	const scalar = (key) => {
		const match = block[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
		if (!match) return undefined;
		return match[1].trim().replace(/^['"]|['"]$/g, '');
	};

	const tags = [...block[1].matchAll(/^\s+-\s+(.+)$/gm)].map((m) => m[1].trim());

	return {
		title: scalar('title'),
		date: scalar('date'),
		image: scalar('image'),
		draft: scalar('draft') === 'true',
		tags
	};
}

/**
 * Newsreader for the title, Inter for everything else — the site's own
 * pairing, but from the static @fontsource packages rather than the variable
 * files the site serves: satori's font parser reads the `fvar` table of a
 * variable font wrong and throws, and a card needs one weight of each face
 * anyway. `.woff` rather than `.woff2` because satori reads ttf, otf and woff.
 */
const FILES = {
	Newsreader: 'node_modules/@fontsource/newsreader/files/newsreader-latin-400-normal.woff',
	Inter: 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'
};

const loadFonts = async () =>
	Promise.all(
		Object.entries(FILES).map(async ([name, file]) => ({
			name,
			data: await readFile(file),
			weight: 400,
			style: 'normal'
		}))
	);

/**
 * Long titles step down a size rather than wrapping into a fourth line, which
 * is where the card stops reading as a headline. The thresholds are character
 * counts because the card is one line of copy at a known width — measuring the
 * string properly would mean shaping it twice.
 */
const titleSize = (title) => (title.length > 68 ? 56 : title.length > 40 ? 68 : 82);

const card = (post) => ({
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
						{
							type: 'div',
							props: { style: { display: 'flex' }, children: post.host }
						}
					]
				}
			}
		]
	}
});

const fonts = await loadFonts();
await mkdir(OUT_DIR, { recursive: true });

const sources = (await readdir(POSTS_DIR)).filter((name) => name.endsWith('.md'));
let written = 0;

for (const name of sources) {
	const slug = basename(name, '.md');
	const meta = frontmatter(await readFile(join(POSTS_DIR, name), 'utf8'));

	// A draft is still reachable by URL, so it still gets a card; a post with
	// no title cannot be rendered and is already skipped by the post list.
	if (!meta?.title) {
		console.warn(`og: skipping ${name} — no title in frontmatter`);
		continue;
	}
	// A post that names its own image opts out of the generated one.
	if (meta.image) continue;

	const svg = await satori(
		card({
			title: meta.title,
			tagLine: meta.tags.slice(0, 3).join(' · '),
			host: site.url.replace(/^https?:\/\//, '')
		}),
		{ width: WIDTH, height: HEIGHT, fonts }
	);

	await sharp(Buffer.from(svg))
		.png({ compressionLevel: 9 })
		.toFile(join(OUT_DIR, `${slug}.png`));
	written++;
}

console.log(`og: wrote ${written} card${written === 1 ? '' : 's'} to ${OUT_DIR}`);
