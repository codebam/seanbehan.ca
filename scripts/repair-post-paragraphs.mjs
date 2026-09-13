#!/usr/bin/env node
/**
 * Repair the damage the first markdown import did to paragraph boundaries.
 *
 * The legacy posts were hard-wrapped at roughly eighty columns. The importer
 * handed that text to EmDash's markdown -> Portable Text converter, which
 * treats every single newline as a block break, so most posts render each
 * source line as its own paragraph. The live corpus is the authority here, so
 * this script is the migration: it joins the adjacent `normal` blocks that a
 * soft wrap produced, leaving blank-line paragraph breaks alone, and it also
 * carries the two body-image fixes the audit found (`--images`).
 *
 * Safety rules, in order of importance:
 *
 *   - Dry run is the default. `--apply` is required for every write.
 *   - A local write needs an explicit `--db <copy.sqlite>`, and the known
 *     production paths (anything under `.wrangler`, `data.db`, the main
 *     checkout's D1 snapshot) are refused outright.
 *   - `--remote --url <origin> --apply` is the separate operator mode; it
 *     reads through `emdash content get --raw` and writes through
 *     `emdash content update --rev`, so revisions, FTS and cache invalidation
 *     behave the way the CMS expects. It must not be run without the backup
 *     step in docs/content-repairs.md.
 *
 * Usage:
 *   node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite
 *   node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite --apply
 *   node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite --images
 *   node scripts/repair-post-paragraphs.mjs --remote --url https://seanbehan.ca
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { DatabaseSync } from 'node:sqlite';

const ROOT = resolve(import.meta.dirname, '..');

/**
 * The D1 file `astro dev` uses in the main checkout. Even copied to /tmp it is
 * named the same, and refusing it there too costs nothing, so apply refuses it
 * wherever it sits. The copy documented in docs/content-repairs.md is
 * `/tmp/d1-copy.sqlite`, and that is deliberately a different name.
 */
const PRODUCTION_SNAPSHOT =
	'e7352547963de7050bd7d94658afc4fe78b61811b7815da12d90be8e863abf4d.sqlite';

const USAGE = `Repair imported post paragraphs (and body-image dimensions) in EmDash.

Usage:
  node scripts/repair-post-paragraphs.mjs --db <copy.sqlite> [options]
  node scripts/repair-post-paragraphs.mjs --remote --url <origin> [options]

Options:
  --db <path>            Local SQLite copy to read (and write with --apply).
  --remote               Use the EmDash CLI against a running site instead of SQLite.
  --url <origin>         Origin for --remote, e.g. https://seanbehan.ca.
  --images               Also set width/height on known body images (and variants
                         when --variants is given). Inline data: images are only
                         reported; replacing one is an operator decision (C2).
  --variants <file>      JSON manifest mapping asset URL -> variants array, used
                         with --images. See docs/content-repairs.md for the shape.
  --extract-image <slug> Write the post's inline data: image to --out and stop.
  --out <path>           Destination for --extract-image.
  --only <slug>          Restrict the repair to one post.
  --apply                Write changes. Required for any write; dry run otherwise.
  --help                 Show this help.

Nothing is written without --apply. Local writes are refused on the
production/main snapshot paths listed in the script.`;

/* ---------------------------------------------------------------------------
 * Markdown soft breaks
 *
 * This half fixes the import path, so future imports do not recreate the
 * broken shape. It cannot fix the already-stored corpus; that is the Portable
 * Text half below.
 */

