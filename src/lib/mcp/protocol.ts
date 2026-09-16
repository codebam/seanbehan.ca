/**
 * The JSON-RPC and Streamable HTTP half of the MCP server.
 *
 * Kept free of D1, R2 and the model so the protocol rules can be tested as
 * plain functions: which protocol version to answer with, which methods exist,
 * how a client's `Accept` chooses between a JSON body and a one-shot SSE
 * frame, and what an MCP error looks like. The tool registry next door is the
 * only part that touches the site.
 */

/** Newest first; the first entry is what an unknown request is answered with. */
export const PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'] as const;
export const LATEST_PROTOCOL_VERSION: string = PROTOCOL_VERSIONS[0];

export interface JsonRpcRequest {
	jsonrpc: '2.0';
	id?: string | number | null;
	method: string;
	params?: Record<string, unknown>;
}

export interface JsonRpcSuccess {
	jsonrpc: '2.0';
	id: string | number | null;
	result: unknown;
}

export interface JsonRpcError {
	jsonrpc: '2.0';
	id: string | number | null;
	error: { code: number; message: string; data?: unknown };
}

export type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

export const RPC_ERRORS = {
	parse: -32700,
	invalidRequest: -32600,
	methodNotFound: -32601,
	invalidParams: -32602,
	internal: -32603
} as const;

export function isJsonRpcRequest(value: unknown): value is JsonRpcRequest {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	const record = value as Record<string, unknown>;
	return record.jsonrpc === '2.0' && typeof record.method === 'string';
}

export function success(id: string | number | null, result: unknown): JsonRpcSuccess {
	return { jsonrpc: '2.0', id, result };
}

export function failure(
	id: string | number | null,
	code: number,
	message: string,
	data?: unknown
): JsonRpcError {
	return { jsonrpc: '2.0', id, error: { code, message, ...(data === undefined ? {} : { data }) } };
}

/**
 * The client's Accept header decides how one JSON-RPC answer travels back.
 * `application/json` wins whenever it is offered: the spec allows either
 * encoding, and a complete JSON body is the cheaper one to parse and to log.
 * A client that only asks for `text/event-stream` still gets its answer, as
 * one SSE message; a client that asks for neither gets a clear 406 rather than
 * a body it did not advertise support for.
 */
export function responseEncoding(accept: string | null): 'json' | 'sse' | 'unsupported' {
	const types = (accept ?? '')
		.split(',')
		.map((part) => part.split(';')[0]?.trim().toLowerCase())
		.filter(Boolean);
	if (types.length === 0) return 'json';
	if (types.includes('application/json') || types.includes('*/*')) return 'json';
	if (types.includes('text/event-stream')) return 'sse';
	return 'unsupported';
}

/** One Streamable HTTP SSE response: a single `message` event, then close. */
export function sseFrame(payload: unknown): string {
	return `event: message\ndata: ${JSON.stringify(payload)}\n\n`;
}

/**
 * Echo the client's version when this server speaks it, otherwise answer with
 * the newest supported one; the client decides whether it can continue, per
 * the spec, rather than the server guessing downward.
 */
export function negotiateProtocolVersion(requested: unknown): string {
	return typeof requested === 'string' &&
		(PROTOCOL_VERSIONS as readonly string[]).includes(requested)
		? requested
		: LATEST_PROTOCOL_VERSION;
}

export function initializeResult(params: unknown): Record<string, unknown> {
	const requested = (params as { protocolVersion?: unknown } | undefined)?.protocolVersion;
	return {
		protocolVersion: negotiateProtocolVersion(requested),
		capabilities: { tools: { listChanged: false } },
		serverInfo: {
			name: 'seanbehan.ca',
			title: 'seanbehan.ca — published writing',
			version: '1.0.0'
		},
		instructions:
			'Read-only tools over seanbehan.ca. search_content and get_entry return published posts and CMS pages; get_resume returns the CV; get_facts returns the canonical identity record; ask gives a grounded answer with source URLs. Prefer the retrieval tools when an exact quote or URL matters.'
	};
}
