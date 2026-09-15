#!/usr/bin/env node
/**
 * Export the deployed database to a SQL file.
 *
 * `wrangler d1 export` refuses a database that contains FTS5 virtual tables —
 * "cannot export databases with Virtual Tables (fts5)" — and EmDash builds one
 * per searchable collection. It will export a named list of tables, though, so
 * this asks the database what it has and hands back everything that is not a
 * virtual table, one of their shadow tables, Cloudflare's own bookkeeping, or
 * a table carrying secrets, credentials or fulfillment state.
 *
 * The dump is content-only: it exists to restore the writing, not a running
 * install. `options` (preview secret, session salt and plugin settings), the
 * user/auth tables, API and OAuth tokens, plugin state, and the Stripe
 * fulfillment rows — whose checkout_session_id is a bearer download credential
 * — are deliberately excluded, so a restore will not carry them.
 *
 * Nothing is lost by skipping the FTS indexes: each is derived from the rows in
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
		// Never inherit either stream: `wrangler d1 export` prints a one-hour
		// presigned URL into both, and an inherited stream is how that URL
		// reaches the CI log. The JSON query parses stdout; the export's output
		// is captured and discarded.
		stdio: json ? ['ignore', 'pipe', 'ignore'] : ['ignore', 'pipe', 'pipe']
	});
	if (!json) return '';
	const start = out.indexOf('[');
	if (start === -1) throw new Error(`no JSON in wrangler output: ${out.slice(0, 200)}`);
	return JSON.parse(out.slice(start));
};

/** Shadow tables FTS5 maintains beside each virtual table. */
const FTS_SHADOW = /_fts_\w+_(data|idx|docsize|config|content)$/;

/**
 * Rows that are credential or live state, never content. The explicit set
 * covers the tables EmDash ships today; the pattern is the safety net for a
 * new table with a telling name.
 */
const SENSITIVE_TABLE =
	/^(?:options|users?|credentials?|auth_|oauth_|sessions?|.*tokens?|.*secrets?|.*fulfillments?|_plugin_)/i;
const SENSITIVE_TABLES = new Set([
	'options',
	'users',
	'users_new',
	'users_old',
	'credentials',
	'auth_tokens',
	'auth_challenges',
	'oauth_accounts',
	'sessions',
	'_emdash_api_tokens',
	'_emdash_authorization_codes',
	'_emdash_oauth_clients',
	'_emdash_oauth_tokens',
	'_the_plugin_state',
	'_plugin_state',
	'_plugin_storage',
	'_plugin_indexes',
	'site_stripe_fulfillments'
]);

const isSensitive = (name) => SENSITIVE_TABLES.has(name) || SENSITIVE_TABLE.test(name);

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
	.filter((name) => name !== '_cf_KV' && !name.startsWith('sqlite_'))
	.filter((name) => !isSensitive(name));

// The filter above did the excluding. This is the assertion that it actually
// did: if a future table list lets a sensitive name back in, stop here rather
// than hand wrangler a `--table` list that dumps credentials.
const leaked = tables.filter((name) => isSensitive(name));
if (leaked.length > 0) {
	throw new Error(`backup: refusing to export sensitive table(s): ${leaked.join(', ')}`);
}

if (!tables.some((name) => name === 'ec_posts')) {
	throw new Error('backup: ec_posts is not in the table list — refusing to write a useless dump');
}

try {
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
} catch (error) {
	// The captured streams may contain the presigned URL; only the exit status
	// belongs in an error log.
	throw new Error(`backup: wrangler d1 export failed (exit status ${error.status ?? 'unknown'})`);
}

console.error(`backup: wrote ${tables.length} tables to ${output}`);
