import { describe, expect, it, vi } from 'vitest';

vi.mock('./retrieval', () => ({
	getFacts: () => ({ name: 'Sean Behan', handle: 'codebam' }),
	getResume: async () => ({ url: 'https://seanbehan.ca/resume.md', text: 'RESUME WORDS' }),
	searchContent: async () => ({
		query: 'nixos',
		results: [
			{ type: 'post', slug: 'nixos', title: 'NixOS notes', url: 'https://seanbehan.ca/posts/nixos' }
		]
	}),
	getEntry: async () => ({
		type: 'post',
		slug: 'nixos',
		title: 'NixOS notes',
		url: 'https://seanbehan.ca/posts/nixos',
		markdown: 'BODY WORDS'
	}),
	entryUrl: () => 'https://seanbehan.ca/posts/nixos'
}));

import {
	ASK_MODEL,
	answerQuestion,
	buildAskMessages,
	extractModelText,
	runQwen,
	type AskSource
} from './ask';

const sources: AskSource[] = [
	{ title: 'Facts', url: 'https://seanbehan.ca/mcp', text: '{"name":"Sean Behan"}' }
];

describe('buildAskMessages', () => {
	it('makes the model answer from sources, in the third person, with citations', () => {
		const messages = buildAskMessages('What does Sean use?', sources);
		expect(messages[0]?.role).toBe('system');
		expect(messages[0]?.content).toContain('third person');
		expect(messages[0]?.content).toContain('SOURCES');
		expect(messages[1]?.content).toContain('[1] Facts — https://seanbehan.ca/mcp');
		expect(messages[1]?.content).toContain('QUESTION\nWhat does Sean use?');
	});
});

describe('extractModelText', () => {
	it('reads the response field Workers AI returns', () => {
		expect(extractModelText({ response: 'An answer.' })).toBe('An answer.');
	});

	it('reads an OpenAI-shaped choices array too', () => {
		expect(extractModelText({ choices: [{ message: { content: 'Another.' } }] })).toBe('Another.');
	});

	it('drops reasoning blocks and treats an empty answer as empty', () => {
		expect(extractModelText({ response: '<thinking>hmm</thinking>The answer.' })).toBe(
			'The answer.'
		);
		expect(extractModelText({ response: '   ' })).toBe('');
	});
});

describe('answerQuestion', () => {
	it('retrieves, prompts, and returns the answer with its source list', async () => {
		const runModel = vi.fn(async () => ({ response: 'Grounded.' }));
		const result = await answerQuestion('What about NixOS?', runModel);

		expect(result.answer).toBe('Grounded.');
		expect(result.model).toBe(ASK_MODEL);
		expect(result.sources.map((source) => source.url)).toEqual([
			'https://seanbehan.ca/mcp',
			'https://seanbehan.ca/resume.md',
			'https://seanbehan.ca/posts/nixos'
		]);
		expect(runModel).toHaveBeenCalledOnce();
	});
});

describe('runQwen', () => {
	it('calls the configured model with thinking disabled', async () => {
		const run = vi.fn(async () => ({ response: 'ok' }));
		await runQwen({ AI: { run } }, [{ role: 'user', content: 'hi' }]);
		expect(run).toHaveBeenCalledWith(
			ASK_MODEL,
			expect.objectContaining({
				max_tokens: 800,
				chat_template_kwargs: { enable_thinking: false }
			})
		);
	});
});
