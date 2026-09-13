import { afterEach, describe, expect, it, vi } from 'vitest';
import { getEmDashCollection, getTermsForEntries } from 'emdash';
import {
	bodyWordCounts,
	getPosts,
	plainText,
	prepareBody,
	slugifyHeading,
	tagCounts,
	toSummary
} from './posts';
import type { PostSummary } from './types';

const block = (style: string, text: string) => ({
	_type: 'block',
	_key: `k-${style}-${text}`,
	style,
	children: [{ _type: 'span', text }]
});

const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');

vi.mock('emdash', () => ({
	getEmDashCollection: vi.fn(),
	getTermsForEntries: vi.fn()
}));

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

describe('bodyWordCounts', () => {
	it('separates prose from code blocks', () => {
		expect(
			bodyWordCounts([
				block('normal', 'one two'),
				{ _type: 'code', _key: 'c', code: 'rm -rf /tmp/x' }
			])
		).toEqual({ prose: 2, code: 3 });
	});

	it('treats an inline code mark as code too', () => {
		const body = [
			{
				_type: 'block',
				style: 'normal',
				children: [
					{ _type: 'span', text: 'see' },
					{ _type: 'span', text: 'npm run build', marks: ['code'] }
				]
			}
		];

		expect(bodyWordCounts(body)).toEqual({ prose: 1, code: 3 });
	});

	it('is zero for a body that is not Portable Text', () => {
		expect(bodyWordCounts(undefined)).toEqual({ prose: 0, code: 0 });
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

	it('charges its code blocks at half weight', () => {
		// The old path flattened the body with plainText, which drops code, so a
		// tutorial read as 1 minute no matter how much shell it walked through.
		const post = toSummary(
			entry({
				content: [block('normal', words(200)), { _type: 'code', _key: 'c', code: words(400) }]
			}),
			[]
		);

		expect(post.readingMinutes).toBe(2);
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

describe('getPosts', () => {
	const entry = (id: string, dataId: string, title: string, noIndex = false) => ({
		id,
		data: {
			id: dataId,
			title,
			status: 'published',
			publishedAt: new Date('2026-01-01T00:00:00Z'),
			content: [block('normal', 'words')],
			...(noIndex ? { seo: { noIndex: true } } : {})
		}
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('carries term labels, falls back to the slug, and collects noIndex slugs', async () => {
		vi.mocked(getEmDashCollection).mockResolvedValue({
			entries: [entry('nixos', '01A', 'NixOS', true), entry('secure-boot', '01B', 'Secure Boot')],
			cacheHint: {}
		} as never);
		vi.mocked(getTermsForEntries).mockResolvedValue(
			new Map([
				['01A', [{ slug: 'nixos', label: 'NixOS' }]],
				['01B', [{ slug: 'secure-boot', label: '' }]]
			]) as never
		);

		const result = await getPosts({ includeBodies: false });

		expect(result.posts.map((post) => post.meta.tags)).toEqual([['NixOS'], ['secure-boot']]);
		expect([...result.noIndex]).toEqual(['nixos']);
	});

	it('warns when the query fills the 200-row ceiling', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.mocked(getEmDashCollection).mockResolvedValue({
			entries: Array.from({ length: 200 }, (_, i) => entry(`post-${i}`, `id-${i}`, `Post ${i}`)),
			cacheHint: {}
		} as never);
		vi.mocked(getTermsForEntries).mockResolvedValue(new Map() as never);

		await getPosts({ includeBodies: false });

		expect(warn).toHaveBeenCalledWith(expect.stringContaining('200-row'));
		warn.mockRestore();
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
