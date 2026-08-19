import { describe, expect, it } from 'vitest';
import { SITES } from './site.data.js';
import { alternateUrl, canonicalUrl, yearsBuilding } from './site';

describe('canonicalUrl', () => {
	it('points published posts at seanbehan.ca from either variant', () => {
		expect(canonicalUrl('/posts/nixos', { post: true })).toBe('https://seanbehan.ca/posts/nixos');
	});

	it('leaves drafts and non-posts on this origin', () => {
		expect(canonicalUrl('/posts/website', { post: true, draft: true })).toMatch(
			/\/posts\/website$/
		);
		expect(canonicalUrl('/')).toBe(SITES.seanbehan.url);
		expect(canonicalUrl('/contact')).toBe(`${SITES.seanbehan.url}/contact`);
	});
});

describe('alternateUrl', () => {
	it('names the sibling origin for a published post', () => {
		expect(alternateUrl('/posts/nixos', { post: true })).toBe('https://codebam.ca/posts/nixos');
	});

	it('is absent for drafts and non-posts', () => {
		expect(alternateUrl('/posts/website', { post: true, draft: true })).toBeUndefined();
		expect(alternateUrl('/')).toBeUndefined();
	});
});

describe('yearsBuilding', () => {
	it('counts whole years from January 2014', () => {
		expect(yearsBuilding(Date.UTC(2014, 0, 1))).toBe(0);
		expect(yearsBuilding(Date.UTC(2026, 0, 1))).toBe(12);
		expect(yearsBuilding(Date.UTC(2025, 11, 31))).toBe(11);
	});
});
