#!/usr/bin/env node
/**
 * Export the deployed database to a SQL file.
 *
 * `wrangler d1 export` refuses a database that contains FTS5 virtual tables —
 * "cannot export databases with Virtual Tables (fts5)" — and EmDash builds one
 * per searchable collection. It will export a named list of tables, though, so
 * this asks the database what it has and hands back everything that is not a
 * virtual table, one of their shadow tables, or Cloudflare's own bookkeeping.
 *
 * Nothing is lost by skipping them: an FTS index is derived from the rows in
 * the table it indexes, and `INSERT INTO <fts>(<fts>) VALUES('rebuild')`
 * reconstructs it after a restore.
 *
 *   node scripts/backup-d1.mjs [database] [output]
 *
 * Defaults to `seanbehan-ca` and `backup.sql`. Used by the nightly workflow in
 * .github/workflows/backup.yml, and worth running by hand before anything
 * alarming.
 */

import { execFileSync } from 'node:child_process';

const database = process.argv[2] ?? 'seanbehan-ca';
const output = process.argv[3] ?? 'backup.sql';

const wrangler = (args, { json = false } = {}) => {
	const out = execFileSync('npx', ['wrangler', ...args], {
		encoding: 'utf8',
		maxBuffer: 256 * 1024 * 1024,
		stdio: json ? ['ignore', 'pipe', 'ignore'] : ['ignore', 'inherit', 'inherit']
	});
	if (!json) return '';
	const start = out.indexOf('[');
	if (start === -1) throw new Error(`no JSON in wrangler output: ${out.slice(0, 200)}`);
	return JSON.parse(out.slice(start));
};

/** Shadow tables FTS5 maintains beside each virtual table. */
const FTS_SHADOW = /_fts_\w+_(data|idx|docsize|config|content)$/;

const result = wrangler(
	[
		'd1',
		'execute',
		database,
		'--remote',
		'--json',
		'--command',
		"SELECT name, sql FROM sqlite_master WHERE type = 'table' ORDER BY name"
	],
	{ json: true }
);

const tables = result[0].results
	.filter((row) => !String(row.sql ?? '').startsWith('CREATE VIRTUAL'))
	.map((row) => row.name)
	.filter((name) => !FTS_SHADOW.test(name))
	// `_cf_KV` is Cloudflare's, not ours, and not something a restore should
	// carry; `sqlite_*` are the engine's own.
	.filter((name) => name !== '_cf_KV' && !name.startsWith('sqlite_'));

if (!tables.some((name) => name === 'ec_posts')) {
	throw new Error('backup: ec_posts is not in the table list — refusing to write a useless dump');
}

console.error(`backup: exporting ${tables.length} tables from ${database}`);

wrangler([
	'd1',
	'export',
	database,
	'--remote',
	'--output',
	output,
	'-y',
	...tables.flatMap((name) => ['--table', name])
]);
