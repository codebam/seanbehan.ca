import { describe, expect, it } from 'vitest';
import { MIN_QUERY_LENGTH, isSearchableQuery, rank } from './search';

const records = [
	{
		slug: 'booting-linux',
		title: 'Booting Linux the slow way',
		description: 'What actually happens between power-on and a shell.',
		tags: ['linux'],
		body: 'The kernel asks the firmware for memory, then hands off to init. systemd comes later.'
	},
	{
		slug: 'rust-servers',
		title: 'Rust for people who run web servers',
		description: '',
		tags: ['systemd'],
		body: 'One chapter is all about linux: linux kernels, linux panics, linux all day.'
	},
	{
		slug: 'garden',
		title: 'Composting in a cold climate',
		description: '',
		tags: [],
		body: 'Carrot tops, coffee grounds, and a bin that never fully freezes.'
	}
];

describe('rank', () => {
	it('finds a post through a word that only its body carries', () => {
		expect(rank('linux', records)).toContain('rust-servers');
	});

	it('ranks a title hit above a body-only hit for the same word', () => {
		const slugs = rank('linux', records);
		expect(slugs.indexOf('booting-linux')).toBeLessThan(slugs.indexOf('rust-servers'));
	});

	it('matches a tag even when no prose mentions it', () => {
		expect(rank('systemd', records)).toContain('rust-servers');
	});

	it('forgives a misspelling, on the grounds that was the pre-database contract', () => {
		expect(rank('lisnx', records)).toContain('booting-linux');
	});

	it('leaves out a post that matches nothing', () => {
		expect(rank('quantum entanglement', records)).not.toContain('garden');
	});

	it('finds a term deep in a long body, past Fuse’s default location window', () => {
		// Fuse's default location scoring gives the first 100 characters all the
		// weight; this term is ~2,400 characters in, so without ignoreLocation
		// there is no match — the live bug behind `toolbox`/`sbctl`.
		const filler = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ');
		const long = [
			{
				slug: 'deep',
				title: 'Deep in the stack',
				description: '',
				tags: [],
				body: `${filler} sbctl holds the keys`
			}
		];

		expect(rank('sbctl', long)).toEqual(['deep']);
	});

	it('applies one minimum-length rule to the form and the JSON endpoint', () => {
		// The no-JS form accepted a one-character query; /search.json answered
		// `{"slugs":[]}` for it, so with JS every card disappeared. Both paths
		// read this predicate now, and one character is above the floor.
		expect(MIN_QUERY_LENGTH).toBe(1);
		expect(isSearchableQuery('r')).toBe(true);
		expect(isSearchableQuery('  ')).toBe(false);
	});
});
