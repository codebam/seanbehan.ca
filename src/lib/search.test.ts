import { describe, expect, it } from 'vitest';
import { rank } from './search';

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
});
