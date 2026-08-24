/**
 * Applies scripts/out/backfill.sql to the local dev database.
 *
 * `astro dev` runs the Worker under miniflare, so the D1 binding is a SQLite
 * file under .wrangler/state, not the `data.db` the CLI's local commands use.
 * The file is named by a hash of the binding, so it is discovered rather than
 * hardcoded — there is exactly one D1 database in this project.
 */

import Database from 'better-sqlite3';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const D1_DIR = join(ROOT, '.wrangler/state/v3/d1/miniflare-D1DatabaseObject');

const files = readdirSync(D1_DIR).filter((f) => f.endsWith('.sqlite') && f !== 'metadata.sqlite');
if (files.length !== 1) {
	throw new Error(`expected one D1 sqlite file in ${D1_DIR}, found ${files.length}`);
}

const db = new Database(join(D1_DIR, files[0]));
const sql = readFileSync(join(ROOT, 'scripts/out/backfill.sql'), 'utf8');
db.exec(sql);
console.log(`applied backfill to ${files[0]}`);
