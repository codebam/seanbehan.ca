import { describe, expect, it } from 'vitest';
import { buildRecords, type SearchRecord } from './search';
import type { PostSummary } from './types';

function post(slug: string, meta: Partial<PostSummary['meta']> = {}): PostSummary {
	return {
		path: `/posts/${slug}`,
		slug,
		meta: {
			title: slug,
			date: '2026-01-01',
			tags: [],
			draft: false,
			...meta
		}
	};
}

describe('buildRecords', () => {
	it('flattens a post into the five fields the ranker scores', () => {
		const expected: SearchRecord = {
			slug: 'booting-linux',
			title: 'Booting Linux the slow way',
			description: 'What happens between power-on and a shell.',
			tags: ['linux', 'firmware'],
			body: 'The kernel asks the firmware for memory.'
		};

		expect(
			buildRecords(
				[
					post('booting-linux', {
						title: expected.title,
						description: expected.description,
						tags: expected.tags
					})
				],
				new Map([['booting-linux', expected.body]])
			)
		).toEqual([expected]);
	});

	it('defaults a missing description to the empty string', () => {
		expect(buildRecords([post('no-desc')], new Map())[0].description).toBe('');
	});

	it('defaults a slug absent from the bodies map to an empty body', () => {
		const records = buildRecords(
			[post('missing')],
			new Map([['other', 'a body for a different post']])
		);

		expect(records[0].body).toBe('');
	});

	it('identifies a record by slug, not by the site path', () => {
		const [record] = buildRecords([post('a-slug')], new Map());

		expect(record.slug).toBe('a-slug');
		expect(record).not.toHaveProperty('path');
		expect(record).not.toHaveProperty('url');
	});

	it('keeps post order and returns nothing for an empty archive', () => {
		const posts = [post('later'), post('earlier')];

		expect(buildRecords(posts, new Map()).map((record) => record.slug)).toEqual([
			'later',
			'earlier'
		]);
		expect(buildRecords([], new Map())).toEqual([]);
	});
});
