/**
 * The Selected work mockups.
 *
 * Every row on the home page carries a 1600x1000 picture of the product. Four
 * are drawn as HTML rather than screenshotted from the live thing: a running
 * service changes without asking, and a photograph of it would be a picture of
 * what it used to be. frame.css supplies only a reset; each page owns its
 * palette and composition so the projects stay distinguishable at card size.
 *
 * Viewport is the exception: its asset is a real capture of the compositor
 * running nested at 1600x1000. It is deliberately absent from this generator so
 * a mockup rebuild cannot replace the photograph with an illustration.
 *
 * Chromium writes WebP when the screenshot file ends in .webp, so nothing else
 * needs to be installed to regenerate the HTML illustrations.
 *
 *     node tools/mockups/build.mjs
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../../src/assets/projects');

/** Page file → image name in src/assets/projects, in the order the rows appear. */
const pages = [
	['matrix.html', 'project-matrix.webp'],
	['telegram-sdk.html', 'project-telegram-sdk.webp'],
	['tux.html', 'project-tux.webp'],
	['pastebin.html', 'project-pastebin.webp']
];

mkdirSync(out, { recursive: true });

for (const [page, image] of pages) {
	const source = join(here, page);
	if (!existsSync(source)) throw new Error(`mockups: ${page} is missing`);

	execFileSync(
		'chromium',
		[
			'--headless',
			'--disable-gpu',
			'--hide-scrollbars',
			'--force-device-scale-factor=1',
			'--run-all-compositor-stages-before-draw',
			'--virtual-time-budget=1000',
			'--window-size=1600,1000',
			`--screenshot=${join(out, image)}`,
			`file://${source}`
		],
		{ stdio: 'pipe' }
	);

	console.log(image);
}
