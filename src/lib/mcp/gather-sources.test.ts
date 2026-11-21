import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EntryDocument, ResumeDocument } from './retrieval';

/** The pure half of the ask tool: source selection, order and truncation. */
vi.mock('./retrieval', () => ({
	getFacts: vi.fn(),
	getResume: vi.fn(),
	searchContent: vi.fn(),
	getEntry: vi.fn()
}));

import { gatherSources } from './ask';
import { getEntry, getFacts, getResume, searchContent } from './retrieval';

const facts = { name: 'Sean Behan', handle: 'codebam' };
const resume: ResumeDocument = {
	url: 'https://seanbehan.ca/resume.md',
	text: 'RESUME WORDS',
	updated: null
};
const hit = {
	type: 'post' as const,
	slug: 'long',
	title: 'Search title',
	url: 'https://seanbehan.ca/posts/long',
	date: null,
	tags: [],
	description: null,
	excerpt: 'FALLBACK EXCERPT'
};

beforeEach(() => {
	vi.mocked(getFacts).mockReturnValue(facts as ReturnType<typeof getFacts>);
	vi.mocked(getResume).mockResolvedValue(resume);
	vi.mocked(searchContent).mockResolvedValue({ query: 'q', results: [] });
	vi.mocked(getEntry).mockResolvedValue(null);
});

describe('gatherSources', () => {
	it('puts canonical facts first, serialized from the identity record', async () => {
		const sources = await gatherSources('who are you?');
		expect(sources[0]).toEqual({
			title: 'Canonical facts about Sean Behan',
			url: 'https://seanbehan.ca/mcp',
			text: JSON.stringify(facts, null, 2)
		});
		expect(getFacts).toHaveBeenCalledOnce();
		expect(searchContent).toHaveBeenCalledWith('who are you?', 4);
	});

	it('omits the résumé when the bucket has no markdown', async () => {
		vi.mocked(getResume).mockResolvedValueOnce({ ...resume, text: null });
		const sources = await gatherSources('q');
		expect(sources.map((source) => source.title)).toEqual(['Canonical facts about Sean Behan']);
	});

	it('truncates a long résumé at the source cap', async () => {
		vi.mocked(getResume).mockResolvedValueOnce({ ...resume, text: 'R'.repeat(4000) });
		const sources = await gatherSources('q');
		expect(sources[1]).toEqual({
			title: 'Résumé (source markdown)',
			url: resume.url,
			text: `${'R'.repeat(3500)}\n…`
		});
		expect(getResume).toHaveBeenCalledWith();
	});

	it('uses the fetched entry and truncates its body', async () => {
		vi.mocked(searchContent).mockResolvedValueOnce({ query: 'q', results: [hit] });
		vi.mocked(getEntry).mockResolvedValueOnce({
			type: 'post',
			slug: 'long',
			title: 'Fetched title',
			url: 'https://seanbehan.ca/posts/long',
			markdown: 'M'.repeat(3000)
		} satisfies EntryDocument);
		const sources = await gatherSources('q');
		expect(getEntry).toHaveBeenCalledWith('post', 'long');
		expect(sources[2]).toEqual({
			title: 'Fetched title',
			url: 'https://seanbehan.ca/posts/long',
			text: `${'M'.repeat(2400)}\n…`
		});
	});

	it('falls back to the search excerpt when no published entry is found', async () => {
		vi.mocked(searchContent).mockResolvedValueOnce({ query: 'q', results: [hit] });
		const sources = await gatherSources('q');
		expect(sources[2]).toEqual({
			title: 'Search title',
			url: hit.url,
			text: hit.excerpt
		});
	});

	it('asks for a CMS page by its own entry type', async () => {
		vi.mocked(searchContent).mockResolvedValueOnce({
			query: 'q',
			results: [{ ...hit, type: 'page', slug: 'about' }]
		});
		await gatherSources('q');
		expect(getEntry).toHaveBeenCalledWith('page', 'about');
	});
});
