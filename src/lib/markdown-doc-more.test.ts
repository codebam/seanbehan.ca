import { describe, expect, it } from 'vitest';
import { bodyMarkdown, jsonDocument } from './markdown';

const block = (text: string, style = 'h2') => ({
	_type: 'block',
	_key: `b-${text}`,
	style,
	children: [{ _type: 'span', _key: `s-${text}`, text, marks: [] }]
});

const entry = (data: Record<string, unknown> = {}) => ({
	id: 'example',
	data: {
		id: '01HEXAMPLE',
		title: 'An example',
		status: 'published',
		publishedAt: new Date('2025-01-15T12:00:00.000Z'),
		content: [block('Details')],
		...data
	}
});

describe('bodyMarkdown: remaining pure cases', () => {
	it('is empty for non-array bodies other than undefined', () => {
		expect(bodyMarkdown(null)).toBe('');
		expect(bodyMarkdown('a string')).toBe('');
		expect(bodyMarkdown({ blocks: [] })).toBe('');
	});

	it('does not print a filename line for a code block with an empty filename', () => {
		expect(bodyMarkdown([{ _type: 'code', language: 'sh', code: 'echo hi', filename: '' }])).toBe(
			'```sh\necho hi\n```\n'
		);
	});

	it('reads asset.url before the feed-style src when an image carries both', () => {
		expect(
			bodyMarkdown([
				{
					_type: 'image',
					alt: 'A',
					src: '/img/old.png',
					asset: { url: '/img/new.png' }
				}
			])
		).toBe('![A](https://seanbehan.ca/img/new.png)\n');
	});
});

describe('jsonDocument: remaining header fields', () => {
	it('absolutizes a featured image, and leaves the field null when there is none', () => {
		expect(
			jsonDocument(entry({ featured_image: { src: '/img/cover.webp' } }) as never, {
				path: '/posts/example'
			}).image
		).toBe('https://seanbehan.ca/img/cover.webp');
		expect(jsonDocument(entry() as never, { path: '/posts/example' }).image).toBeNull();
	});

	it('reports draft status from the entry, not from the caller', () => {
		const doc = jsonDocument(entry({ status: 'draft' }) as never, {
			path: '/posts/example'
		});
		expect(doc.draft).toBe(true);
	});

	it('suppresses an updated date that is only the publish touch', () => {
		const touched = jsonDocument(
			entry({ updatedAt: new Date('2025-01-15T12:00:30.000Z') }) as never,
			{ path: '/posts/example' }
		);
		expect(touched.updated).toBeNull();

		const edited = jsonDocument(
			entry({ updatedAt: new Date('2025-01-15T13:00:00.000Z') }) as never,
			{ path: '/posts/example' }
		);
		expect(edited.updated).toBe('2025-01-15T13:00:00.000Z');
	});

	it('falls back to createdAt when publishedAt is missing', () => {
		const doc = jsonDocument(
			{
				id: 'example',
				data: { id: '01HEXAMPLE', title: 'An example', createdAt: new Date('2024-06-01T00:00:00Z') }
			} as never,
			{ path: '/posts/example' }
		);
		expect(doc.published).toBe('2024-06-01T00:00:00.000Z');
	});

	it('keeps content and sections empty for an entry with no body', () => {
		const doc = jsonDocument(
			{ id: 'example', data: { id: '01HEXAMPLE', title: 'An example' } } as never,
			{ path: '/posts/example' }
		);
		expect(doc.content).toBe('');
		expect(doc.sections).toEqual([]);
		expect(doc.content_url).toBe('https://seanbehan.ca/posts/example.md');
	});
});
