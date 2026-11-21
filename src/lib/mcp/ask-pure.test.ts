import { describe, expect, it, vi } from 'vitest';

// ask.ts imports the retrieval graph at module load; pin only its pure helpers,
// so keep the binding-backed content paths out of this file.
vi.mock('./retrieval', () => ({
	getFacts: () => ({ name: 'Sean Behan' }),
	getResume: async () => ({ url: 'https://seanbehan.ca/resume.md', text: null }),
	searchContent: async () => ({ query: '', results: [] }),
	getEntry: async () => null,
	entryUrl: () => 'https://seanbehan.ca/'
}));

import { buildAskMessages, extractModelText, type AskSource } from './ask';

describe('extractModelText response shapes', () => {
	it('accepts a bare string response', () => {
		expect(extractModelText('Plain answer.')).toBe('Plain answer.');
	});

	it('reads output_text when response and choices are absent', () => {
		expect(extractModelText({ output_text: 'From output_text.' })).toBe('From output_text.');
	});

	it('falls past a blank or wrongly typed response to the next field', () => {
		expect(extractModelText({ response: '   ', output_text: 'Second choice.' })).toBe(
			'Second choice.'
		);
		expect(
			extractModelText({ response: 42, choices: [{ message: { content: 'Third choice.' } }] })
		).toBe('Third choice.');
	});

	it('ignores non-string choice content and reason-only payloads', () => {
		expect(extractModelText({ choices: [{ message: { content: 7 } }] })).toBe('');
		expect(extractModelText({ response: '<think>reasoning only</think>' })).toBe('');
	});

	it('returns empty for inputs that carry no text at all', () => {
		for (const raw of [null, undefined, 42, true, {}, { response: '\n\t' }]) {
			expect(extractModelText(raw)).toBe('');
		}
	});

	it('strips both think spellings and trims the surviving answer', () => {
		expect(extractModelText('  <think>deep</think>Answer.  ')).toBe('Answer.');
		expect(extractModelText('<thinking>\nmulti\nline\n</thinking>Answered.')).toBe('Answered.');
	});
});

describe('buildAskMessages source framing', () => {
	const sources: AskSource[] = [
		{ title: 'First', url: 'https://seanbehan.ca/mcp', text: 'FACTS' },
		{ title: 'Second', url: 'https://seanbehan.ca/posts/x', text: 'POST' }
	];
	const [, user] = buildAskMessages('Q?', sources);
	const [system] = buildAskMessages('Q?', sources);

	it('numbers every source so a citation can point at one', () => {
		expect(user?.content).toContain('[1] First — https://seanbehan.ca/mcp\nFACTS');
		expect(user?.content).toContain('[2] Second — https://seanbehan.ca/posts/x\nPOST');
	});

	it('states the exact no-answer reply and the word cap', () => {
		expect(system?.content).toContain("The published sources don't answer that.");
		expect(user?.content).toContain('Answer in at most 200 words.');
	});
});