/** A fence line, with up to three spaces of indentation, per CommonMark. */
const FENCE_LINE = /^ {0,3}(`{3,}|~{3,})/;
const ATX_HEADING = /^ {0,3}#{1,6}(?:\s|$)/;
const LIST_ITEM = /^ {0,3}(?:[-*+]|\d{1,9}[.)])(?:\s|$)/;
const BLOCKQUOTE = /^ {0,3}>/;
const INDENTED_CODE = /^(?: {4,}|\t)/;
const THEMATIC_BREAK = /^ {0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/;
const SETEXT_UNDERLINE = /^ {0,3}(?:=+|-+)\s*$/;
const HTML_BLOCK = /^ {0,3}</;
const LINK_REFERENCE = /^ {0,3}\[[^\]]+\]:/;
const IMAGE_BLOCK = /^ {0,3}!\[[^\]]*\]\(/;

/**
 * A GFM table row usually starts with a pipe; a row that does not still has
 * at least two pipes, which prose in this corpus never does at line start.
 */
const tableLine = (line) => /^\s*\|/.test(line) || (line.match(/\|/g)?.length ?? 0) >= 2;

const blockLine = (line) =>
	FENCE_LINE.test(line) ||
	ATX_HEADING.test(line) ||
	LIST_ITEM.test(line) ||
	BLOCKQUOTE.test(line) ||
	INDENTED_CODE.test(line) ||
	THEMATIC_BREAK.test(line) ||
	SETEXT_UNDERLINE.test(line) ||
	HTML_BLOCK.test(line) ||
	LINK_REFERENCE.test(line) ||
	IMAGE_BLOCK.test(line) ||
	tableLine(line);

/**
 * Collapse single newlines inside markdown prose into spaces.
 *
 * Only prose is touched: blank lines, fences, headings, lists, blockquotes,
 * tables and indented code are copied through byte-for-byte, so the converter
 * still sees every block boundary the author wrote. The one heuristic is that
 * a line beginning a block keeps its own line and blocks joining on either
 * side, which is why a hard-wrapped list continuation is not re-flowed here.
 */
export function unwrapSoftBreaks(markdown) {
	const text = String(markdown ?? '').replace(/\r\n?/g, '\n');
	if (!text) return text;

	const out = [];
	let fence = null;
	let canJoinNext = false;

	for (const line of text.split('\n')) {
		const fenceMatch = FENCE_LINE.exec(line);

		if (fence) {
			out.push(line);
			if (fenceMatch && fenceMatch[1][0] === fence.char && fenceMatch[1].length >= fence.length) {
				fence = null;
			}
			canJoinNext = false;
			continue;
		}

		if (fenceMatch) {
			fence = { char: fenceMatch[1][0], length: fenceMatch[1].length };
			out.push(line);
			canJoinNext = false;
			continue;
		}

		if (line.trim() === '') {
			out.push(line);
			canJoinNext = false;
			continue;
		}

		const startsBlock = blockLine(line);
		if (canJoinNext && !startsBlock && out.length > 0) {
			// Keep exactly one space at the join: the sources have no trailing
			// spaces, but this also makes the function idempotent.
			out[out.length - 1] = `${out[out.length - 1].trimEnd()} ${line.trimStart()}`;
			canJoinNext = true;
			continue;
		}

		out.push(line);
		canJoinNext = !startsBlock;
	}

	return out.join('\n');
}

/* ---------------------------------------------------------------------------
 * Portable Text paragraph merges
 */

const blockText = (block) =>
	(Array.isArray(block?.children) ? block.children : [])
		.map((child) => (typeof child?.text === 'string' ? child.text : ''))
		.join('');

export const isNormalBlock = (block) =>
	block?._type === 'block' &&
	(block.style ?? 'normal') === 'normal' &&
	block.listItem === undefined;

/**
 * A link/footnote definition (`[^1]: https://...`) is one source line and one
 * block on purpose; the union heuristic below would otherwise read the missing
 * final period as a soft wrap and fold neighbours into one paragraph.
 */
const isReferenceDefinition = (block) => /^\s*\[[^\]]+\]:/.test(blockText(block));

/**
 * A boundary is a soft wrap when the previous line did not finish a sentence,
 * or the next line starts as a continuation (lowercase or a parenthetical).
 * That union finds 273 boundaries across 18 posts on the snapshot the audit
 * measured; this function declines two of them because they are link-reference
 * definition pairs, leaving 271 real prose merges. The intersection (236)
 * misses the wraps that land after a full stop or before a proper noun.
 *
 * The cost is that two genuinely separate paragraphs can be joined when the
 * first ends without `.!?` -- impossible for finished prose -- or the second
 * starts lowercase. The dry run prints the per-post count and one sample
 * joined sentence per post, so a human can spot-check the heuristic before
 * `--apply`; `--only <slug>` narrows a review to one post.
 */
