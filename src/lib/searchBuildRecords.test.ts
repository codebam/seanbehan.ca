import { describe, expect, it } from 'vitest';
import { buildRecords } from './search';
import type { PostSummary } from './types';

const full: PostSummary = {
	path: '/posts/linux',
	slug: 'linux',
	meta: {
		title: 'Booting Linux',
		date: '2026-01-01',
		description: 'A one-line pitch.',
		tags: ['linux', 'boot'],
		draft: false
	},
	readingMinutes: 4
};

describe('buildRecords', () => {
	it('flattens a post into the four fields the ranker can hit', () => {
		expect(buildRecords([full], new Map([['linux', 'the kernel starts here']]))).toEqual([
			{
				slug: 'linux',
				title: 'Booting Linux',
				description: 'A one-line pitch.',
				tags: ['linux', 'boot'],
				body: 'the kernel starts here'
			}
		]);
	});

	it('defaults a missing description and body to empty strings', () => {
		const minimal: PostSummary = {
			path: '/posts/minimal',
			slug: 'minimal',
			meta: { title: 'Minimal', date: '2026-01-01', tags: [], draft: false }
		};

		expect(buildRecords([minimal], new Map())).toEqual([
			{ slug: 'minimal', title: 'Minimal', description: '', tags: [], body: '' }
		]);
	});

	it('looks a body up by slug, not by the post path', () => {
		const bodies = new Map([
			['linux', 'keyed by slug'],
			['/posts/linux', 'keyed by path']
		]);

		expect(buildRecords([full], bodies)[0].body).toBe('keyed by slug');
	});

	it('keeps one record per post in the published order', () => {
		const other: PostSummary = {
			...full,
			path: '/posts/other',
			slug: 'other',
			meta: { ...full.meta, title: 'Other' }
		};

		expect(buildRecords([full, other], new Map()).map((record) => record.slug)).toEqual([
			'linux',
			'other'
		]);
	});
});
