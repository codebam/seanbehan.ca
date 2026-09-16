/**
 * The tool registry: what an agent can ask this server to do, and the small
 * amount of argument checking between the wire and the retrieval layer.
 *
 * Every tool is read-only and every tool answers from content the site already
 * publishes. The registry exists as data so `tools/list` and `tools/call`
 * cannot drift apart, and so a new tool has exactly one definition to add.
 */
import { consumeRateLimit, getClientIp, type RateLimitDatabase } from '../rateLimit';
import { answerQuestion, runQwen, type AskResult, type ChatMessage } from './ask';
import {
	getEntry,
	getFacts,
	getResume,
	listPosts,
	searchContent,
	type EntryType
} from './retrieval';

/** The bindings this surface reads; narrower than the Worker's full Env. */
export interface McpEnv {
	AI: { run(model: string, inputs: Record<string, unknown>): Promise<unknown> };
	DB: RateLimitDatabase;
}

export interface ToolDefinition {
	name: string;
	title: string;
	description: string;
	inputSchema: {
		type: 'object';
		properties: Record<string, unknown>;
		required?: string[];
		additionalProperties: false;
	};
	annotations: {
		title: string;
		readOnlyHint: true;
		destructiveHint: false;
		idempotentHint: true;
		openWorldHint: false;
	};
}

export interface ToolRunResult {
	text: string;
	structured?: Record<string, unknown>;
	isError?: boolean;
}

const readOnly = (title: string) => ({
	title,
	readOnlyHint: true as const,
	destructiveHint: false as const,
	idempotentHint: true as const,
	openWorldHint: false as const
});

export const TOOL_DEFINITIONS: ToolDefinition[] = [
	{
		name: 'search_content',
		title: 'Search published content',
		description:
			'Ranked search over published posts and CMS pages, including full bodies. Returns slugs, titles, URLs, dates, tags and excerpts. Use this before get_entry when you do not already know the slug.',
		inputSchema: {
			type: 'object',
			properties: {
				query: { type: 'string', description: 'Words to search for.' },
				limit: {
					type: 'integer',
					minimum: 1,
					maximum: 20,
					description: 'Maximum results. Defaults to 6.'
				}
			},
			required: ['query'],
			additionalProperties: false
		},
		annotations: readOnly('Search published content')
	},
	{
		name: 'get_entry',
		title: 'Read one post or page',
		description:
			'One published entry as markdown, with its canonical URL, dates, tags and body. Use the slug returned by search_content or list_posts. Drafts are reachable only when the caller already knows the slug.',
		inputSchema: {
			type: 'object',
			properties: {
				slug: { type: 'string', description: 'Entry slug, no leading slash.' },
				type: {
					type: 'string',
					enum: ['post', 'page'],
					description: 'Collection the slug belongs to. Defaults to post.'
				}
			},
			required: ['slug'],
			additionalProperties: false
		},
		annotations: readOnly('Read one post or page')
	},
	{
		name: 'list_posts',
		title: 'List published posts',
		description:
			'The published archive, newest first, optionally narrowed to one tag. Returns metadata only; use get_entry for a body.',
		inputSchema: {
			type: 'object',
			properties: {
				tag: { type: 'string', description: 'Tag label or slug to filter by.' },
				limit: {
					type: 'integer',
					minimum: 1,
					maximum: 50,
					description: 'Maximum posts. Defaults to 20.'
				}
			},
			additionalProperties: false
		},
		annotations: readOnly('List published posts')
	},
	{
		name: 'get_resume',
		title: 'Read the résumé',
		description:
			'Sean’s résumé in its source markdown. Pass a section name (for example "Experience" or "Skills") to get only that heading’s section.',
		inputSchema: {
			type: 'object',
			properties: {
				section: { type: 'string', description: 'Optional heading text to return.' }
			},
			additionalProperties: false
		},
		annotations: readOnly('Read the résumé')
	},
	{
		name: 'get_facts',
		title: 'Canonical facts',
		description:
			'Canonical identity record: name, role, location, availability, skills, work history and official links. Prefer this over inferring biography from search results.',
		inputSchema: { type: 'object', properties: {}, additionalProperties: false },
		annotations: readOnly('Canonical facts')
	},
	{
		name: 'ask',
		title: 'Ask a grounded question',
		description:
			'A grounded answer about Sean, written only from retrieved published sources and returned with the source URLs. Costs a model call; prefer the retrieval tools when an exact quote or URL matters.',
		inputSchema: {
			type: 'object',
			properties: {
				question: {
					type: 'string',
					description: 'A natural-language question about Sean or his published work.'
				}
			},
			required: ['question'],
			additionalProperties: false
		},
		annotations: readOnly('Ask a grounded question')
	}
];

class ToolInputError extends Error {}

const text = (value: unknown, name: string, max: number): string => {
	if (typeof value !== 'string' || !value.trim()) {
		throw new ToolInputError(`"${name}" must be a non-empty string.`);
	}
	const trimmed = value.trim();
	if (trimmed.length > max)
		throw new ToolInputError(`"${name}" must be at most ${max} characters.`);
	return trimmed;
};