const hasSoftWrapShape = (a, b) => !/[.!?]$/.test(a) || /^[a-z(]/.test(b);

export function isSoftWrapBoundary(previous, next) {
	if (!isNormalBlock(previous) || !isNormalBlock(next)) return false;
	const a = blockText(previous).trim();
	const b = blockText(next).trim();
	if (!a || !b) return false;
	if (isReferenceDefinition(previous) || isReferenceDefinition(next)) return false;
	return hasSoftWrapShape(a, b);
}

/**
 * The two reference-definition pairs the audit's raw boundary count included:
 * they have the shape of a soft wrap but are single-line definitions, so the
 * merge loop declines them and reports them separately.
 */
const isDeclinedReferenceBoundary = (previous, next) => {
	if (!isNormalBlock(previous) || !isNormalBlock(next)) return false;
	if (!isReferenceDefinition(previous) && !isReferenceDefinition(next)) return false;
	const a = blockText(previous).trim();
	const b = blockText(next).trim();
	return Boolean(a && b && hasSoftWrapShape(a, b));
};

/**
 * Append `next`'s children to `previous`, keeping marks and their definitions.
 * A mark key that collides with a different definition on the previous block
 * is renamed on both the definition and the span marks that reference it.
 */
function joinNormalBlocks(previous, next) {
	const children = (previous.children ?? []).map((child) => ({ ...child }));
	const nextChildren = (next.children ?? []).map((child) => ({ ...child }));

	const previousText = blockText(previous);
	const nextText = blockText(next);
	if (previousText && nextText) {
		const last = children[children.length - 1];
		const first = nextChildren[0];
		if (last && typeof last.text === 'string' && last.text.trim() !== '') {
			children[children.length - 1] = { ...last, text: last.text.replace(/\s*$/, '') + ' ' };
		} else if (first && typeof first.text === 'string') {
			nextChildren[0] = { ...first, text: ` ${first.text.replace(/^\s+/, '')}` };
		} else {
			children.push({ _type: 'span', text: ' ', marks: [] });
		}
	}

	const markDefs = [...(previous.markDefs ?? [])];
	const seen = new Map(markDefs.map((def) => [def?._key, JSON.stringify(def)]));
	const renamed = new Map();
	for (const def of next.markDefs ?? []) {
		if (!def?._key || !seen.has(def._key)) {
			markDefs.push(def);
			if (def?._key) seen.set(def._key, JSON.stringify(def));
			continue;
		}
		if (seen.get(def._key) === JSON.stringify(def)) continue;
		let key = def._key;
		let suffix = 2;
		while (seen.has(key)) key = `${def._key}-${suffix++}`;
		renamed.set(def._key, key);
		const replacement = { ...def, _key: key };
		markDefs.push(replacement);
		seen.set(key, JSON.stringify(replacement));
	}

	if (renamed.size > 0) {
		for (let i = 0; i < nextChildren.length; i++) {
			const child = nextChildren[i];
			if (!Array.isArray(child?.marks) || child.marks.length === 0) continue;
			nextChildren[i] = {
				...child,
				marks: child.marks.map((mark) => renamed.get(mark) ?? mark)
			};
		}
	}

	children.push(...nextChildren);
	return { ...previous, markDefs, children };
}

/** The first soft-wrap boundary, trimmed to something that fits one line. */
function joinSample(previous, next) {
	const joined = `${blockText(previous).trim()} ${blockText(next).trim()}`.replace(/\s+/g, ' ');
	return joined.length > 180 ? `${joined.slice(0, 177)}...` : joined;
}

/**
 * Merge the soft-wrap chain in one Portable Text body. Idempotent: running it
 * over its own output finds no boundary because `isSoftWrapBoundary` reads the
 * joined text and the sentence boundaries no longer fall between blocks.
 */
export function mergeSoftWrappedBlocks(blocks) {
	if (!Array.isArray(blocks)) return { blocks: [], merges: 0, samples: [], declined: 0 };
	const out = [];
	const samples = [];
	let merges = 0;
	let declined = 0;

	for (const block of blocks) {
		const previous = out[out.length - 1];
		if (previous && isSoftWrapBoundary(previous, block)) {
			if (samples.length === 0) samples.push(joinSample(previous, block));
			out[out.length - 1] = joinNormalBlocks(previous, block);
			merges++;
		} else {
			if (previous && isDeclinedReferenceBoundary(previous, block)) declined++;
			out.push(block);
		}
	}

	return { blocks: out, merges, samples, declined };
}

/* ---------------------------------------------------------------------------
 * Body images
 */

/**
 * Intrinsic dimensions measured from the files the audit named. `--images`
 * only touches URLs in this table (plus a URL in the operator's variants
 * manifest); anything else is left for a human, because guessing a size would
 * reserve the wrong space and be worse than none.
 */
export const IMAGE_DIMENSIONS = Object.freeze({
	'/img/reactjs-card.webp': Object.freeze({ width: 843, height: 381 }),
	'/img/20210213_15h31m29s_grim.webp': Object.freeze({ width: 2560, height: 1440 })
});

const imageUrl = (block) => block?.asset?.url ?? block?.src;

export function decodeDataUri(dataUri) {
	const match = /^data:(image\/[a-z0-9.+-]+)(;base64)?,([\s\S]*)$/i.exec(String(dataUri ?? ''));
	if (!match) throw new Error('not an image data: URI');
	const [, mime, base64, payload] = match;
	const bytes = base64
		? Buffer.from(payload, 'base64')
		: Buffer.from(decodeURIComponent(payload), 'utf8');
	if (bytes.length === 0) throw new Error('image data: URI has no bytes');
	return { mime: mime.toLowerCase(), bytes };
}

/**
 * Set dimensions and, when the operator has created derivatives, a variants
 * array on image blocks. Inline `data:` images are reported but never changed:
 * extracting and re-uploading one needs a human-written alt, so the script
 * stops at telling the operator which post needs it.
 */
export function applyImageFixes(blocks, { variants = {} } = {}) {
	if (!Array.isArray(blocks)) return { blocks: [], changes: [], inline: [] };
	const out = [];
	const changes = [];
	const inline = [];

	for (const block of blocks) {
		if (block?._type !== 'image') {
			out.push(block);
			continue;
		}

		const url = imageUrl(block);
		if (typeof url === 'string' && url.startsWith('data:image/')) {
			inline.push({ url, alt: block.alt ?? '' });
			out.push(block);
			continue;
		}

		let next = block;
		const before = { width: block.width, height: block.height, variants: block.variants };
		const size = IMAGE_DIMENSIONS[url];
		if (size && (block.width !== size.width || block.height !== size.height)) {
			next = { ...next, width: size.width, height: size.height };
		}
		const variantList = variants[url];
		if (variantList && JSON.stringify(next.variants) !== JSON.stringify(variantList)) {
			next = { ...next, variants: variantList };
		}
		if (next !== block) {
			changes.push({
				url,
				before,
				after: { width: next.width, height: next.height, variants: next.variants }
			});
		}
		out.push(next);
	}

	return { blocks: out, changes, inline };
}

/* ---------------------------------------------------------------------------
 * Targets and options
 */

/**
 * Why `--apply` must not touch this path, or null when it is safe. Matching by
 * name as well as by directory means a copy of the production snapshot is
 * refused wherever the operator puts it.
 */
export function forbiddenApplyReason(dbPath) {
	// Resolve symlinks too: a /tmp link must not become a way around the
	// production-path refusal.
	let resolved = resolve(String(dbPath));
	try {
		resolved = realpathSync(resolved);
	} catch {
		// A missing file cannot have been mistaken for a production copy; the
		// caller's existsSync check reports it with a better message.
	}
	const parts = resolved.split(/[\\/]/);
	if (parts.includes('.wrangler')) return 'inside a .wrangler state directory';
	const name = basename(resolved);
	if (name === 'data.db') return 'the local CLI data.db';
	if (name === 'metadata.sqlite') return 'the Miniflare metadata database';
	if (name === PRODUCTION_SNAPSHOT) return 'the known main-checkout D1 snapshot';
	return null;
}

export function parseVariantManifest(text) {
	const parsed = JSON.parse(text);
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new Error('variants manifest must be a JSON object mapping asset URL -> array');
	}
	const out = {};
	for (const [url, list] of Object.entries(parsed)) {
		if (!url.startsWith('/'))
			throw new Error(`variants manifest: asset URL must be root-relative: ${url}`);
		if (!Array.isArray(list)) throw new Error(`variants manifest: ${url} must map to an array`);
		out[url] = list.map((entry, index) => {
			if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
				throw new Error(`variants manifest: ${url}[${index}] must be an object`);
			}
			if (typeof entry.url !== 'string' || !entry.url) {
				throw new Error(`variants manifest: ${url}[${index}].url must be a non-empty string`);
			}
			if (!Number.isInteger(entry.width) || entry.width <= 0) {
				throw new Error(`variants manifest: ${url}[${index}].width must be a positive integer`);
			}
			const variant = { url: entry.url, width: entry.width };
			if (entry.height !== undefined) {
				if (!Number.isInteger(entry.height) || entry.height <= 0) {
					throw new Error(`variants manifest: ${url}[${index}].height must be a positive integer`);
				}
				variant.height = entry.height;
			}
			return variant;
		});
	}
	return out;
}

