import { describe, expect, it } from 'vitest';
import { COMMERCE, SITES, siteFor } from './site.data.js';

describe('siteFor', () => {
	it('selects the legal-name origin as the canonical variant', () => {
		const site = siteFor('seanbehan');
		expect(site).toBe(SITES.seanbehan);
		expect(site.id).toBe('seanbehan');
		expect(site.url).toBe('https://seanbehan.ca');
		expect(site.name).toBe('Sean Behan');
		expect(site.title).toBe('Sean Behan — Senior full-stack developer');
		expect(site.ogTitle).toBe('Sean Behan');
		expect(site.ogDescription).toBe(
			'Senior full-stack developer · Ontario, Canada · Open to work.'
		);
		expect(site.leadWith).toBe('facts');
		expect(site.showResume).toBe(true);
		expect(site.availability?.label).toBe('Open to work');
		expect(site.primaryAction).toEqual({ label: 'View the résumé', href: '/resume' });
	});

	it('selects the handle origin as the alternate variant', () => {
		const site = siteFor('codebam');
		expect(site).toBe(SITES.codebam);
		expect(site.id).toBe('codebam');
		expect(site.url).toBe('https://codebam.ca');
		expect(site.name).toBe('codebam');
		expect(site.title).toBe('codebam — Rust, TypeScript, NixOS');
		expect(site.ogTitle).toBe('codebam');
		expect(site.ogDescription).toBe('Open source in Rust, TypeScript and NixOS.');
		expect(site.leadWith).toBe('work');
		expect(site.showResume).toBe(false);
		expect(site.availability).toBeNull();
		expect(site.primaryAction).toEqual({
			label: 'Work with me',
			href: '/services',
			via: 'commerce'
		});
	});

	it('falls back to the canonical variant for an unknown or missing id', () => {
		expect(siteFor('unknown')).toBe(SITES.seanbehan);
		expect(siteFor('')).toBe(SITES.seanbehan);
		expect(siteFor(undefined)).toBe(SITES.seanbehan);
	});
});

describe('site data tables', () => {
	it('holds commercial facts only for the canonical variant', () => {
		expect(Object.keys(COMMERCE)).toEqual(['seanbehan']);
		expect(Object.keys(SITES).sort()).toEqual(['codebam', 'seanbehan']);
	});
});