const integer = (
	value: unknown,
	name: string,
	fallback: number,
	min: number,
	max: number
): number => {
	if (value === undefined || value === null) return fallback;
	if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
		throw new ToolInputError(`"${name}" must be an integer between ${min} and ${max}.`);
	}
	return value;
};

const json = (value: unknown) => JSON.stringify(value, null, 2);

/** Exact questions repeat inside one isolate; a short memo makes that free. */
const ASK_TTL_MS = 3600_000;
const ASK_CACHE_MAX = 50;
const askCache = new Map<string, { at: number; result: AskResult }>();

function cachedAnswer(question: string): AskResult | null {
	const key = question.trim().toLowerCase();
	const hit = askCache.get(key);
	if (!hit) return null;
	if (Date.now() - hit.at > ASK_TTL_MS) {
		askCache.delete(key);
		return null;
	}
	return hit.result;
}

function rememberAnswer(question: string, result: AskResult) {
	const key = question.trim().toLowerCase();
	if (!askCache.has(key) && askCache.size >= ASK_CACHE_MAX) {
		const oldest = askCache.keys().next().value;
		if (oldest) askCache.delete(oldest);
	}
	askCache.set(key, { at: Date.now(), result });
}

/** The model's answer plus the list a caller can cite without trusting prose. */
function formatAnswer(result: AskResult): string {
	const lines = [result.answer || 'The model returned no answer.'];
	if (result.sources.length) {
		lines.push('', 'Sources:');
		for (const source of result.sources) lines.push(`- [${source.title}](${source.url})`);
	}
	return lines.join('\n');
}

async function askTool(
	args: Record<string, unknown>,
	{ env, request }: { env: McpEnv; request: Request }
): Promise<ToolRunResult> {
	const question = text(args.question, 'question', 1000);
	const cached = cachedAnswer(question);
	if (cached) return { text: formatAnswer(cached), structured: { ...cached, cached: true } };

	// The WAF cannot see inside a JSON-RPC body, so the application owns this
	// bound: one model call per ask, twenty asks per IP per hour.
	const ip = getClientIp(request);
	if (ip) {
		const rate = await consumeRateLimit(env.DB, {
			key: `mcp-ask:${ip}`,
			limit: 20,
			windowSeconds: 3600
		});
		if (!rate.allowed) {
			return {
				text: `Rate limited: too many model-backed questions from this address. Try again in ${rate.retryAfterSeconds} seconds, or use search_content and get_entry, which are not limited.`,
				isError: true
			};
		}
	}

	const result = await answerQuestion(question, (messages: ChatMessage[]) =>
		runQwen(env, messages)
	);
	rememberAnswer(question, result);
	return { text: formatAnswer(result), structured: { ...result } };
}

/**
 * Run one named tool. Input errors are the caller's to see and are returned as
 * tool errors; unexpected failures are logged and described without leaking
 * the stack or the binding into the model's context.
 */
export async function runTool(
	name: string,
	args: Record<string, unknown>,
	context: { env: McpEnv; request: Request }
): Promise<ToolRunResult> {
	try {
		switch (name) {
			case 'search_content': {
				const query = text(args.query, 'query', 1000);
				const limit = integer(args.limit, 'limit', 6, 1, 20);
				return { text: json(await searchContent(query, limit)) };
			}
			case 'get_entry': {
				const slug = text(args.slug, 'slug', 200);
				const type = args.type === 'page' ? 'page' : args.type === 'post' ? 'post' : null;
				if (args.type !== undefined && !type) {
					throw new ToolInputError('"type" must be "post" or "page".');
				}
				const entry = await getEntry((type ?? 'post') as EntryType, slug);
				if (!entry) {
					return { text: `No ${type ?? 'post'} found with slug "${slug}".`, isError: true };
				}
				return {
					text: entry.markdown,
					structured: { type: entry.type, slug: entry.slug, title: entry.title, url: entry.url }
				};
			}
			case 'list_posts': {
				const tag = args.tag === undefined ? undefined : text(args.tag, 'tag', 100);
				const limit = integer(args.limit, 'limit', 20, 1, 50);
				return { text: json(await listPosts(tag, limit)) };
			}
			case 'get_resume': {
				const section = args.section === undefined ? undefined : text(args.section, 'section', 100);
				const resume = await getResume(section);
				if (!resume.text) {
					return {
						text: `No résumé section matched "${section ?? ''}". The résumé markdown is at ${resume.url}.`,
						isError: true
					};
				}
				return {
					text: `${resume.text}\n\nSource: ${resume.url}`,
					structured: { url: resume.url, updated: resume.updated }
				};
			}
			case 'get_facts':
				return { text: json(getFacts()), structured: getFacts() };
			case 'ask':
				return await askTool(args, context);
			default:
				return { text: `Unknown tool "${name}".`, isError: true };
		}
	} catch (error) {
		if (error instanceof ToolInputError) return { text: error.message, isError: true };
		console.error(`[mcp] tool "${name}" failed`, error);
		return { text: `The ${name} tool failed; the error is in the Worker logs.`, isError: true };
	}
}
