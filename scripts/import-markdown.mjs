/**
 * One-time import of the SvelteKit-era markdown posts into EmDash.
 *
 * The posts lived as `src/routes/posts/<slug>.md` with YAML frontmatter. Here
 * they become rows in the `posts` collection: the body goes through the CLI,
 * which converts markdown to Portable Text server-side, so fences, marks and
 * lists land as real blocks rather than one opaque string.
 *
 * Two things the create API cannot express are patched afterwards in SQL:
 *
 *   - `published_at`. The API stamps "now" on publish and refuses a scheduled
 *     date in the past, so a 2023 post would otherwise claim to be from today.
 *   - taxonomy assignment. `emdash taxonomy` creates terms but has no command
 *     to attach one to an entry.
 *
 * The same patch is written to `scripts/out/backfill.sql` so the deployed D1
 * can be brought to the same state with `wrangler d1 execute --remote --file`.
 *
 * Usage (dev server must be running):
 *   node scripts/import-markdown.mjs [--dry-run]
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const POSTS_DIR = resolve(ROOT, '../src/routes/posts');
const OUT_DIR = join(ROOT, 'scripts/out');
const DRY = process.argv.includes('--dry-run');

/** Tag display labels, mirroring src/lib/tags.ts on the SvelteKit side. */
const TAG_LABELS = {
	nixos: 'NixOS',
	typescript: 'TypeScript',
	javascript: 'JavaScript',
	sveltekit: 'SvelteKit',
	svelte: 'Svelte',
	'steam-deck': 'Steam Deck',
	'secure-boot': 'Secure Boot',
	wireshark: 'Wireshark',
	cloudflare: 'Cloudflare',
	usb: 'USB',
	css: 'CSS',
	raid: 'RAID',
	linux: 'Linux',
	rust: 'Rust',
	systemd: 'systemd',
	podman: 'Podman',
	docker: 'Docker',
	ostree: 'OSTree',
	react: 'React',
	websocket: 'WebSocket',
	alpine: 'Alpine',
	quadlet: 'Quadlet'
};

const slugifyTag = (tag) => tag.trim().toLowerCase().replace(/\s+/g, '-');
const displayTag = (tag) => TAG_LABELS[slugifyTag(tag)] ?? tag;

/**
 * The frontmatter here is a fixed, small dialect — scalars, one list, no
 * anchors or nesting — so it is parsed directly rather than pulling in a YAML
 * dependency for a script that runs once.
 */
function parseFrontmatter(raw) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
	if (!match) throw new Error('no frontmatter');
	const [, head, body] = match;
	const meta = {};
	let listKey = null;

	for (const line of head.split(/\r?\n/)) {
		const item = /^\s+-\s+(.*)$/.exec(line);
		if (item && listKey) {
			meta[listKey].push(unquote(item[1]));
			continue;
		}
		const pair = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
		if (!pair) continue;
		const [, key, value] = pair;
		if (value === '') {
			listKey = key;
			meta[key] = [];
		} else {
			listKey = null;
			meta[key] = unquote(value);
		}
	}
	return { meta, body: body.trim() };
}

const unquote = (v) => v.trim().replace(/^['"]|['"]$/g, '');

/** ISO 8601 in the form the content tables store. */
function isoDate(value, what) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) throw new Error(`invalid ${what}: ${value}`);
	return date.toISOString();
}

function emdash(args, { json = true } = {}) {
	const out = execFileSync('npx', ['emdash', ...args, ...(json ? ['--json'] : [])], {
		cwd: ROOT,
		encoding: 'utf8',
		maxBuffer: 64 * 1024 * 1024
	});
	if (!json) return out;
	const start = out.indexOf('{');
	const arrayStart = out.indexOf('[');
	const from = start === -1 ? arrayStart : arrayStart === -1 ? start : Math.min(start, arrayStart);
	if (from === -1) throw new Error(`no JSON in output: ${out.slice(0, 200)}`);
	return JSON.parse(out.slice(from));
}

