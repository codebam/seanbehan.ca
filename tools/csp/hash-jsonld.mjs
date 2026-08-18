#!/usr/bin/env node
/**
 * Add the structured-data blocks to the Content-Security-Policy.
 *
 * The layout emits a <script type="application/ld+json"> per page. SvelteKit's
 * `csp: { mode: 'auto' }` hashes the scripts *it* injects — its own bootstrap —
 * and knows nothing about markup that came out of svelte:head, so the JSON-LD
 * lands in the page without a matching hash and browsers report a violation
 * for it (the block is data, never executed, but the check still runs).
 *
 * Relaxing script-src to 'unsafe-inline' to fix that would trade the whole
 * policy for one data block. Instead, every prerendered page is walked after
 * the build, its JSON-LD hashed, and the hash appended to that page's own CSP
 * meta tag — the policy stays strict and per-page.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT_DIR = '.svelte-kit/cloudflare';
const JSON_LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
const SCRIPT_SRC = /(script-src [^;"]*)/;

async function* htmlFiles(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) yield* htmlFiles(path);
		else if (entry.name.endsWith('.html')) yield path;
	}
}

const sha256 = (value) => `'sha256-${createHash('sha256').update(value, 'utf8').digest('base64')}'`;

let patched = 0;

for await (const file of htmlFiles(OUT_DIR)) {
	const html = await readFile(file, 'utf8');
	const hashes = [...html.matchAll(JSON_LD)].map((match) => sha256(match[1]));
	if (hashes.length === 0) continue;

	// A page with no CSP meta tag is served through the Worker, which sets a
	// nonce-based policy instead; there is nothing here to patch.
	if (!SCRIPT_SRC.test(html)) continue;

	const next = html.replace(SCRIPT_SRC, (_, directive) => {
		const missing = hashes.filter((hash) => !directive.includes(hash));
		return missing.length ? `${directive} ${missing.join(' ')}` : directive;
	});

	if (next !== html) {
		await writeFile(file, next);
		patched++;
	}
}

console.log(`csp: hashed JSON-LD in ${patched} page${patched === 1 ? '' : 's'}`);