/** Turn the CLI arguments into the one shape main() and the tests both use. */
export function parseCli(argv) {
	const { values } = parseArgs({
		args: argv,
		options: {
			db: { type: 'string' },
			remote: { type: 'boolean', default: false },
			url: { type: 'string' },
			images: { type: 'boolean', default: false },
			variants: { type: 'string' },
			'extract-image': { type: 'string' },
			out: { type: 'string' },
			only: { type: 'string' },
			apply: { type: 'boolean', default: false },
			help: { type: 'boolean', default: false }
		},
		allowPositionals: false
	});
	return {
		db: values.db,
		remote: values.remote,
		url: values.url,
		images: values.images,
		variants: values.variants,
		extractImage: values['extract-image'],
		out: values.out,
		only: values.only,
		apply: values.apply,
		help: values.help
	};
}

export function validateOptions(options) {
	if (options.help) return;
	if (options.db && options.remote) throw new Error('use either --db or --remote, not both');
	if (!options.db && !options.remote) {
		throw new Error('a target is required: --db <copy.sqlite> or --remote --url <origin>');
	}
	if (options.remote && !options.url) throw new Error('--remote requires --url <origin>');
	if (options.variants && !options.images)
		throw new Error('--variants only makes sense with --images');

	if (options.extractImage) {
		if (!options.out) throw new Error('--extract-image requires --out <path>');
		if (options.apply) throw new Error('--extract-image never writes to D1; drop --apply');
		if (options.images) throw new Error('--extract-image is its own mode; drop --images');
		if (options.variants) throw new Error('--extract-image is its own mode; drop --variants');
		return;
	}

	if (options.out && !options.extractImage) {
		throw new Error('--out is only valid with --extract-image');
	}
	if (options.apply && options.db) {
		const reason = forbiddenApplyReason(options.db);
		if (reason) throw new Error(`refusing --apply on ${options.db}: it is ${reason}`);
	}
	// --remote already required --url above; --apply plus both is the explicit
	// operator opt-in described in docs/content-repairs.md.
}

