import { describe, expect, it, vi } from 'vitest';

// retrieval reaches R2 and cloudflare:workers through resume.ts; the dispatch
// cases here stop at validation, so stub the retrieval layer rather than load
// a module graph that needs bindings.
vi.mock('./retrieval', () => ({
	getEntry: async () => null,
	getFacts: () => ({}),
	getResume: async () => ({ url: '', text: null, updated: null }),
	listPosts: async () => [],
	searchContent: async () => []
}));

import { TOOL_DEFINITIONS, runTool, type McpEnv } from './tools';

/**
 * The catalogue is the contract a remote client discovers through tools/list,
 * so a rename or a dropped schema is a protocol change even when dispatch
 * still works. The runTool cases below stop at validation: they reach neither
 * D1 nor the model, so no bindings are needed to check the error shape.
 */
const CONTEXT: { env: McpEnv; request: Request } = {
	env: {
		AI: {
			run: async () => {
				throw new Error('the model must not be called');
			}
		},
		DB: {
			prepare: () => {
				throw new Error('D1 must not be touched');
			}
		}
	},
	request: new Request('https://seanbehan.ca/mcp')
};

describe('TOOL_DEFINITIONS', () => {
	it('advertises the six tools by name', () => {
		expect(TOOL_DEFINITIONS.map((tool) => tool.name)).toEqual([
			'search_content',
			'get_entry',
			'list_posts',
			'get_resume',
			'get_facts',
			'ask'
		]);
	});

	it('gives every tool a description and a closed object schema', () => {
		for (const tool of TOOL_DEFINITIONS) {
			expect(tool.description).toBeTruthy();
			expect(tool.inputSchema.type).toBe('object');
			expect(tool.inputSchema.properties).toBeTypeOf('object');
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
});

describe('runTool dispatch', () => {
	it('returns a tool error for an unknown name', async () => {
		await expect(runTool('not_a_tool', {}, CONTEXT)).resolves.toEqual({
			text: 'Unknown tool "not_a_tool".',
			isError: true
		});
	});

	it('reports invalid arguments as tool errors before reaching a binding', async () => {
		await expect(runTool('search_content', { query: '   ' }, CONTEXT)).resolves.toEqual({
			text: '"query" must be a non-empty string.',
			isError: true
		});
		await expect(runTool('get_entry', { slug: 'nixos', type: 'draft' }, CONTEXT)).resolves.toEqual({
			text: '"type" must be "post" or "page".',
			isError: true
		});
	});
});
