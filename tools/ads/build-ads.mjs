/**
 * The display ads for both origins, and their billboard cut-downs.
 *
 * The `.svg` files are the source: drawn in the site's palette
 * (`src/styles/app.css`), set in its faces, and self-contained where a face
 * has to be embedded. The `.png` files beside them are exports for the slots
 * that will not take an SVG, and they are what this script writes.
 *
 * The codebam entries below must name their output file where it does not fit
 * the `<name>-<w>x<h>.png` convention: `codebam-websites-telegram-bots-500.png`
 * is a live placement, and renaming it would orphan the slot's copy.
 *
 *     node tools/ads/build-ads.mjs
 *
 * Each PNG is a window of a known size holding the SVG scaled to the window's
 * width, with the page background set to the ad's own ground. Two of the sizes
 * are the 2x exports of the same layout, and the 1600x720 board is the 3:1
 * board scaled to fit a 16:9 slot — the board's own proportions are kept and
 * the extra height is filled with the ground, so nothing is stretched.
 *
 * Re-ink the SVGs first when the palette moves; this only rasterises them.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../../public/img');

/** The SVG each PNG is rasterised from, the ground it sits on, and the sizes. */
const ads = [
	// The display ad slot: 800x360, displayed at about 400x180.
	{
		svg: 'seanbehan-ad-800x360.svg',
		name: 'seanbehan-ad',
		bg: '#ffffff',
		sizes: [
			[800, 360, 1],
			[800, 360, 2]
		]
	},
	{
		svg: 'seanbehan-ad-dark-800x360.svg',
		name: 'seanbehan-ad-dark',
		bg: '#0b0b0c',
		sizes: [
			[800, 360, 1],
			[800, 360, 2]
		]
	},

	// The billboard: 3:1 at 1x and 2x, the 800x360 cut-down of the same design,
	// and the 16:9 fit for a slot that will not take a 3:1 board.
	{
		svg: 'seanbehan-billboard-dark-2400x800.svg',
		name: 'seanbehan-billboard-dark',
		bg: '#0b0b0c',
		sizes: [
			[2400, 800, 1],
			[2400, 800, 2],
			[1600, 720, 1]
		]
	},
	{
		svg: 'seanbehan-billboard-dark-800x360.svg',
		name: 'seanbehan-billboard-dark',
		bg: '#0b0b0c',
		sizes: [[800, 360, 1]]
	},

	// codebam.ca is the commercial origin, so its ads sell the work rather
	// than the person. They are dark-ground creatives and take the dark
	// scheme's token values — the same names as the seanbehan pair, resolved
	// against `prefers-color-scheme` in the page and against the dark values
	// here because the ground never changes.
	{
		svg: 'codebam-services-ad-500x250.svg',
		name: 'codebam-services-ad',
		bg: '#0b0b0c',
		sizes: [[500, 250, 1]]
	},
	{
		svg: 'codebam-websites-telegram-bots-500.svg',
		name: 'codebam-websites-telegram-bots',
		bg: '#0b0b0c',
		sizes: [[500, 500, 1, 'codebam-websites-telegram-bots-500.png']]
	}

	/*
	 * Three live codebam placements are intentionally absent from this list:
	 * codebam-ad-1200x628.png, codebam-ad-500x250.png and
	 * codebam-ad-900x471.png. They have no vector source in this repo's history,
	 * so they were re-inked in place at the raster level: their colours are
	 * token values now, but they cannot be regenerated. `node
	 * tools/ads/build-ads.mjs` must not overwrite them until an SVG source for
	 * each is authored; add the entry here when it is and remove its line from
	 * this comment.
	 */
];

const frame = join(here, '.frame.html');

for (const ad of ads) {
	const source = join(out, ad.svg);
	if (!existsSync(source)) throw new Error(`ads: ${ad.svg} is missing`);

	// The wrapper exists so the ground can be filled: a 3:1 board in a 16:9
	// window leaves a band at the foot of the frame, and an SVG document
	// loaded directly paints that band transparent. The source is an absolute
	// `file://` URL because the wrapper is written beside this script, not
	// beside the SVG — a relative `src` silently renders an empty frame.
	writeFileSync(
		frame,
		`<!doctype html><meta charset=utf-8><style>
html,body{margin:0;padding:0;background:${ad.bg}}
img{display:block;width:100vw;height:auto}
</style><img src="file://${source}">`
	);

	for (const [w, h, scale, file] of ad.sizes) {
		// `file` is only set where the live placement already has a name the
		// convention would not produce; leave it off everywhere else.
		const name = file ?? `${ad.name}-${w * scale}x${h * scale}.png`;
		execFileSync(
			'chromium',
			[
				'--headless',
				'--disable-gpu',
				'--hide-scrollbars',
				// The wrapper's <img> is a file:// subresource, and --screenshot can
				// fire before it paints — the re-inked codebam ads first came out as
				// empty grounds without this wait.
				'--virtual-time-budget=3000',
				`--force-device-scale-factor=${scale}`,
				`--window-size=${w},${h}`,
				`--screenshot=${join(out, name)}`,
				`file://${frame}`
			],
			{ stdio: 'pipe' }
		);
		console.log(name);
	}
}

rmSync(frame, { force: true });
