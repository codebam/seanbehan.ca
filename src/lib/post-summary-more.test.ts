import { describe, expect, it } from 'vitest';
import { prepareBody, toSummary } from './posts';

/** A prose block with as many child spans as the case needs. */
const block = (style: string, ...texts: (string | undefined)[]) => ({
	_type: 'block',
	style,
	children: texts.map((text) => ({ _type: 'span', text }))
});

const entry = (data: Record<string, unknown>) =>
	({ id: 'my-post', data: { id: '01ABC', title: 'My post', ...data } }) as never;

describe('toSummary: date fallbacks', () => {
	it('uses createdAt when the entry was never published', () => {
		const post = toSummary(entry({ createdAt: new Date('2025-03-04T05:06:07Z') }));
		expect(post.meta.date).toBe('2025-03-04T05:06:07.000Z');
	});

	it('falls back to the epoch when the entry has no date at all', () => {
		expect(toSummary(entry({})).meta.date).toBe('1970-01-01T00:00:00.000Z');
	});

	it('does not advertise an edit with no publication date to follow', () => {
		expect(
			toSummary(entry({ updatedAt: new Date('2025-03-04T05:06:07Z') })).meta.updated
		).toBeUndefined();
	});
});

describe('toSummary: modified-date threshold', () => {
	const published = new Date('2024-06-01T22:38:41Z');

	it('ignores an edit at the one-minute mark', () => {
		const post = toSummary(
			entry({ publishedAt: published, updatedAt: new Date(published.getTime() + 60_000) })
		);
		expect(post.meta.updated).toBeUndefined();
	});

	it('reports an edit a millisecond past the one-minute mark', () => {
		const post = toSummary(
			entry({ publishedAt: published, updatedAt: new Date(published.getTime() + 60_001) })
		);
		expect(post.meta.updated).toBe('2024-06-01T22:39:41.001Z');
	});
});

describe('toSummary: supplied and optional fields', () => {
	it('trusts supplied word counts over the body', () => {
		// Callers that already walked the body must not pay for a second walk:
		// a two-word body with a thousand-word count proves which one won.
		const post = toSummary(entry({ content: [block('normal', 'two words')] }), [], {
			prose: 1000,
			code: 0
		});
		expect(post.readingMinutes).toBe(5);
		expect(toSummary(entry({})).readingMinutes).toBe(1);
	});

	it('keeps an empty excerpt but drops a missing one', () => {
		expect(toSummary(entry({ excerpt: '' })).meta.description).toBe('');
		expect(toSummary(entry({ excerpt: null })).meta.description).toBeUndefined();
	});

	it('carries the entry slug and the featured image source', () => {
		const post = toSummary(entry({ featured_image: { src: '/images/cover.jpg' } }));
		expect(post.slug).toBe('my-post');
		expect(post.path).toBe('/posts/my-post');
		expect(post.meta.image).toBe('/images/cover.jpg');
	});

	it('drops a featured image with no source', () => {
		expect(toSummary(entry({ featured_image: { src: null } })).meta.image).toBeUndefined();
		expect(toSummary(entry({ featured_image: null })).meta.image).toBeUndefined();
	});

	it('treats a missing status as a draft', () => {
		expect(toSummary(entry({})).meta.draft).toBe(true);
	});
});

describe('prepareBody: unusual bodies', () => {
	it('returns empty lists for a body that is not Portable Text', () => {
		expect(prepareBody(undefined)).toEqual({ blocks: [], headings: [] });
		expect(prepareBody(null)).toEqual({ blocks: [], headings: [] });
		expect(prepareBody('# Setup')).toEqual({ blocks: [], headings: [] });
	});

	it('keeps numbering duplicates past the second', () => {
		const { headings } = prepareBody([
			block('h2', 'Conclusion'),
			block('h2', 'Conclusion'),
			block('h2', 'Conclusion')
		]);
		expect(headings.map((heading) => heading.id)).toEqual([
			'conclusion',
			'conclusion-1',
			'conclusion-2'
		]);
	});

	it('joins heading spans without adding spaces, then trims', () => {
		const { blocks, headings } = prepareBody([block('h2', 'Build', ' with ', 'Nix', undefined)]);
		expect(headings).toEqual([{ id: 'build-with-nix', text: 'Build with Nix', level: 2 }]);
		expect((blocks[0] as { headingId?: string }).headingId).toBe('build-with-nix');
	});

	it('does not list a heading with no text, and leaves its block alone', () => {
		const empty = block('h2');
		const whitespace = block('h2', '   ');
		const { blocks, headings } = prepareBody([empty, whitespace]);
		expect(headings).toEqual([]);
		expect(blocks[0]).toBe(empty);
		expect(blocks[1]).toBe(whitespace);
		expect(blocks.every((b) => !('headingId' in b))).toBe(true);
	});

	it('ignores heading-looking non-blocks and unsupported styles', () => {
		const image = { _type: 'image', style: 'h2', children: [{ text: 'Picture' }] };
		const tooDeep = block('h7', 'Too deep');
		const wrongCase = block('H2', 'Wrong case');
		const { blocks, headings } = prepareBody([image, tooDeep, wrongCase]);
		expect(headings).toEqual([]);
		expect(blocks).toEqual([image, tooDeep, wrongCase]);
	});

	it('rebases h5 and h6 while keeping their distance', () => {
		const { blocks, headings } = prepareBody([block('h5', 'Deep'), block('h6', 'Deeper')]);
		expect(headings.map((heading) => heading.level)).toEqual([2, 3]);
		expect(blocks.map((b) => (b as { style?: string }).style)).toEqual(['h2', 'h3']);
	});

	it('does not change the stored blocks', () => {
		const heading = block('h2', 'Setup');
		prepareBody([heading]);
		expect(heading.style).toBe('h2');
		expect('headingId' in heading).toBe(false);
	});
});
