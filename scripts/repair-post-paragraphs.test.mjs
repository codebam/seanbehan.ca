/**
 * Tests for scripts/repair-post-paragraphs.mjs.
 *
 * These run with `node --test` rather than Vitest: the script is a plain Node
 * tool that talks to node:sqlite, and the test creates its own throwaway D1
 * file so the suite never depends on the machine's .wrangler snapshot.
 */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';

import {
	applyImageFixes,
	decodeDataUri,
	IMAGE_DIMENSIONS,
	isSoftWrapBoundary,
	mergeSoftWrappedBlocks,
	parseVariantManifest,
	repairSqlite,
	unwrapSoftBreaks,
	validateOptions,
	forbiddenApplyReason,
	isTransientCliError
} from './repair-post-paragraphs.mjs';

const span = (text, marks = []) => ({ _type: 'span', text, marks });
const normal = (text, extra = {}) => ({
	_type: 'block',
	style: 'normal',
	markDefs: [],
	children: [span(text)],
	...extra
});

const SCRIPT = join(import.meta.dirname, 'repair-post-paragraphs.mjs');

test('unwrapSoftBreaks joins hard-wrapped prose with one space', () => {
	const source =
		'I mentioned in my previous post that I use an external drive to keep my Steam\n' +
		'games on. In an attempt to not re-download everything I use RAID1.\n' +
		'\n' +
		'A genuinely separate paragraph stays separate.';
	assert.equal(
		unwrapSoftBreaks(source),
		'I mentioned in my previous post that I use an external drive to keep my Steam games on. In an attempt to not re-download everything I use RAID1.\n\nA genuinely separate paragraph stays separate.'
	);
	assert.equal(unwrapSoftBreaks(unwrapSoftBreaks(source)), unwrapSoftBreaks(source));
});

test('unwrapSoftBreaks preserves fences, headings, lists, quotes, tables and rules', () => {
	const source = [
		'# A heading',
		'Prose that wraps',
		'onto a second line.',
		'',
		'- item one',
		'- item two',
		'',
		'> quoted line one',
		'> quoted line two',
		'',
		'| a | b |',
		'| - | - |',
		'| 1 | 2 |',
		'',
		'```js',
		'const a = 1;',
		'const b = a;',
		'```',
		'',
		'---',
		'after the rule',
		'joins normally.'
	].join('\n');

	assert.equal(
		unwrapSoftBreaks(source),
		[
			'# A heading',
			'Prose that wraps onto a second line.',
			'',
			'- item one',
			'- item two',
			'',
			'> quoted line one',
			'> quoted line two',
			'',
			'| a | b |',
			'| - | - |',
			'| 1 | 2 |',
			'',
			'```js',
			'const a = 1;',
			'const b = a;',
			'```',
			'',
			'---',
			'after the rule joins normally.'
		].join('\n')
	);
});

test('unwrapSoftBreaks leaves a setext heading on its own line', () => {
	assert.equal(
		unwrapSoftBreaks('Title\n===\nBody that wraps\nonto the next line.'),
		'Title\n===\nBody that wraps onto the next line.'
	);
});

test('isSoftWrapBoundary finds the audit boundaries and spares finished paragraphs', () => {
	assert.equal(isSoftWrapBoundary(normal('keep my Steam'), normal('games on.')), true);
	assert.equal(isSoftWrapBoundary(normal('A full stop.'), normal('Next sentence.')), false);
	assert.equal(isSoftWrapBoundary(normal('A full stop.'), normal('lowercase continuation.')), true);
	assert.equal(isSoftWrapBoundary(normal('no punctuation'), normal('Upper case start')), true);
	assert.equal(
		isSoftWrapBoundary(normal('first', { listItem: 'bullet' }), normal('second')),
		false
	);
	// Reference definitions are single blocks on purpose, even without a
	// final period, so the prose heuristic must decline them.
	assert.equal(
		isSoftWrapBoundary(normal('[^1]: https://example.com'), normal('[^2]: https://example.org')),
		false
	);
	const references = mergeSoftWrappedBlocks([
		normal('[^1]: https://example.com'),
		normal('[^2]: https://example.org')
	]);
	assert.equal(references.merges, 0);
	assert.equal(references.declined, 1);
	assert.equal(references.blocks.length, 2);
});

