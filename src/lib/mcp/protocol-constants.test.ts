import { describe, expect, it } from 'vitest';
import { LATEST_PROTOCOL_VERSION, PROTOCOL_VERSIONS, RPC_ERRORS } from './protocol';

describe('protocol constants', () => {
	it('advertises the supported MCP versions newest first', () => {
		expect(PROTOCOL_VERSIONS).toEqual(['2025-06-18', '2025-03-26', '2024-11-05']);
		expect(LATEST_PROTOCOL_VERSION).toBe(PROTOCOL_VERSIONS[0]);
	});

	it('uses the standard JSON-RPC 2.0 error codes', () => {
		expect(RPC_ERRORS).toEqual({
			parse: -32700,
			invalidRequest: -32600,
			methodNotFound: -32601,
			invalidParams: -32602,
			internal: -32603
		});
	});
});
