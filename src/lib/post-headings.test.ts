import { describe, expect, it } from 'vitest';
import { slugifyHeading, tagCounts } from './posts';
import type { PostSummary } from './types';

// posts.test.ts pins one ordinary heading slug and one frequency-ordered tag
// list. These are the remaining edges of the two pure helpers: what the id
// regex keeps and drops, and how labels from the terms lookup collapse to
// slugs on their way into the counts.
const post = (tags: string[]): PostSummary => ({
	path: '/posts/x',
	slug: 'x',
	meta: { title: 'x', date: '2026-01-01', tags, draft: false }
});

describe('slugifyHeading', () => {
	it('folds case, trims padding and drops punctuation', () => {
		expect(slugifyHeading('  Mixed CASE   headings!  ')).toBe('mixed-case-headings');
	});

	it('keeps underscores and hyphens, which the id form allows', () => {
		expect(slugifyHeading('foo_bar-baz and C++')).toBe('foo_bar-baz-and-c');
	});

	it('collapses tabs and newlines into a single hyphen', () => {
		expect(slugifyHeading('Line\tBreak\nHere')).toBe('line-break-here');
	});

	it('is empty for a heading made only of punctuation', () => {
		expect(slugifyHeading('!!!')).toBe('');
	});

	it('drops non-ASCII letters, which fall outside the id character class', () => {
		expect(slugifyHeading('Café')).toBe('caf');
	});
});

describe('tagCounts', () => {
	it('returns nothing for an empty archive or posts without tags', () => {
		expect(tagCounts([])).toEqual([]);
		expect(tagCounts([post([]), post([])])).toEqual([]);
	});

	it('counts every occurrence, including repeats within one post', () => {
		expect(tagCounts([post(['Linux', 'linux', 'LINUX'])])).toEqual([{ slug: 'linux', count: 3 }]);
	});

	it('collapses differently spaced labels onto the same slug', () => {
		// A term whose label is blank reaches the archive as its slug, and the
		// label itself may carry padding the tag links must not inherit.
		expect(tagCounts([post(['Secure Boot']), post([' secure   boot ']), post(['NixOS'])])).toEqual([
			{ slug: 'secure-boot', count: 2 },
			{ slug: 'nixos', count: 1 }
		]);
	});
});
