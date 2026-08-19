#!/usr/bin/env node
/**
 * Record the pixel size of every image a post can embed, into
 * src/lib/imageSizes.json.
 *
 * Markdown has no syntax for image dimensions, so post bodies rendered to
 * `<img src alt>` and nothing else: the browser learns the size only once the
 * bytes arrive, and everything below the image jumps when they do. The
 * renderer stamps width and height from this file instead.
 *
 * The file is committed rather than gitignored — unlike the social cards, it is
 * a handful of numbers that only change when an image is added or replaced, and
 * committing it keeps `npm run check` working on a fresh clone. `npm run build`
 * regenerates it, so a stale entry shows up as a diff.
 */
import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const IMG_DIR = 'static/img';
const OUT = 'src/lib/imageSizes.json';

const sizes = {};

for (const name of (await readdir(IMG_DIR)).sort()) {
	try {
		const { width, height } = await sharp(join(IMG_DIR, name)).metadata();
		if (width && height) sizes[`/img/${name}`] = { width, height };
	} catch {
		// Not an image, or one sharp cannot read: the renderer simply omits the
		// attributes for it, which is where this started.
	}
}

await writeFile(OUT, `${JSON.stringify(sizes, null, '\t')}\n`);
console.log(`img: measured ${Object.keys(sizes).length} images into ${OUT}`);
