import { describe, expect, it } from 'vitest';
import { questionTerms, rankedSlugs } from './ranking';
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

describe('questionTerms', () => {
	it('keeps content words and drops question scaffolding and the byline', () => {
		expect(questionTerms('What has Sean Behan written about NixOS?')).toEqual(['nixos']);
	});

	it('orders longer terms first so the topic outranks a short name', () => {
		expect(questionTerms('How does Cloudflare Workers compare with Rust?')).toEqual([
			'cloudflare',
			'workers',
			'compare',
			'rust'
		]);
	});
});

describe('rankedSlugs', () => {
	it('leaves a keyword query to the archive scorer', () => {
		expect(rankedSlugs('nixos flakes', records, 5)).toEqual(['nixos']);
	});

	it('falls back to content words when the whole question matches nothing', () => {
		expect(rankedSlugs('What has Sean written about NixOS?', records, 5)).toEqual(['nixos']);
	});

	it('returns nothing for a question with no content words', () => {
		expect(rankedSlugs('What does he do?', records, 5)).toEqual([]);
	});

	it('honours the limit, including a caller that is already full', () => {
		expect(rankedSlugs('What about NixOS and Rust?', records, 1)).toEqual(['nixos']);
		expect(rankedSlugs('What about NixOS and Rust?', records, 0)).toEqual([]);
	});
});
