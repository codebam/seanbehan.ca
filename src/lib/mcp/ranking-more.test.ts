import { describe, expect, it } from 'vitest';
import { QUESTION_STOPWORDS, questionTerms, rankedSlugs } from './ranking';
import type { SearchRecord } from '../search';

const records: SearchRecord[] = [
	{
		slug: 'nixos',
		title: 'NixOS Flakes',
		description: 'What a flake is.',
		tags: ['NixOS'],
		body: 'Flakes in NixOS allow you to write Nix code with pinned inputs.'
	},
	{
		slug: 'rust',
		title: 'A tiny Rust service',
		description: 'A small HTTP service.',
		tags: ['Rust'],
		body: 'Rust at the edge with no framework.'
	}
];

describe('QUESTION_STOPWORDS', () => {
	it('holds the scaffolding and the byline, not the topic', () => {
		for (const word of ['what', 'about', 'would', 'their', 'written', 'sean', 'behan']) {
			expect(QUESTION_STOPWORDS.has(word)).toBe(true);
		}
		expect(QUESTION_STOPWORDS.has('nixos')).toBe(false);
		expect(QUESTION_STOPWORDS.has('rust')).toBe(false);
	});

	it('is lowercase throughout, matching the terms the splitter produces', () => {
		for (const word of QUESTION_STOPWORDS) expect(word).toBe(word.toLowerCase());
	});
});

describe('questionTerms: remaining pure cases', () => {
	it('deduplicates a content word repeated through the question', () => {
		expect(questionTerms('Rust and Rust and Rust?')).toEqual(['rust']);
	});

	it('keeps punctuation inside a technical token but drops 1- and 2-letter words', () => {
		expect(questionTerms('How does C++ compare to Deno?')).toEqual(['compare', 'deno', 'c++']);
		expect(questionTerms('Go vs C# and AI?')).toEqual([]);
	});

	it('drops the longer stopwords too, not just the short ones', () => {
		expect(questionTerms('Would their written work be about anything?')).toEqual([
			'anything',
			'work'
		]);
	});

	it('is empty for an empty or punctuation-only question', () => {
		expect(questionTerms('')).toEqual([]);
		expect(questionTerms('   ')).toEqual([]);
		expect(questionTerms('?!')).toEqual([]);
	});
});

describe('rankedSlugs: remaining pure cases', () => {
	it('returns nothing for an empty index', () => {
		expect(rankedSlugs('What about NixOS?', [], 5)).toEqual([]);
	});

	it('returns nothing for a negative limit as well as zero', () => {
		expect(rankedSlugs('What about NixOS?', records, -3)).toEqual([]);
	});

	it('unions content words in longest-first order and emits a repeated slug once', () => {
		expect(rankedSlugs('What about NixOS and Rust?', records, 5)).toEqual(['nixos', 'rust']);
		// Both "flake" and "nixos" reach the same entry; the union is a set.
		expect(rankedSlugs('What about flake NixOS?', records, 5)).toEqual(['nixos']);
	});
});
