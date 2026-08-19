// @vitest-environment node
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * svelte:head appends. A page that also writes <meta name="description">
 * next to the layout's one ships two of them — which is what production
 * was doing on every inner page. These assertions read the built HTML so
 * that regression is a failed test rather than a silent second tag.
 */
const PAGES: { file: string; description: string | RegExp; ogTitle: string }[] = [
	{
		file: 'index.html',
		description:
			'Sean Behan — full-stack developer working in Rust, TypeScript and NixOS. Writing about Linux, Cloudflare Workers, and building software.',
		ogTitle: 'Sean Behan'
	},
	{
		file: 'posts.html',
		description: 'Posts on Linux, NixOS, Rust, and Cloudflare Workers.',
		ogTitle: 'Writing — Sean Behan'
	},
	{
		file: 'contact.html',
		description: 'Get in touch with Sean Behan — email, GitHub, Mastodon.',
		ogTitle: 'Contact — Sean Behan'
	},
	{
		file: 'posts/tag/nixos.html',
		description: /posts tagged “NixOS”/,
		ogTitle: 'NixOS — Sean Behan'
	}
];

const attr = (html: string, name: string, attrName = 'name') =>
	[...html.matchAll(new RegExp(`<meta\\s+${attrName}="${name}"\\s+content="([^"]*)"`, 'g'))].map(
		(m) => m[1]
	);

describe('built page metadata', () => {
	it(
		'emits exactly one description and an og:title that matches the page',
		{ timeout: 300_000 },
		() => {
			if (!existsSync(resolve('.svelte-kit/cloudflare/index.html'))) {
				execSync('npm run build', { stdio: 'pipe' });
			}

			for (const page of PAGES) {
				const file = resolve(`.svelte-kit/cloudflare/${page.file}`);
				expect(existsSync(file), `${page.file}: built output missing`).toBe(true);
				const html = readFileSync(file, 'utf8');

				const descriptions = attr(html, 'description');
				expect(
					descriptions,
					`${page.file}: expected one description, got ${descriptions.length}`
				).toHaveLength(1);
				if (typeof page.description === 'string') {
					expect(descriptions[0]).toBe(page.description);
				} else {
					expect(descriptions[0]).toMatch(page.description);
				}

				const titles = attr(html, 'og:title', 'property');
				expect(titles, `${page.file}: expected one og:title`).toHaveLength(1);
				expect(titles[0]).toBe(page.ogTitle);

				const twitter = attr(html, 'twitter:title');
				expect(twitter, `${page.file}: expected one twitter:title`).toHaveLength(1);
				expect(twitter[0]).toBe(page.ogTitle);
			}
		}
	);

	it('prerenders drafts so they can be shared by URL, and noindexes them', () => {
		const file = resolve('.svelte-kit/cloudflare/posts/website.html');
		expect(existsSync(file), 'draft /posts/website is missing from the build').toBe(true);
		const html = readFileSync(file, 'utf8');
		expect(html).toContain('name="robots" content="noindex, nofollow"');
	});

	it('points non-post pages at the generated site card, not the author photo', () => {
		const html = readFileSync(resolve('.svelte-kit/cloudflare/index.html'), 'utf8');
		expect(html).toContain('property="og:image" content="https://seanbehan.ca/og/site.png"');
		expect(html).toContain('property="og:image:width" content="1200"');
		expect(existsSync(resolve('.svelte-kit/cloudflare/og/site.png'))).toBe(true);
	});

	it('canonicals published posts to seanbehan.ca and names the sibling', () => {
		const html = readFileSync(resolve('.svelte-kit/cloudflare/posts/nixos.html'), 'utf8');
		expect(html).toContain('rel="canonical" href="https://seanbehan.ca/posts/nixos"');
		expect(html).toContain('rel="alternate" href="https://codebam.ca/posts/nixos"');
		expect(html).not.toContain('property="article:modified_time"');
		expect(html).toContain('"name":"Sean Behan"');
		expect(html).toContain('"alternateName":"codebam"');
	});

	it('keeps drafts self-canonical', () => {
		const html = readFileSync(resolve('.svelte-kit/cloudflare/posts/website.html'), 'utf8');
		expect(html).toContain('rel="canonical" href="https://seanbehan.ca/posts/website"');
		expect(html).not.toContain('rel="alternate" href="https://codebam.ca/posts/website"');
	});
});
