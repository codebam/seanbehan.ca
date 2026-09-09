import { describe, expect, it } from 'vitest';
import { robotsTxt } from './robots';

const body = robotsTxt();

describe('robotsTxt', () => {
	it('emits exactly one group for the wildcard user-agent', () => {
		// Two `User-agent: *` groups are mergeable per the spec but not merged by
		// every crawler. The wildcard rules belong in one group.
		expect(body.match(/^User-agent: \*$/gm)).toHaveLength(1);
	});

	it('allows the site but keeps crawlers out of the CMS', () => {
		const wildcard = body.slice(
			body.indexOf('User-agent: *'),
			body.indexOf('User-agent: SemrushBot')
		);
		expect(wildcard).toContain('Allow: /');
		expect(wildcard).toContain('Disallow: /_emdash/');
	});

	it('blocks the scrapers that take without giving back', () => {
		for (const bot of ['SemrushBot', 'AhrefsBot', 'Yandex', 'MJ12bot']) {
			expect(body).toContain(`User-agent: ${bot}\nDisallow: /`);
		}
	});

	it('points at this origin\u2019s absolute sitemap', () => {
		expect(body).toContain('Sitemap: https://seanbehan.ca/sitemap.xml');
	});
});
