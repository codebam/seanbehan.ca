import { describe, expect, it } from 'vitest';
import { robotsTxt } from './robots';

const BOTS = [
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

const body = robotsTxt();

describe('robotsTxt scraper blocklist', () => {
	it('blocks every scraper, not just the four the smoke test names', () => {
		for (const bot of BOTS) {
			expect(body).toContain(`User-agent: ${bot}\nDisallow: /`);
		}
	});

	it('gives each scraper exactly one group and one blanket Disallow', () => {
		// The wildcard group's `Disallow: /_emdash/` is a different rule; only
		// the scraper groups use a bare `Disallow: /`.
		expect(body.match(/^Disallow: \/$/gm)).toHaveLength(BOTS.length);
		for (const bot of BOTS) {
			const agent = bot.replace(/-/g, '\\-');
			expect(body.match(new RegExp(`^User-agent: ${agent}$`, 'gm'))).toHaveLength(1);
		}
	});
});
