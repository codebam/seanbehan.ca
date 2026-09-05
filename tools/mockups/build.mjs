/**
 * The Selected work mockups.
 *
 * Every row on the home page carries a 1600x1000 picture of the product. These
 * are drawn as HTML rather than screenshotted from the live thing: a running
 * service changes without asking, and a photograph of it would be a picture of
 * what it used to be. frame.css is the shared surround — the grid, the ordinal,
 * the stack, the bordered surface — and a page adds only what goes inside it.
 *
 * The ordinals in the pages are the row order in src/lib/projects.ts, so adding
 * a project means redrawing the numbers on the rows below it. That is the cost
 * of baking them into the picture; the alternative was a caption that could
 * disagree with the row it labels.
 *
 * Chromium writes WebP when the screenshot file ends in .webp, so nothing else
 * needs to be installed to regenerate the set.
 *
 *     node tools/mockups/build.mjs
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../../public/img');

/** Page file → image name in public/img, in the order the rows appear. */
const pages = [
	['stream.html', 'project-stream.webp'],
	['viewport.html', 'project-viewport.webp'],
	['telegram-sdk.html', 'project-telegram-sdk.webp'],
	['tux.html', 'project-tux.webp'],
	['pastebin.html', 'project-pastebin.webp']
];

for (const [page, image] of pages) {
	const source = join(here, page);
	if (!existsSync(source)) throw new Error(`mockups: ${page} is missing`);

	execFileSync(
		'chromium',
		[
			'--headless',
			'--disable-gpu',
			'--hide-scrollbars',
			'--window-size=1600,1000',
			`--screenshot=${join(out, image)}`,
			`file://${source}`
		],
		{ stdio: 'pipe' }
	);

	console.log(image);
}
