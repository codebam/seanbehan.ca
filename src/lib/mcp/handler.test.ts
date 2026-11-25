import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { McpEnv } from './tools';

/** Transport tests: the tool registry is the handler's only stateful edge. */
vi.mock('./tools', () => ({
	TOOL_DEFINITIONS: [
		{
			name: 'echo',
			title: 'Echo',
			description: 'Returns its arguments as text.',
			inputSchema: { type: 'object', properties: {}, additionalProperties: false },
			annotations: {
				title: 'Echo',
				readOnlyHint: true,
				destructiveHint: false,
				idempotentHint: true,
				openWorldHint: false
			}
		}
	],
	runTool: vi.fn()
}));

import { handleMcp } from './handler';
import { runTool } from './tools';

const runToolMock = vi.mocked(runTool);
const env = {} as McpEnv;
const ENDPOINT = 'https://seanbehan.ca/mcp';

const post = (body: string, headers: Record<string, string> = {}) =>
	new Request(ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...headers },
		body
	});

const message = (id: string | number | null, method: string, params?: Record<string, unknown>) =>
	JSON.stringify({ jsonrpc: '2.0', id, method, ...(params ? { params } : {}) });

interface Envelope {
	jsonrpc: string;
	id: string | number | null;
	result?: Record<string, unknown>;
	error?: { code: number; message: string };
}

const envelope = async (res: Response) => (await res.json()) as Envelope;

beforeEach(() => {
	runToolMock.mockReset();
	runToolMock.mockResolvedValue({ text: 'echoed' });
});

describe('handleMcp — transport', () => {
	it('answers preflight with CORS and no-store headers', async () => {
		const res = await handleMcp(new Request(ENDPOINT, { method: 'OPTIONS' }), env);
		expect(res.status).toBe(204);
		expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
		expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
		expect(res.headers.get('Cache-Control')).toBe('no-store');
		expect(await res.text()).toBe('');
	});

	it('declines the server-to-client stream on GET and accepts a stateless DELETE', async () => {
		const get = await handleMcp(new Request(ENDPOINT, { method: 'GET' }), env);
		expect(get.status).toBe(405);
		expect(get.headers.get('Allow')).toBe('POST, DELETE, OPTIONS');

		const del = await handleMcp(new Request(ENDPOINT, { method: 'DELETE' }), env);
		expect(del.status).toBe(204);
		expect(del.headers.get('Allow')).toBe('POST, DELETE, OPTIONS');
	});

	it('405s any other method with a plain body', async () => {
		const res = await handleMcp(new Request(ENDPOINT, { method: 'PUT' }), env);
		expect(res.status).toBe(405);
		expect(res.headers.get('Allow')).toBe('POST, DELETE, OPTIONS');
		expect(await res.text()).toBe('Method Not Allowed');
	});
});

describe('handleMcp — error formatting', () => {
	it('406s an Accept header that advertises neither supported encoding', async () => {
		const res = await handleMcp(post(message(1, 'ping'), { Accept: 'text/html' }), env);
		expect(res.status).toBe(406);
		expect(res.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
		expect(res.headers.get('Vary')).toBe('Accept');
		expect((await envelope(res)).error).toMatchObject({
			code: -32600,
			message: 'Accept must allow application/json or text/event-stream.'
		});
	});

	it('413s a body whose declared Content-Length exceeds the cap', async () => {
		const res = await handleMcp(post('{}', { 'Content-Length': String(64 * 1024 + 1) }), env);
		expect(res.status).toBe(413);
		expect((await envelope(res)).error?.message).toBe('Request body too large.');
	});

	it('413s an oversized body even when no length was declared', async () => {
		const res = await handleMcp(post('x'.repeat(64 * 1024 + 1)), env);
		expect(res.status).toBe(413);
		expect((await envelope(res)).error?.code).toBe(-32600);
	});

	it('counts UTF-8 bytes rather than UTF-16 code units', async () => {
		const res = await handleMcp(post('é'.repeat(40 * 1024)), env);
		expect(res.status).toBe(413);
		expect((await envelope(res)).error?.code).toBe(-32600);
	});

	it('cancels an oversized chunked body without reading the rest', async () => {
		let pulls = 0;
		let cancelled = false;
		const body = new ReadableStream<Uint8Array>({
			pull(controller) {
				pulls += 1;
				if (pulls === 1) controller.enqueue(new Uint8Array(64 * 1024 + 1));
				else {
					controller.enqueue(new Uint8Array([120]));
					controller.close();
				}
			},
			cancel() {
				cancelled = true;
			}
		});
		const request = new Request(ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body,
			duplex: 'half'
		} as RequestInit);

		const res = await handleMcp(request, env);

		expect(res.status).toBe(413);
		expect(cancelled).toBe(true);
		expect(pulls).toBe(1);
	});

	it('400s malformed JSON as a parse error', async () => {
		const res = await handleMcp(post('{nope'), env);
		expect(res.status).toBe(400);
		expect((await envelope(res)).error).toMatchObject({
			code: -32700,
			message: 'Parse error.'
		});
	});

	it('400s a batch instead of executing it', async () => {
		const res = await handleMcp(post(`[${message(1, 'ping')}]`), env);
		expect(res.status).toBe(400);
		expect((await envelope(res)).error?.message).toBe('Batches are not supported.');
		expect(runToolMock).not.toHaveBeenCalled();
	});

	it('400s a non-request message but echoes the id it carried', async () => {
		const res = await handleMcp(
			post(JSON.stringify({ jsonrpc: '2.0', id: 'abc', result: {} })),
			env
		);
		expect(res.status).toBe(400);
		expect(await envelope(res)).toMatchObject({
			id: 'abc',
			error: { code: -32600, message: 'Invalid Request.' }
		});
	});

	it('answers with a null id when a malformed message has no usable id', async () => {
		const res = await handleMcp(
			post(JSON.stringify({ jsonrpc: '1.0', id: {}, method: 'ping' })),
			env
		);
		expect((await envelope(res)).id).toBeNull();
	});

	it('answers notifications with an empty 202 and no JSON-RPC body', async () => {
		const bodies = [
			JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
			JSON.stringify({ jsonrpc: '2.0', id: null, method: 'ping' })
		];
		for (const body of bodies) {
			const res = await handleMcp(post(body), env);
			expect(res.status).toBe(202);
			expect(await res.text()).toBe('');
		}
	});
});