/* ---------------------------------------------------------------------------
 * SQLite mode
 */

const asBlocks = (value) => {
	const parsed = typeof value === 'string' ? JSON.parse(value) : value;
	if (!Array.isArray(parsed)) throw new Error('content is not a Portable Text array');
	return parsed;
};

const declinedNote = (summary) =>
	summary.referenceDeclined > 0
		? ` (${summary.referenceDeclined} reference-definition boundar${
				summary.referenceDeclined === 1 ? 'y' : 'ies'
			} declined)`
		: '';

const describeImageChange = (change) => {
	const bits = [];
	if (change.before.width !== change.after.width || change.before.height !== change.after.height) {
		bits.push(
			`width=${change.before.width ?? 'none'} height=${change.before.height ?? 'none'} ` +
				`-> ${change.after.width}x${change.after.height}`
		);
	}
	if (change.before.variants !== change.after.variants) {
		bits.push(
			`variants ${change.before.variants?.length ?? 0} -> ${change.after.variants?.length ?? 0}`
		);
	}
	return bits.join(', ');
};

/**
 * Walk the published posts in a SQLite file. `log` is injected so tests can
 * assert what a dry run would have printed without reimplementing the output.
 */
export function repairSqlite({
	dbPath,
	apply = false,
	images = false,
	variants = {},
	only = null,
	log = console.log
}) {
	const reason = forbiddenApplyReason(dbPath);
	if (apply && reason) throw new Error(`refusing --apply on ${dbPath}: it is ${reason}`);
	if (!existsSync(dbPath)) throw new Error(`no such database: ${dbPath}`);

	const db = new DatabaseSync(dbPath, { readOnly: !apply });
	const summary = {
		target: resolve(dbPath),
		mode: apply ? 'apply' : 'dry run',
		posts: 0,
		paragraphPosts: 0,
		merges: 0,
		referenceDeclined: 0,
		imageBlocks: 0,
		inlineImages: 0
	};

	try {
		let sql =
			"SELECT id, slug, status, content FROM ec_posts WHERE status = 'published' AND deleted_at IS NULL";
		const params = [];
		if (only) {
			sql += ' AND slug = ?';
			params.push(only);
		}
		sql += ' ORDER BY published_at';

		const rows = db.prepare(sql).all(...params);
		log(`${summary.mode}: ${summary.target}`);
		if (!apply && reason) {
			log(`warning: ${dbPath} is ${reason}; this run only reads it. --apply is refused.`);
		}
		if (rows.length === 0) log('no published posts matched');

		const updates = [];
		for (const row of rows) {
			let blocks;
			try {
				blocks = asBlocks(row.content);
			} catch (error) {
				summary.posts++;
				log(`  ${row.slug}: skipped (${error.message})`);
				continue;
			}

			const paragraph = mergeSoftWrappedBlocks(blocks);
			const image = images
				? applyImageFixes(paragraph.blocks, { variants })
				: { blocks: paragraph.blocks, changes: [], inline: [] };
			const changed = paragraph.merges > 0 || image.changes.length > 0;
			summary.referenceDeclined += paragraph.declined;

			if (image.inline.length > 0) {
				summary.inlineImages += image.inline.length;
				log(
					`  ${row.slug}: ${image.inline.length} inline data: image${
						image.inline.length === 1 ? '' : 's'
					} left for a human (see docs/content-repairs.md C2)`
				);
			}

			if (!changed) continue;

			summary.posts++;
			if (paragraph.merges > 0) summary.paragraphPosts++;
			summary.merges += paragraph.merges;
			summary.imageBlocks += image.changes.length;
			updates.push({ id: row.id, blocks: image.blocks });

			const imageCount = image.changes.length;
			const imageNote =
				imageCount > 0 ? `, ${imageCount} image change${imageCount === 1 ? '' : 's'}` : '';
			log(
				`  ${row.slug}: blocks ${blocks.length} -> ${image.blocks.length} ` +
					`(${paragraph.merges} merge${paragraph.merges === 1 ? '' : 's'}${imageNote})`
			);
			for (const change of image.changes) {
				log(`    image ${change.url}: ${describeImageChange(change)}`);
			}
			if (paragraph.samples.length > 0) log(`    sample: "${paragraph.samples[0]}"`);
		}

		if (apply && updates.length > 0) {
			// One transaction so a failed write cannot leave half the corpus
			// repaired; the FTS triggers on ec_posts update the search index
			// for each row as it is written.
			const updateSql = db.prepare('UPDATE ec_posts SET content = ? WHERE id = ?');
			db.exec('BEGIN');
			try {
				for (const update of updates) {
					updateSql.run(JSON.stringify(update.blocks), update.id);
				}
				db.exec('COMMIT');
			} catch (error) {
				db.exec('ROLLBACK');
				throw error;
			}
			log(`applied: ${updates.length} post${updates.length === 1 ? '' : 's'} written`);
		}

		log(
			`paragraphs: ${summary.paragraphPosts} post${summary.paragraphPosts === 1 ? '' : 's'}, ` +
				`${summary.merges} soft-wrap merge${summary.merges === 1 ? '' : 's'}` +
				declinedNote(summary)
		);
		if (images) {
			log(
				`images: ${summary.imageBlocks} block${summary.imageBlocks === 1 ? '' : 's'} changed by this pass`
			);
		}
		if (!apply) log('dry run: nothing was written (add --apply to write a --db copy)');
		return summary;
	} finally {
		db.close();
	}
}

