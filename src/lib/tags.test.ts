import { describe, expect, it } from 'vitest';
import { displayTag, slugifyTag } from './tags';

describe('slugifyTag', () => {
	it.each([
		['  NixOS  ', 'nixos'],
		['Secure Boot', 'secure-boot'],
		['Steam   Deck', 'steam-deck'],
		['\tWSL2\n', 'wsl2']
	])('turns %j into the slug %j', (tag, expected) => {
		expect(slugifyTag(tag)).toBe(expected);
	});

	it('collapses runs of whitespace to a single hyphen', () => {
		expect(slugifyTag('a   b \t c')).toBe('a-b-c');
	});

	it('leaves already-slug input unchanged', () => {
		expect(slugifyTag('steam-deck')).toBe('steam-deck');
		expect(slugifyTag('nixos')).toBe('nixos');
	});
});

describe('displayTag', () => {
	it.each([
		['nixos', 'NixOS'],
		['typescript', 'TypeScript'],
		['steam-deck', 'Steam Deck']
	])('maps the known tag %j to %j', (tag, expected) => {
		expect(displayTag(tag)).toBe(expected);
	});

	it('maps the slugified form of a mixed-case, spaced input', () => {
		expect(displayTag('  Steam   Deck ')).toBe('Steam Deck');
		expect(displayTag('NIXOS')).toBe('NixOS');
	});

	it('returns unknown tags verbatim', () => {
		expect(displayTag('some-unknown-tag')).toBe('some-unknown-tag');
		expect(displayTag('Some Weird Tag')).toBe('Some Weird Tag');
	});

	it.each(['constructor', 'toString', '__proto__'])(
		'does not read inherited object keys for %j',
		(tag) => {
			expect(displayTag(tag)).toBe(tag);
		}
	);
});
