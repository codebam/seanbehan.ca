import { describe, expect, it, vi } from 'vitest';

// retrieval.ts reaches the résumé bucket through this module; none of the
// binding-free paths below read it, so a stub keeps the real facts in play.
vi.mock('cloudflare:workers', () => ({ env: {} }));

import { TOOL_DEFINITIONS, runTool, type McpEnv } from './tools';

/** The paths under test never read a binding; this stub is only a type shape. */
const context = {
	env: {} as McpEnv,
	request: new Request('https://seanbehan.ca/mcp')
};

describe('TOOL_DEFINITIONS', () => {
	it('lists exactly the tools the dispatcher handles', () => {
		expect(TOOL_DEFINITIONS.map((tool) => tool.name)).toEqual([
			'search_content',
			'get_entry',
			'list_posts',
			'get_resume',
			'get_facts',
			'ask'
		]);
	});

	it('marks every tool read-only with a closed object schema', () => {
		for (const tool of TOOL_DEFINITIONS) {
			expect(tool.inputSchema.type).toBe('object');
			expect(tool.inputSchema.additionalProperties).toBe(false);
			expect(tool.annotations).toEqual({
				title: tool.title,
				readOnlyHint: true,
				destructiveHint: false,
				idempotentHint: true,
				openWorldHint: false
			});
		}
	});

	it('declares which arguments a caller must supply', () => {
		const byName = new Map(TOOL_DEFINITIONS.map((tool) => [tool.name, tool]));
		expect(byName.get('search_content')?.inputSchema.required).toEqual(['query']);
		expect(byName.get('get_entry')?.inputSchema.required).toEqual(['slug']);
		expect(byName.get('ask')?.inputSchema.required).toEqual(['question']);
		expect(byName.get('list_posts')?.inputSchema.required).toBeUndefined();
	});
});

describe('runTool argument checking', () => {
	it.each([
		['search_content', { query: '' }, '"query" must be a non-empty string.'],
		['get_entry', { slug: '' }, '"slug" must be a non-empty string.'],
		['get_entry', { slug: 'x', type: 'widget' }, '"type" must be "post" or "page".'],
		['list_posts', { tag: '' }, '"tag" must be a non-empty string.'],
		['get_resume', { section: '' }, '"section" must be a non-empty string.'],
		['ask', { question: '' }, '"question" must be a non-empty string.']
	] as const)(
		'rejects a bad %s argument before reaching a binding',
		async (name, args, message) => {
			await expect(runTool(name, args, context)).resolves.toEqual({ text: message, isError: true });
		}
	);

	it.each([
		['search_content', { query: 'x', limit: 0 }, 1, 20],
		['search_content', { query: 'x', limit: 21 }, 1, 20],
		['search_content', { query: 'x', limit: 1.5 }, 1, 20],
		['list_posts', { limit: 51 }, 1, 50]
	] as const)('rejects an out-of-range %s limit', async (name, args, min, max) => {
		await expect(runTool(name, args, context)).resolves.toEqual({
			text: `"limit" must be an integer between ${min} and ${max}.`,
			isError: true
		});
	});

	it('reports an unknown tool name', async () => {
		await expect(runTool('nope', {}, context)).resolves.toEqual({
			text: 'Unknown tool "nope".',
			isError: true
		});
	});
});

describe('runTool get_facts', () => {
	it('answers from the static identity record and mirrors it as structured data', async () => {
		const result = await runTool('get_facts', {}, context);
		expect(result.isError).toBeUndefined();
		expect(result.structured).toMatchObject({ name: 'Sean Behan', handle: 'codebam' });
		expect(JSON.parse(result.text)).toEqual(result.structured);
	});
});