describe('handleMcp — dispatch and response encoding', () => {
	it('answers known methods in a JSON envelope', async () => {
		const ping = await handleMcp(post(message(1, 'ping')), env);
		expect(ping.status).toBe(200);
		expect(ping.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
		expect(await envelope(ping)).toEqual({ jsonrpc: '2.0', id: 1, result: {} });

		const list = await handleMcp(post(message('list', 'tools/list')), env);
		expect((await envelope(list)).result?.tools).toEqual([
			expect.objectContaining({ name: 'echo' })
		]);
	});

	it('frames one SSE message when the client only accepts a stream', async () => {
		const res = await handleMcp(post(message(7, 'ping'), { Accept: 'text/event-stream' }), env);
		expect(res.status).toBe(200);
		expect(res.headers.get('Content-Type')).toBe('text/event-stream; charset=utf-8');
		const frame = await res.text();
		expect(frame.startsWith('event: message\ndata: ')).toBe(true);
		expect(frame.endsWith('\n\n')).toBe(true);
		expect(JSON.parse(frame.slice('event: message\ndata: '.length, -2))).toEqual({
			jsonrpc: '2.0',
			id: 7,
			result: {}
		});
	});

	it('reports an unknown method as methodNotFound', async () => {
		const res = await handleMcp(post(message(2, 'no/such')), env);
		expect((await envelope(res)).error).toMatchObject({
			code: -32601,
			message: 'Method not found: no/such'
		});
	});

	it('reports an unknown tool as invalidParams without running one', async () => {
		const res = await handleMcp(post(message(3, 'tools/call', { name: 'nope' })), env);
		expect((await envelope(res)).error).toMatchObject({
			code: -32602,
			message: 'Unknown tool "nope".'
		});
		expect(runToolMock).not.toHaveBeenCalled();
	});

	it('wraps a tool result, including structured content and the error flag', async () => {
		runToolMock.mockResolvedValueOnce({
			text: 'echoed',
			structured: { ok: true },
			isError: true
		});
		const call = post(message(4, 'tools/call', { name: 'echo', arguments: { q: 'hi' } }), {
			'MCP-Protocol-Version': '2025-06-18'
		});
		const res = await handleMcp(call, env);
		expect(runToolMock).toHaveBeenCalledWith('echo', { q: 'hi' }, { env, request: call });
		expect(await envelope(res)).toEqual({
			jsonrpc: '2.0',
			id: 4,
			result: {
				content: [{ type: 'text', text: 'echoed' }],
				structuredContent: { ok: true },
				isError: true
			}
		});
	});

	it('passes an empty object when arguments are not a record', async () => {
		await handleMcp(post(message(5, 'tools/call', { name: 'echo', arguments: ['nope'] })), env);
		expect(runToolMock).toHaveBeenCalledWith('echo', {}, expect.anything());
	});

	it('negotiates the protocol version at initialize', async () => {
		const res = await handleMcp(
			post(message(6, 'initialize', { protocolVersion: '2025-03-26' })),
			env
		);
		expect((await envelope(res)).result).toMatchObject({
			protocolVersion: '2025-03-26',
			serverInfo: { name: 'seanbehan.ca' }
		});
	});
});