/* ---------------------------------------------------------------------------
 * Remote mode (emdash CLI)
 */

const runEmdash = (args, { json = true } = {}) => {
	const out = execFileSync('npx', ['emdash', ...args, ...(json ? ['--json'] : [])], {
		cwd: ROOT,
		encoding: 'utf8',
		maxBuffer: 64 * 1024 * 1024
	});
	if (!json) return out;
	const start = out.search(/[[{]/);
	if (start === -1) throw new Error(`no JSON in emdash output: ${out.slice(0, 200)}`);
	return JSON.parse(out.slice(start));
};

const portableTextField = (data) => {
	if (Array.isArray(data?.content)) return 'content';
	for (const [key, value] of Object.entries(data ?? {})) {
		if (Array.isArray(value) && value.every((item) => item === null || typeof item === 'object')) {
			return key;
		}
	}
	return null;
};

/** Remote equivalent of repairSqlite(); reads and writes through the CMS. */
export function repairRemote({
	url,
	apply = false,
	images = false,
	variants = {},
	only = null,
	log = console.log
}) {
	if (!url) throw new Error('--remote requires --url <origin>');
	const summary = {
		target: url,
		mode: apply ? 'apply' : 'dry run',
		posts: 0,
		paragraphPosts: 0,
		merges: 0,
		referenceDeclined: 0,
		imageBlocks: 0,
		inlineImages: 0
	};

	log(`${summary.mode}: ${url}`);
	const items = [];
	let cursor;
	do {
		const page = runEmdash([
			'content',
			'list',
			'posts',
			'--status',
			'published',
			'--limit',
			'100',
			'--url',
			url,
			...(cursor ? ['--cursor', cursor] : [])
		]);
		items.push(...(page.items ?? []));
		cursor = page.nextCursor;
	} while (cursor);

	for (const listed of items) {
		if (only && listed.slug !== only) continue;
		const item = runEmdash([
			'content',
			'get',
			'posts',
			listed.id,
			'--raw',
			'--published',
			'--url',
			url
		]);
		const field = portableTextField(item?.data);
		if (!field) {
			log(`  ${listed.slug}: skipped (no Portable Text field found)`);
			continue;
		}
		const blocks = item.data[field];
		const paragraph = mergeSoftWrappedBlocks(blocks);
		const image = images
			? applyImageFixes(paragraph.blocks, { variants })
			: { blocks: paragraph.blocks, changes: [], inline: [] };
		const changed = paragraph.merges > 0 || image.changes.length > 0;
		summary.referenceDeclined += paragraph.declined;

		if (image.inline.length > 0) {
			summary.inlineImages += image.inline.length;
			log(
				`  ${listed.slug}: ${image.inline.length} inline data: image${
					image.inline.length === 1 ? '' : 's'
				} left for a human (see docs/content-repairs.md C2)`
			);
		}
		if (!changed) continue;

		summary.posts++;
		if (paragraph.merges > 0) summary.paragraphPosts++;
		summary.merges += paragraph.merges;
		summary.imageBlocks += image.changes.length;
		log(
			`  ${listed.slug}: blocks ${blocks.length} -> ${image.blocks.length} ` +
				`(${paragraph.merges} merge${paragraph.merges === 1 ? '' : 's'})`
		);
		for (const change of image.changes) {
			log(`    image ${change.url}: ${describeImageChange(change)}`);
		}
		if (paragraph.samples.length > 0) log(`    sample: "${paragraph.samples[0]}"`);

		if (!apply) continue;
		const rev = item._rev;
		if (!rev) {
			log(`  ${listed.slug}: no _rev from content get; refusing to update`);
			continue;
		}
		runEmdash([
			'content',
			'update',
			'posts',
			listed.id,
			'--rev',
			rev,
			'--data',
			JSON.stringify({ [field]: image.blocks }),
			'--url',
			url
		]);
		log(`  ${listed.slug}: updated via emdash content update`);
	}

	log(
		`paragraphs: ${summary.paragraphPosts} post${summary.paragraphPosts === 1 ? '' : 's'}, ` +
			`${summary.merges} soft-wrap merge${summary.merges === 1 ? '' : 's'}` +
			declinedNote(summary)
	);
	if (images) {
		log(
			`images: ${summary.imageBlocks} block${summary.imageBlocks === 1 ? '' : 's'} changed by this pass`
		);
	}
	if (!apply) log('dry run: nothing was written (add --apply for the operator mode)');
	return summary;
}

function extractRemoteImage({ url, slug, out, log }) {
	const item = runEmdash(['content', 'get', 'posts', slug, '--raw', '--published', '--url', url]);
	const field = portableTextField(item?.data);
	if (!field) throw new Error(`${slug}: no Portable Text field found`);
	const found = (item.data[field] ?? []).find(
		(block) => block?._type === 'image' && String(imageUrl(block)).startsWith('data:image/')
	);
	if (!found) throw new Error(`${slug}: no inline data: image found`);
	const { mime, bytes } = decodeDataUri(imageUrl(found));
	writeFileSync(out, bytes);
	log(`wrote ${bytes.length} bytes (${mime}) from ${slug} to ${out}`);
	log(`next: npx emdash media upload ${out} --alt "<what the screenshot shows>" --url ${url}`);
	log('then replace the inline image block in the admin with the uploaded asset (C2)');
}

function extractSqliteImage({ dbPath, slug, out, log }) {
	const db = new DatabaseSync(dbPath, { readOnly: true });
	try {
		const row = db
			.prepare('SELECT content FROM ec_posts WHERE slug = ? AND deleted_at IS NULL')
			.get(slug);
		if (!row) throw new Error(`${slug}: no post in ${dbPath}`);
		const blocks = asBlocks(row.content);
		const found = blocks.find(
			(block) => block?._type === 'image' && String(imageUrl(block)).startsWith('data:image/')
		);
		if (!found) throw new Error(`${slug}: no inline data: image found`);
		const { mime, bytes } = decodeDataUri(imageUrl(found));
		writeFileSync(out, bytes);
		log(`wrote ${bytes.length} bytes (${mime}) from ${slug} to ${out}`);
		log('next: upload the file, then replace the inline image block in the admin (C2)');
	} finally {
		db.close();
	}
}

/* ---------------------------------------------------------------------------
 * CLI entry point
 */

function main() {
	let options;
	try {
		options = parseCli(process.argv.slice(2));
		validateOptions(options);
	} catch (error) {
		process.stderr.write(`repair-post-paragraphs: ${error.message}\n\n${USAGE}\n`);
		process.exit(1);
	}

	if (options.help) {
		process.stdout.write(`${USAGE}\n`);
		return;
	}

	try {
		const variants = options.variants
			? parseVariantManifest(readFileSync(options.variants, 'utf8'))
			: {};

		if (options.extractImage) {
			if (options.remote) {
				extractRemoteImage({
					url: options.url,
					slug: options.extractImage,
					out: options.out,
					log: console.log
				});
			} else {
				extractSqliteImage({
					dbPath: options.db,
					slug: options.extractImage,
					out: options.out,
					log: console.log
				});
			}
			return;
		}

		if (options.remote) {
			repairRemote({
				url: options.url,
				apply: options.apply,
				images: options.images,
				variants,
				only: options.only,
				log: console.log
			});
		} else {
			repairSqlite({
				dbPath: options.db,
				apply: options.apply,
				images: options.images,
				variants,
				only: options.only,
				log: console.log
			});
		}
	} catch (error) {
		process.stderr.write(`repair-post-paragraphs: ${error.message}\n`);
		process.exit(1);
	}
}

if (import.meta.main) main();