const sqlString = (value) => (value === null ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`);

const posts = readdirSync(POSTS_DIR)
	.filter((f) => f.endsWith('.md'))
	.sort()
	.map((file) => {
		const slug = basename(file, '.md');
		const { meta, body } = parseFrontmatter(readFileSync(join(POSTS_DIR, file), 'utf8'));
		if (!meta.title || !meta.date) throw new Error(`${file}: missing title or date`);
		return {
			slug,
			body,
			title: meta.title,
			excerpt: meta.description ?? null,
			publishedAt: isoDate(meta.date, `${file} date`),
			updatedAt: meta.updated ? isoDate(meta.updated, `${file} updated`) : null,
			draft: meta.draft === 'true' || meta.draft === true,
			image: meta.image ?? null,
			tags: (meta.tags ?? []).map((t) => ({ slug: slugifyTag(t), label: displayTag(t) }))
		};
	});

console.log(`${posts.length} markdown posts found in ${POSTS_DIR}`);
for (const post of posts) {
	console.log(
		`  ${post.slug.padEnd(28)} ${post.publishedAt.slice(0, 10)}  ${post.draft ? 'draft ' : 'live  '}${post.tags.map((t) => t.slug).join(',')}`
	);
}
if (DRY) process.exit(0);

// Terms first: an entry can only be attached to a term that exists.
const wanted = new Map();
for (const post of posts) for (const tag of post.tags) wanted.set(tag.slug, tag.label);

const existing = new Map(
	(emdash(['taxonomy', 'terms', 'tag']).items ?? []).map((t) => [t.slug, t.id])
);
for (const [slug, label] of [...wanted].sort()) {
	if (existing.has(slug)) continue;
	const term = emdash(['taxonomy', 'add-term', 'tag', '--name', label, '--slug', slug]);
	existing.set(slug, term.id ?? term.term?.id);
	console.log(`term  + ${slug}`);
}

// Then the entries. Drafts are created with --draft so they stay unpublished,
// matching `draft: true` in the old frontmatter.
const created = [];
for (const post of posts) {
	const data = { title: post.title, content: post.body };
	if (post.excerpt) data.excerpt = post.excerpt;

	const args = ['content', 'create', 'posts', '--slug', post.slug, '--data', JSON.stringify(data)];
	if (post.draft) args.push('--draft');

	const entry = emdash(args);
	created.push({ ...post, id: entry.id });
	console.log(`post  + ${post.slug} -> ${entry.id}`);
}

// Finally the backfill the API has no route for.
const statements = [];
for (const post of created) {
	statements.push(
		`UPDATE ec_posts SET published_at = ${sqlString(post.draft ? null : post.publishedAt)}, ` +
			`created_at = ${sqlString(post.publishedAt)}, ` +
			`updated_at = ${sqlString(post.updatedAt ?? post.publishedAt)} ` +
			`WHERE id = ${sqlString(post.id)};`
	);
	for (const tag of post.tags) {
		const termId = existing.get(tag.slug);
		statements.push(
			`INSERT OR IGNORE INTO content_taxonomies ` +
				`(collection, entry_id, taxonomy_id, status, published_at, created_at, locale) VALUES ` +
				`('posts', ${sqlString(post.id)}, ${sqlString(termId)}, ` +
				`${sqlString(post.draft ? 'draft' : 'published')}, ` +
				`${sqlString(post.draft ? null : post.publishedAt)}, ${sqlString(post.publishedAt)}, 'en');`
		);
	}
}

mkdirSync(OUT_DIR, { recursive: true });
const sqlPath = join(OUT_DIR, 'backfill.sql');
writeFileSync(sqlPath, statements.join('\n') + '\n');
console.log(`\nwrote ${statements.length} statements to ${sqlPath}`);
console.log('apply locally:  node scripts/apply-backfill.mjs');
console.log(
	'apply on D1:    npx wrangler d1 execute <db> --remote --file scripts/out/backfill.sql'
);
