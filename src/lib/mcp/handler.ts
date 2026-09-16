/**
 * The Streamable HTTP transport for /mcp.
 *
 * This is deliberately a Worker-level route rather than an Astro page: MCP is
 * a protocol surface, not a rendered page, so it must not inherit the page
 * cache policy, the content negotiation middleware, or the HTML security
 * headers. The handler is stateless — no session id, no server-initiated
 * stream — which the spec allows and which keeps a public read-only server
 * cheap: every request is a self-contained JSON-RPC exchange.
 */
import {
	RPC_ERRORS,
	failure,
	initializeResult,
	isJsonRpcRequest,
	responseEncoding,
	sseFrame,
	success,
	type JsonRpcError,
	type JsonRpcResponse
} from './protocol';
import { TOOL_DEFINITIONS, runTool, type McpEnv } from './tools';

/** A question plus its context is small; anything larger is abuse, not input. */
const MAX_BODY_BYTES = 64 * 1024;

const CORS_HEADERS: Record<string, string> = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
	'Access-Control-Allow-Headers':
		'Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id, Last-Event-ID, Authorization',
	'Access-Control-Expose-Headers': 'Mcp-Session-Id',
	'Access-Control-Max-Age': '86400'
};

const noStore = (headers: Record<string, string> = {}) => ({
	...CORS_HEADERS,
	'Cache-Control': 'no-store',
	...headers
});

function rpcResponse(
	payload: JsonRpcResponse | null,
	encoding: 'json' | 'sse',
	status = 200,
	headers: Record<string, string> = {}
): Response {
	if (!payload) return new Response(null, { status, headers: noStore(headers) });
	if (encoding === 'sse') {
		return new Response(sseFrame(payload), {
			status,
			headers: noStore({ ...headers, 'Content-Type': 'text/event-stream; charset=utf-8' })
		});
	}
	return new Response(JSON.stringify(payload), {
		status,
		headers: noStore({
			...headers,
			'Content-Type': 'application/json; charset=utf-8',
			Vary: 'Accept'
		})
	});
}

/** The id to answer on, even when the request itself was malformed. */
function idOf(value: unknown): string | number | null {
	if (!value || typeof value !== 'object') return null;
	const id = (value as { id?: unknown }).id;
	return typeof id === 'string' || typeof id === 'number' ? id : null;
}

/** One JSON-RPC request. `null` means the message was a notification. */
async function dispatch(
	message: { id?: string | number | null; method: string; params?: Record<string, unknown> },
	env: McpEnv,
	request: Request
): Promise<JsonRpcResponse | null> {
	const id = message.id ?? null;
	switch (message.method) {
		case 'initialize':
			return success(id, initializeResult(message.params));
		case 'ping':
			return success(id, {});
		case 'tools/list':
			return success(id, { tools: TOOL_DEFINITIONS });
		case 'tools/call': {
			const params = message.params ?? {};
			const name = params.name;
			if (typeof name !== 'string' || !TOOL_DEFINITIONS.some((tool) => tool.name === name)) {
				return failure(id, RPC_ERRORS.invalidParams, `Unknown tool "${String(name)}".`);
			}
			const args =
				params.arguments && typeof params.arguments === 'object' && !Array.isArray(params.arguments)
					? (params.arguments as Record<string, unknown>)
					: {};
			const result = await runTool(name, args, { env, request });
			return success(id, {
				content: [{ type: 'text', text: result.text }],
				...(result.structured ? { structuredContent: result.structured } : {}),
				...(result.isError ? { isError: true } : {})
			});
		}
		default:
			return failure(id, RPC_ERRORS.methodNotFound, `Method not found: ${message.method}`);
	}
}

export async function handleMcp(request: Request, env: McpEnv): Promise<Response> {
	if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: noStore() });

	// The spec lets a server decline the server-to-client stream; a stateless
	// server has nothing to send on it, so GET is explicitly not supported.
	if (request.method === 'GET' || request.method === 'DELETE') {
		return new Response(null, {
			status: request.method === 'DELETE' ? 204 : 405,
			headers: noStore({ Allow: 'POST, DELETE, OPTIONS' })
		});
	}
	if (request.method !== 'POST') {
		return new Response('Method Not Allowed', {
			status: 405,
			headers: noStore({ Allow: 'POST, DELETE, OPTIONS' })
		});
	}

	const encoding = responseEncoding(request.headers.get('Accept'));
	if (encoding === 'unsupported') {
		return new Response(
			JSON.stringify(
				failure(
					null,
					RPC_ERRORS.invalidRequest,
					'Accept must allow application/json or text/event-stream.'
				)
			),
			{
				status: 406,
				headers: noStore({ 'Content-Type': 'application/json; charset=utf-8', Vary: 'Accept' })
			}
		);
	}

	const declared = Number(request.headers.get('Content-Length') ?? '0');
	if (declared > MAX_BODY_BYTES) {
		return rpcResponse(
			failure(null, RPC_ERRORS.invalidRequest, 'Request body too large.'),
			encoding,
			413
		);
	}

	const body = await request.text();
	if (body.length > MAX_BODY_BYTES) {
		return rpcResponse(
			failure(null, RPC_ERRORS.invalidRequest, 'Request body too large.'),
			encoding,
			413
		);
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(body);
	} catch {
		return rpcResponse(failure(null, RPC_ERRORS.parse, 'Parse error.'), encoding, 400);
	}

	// 2025-06-18 removed JSON-RPC batching; a batch is answered as one invalid
	// request rather than half-executed.
	if (Array.isArray(parsed)) {
		return rpcResponse(
			failure(null, RPC_ERRORS.invalidRequest, 'Batches are not supported.'),
			encoding,
			400
		);
	}
	if (!isJsonRpcRequest(parsed)) {
		return rpcResponse(
			failure(idOf(parsed), RPC_ERRORS.invalidRequest, 'Invalid Request.'),
			encoding,
			400
		);
	}

	// Notifications get no JSON-RPC response, so the HTTP response is an empty
	// 202. `notifications/initialized` is the one this server acts on, and its
	// action is nothing: the server is stateless.
	if (parsed.id === undefined || parsed.id === null || parsed.method.startsWith('notifications/')) {
		return rpcResponse(null, encoding, 202);
	}

	const response = await dispatch(parsed, env, request);
	return rpcResponse(response as JsonRpcError, encoding, 200);
}

export type { McpEnv } from './tools';
