import { describe, expect, it } from 'vitest';
import { bodyMarkdown, jsonDocument, markdownDocument } from './markdown';

// The block shapes as the database actually holds them: links as markDefs,
// code with a `language`, images with an `asset.url` — the import from the
// markdown era wrote them, the admin editor keeps to them.
const block = (style: string, children: unknown[], extra: Record<string, unknown> = {}) => ({
	_type: 'block',
	_key: `b-${Math.random()}`,
	style,
	children,
	...extra
});

const span = (text: string, marks: string[] = []) => ({
	_type: 'span',
	_key: `s-${text}`,
	text,
	marks
});

const body = [
	block('h2', [span('Setup')]),
	block(
		'normal',
		[
			span('read the '),
			span('manual', ['lk']),
			span(' and run '),
			span('nix flake update', ['code'])
		],
		{ markDefs: [{ _key: 'lk', _type: 'link', href: 'https://nixos.org' }] }
	),
	block('normal', [span('first')], { listItem: 'bullet', level: 1 }),
	block('normal', [span('second')], { listItem: 'bullet', level: 1 }),
	{ _type: 'code', _key: 'c1', language: 'sh', code: 'nix flake update' },
	{ _type: 'image', _key: 'i1', alt: 'card', asset: { url: '/img/card.webp' } }
];

const entry = {
	id: 'nixos',
	data: {
		id: '01HXX',
		title: 'NixOS Flakes',
		excerpt: 'A description.',
		status: 'published',
		publishedAt: new Date('2025-11-02T10:00:00Z'),
		updatedAt: new Date('2025-11-05T10:00:00Z'),
		content: body
	}
};

describe('bodyMarkdown', () => {
	it('converts the body the CMS itself reads it back as', () => {
		expect(bodyMarkdown(body)).toBe(
			[
				'## Setup',
				'',
				'read the [manual](https://nixos.org) and run `nix flake update`',
				'',
				'- first',
				'- second',
				'',
				'```sh',
				'nix flake update',
				'```',
				'',
				'![card](https://seanbehan.ca/img/card.webp)',
				''
			].join('\n')
		);
	});

	it('absolutizes an image stored the way the feed renders it', () => {
		expect(bodyMarkdown([{ _type: 'image', _key: 'i', alt: 'A', src: '/img/a.png' }])).toBe(
			'![A](https://seanbehan.ca/img/a.png)\n'
		);
	});

	it('gives a named code block its filename above the fence', () => {
		const md = bodyMarkdown([
			{ _type: 'code', _key: 'c', language: 'nix', code: 'inputs = {};', filename: 'flake.nix' }
		]);
		expect(md).toBe('flake.nix\n\n```nix\ninputs = {};\n```\n');
	});

	it('keeps blocks no converter knows as opaque fences, not silence', () => {
		expect(bodyMarkdown([{ _type: 'embed', _key: 'e', html: '<iframe></iframe>' }])).toContain(
			'<!--ec:block'
		);
	});

	it('is empty for a body that is not Portable Text', () => {
		expect(bodyMarkdown(undefined)).toBe('');
	});
});

describe('markdownDocument', () => {
	it('leads with what the header carried: title, description, facts, origin', () => {
		const md = markdownDocument(entry as never, {
			path: '/posts/nixos',
			tags: ['nix', 'linux'],
			byline: true
		});

		expect(md).toContain('# NixOS Flakes');
		expect(md).toContain('> A description.');
		expect(md).toContain('- URL: https://seanbehan.ca/posts/nixos');
		expect(md).toContain('- Author: Sean Behan');
		expect(md).toContain('- Published: November 2, 2025');
		expect(md).toContain('- Updated: November 5, 2025');
		expect(md).toContain('- Tags: nix, linux');
		// The rule of three: header, separator, then exactly the body the
		// body-only converter produces.
		expect(md.split('\n---\n\n')[1]).toBe(bodyMarkdown(body));
	});

	it('marks the draft, and says nothing of tags a page does not have', () => {
		const page = { ...entry, data: { ...entry.data, status: 'draft' } };
		const md = markdownDocument(page as never, { path: '/pages/about-site' });
		expect(md).toContain('- Status: draft');
		expect(md).not.toContain('Tags:');
		expect(md).not.toContain('Author:');
	});

	it('singularises a one-minute read', () => {
		// The fixture body is one minute, and every short post's header read
		// "Reading time: 1 minutes" for as long as the exports have existed.
		expect(markdownDocument(entry as never, { path: '/posts/x' })).toContain(
			'Reading time: 1 minute\n'
		);

		const long = {
			...entry,
			data: {
				...entry.data,
				content: Array.from({ length: 400 }, () =>
					block('normal', [span('ten words in a sentence right here')])
				)
			}
		};
		const md = markdownDocument(long as never, { path: '/posts/x' });
		expect(md).toMatch(/Reading time: \d+ minutes\n/);
		expect(md).not.toContain('1 minutes');
	});
});

describe('jsonDocument', () => {
	it('carries the facts as fields and the body as markdown', () => {
		const doc = jsonDocument(entry as never, {
			path: '/posts/nixos',
			tags: ['nix'],
			byline: true
		});

		expect(doc).toMatchObject({
			title: 'NixOS Flakes',
			url: 'https://seanbehan.ca/posts/nixos',
			description: 'A description.',
			author: 'Sean Behan',
			published: '2025-11-02T10:00:00.000Z',
			updated: '2025-11-05T10:00:00.000Z',
			draft: false,
			tags: ['nix'],
			content_format: 'text/markdown',
			content_url: 'https://seanbehan.ca/posts/nixos.md',
			content: bodyMarkdown(body)
		});
		expect(doc.sections).toEqual([{ id: 'setup', text: 'Setup', level: 2 }]);
	});

	it('keeps every field present on a page that has none of them', () => {
		const doc = jsonDocument({ ...entry, data: { ...entry.data, excerpt: null } } as never, {
			path: '/pages/about-site'
		});
		expect(doc.description).toBeNull();
		expect(doc.author).toBeNull();
		expect(doc.tags).toEqual([]);
	});
});
