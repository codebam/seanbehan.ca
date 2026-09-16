// Worker entry: Astro's fetch handler plus EmDash's scheduled() handler, which
// the Cron Trigger in wrangler.jsonc drives. PluginBridge is the sandbox
// Durable Object, re-exported here so its binding resolves.
//
// `/mcp` is answered here, before the Astro pipeline. MCP is a protocol
// surface rather than a page: the endpoint keeps its own headers, its own
// no-store policy and its own JSON-RPC errors instead of inheriting the page
// middleware's cache and content negotiation.
import emdashWorker from '@emdash-cms/cloudflare/worker';
import { handleMcp, type McpEnv } from './lib/mcp/handler';

export { PluginBridge } from '@emdash-cms/cloudflare/worker';

/** The bindings the MCP route reads, beside whatever Astro receives. */
type WorkerEnv = McpEnv & Record<string, unknown>;

/** The subset of workerd's execution context the Astro handler uses. */
type WorkerContext = {
	waitUntil(promise: Promise<unknown>): void;
	passThroughOnException(): void;
};

const astroFetch = emdashWorker.fetch as unknown as (
	request: Request,
	env: WorkerEnv,
	ctx: WorkerContext
) => Response | Promise<Response>;

export default {
	...emdashWorker,
	fetch(request: Request, env: WorkerEnv, ctx: WorkerContext): Response | Promise<Response> {
		if (new URL(request.url).pathname === '/mcp') return handleMcp(request, env);
		return astroFetch(request, env, ctx);
	}
};
