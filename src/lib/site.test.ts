import { describe, expect, it } from 'vitest';
import { SITES } from './site.data.js';
import {
	canonicalUrl,
	isSiblingHref,
	linkHref,
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

describe('linkHref', () => {
	it('leaves a local link alone', () => {
		expect(linkHref({ label: 'Work', href: '/#work' })).toBe('/#work');
		expect(linkHref({ label: 'Résumé', href: '/resume' })).toBe('/resume');
	});

	it('resolves the two cross-origin kinds from the seanbehan build', () => {
		expect(linkHref({ label: 'Writing', href: '/posts', via: 'writing' })).toBe('/posts');
		expect(linkHref({ label: 'Services', href: '/services', via: 'codebam' })).toBe(
			'https://codebam.ca/services'
		);
	});
});

describe('the hiring variant', () => {
	// The two variants are one design and two pitches, and these are the facts
	// that make seanbehan.ca the one an employer reads. They are pinned here
	// because nothing in a build would otherwise notice their loss: a dropped
	// availability line, or a résumé demoted out of the header, both render
	// cleanly and both quietly undo the reason that origin exists.
	it('declares an availability the codebam variant does not', () => {
		expect(SITES.seanbehan.availability?.label).toBeTruthy();
		expect(SITES.seanbehan.availability?.detail).toBeTruthy();
		expect(SITES.codebam.availability).toBeNull();
	});

	it('tells the work history on the hiring origin only', () => {
		const experience = SITES.seanbehan.experience;
		expect(experience?.length).toBeGreaterThan(0);
		expect(SITES.codebam.experience).toBeNull();
		for (const row of experience ?? []) {
			expect(row.role).toBeTruthy();
			expect(row.org).toBeTruthy();
			expect(row.period).toBeTruthy();
			expect(row.note).toBeTruthy();
		}
	});

	it('makes the résumé the home page’s primary action', () => {
		expect(SITES.seanbehan.primaryAction).toEqual({ label: 'View the résumé', href: '/resume' });
	});

	it('keeps the résumé in the header nav, and early in it', () => {
		const labels = SITES.seanbehan.nav.map((item) => item.label);
		expect(labels).toContain('Résumé');
		expect(labels.indexOf('Résumé')).toBeLessThan(2);
	});

	it('keeps both headers short enough to stay on one row', () => {
		// Contact is rendered by the frame and is always last, so the header
		// carries one more item than this list. Six wrapped to two rows on a
		// phone and put Résumé on the second of them.
		expect(SITES.seanbehan.nav.length).toBeLessThanOrEqual(4);
		expect(SITES.codebam.nav.length).toBeLessThanOrEqual(4);
	});

	it('points the codebam hero at the writing, on the writing’s own origin', () => {
		expect(SITES.codebam.primaryAction).toEqual({
			label: 'Read the writing',
			href: '/posts',
			via: 'writing'
		});
	});
});