test('mergeSoftWrappedBlocks joins a chain once and keeps marks', () => {
	const blocks = [
		{ _type: 'block', style: 'h3', markDefs: [], children: [span('Title')] },
		{
			_type: 'block',
			style: 'normal',
			markDefs: [{ _key: 'link1', _type: 'link', href: 'https://example.com' }],
			children: [
				span('I mentioned in my previous post that I use an external drive to keep my '),
				span('Steam', ['link1'])
			]
		},
		normal('games on. In an attempt to not re-download everything I use RAID1.'),
		normal('A real paragraph break.'),
		normal('This uppercase paragraph stays on its own.')
	];

	const result = mergeSoftWrappedBlocks(blocks);
	assert.equal(result.merges, 1);
	assert.equal(result.blocks.length, 4);
	assert.equal(result.blocks[1].style, 'normal');
	assert.equal(result.blocks[1].markDefs.length, 1);
	assert.deepEqual(result.blocks[1].markDefs[0], {
		_key: 'link1',
		_type: 'link',
		href: 'https://example.com'
	});
	assert.ok(result.blocks[1].children.some((child) => child.marks.includes('link1')));
	assert.match(result.blocks[1].children.map((child) => child.text).join(''), /Steam games on\./);
	assert.match(result.samples[0], /keep my Steam games on/);

	// The repaired body is stable: nothing left to join.
	assert.equal(mergeSoftWrappedBlocks(result.blocks).merges, 0);
});

test('mergeSoftWrappedBlocks leaves headings, lists and code alone', () => {
	const blocks = [
		{ _type: 'block', style: 'h2', markDefs: [], children: [span('Heading')] },
		normal('Heading text is not prose'),
		{ _type: 'block', style: 'normal', listItem: 'bullet', markDefs: [], children: [span('item')] },
		{ _type: 'code', _key: 'c1', code: 'const a = 1;', language: 'js' },
		normal('After code, prose wraps'),
		normal('onto the next source line.')
	];

	const result = mergeSoftWrappedBlocks(blocks);
	assert.equal(result.merges, 1);
	assert.equal(result.blocks.length, 5);
	assert.equal(result.blocks[2].listItem, 'bullet');
	assert.equal(result.blocks[3]._type, 'code');
	assert.equal(
		result.blocks[4].children.map((child) => child.text).join(''),
		'After code, prose wraps onto the next source line.'
	);
});

test('applyImageFixes sets the two known intrinsic sizes and is idempotent', () => {
	const silverblue = '/img/20210213_15h31m29s_grim.webp';
	const react = '/img/reactjs-card.webp';
	const blocks = [
		{
			_type: 'image',
			_key: 'i1',
			alt: 'Fedora Silverblue desktop screenshot',
			asset: { url: silverblue }
		},
		{ _type: 'image', _key: 'i2', alt: 'react card', asset: { url: react } },
		{ _type: 'image', _key: 'i3', alt: 'unknown', asset: { url: '/img/unknown.webp' } }
	];

	const first = applyImageFixes(blocks);
	assert.equal(first.changes.length, 2);
	assert.deepEqual(
		first.blocks.map((block) => [block.width, block.height]),
		[
			[2560, 1440],
			[843, 381],
			[undefined, undefined]
		]
	);
	assert.equal(first.inline.length, 0);

	const second = applyImageFixes(first.blocks);
	assert.equal(second.changes.length, 0);
});

test('applyImageFixes applies an operator variants manifest only for matching URLs', () => {
	const url = '/img/20210213_15h31m29s_grim.webp';
	const variants = {
		[url]: [
			{ url: '/img/20210213_15h31m29s_grim-800.webp', width: 800, height: 450 },
			{ url: '/img/20210213_15h31m29s_grim-1600.webp', width: 1600, height: 900 }
		]
	};
	const result = applyImageFixes([{ _type: 'image', alt: '', asset: { url } }], { variants });
	assert.equal(result.changes.length, 1);
	assert.deepEqual(result.blocks[0].variants, variants[url]);
	assert.deepEqual(result.blocks[0].width, IMAGE_DIMENSIONS[url].width);
	assert.equal(applyImageFixes(result.blocks, { variants }).changes.length, 0);
});

