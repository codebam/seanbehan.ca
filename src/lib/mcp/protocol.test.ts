import { describe, expect, it } from 'vitest';
import {
	LATEST_PROTOCOL_VERSION,
	failure,
	initializeResult,
	isJsonRpcRequest,
	negotiateProtocolVersion,
	responseEncoding,
	success,
	sseFrame
} from './protocol';

describe('responseEncoding', () => {
	it('prefers a JSON body when the client allows one', () => {
		expect(responseEncoding('application/json, text/event-stream')).toBe('json');
		expect(responseEncoding('*/*')).toBe('json');
		expect(responseEncoding(null)).toBe('json');
	});

	it('falls back to SSE for a client that only accepts a stream', () => {
		expect(responseEncoding('text/event-stream')).toBe('sse');
		expect(responseEncoding('text/event-stream;q=1')).toBe('sse');
	});

	it('rejects an Accept that names neither supported type', () => {
		expect(responseEncoding('text/html')).toBe('unsupported');
	});
});

describe('protocol negotiation', () => {
	it('echoes a supported version', () => {
		expect(negotiateProtocolVersion('2025-03-26')).toBe('2025-03-26');
	});

	it('answers an unknown or missing version with the newest supported one', () => {
		expect(negotiateProtocolVersion('1999-01-01')).toBe(LATEST_PROTOCOL_VERSION);
		expect(negotiateProtocolVersion(undefined)).toBe(LATEST_PROTOCOL_VERSION);
	});

	it('advertises tools and a server name at initialize', () => {
		const result = initializeResult({ protocolVersion: '2025-06-18' });
		expect(result).toMatchObject({
			protocolVersion: '2025-06-18',
			capabilities: { tools: { listChanged: false } },
			serverInfo: { name: 'seanbehan.ca' }
		});
	});
});

describe('json-rpc messages', () => {
	it('recognises a request and rejects a response or an array', () => {
		expect(isJsonRpcRequest({ jsonrpc: '2.0', id: 1, method: 'ping' })).toBe(true);
		expect(isJsonRpcRequest({ jsonrpc: '2.0', id: 1, result: {} })).toBe(false);
		expect(isJsonRpcRequest([{ jsonrpc: '2.0', id: 1, method: 'ping' }])).toBe(false);
	});

	it('builds success and failure envelopes', () => {
		expect(success(1, { ok: true })).toEqual({ jsonrpc: '2.0', id: 1, result: { ok: true } });
		expect(failure('a', -32601, 'Method not found')).toEqual({
			jsonrpc: '2.0',
			id: 'a',
			error: { code: -32601, message: 'Method not found' }
		});
	});

	it('frames one SSE message and terminates the event', () => {
		expect(sseFrame({ jsonrpc: '2.0', id: 1, result: {} })).toBe(
			'event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{}}\n\n'
		);
	});
});
