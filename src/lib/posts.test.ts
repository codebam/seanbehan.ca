import { describe, expect, it } from 'vitest';
import { plainText, prepareBody, slugifyHeading, tagCounts, toSummary } from './posts';
import type { PostSummary } from './types';

const block = (style: string, text: string) => ({
	_type: 'block',
	_key: `k-${style}-${text}`,
	style,
	children: [{ _type: 'span', text }]
});

describe('plainText', () => {
	it('collects the words in prose blocks', () => {
		expect(plainText([block('normal', 'one two'), block('h2', 'three')])).toBe('one two three');
	});

	it('ignores code blocks, which are not read at prose speed', () => {
		const body = [block('normal', 'prose'), { _type: 'code', _key: 'c', code: 'rm -rf /tmp/x' }];
		expect(plainText(body)).toBe('prose');
	});

	it('is empty for a body that is not Portable Text', () => {
		expect(plainText(undefined)).toBe('');
		expect(plainText('<p>html</p>')).toBe('');
	});
});

describe('slugifyHeading', () => {
	it('drops punctuation and hyphenates spaces', () => {
		expect(slugifyHeading('Managing dependencies with flake.lock')).toBe(
			'managing-dependencies-with-flakelock'
		);
	});
});

describe('prepareBody', () => {
	it('lists h2 and h3 headings in document order', () => {
		const { headings } = prepareBody([
			block('h2', 'Setup'),
			block('normal', 'words'),
			block('h3', 'Details')
		]);

		expect(headings).toEqual([
			{ id: 'setup', text: 'Setup', level: 2 },
			{ id: 'details', text: 'Details', level: 3 }
		]);
	});

	it('gives a repeated heading its own fragment', () => {
		const { headings } = prepareBody([block('h3', 'Conclusion'), block('h2', 'Conclusion')]);
		expect(headings.map((heading) => heading.id)).toEqual(['conclusion', 'conclusion-1']);
	});

	it('attaches each id to the block that will render it', () => {
		const { blocks, headings } = prepareBody([block('h2', 'Setup')]);
		expect((blocks[0] as { headingId?: string }).headingId).toBe(headings[0].id);
	});

	it('leaves paragraphs without an id, and never lists one', () => {
		const { blocks, headings } = prepareBody([
			block('normal', 'words'),
			block('blockquote', 'quoted')
		]);
		expect(blocks.every((b) => !('headingId' in b))).toBe(true);
		expect(headings).toEqual([]);
	});

	it('gives a deeper heading an id too, re-based like the rest', () => {
		const { blocks, headings } = prepareBody([block('h4', 'Aside')]);

		expect(headings).toEqual([{ id: 'aside', text: 'Aside', level: 2 }]);
		expect((blocks[0] as { style?: string }).style).toBe('h2');
	});

	it('re-bases a stray page-level heading rather than rendering a second h1', () => {
		const { headings } = prepareBody([block('h1', 'Title again'), block('h2', 'Section')]);
		expect(headings.map((heading) => heading.level)).toEqual([2, 3]);
	});

	/**
	 * Every section in the archive is stored as `###`, which rendered as an `h1`
	 * title followed by `h3` sections — a skipped level on every post.
	 */
	it('re-bases an all-h3 body so its sections sit directly under the page h1', () => {
		const { blocks, headings } = prepareBody([block('h3', 'Setup'), block('h3', 'Details')]);

		expect(headings.map((heading) => heading.level)).toEqual([2, 2]);
		expect(blocks.map((b) => (b as { style?: string }).style)).toEqual(['h2', 'h2']);
	});

	it('keeps the distance between levels when it re-bases them', () => {
		const { blocks, headings } = prepareBody([block('h3', 'Setup'), block('h3', 'Details')]);

		expect(blocks).toHaveLength(headings.length);
		const mixed = prepareBody([block('h2', 'Setup'), block('h3', 'Details')]);
		expect(mixed.headings.map((heading) => heading.level)).toEqual([2, 3]);
		expect(mixed.blocks.map((b) => (b as { style?: string }).style)).toEqual(['h2', 'h3']);
	});

	it('leaves a body with no headings alone', () => {
		const { blocks, headings } = prepareBody([block('normal', 'words')]);
		expect(headings).toEqual([]);
		expect((blocks[0] as { style?: string }).style).toBe('normal');
	});
});

describe('toSummary', () => {
	const entry = (data: Record<string, unknown>) =>
		({ id: 'nixos', data: { id: '01ABC', title: 'NixOS Flakes', ...data } }) as never;

	it('reads the CMS entry with the field names the templates use', () => {
		const post = toSummary(
			entry({
				excerpt: 'What a flake actually is.',
				status: 'published',
				publishedAt: new Date('2024-06-01T22:38:41Z'),
				updatedAt: new Date('2024-06-01T22:38:41Z'),
				content: [block('normal', 'one two three')]
			}),
			['nixos']
		);

		expect(post.path).toBe('/posts/nixos');
		expect(post.meta.date).toBe('2024-06-01T22:38:41.000Z');
		expect(post.meta.description).toBe('What a flake actually is.');
		expect(post.meta.tags).toEqual(['nixos']);
		expect(post.meta.draft).toBe(false);
	});

	it('reports an unpublished entry as a draft', () => {
		const post = toSummary(entry({ status: 'draft', publishedAt: null }));
		expect(post.meta.draft).toBe(true);
	});

	it('advertises a modified date only for a real edit', () => {
		const published = new Date('2024-06-01T22:38:41Z');

		// Publishing touches updated_at, so an untouched post would otherwise
		// claim to have been modified at the moment it went out.
		const untouched = toSummary(entry({ publishedAt: published, updatedAt: published }));
		expect(untouched.meta.updated).toBeUndefined();

		const edited = toSummary(
			entry({ publishedAt: published, updatedAt: new Date('2025-02-02T00:00:00Z') })
		);
		expect(edited.meta.updated).toBe('2025-02-02T00:00:00.000Z');
	});
});

describe('tagCounts', () => {
	const post = (tags: string[]): PostSummary => ({
		path: '/posts/x',
		slug: 'x',
		meta: { title: 'x', date: '2026-01-01', tags, draft: false }
	});

	it('counts by slug and sorts by frequency, then alphabetically', () => {
		expect(tagCounts([post(['Linux', 'NixOS']), post(['linux']), post(['rust'])])).toEqual([
			{ slug: 'linux', count: 2 },
			{ slug: 'nixos', count: 1 },
			{ slug: 'rust', count: 1 }
		]);
	});
});