test('inline data: images are reported, never rewritten, and decode', () => {
	const dataUri = 'data:image/png;base64,aGVsbG8=';
	const result = applyImageFixes([{ _type: 'image', alt: '', asset: { url: dataUri } }]);
	assert.equal(result.changes.length, 0);
	assert.equal(result.inline.length, 1);
	assert.equal(result.blocks[0].asset.url, dataUri);
	const { mime, bytes } = decodeDataUri(dataUri);
	assert.equal(mime, 'image/png');
	assert.equal(bytes.toString('utf8'), 'hello');
	assert.throws(() => decodeDataUri('https://example.com/x.png'), /not an image data: URI/);
});

test('variant manifests are validated', () => {
	assert.deepEqual(
		parseVariantManifest('{"/img/a.webp":[{"url":"/img/a-800.webp","width":800}]}'),
		{ '/img/a.webp': [{ url: '/img/a-800.webp', width: 800 }] }
	);
	assert.throws(() => parseVariantManifest('[]'), /JSON object/);
	assert.throws(() => parseVariantManifest('{"nope":[]}'), /root-relative/);
	assert.throws(
		() => parseVariantManifest('{"/img/a.webp":[{"url":"/x.webp","width":"800"}]}'),
		/width/
	);
});

test('writes are refused on the known production paths', () => {
	assert.equal(forbiddenApplyReason('/tmp/d1-copy.sqlite'), null);
	assert.match(
		forbiddenApplyReason('/home/x/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/e735.sqlite'),
		/\.wrangler/
	);
	assert.match(forbiddenApplyReason('/home/x/data.db'), /data\.db/);
	assert.match(
		forbiddenApplyReason(
			'/tmp/e7352547963de7050bd7d94658afc4fe78b61811b7815da12d90be8e863abf4d.sqlite'
		),
		/known main-checkout/
	);

	// A symlinked copy must not bypass the name check.
	const dir = mkdtempSync(join(tmpdir(), 'repair-safety-'));
	try {
		const target = join(dir, 'data.db');
		writeFileSync(target, 'not a real database');
		const link = join(dir, 'copy.sqlite');
		symlinkSync(target, link);
		assert.match(forbiddenApplyReason(link), /data\.db/);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('validateOptions forces an explicit target and a real operator opt-in', () => {
	assert.throws(() => validateOptions({ apply: true }), /target is required/);
	assert.throws(() => validateOptions({ remote: true }), /--url/);
	assert.throws(() => validateOptions({ db: '/home/x/data.db', apply: true }), /refusing --apply/);
	assert.throws(
		() => validateOptions({ db: '/tmp/x.sqlite', variants: '/tmp/v.json' }),
		/--variants only makes sense/
	);
	assert.throws(() => validateOptions({ db: '/tmp/x.sqlite', extractImage: 'slug' }), /--out/);
	assert.doesNotThrow(() => validateOptions({ db: '/tmp/x.sqlite' }));
	assert.doesNotThrow(() => validateOptions({ remote: true, url: 'https://example.com' }));
});

function fixture() {
	const dir = mkdtempSync(join(tmpdir(), 'repair-post-paragraphs-'));
	const dbPath = join(dir, 'copy.sqlite');
	const db = new DatabaseSync(dbPath);
	db.exec(`
CREATE TABLE ec_posts (
id TEXT PRIMARY KEY,
slug TEXT,
status TEXT,
deleted_at TEXT,
published_at TEXT,
content TEXT
)
`);

	const body = [
		{ _type: 'block', style: 'h3', markDefs: [], children: [span('Title')] },
		normal('I mentioned in my previous post that I use an external drive to keep my Steam'),
		normal('games on. In an attempt to not re-download everything I use RAID1.'),
		normal('A new source line ends without punctuation'),
		normal('and continues here.'),
		normal('A real paragraph break follows.'),
		{
			_type: 'image',
			_key: 'i1',
			alt: 'Fedora Silverblue desktop screenshot',
			asset: { url: '/img/20210213_15h31m29s_grim.webp' }
		},
		{ _type: 'image', _key: 'i2', alt: 'react card', asset: { url: '/img/reactjs-card.webp' } },
		{ _type: 'image', _key: 'i3', alt: '', asset: { url: 'data:image/png;base64,aGVsbG8=' } }
	];

	const insert = db.prepare(
		'INSERT INTO ec_posts (id, slug, status, deleted_at, published_at, content) VALUES (?, ?, ?, ?, ?, ?)'
	);
	insert.run('p1', 'fixture-post', 'published', null, '2020-01-01T00:00:00Z', JSON.stringify(body));
	insert.run(
		'p2',
		'draft-post',
		'draft',
		null,
		null,
		JSON.stringify([normal('draft line one'), normal('draft line two')])
	);
	db.close();
	return { dir, dbPath, originalLength: body.length };
}

const contentOf = (dbPath, slug) => {
	const db = new DatabaseSync(dbPath, { readOnly: true });
	try {
		const row = db.prepare('SELECT content FROM ec_posts WHERE slug = ?').get(slug);
		return JSON.parse(row.content);
	} finally {
		db.close();
	}
};

test('repairSqlite dry-runs, applies paragraphs and images, and is idempotent', () => {
	const { dir, dbPath, originalLength } = fixture();
	try {
		const dryLog = [];
		const dry = repairSqlite({ dbPath, log: (line) => dryLog.push(line) });
		assert.equal(dry.mode, 'dry run');
		assert.equal(dry.paragraphPosts, 1);
		assert.equal(dry.merges, 2);
		assert.equal(dry.imageBlocks, 0);
		assert.equal(contentOf(dbPath, 'fixture-post').length, originalLength);
		assert.ok(dryLog.some((line) => line.includes('fixture-post: blocks')));
		assert.ok(dryLog.some((line) => line.includes('sample:')));
		assert.ok(dryLog.some((line) => line.includes('dry run: nothing was written')));

		const applied = repairSqlite({ dbPath, apply: true, images: true, log: () => {} });
		assert.equal(applied.mode, 'apply');
		assert.equal(applied.paragraphPosts, 1);
		assert.equal(applied.merges, 2);
		assert.equal(applied.imageBlocks, 2);
		assert.equal(applied.inlineImages, 1);

		const after = contentOf(dbPath, 'fixture-post');
		assert.equal(after.length, 7);
		const text = after
			.filter((block) => block?._type === 'block' && block.style === 'normal')
			.map((block) => block.children.map((child) => child.text).join(''))
			.join('\n');
		assert.match(text, /Steam games on\./);
		assert.match(text, /punctuation and continues here\./);
		assert.equal(after[4].width, 2560);
		assert.equal(after[4].height, 1440);
		assert.equal(after[5].width, 843);
		assert.equal(after[5].height, 381);

		// The draft row is not part of the published corpus and was not touched.
		const draft = contentOf(dbPath, 'draft-post');
		assert.equal(draft.length, 2);
		assert.equal(draft[0].children[0].text, 'draft line one');

		const second = repairSqlite({ dbPath, images: true, log: () => {} });
		assert.equal(second.merges, 0);
		assert.equal(second.paragraphPosts, 0);
		assert.equal(second.imageBlocks, 0);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('--extract-image writes the decoded inline image from the copy', () => {
	const { dir, dbPath } = fixture();
	try {
		const out = join(dir, 'inline.png');
		const stdout = execFileSync(
			process.execPath,
			[SCRIPT, '--db', dbPath, '--extract-image', 'fixture-post', '--out', out],
			{ encoding: 'utf8' }
		);
		assert.match(stdout, /wrote 5 bytes \(image\/png\)/);
		assert.equal(readFileSync(out, 'utf8'), 'hello');
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('isTransientCliError retries transport failures but not permanent ones', () => {
	assert.equal(isTransientCliError({ message: 'Command failed: fetch failed' }), true);
	assert.equal(isTransientCliError({ stderr: 'Error: socket hang up' }), true);
	assert.equal(isTransientCliError({ message: '429 Too Many Requests' }), true);
	assert.equal(isTransientCliError({ message: '401 Unauthorized' }), false);
	assert.equal(isTransientCliError({ message: 'no JSON in emdash output: ...' }), false);
});
