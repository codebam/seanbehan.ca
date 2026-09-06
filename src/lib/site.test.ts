import { describe, expect, it } from 'vitest';
import { SITES } from './site.data.js';
import {
	canonicalUrl,
	isSiblingHref,
	projectHref,
	siblingHost,
	writingHref,
	yearsBuilding
} from './site';

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

describe('isSiblingHref', () => {
	it('flags the other variant origin (the seanbehan build)', () => {
		expect(isSiblingHref('https://codebam.ca/services')).toBe(true);
		expect(isSiblingHref('https://codebam.ca')).toBe(true);
	});

	it('ignores same-origin paths and truly external URLs', () => {
		expect(isSiblingHref('/posts')).toBe(false);
		expect(isSiblingHref('https://seanbehan.ca/contact')).toBe(false);
		expect(isSiblingHref('https://github.com/codebam')).toBe(false);
		expect(isSiblingHref('mailto:sean@seanbehan.ca')).toBe(false);
	});

	it('is not fooled by a host that merely starts with ours', () => {
		expect(isSiblingHref('https://seanbehan.ca.evil.com/posts')).toBe(false);
	});

	it('names the host a sibling href points at', () => {
		expect(siblingHost('https://codebam.ca/services')).toBe('codebam.ca');
	});
});

describe('yearsBuilding', () => {
	it('counts whole years from January 2014', () => {
		expect(yearsBuilding(Date.UTC(2014, 0, 1))).toBe(0);
		expect(yearsBuilding(Date.UTC(2026, 0, 1))).toBe(12);
		expect(yearsBuilding(Date.UTC(2025, 11, 31))).toBe(11);
	});
});
