import { describe, expect, it, vi } from 'vitest';

// The filename helpers never touch the bucket, but importing the module
// pulls in the Worker-only `env` binding. Stub it so the pure helpers can be
// exercised under plain Node.
vi.mock('cloudflare:workers', () => ({ env: {} }));

import { resumePdfFilename, resumeTxtFilename } from './resume';

describe('resume filename helpers', () => {
	it('names the default résumé after the site identity', () => {
		expect(resumePdfFilename()).toBe('Sean-Behan-Resume.pdf');
		expect(resumeTxtFilename()).toBe('Sean-Behan-Resume.txt');
	});

	it('uses an explicit name when one is given', () => {
		expect(resumePdfFilename('Ada Lovelace')).toBe('Ada-Lovelace-Resume.pdf');
		expect(resumeTxtFilename('Ada Lovelace')).toBe('Ada-Lovelace-Resume.txt');
	});

	it('applies the same slug rules to every extension', () => {
		expect(resumePdfFilename("O'Neil")).toBe('O-Neil-Resume.pdf');
		expect(resumeTxtFilename("O'Neil")).toBe('O-Neil-Resume.txt');
	});
});

describe('resume filename slug', () => {
	it('collapses runs of punctuation and whitespace into one hyphen', () => {
		expect(resumePdfFilename('  Sean   J.  Behan  ')).toBe('Sean-J-Behan-Resume.pdf');
	});

	it('keeps Unicode letters and digits', () => {
		expect(resumePdfFilename('Seán 2 Behan')).toBe('Seán-2-Behan-Resume.pdf');
	});

	it('trims leading and trailing punctuation', () => {
		expect(resumePdfFilename('—Sean Behan—')).toBe('Sean-Behan-Resume.pdf');
	});

	it('preserves the case it is given', () => {
		expect(resumePdfFilename('sean behan')).toBe('sean-behan-Resume.pdf');
	});

	it('falls back to resume when the name has no letters or numbers', () => {
		expect(resumePdfFilename('  —  ')).toBe('resume-Resume.pdf');
		expect(resumeTxtFilename('')).toBe('resume-Resume.txt');
	});
});
