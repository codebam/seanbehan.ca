import { describe, expect, it } from 'vitest';
import { robotsTxt } from './robots';
import { SITES, absolute, site } from './site';

const body = robotsTxt();

// The whole blocked set. The original suite samples four of these; pinning the
// rest here also lets us assert the shape of every per-crawler group.
const BLOCKED = [
	'SemrushBot',
	'SemrushBot-SA',
	'AhrefsBot',
	'dotbot',
	'rogerbot',
	'BLEXBot',
	'AspiegelBot',
	'ZoominfoBot',
	'Yandex',
	'MJ12bot'
];

describe('robots.txt sitemap directive', () => {
	it('emits exactly one Sitemap line, derived from absolute()', () => {
		const lines = body.split('\n').filter((line) => line.startsWith('Sitemap:'));
		expect(lines).toEqual([`Sitemap: ${absolute('/sitemap.xml')}`]);
	});

	it('points the sitemap at this origin, never the sibling host', () => {
		const url = body.match(/^Sitemap: (.*)$/m)?.[1];
		expect(url).toMatch(/^https:\/\//);
		expect(new URL(url!).origin).toBe(site.url);
		expect(url).not.toContain(new URL(SITES.codebam.url).host);
	});

	it('puts the Sitemap line last, behind a blank separator', () => {
		const lines = body.split('\n');
		const index = lines.findIndex((line) => line.startsWith('Sitemap:'));
		expect(lines[index - 1]).toBe('');
		expect(lines.slice(index + 1).every((line) => line === '')).toBe(true);
	});
});

describe('robots.txt host rules', () => {
	it('blocks every scraper in the list, not just a sampled few', () => {
		for (const bot of BLOCKED) {
			expect(body).toContain(`User-agent: ${bot}\nDisallow: /`);
		}
	});

	it('gives each blocked scraper one group that disallows everything', () => {
		for (const bot of BLOCKED) {
			const escaped = bot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			expect(body.match(new RegExp(`^User-agent: ${escaped}$`, 'gm')), bot).toHaveLength(1);

			const marker = `User-agent: ${bot}\n`;
			const start = body.indexOf(marker) + marker.length;
			expect(body.slice(start).split('\n')[0], bot).toBe('Disallow: /');
		}
	});

	it('has one disallow-all group per blocked scraper and no extras', () => {
		const groups = body.match(/^User-agent: (?!\*).+$/gm) ?? [];
		expect(groups.map((line) => line.slice('User-agent: '.length))).toEqual(BLOCKED);
	});
});
