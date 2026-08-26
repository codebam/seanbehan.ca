import { describe, expect, it } from 'vitest';
import { SITES } from './site.data.js';
import { canonicalUrl, projectHref, writingHref, yearsBuilding } from './site';

describe('canonicalUrl', () => {
	it('points published posts at seanbehan.ca from either variant', () => {
		expect(canonicalUrl('/posts/nixos', { post: true })).toBe('https://seanbehan.ca/posts/nixos');
	});

	it('normalizes trailing slashes', () => {
		expect(canonicalUrl('/posts/')).toBe(`${SITES.seanbehan.url}/posts`);
	});

	it('leaves drafts and non-posts on this origin', () => {
		expect(canonicalUrl('/posts/website', { post: true, draft: true })).toMatch(
			/\/posts\/website$/
		);
		expect(canonicalUrl('/')).toBe(SITES.seanbehan.url);
		expect(canonicalUrl('/contact')).toBe(`${SITES.seanbehan.url}/contact`);
	});
});

describe('content origins', () => {
	it('keeps writing on the Sean variant', () => {
		expect(writingHref('/posts/nixos')).toBe('/posts/nixos');
	});

	it('sends project case studies to codebam.ca', () => {
		expect(projectHref('/projects/viewport')).toBe('https://codebam.ca/projects/viewport');
	});
});

describe('yearsBuilding', () => {
	it('counts whole years from January 2014', () => {
		expect(yearsBuilding(Date.UTC(2014, 0, 1))).toBe(0);
		expect(yearsBuilding(Date.UTC(2026, 0, 1))).toBe(12);
		expect(yearsBuilding(Date.UTC(2025, 11, 31))).toBe(11);
	});
});
