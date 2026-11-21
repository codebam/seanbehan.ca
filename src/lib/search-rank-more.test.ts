import { describe, expect, it } from 'vitest';
import { MAX_QUERY_LENGTH, clampQuery, isSearchableQuery, rank, type SearchRecord } from './search';

const records: SearchRecord[] = [
	{
		slug: 'booting-linux',
		title: 'Booting Linux the slow way',
		description: 'What happens before a shell.',
		tags: ['linux'],
		body: 'The kernel asks the firmware for memory.'
	},
	{
		slug: 'melody-title',
		title: 'Melodious evenings',
		description: '',
		tags: [],
		body: 'unrelated prose words'
	},
	{
		slug: 'overture',
		title: 'A quiet morning',
		description: 'A melodious overture for the start of the day.',
		tags: [],
		body: 'Coffee and a window open.'
	}
];

describe('clampQuery', () => {
	it('leaves an empty string empty', () => {
		expect(clampQuery('')).toBe('');
	});

	it('leaves a query exactly at the cap untouched', () => {
		const exact = 'a'.repeat(MAX_QUERY_LENGTH);
		expect(clampQuery(exact)).toBe(exact);
		expect(clampQuery(exact)).toHaveLength(MAX_QUERY_LENGTH);
	});

	it('collapses tabs and runs of newlines as well as spaces', () => {
		expect(clampQuery('\tlinux\n\n  kernel\t')).toBe('linux kernel');
	});
});

describe('isSearchableQuery', () => {
	it('rejects an empty or whitespace-only query', () => {
		expect(isSearchableQuery('')).toBe(false);
		expect(isSearchableQuery('\t \n')).toBe(false);
	});
});

describe('rank', () => {
	it('returns no slugs when there are no records to rank', () => {
		expect(rank('linux', [])).toEqual([]);
	});

	it('matches regardless of the query’s case', () => {
		expect(rank('LINUX', records)).toContain('booting-linux');
	});

	it('finds a post through a word only its description carries', () => {
		expect(rank('overture', records)).toEqual(['overture']);
	});

	it('ranks a title hit above a description hit for the same word', () => {
		const slugs = rank('melodious', records);
		expect(slugs.indexOf('melody-title')).toBeLessThan(slugs.indexOf('overture'));
	});

	it('trims a padded query before handing it to the ranker', () => {
		expect(rank('  linux  ', records)).toEqual(rank('linux', records));
	});
});
