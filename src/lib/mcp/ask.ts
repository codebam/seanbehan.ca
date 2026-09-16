/**
 * The one conversational tool: retrieval first, then Qwen.
 *
 * The model is the least trustworthy part of the answer, so it is also the
 * most constrained. It never gets to search on its own — the sources below are
 * chosen by the same ranked search the archive uses — it is told to answer in
 * the third person, to cite the URL behind every claim, to say the published
 * sources do not answer rather than guess, and to treat the source text as
 * data rather than instructions. A model that cannot search cannot wander, and
 * a caller that does not trust the prose still has the source list.
 *
 * `@cf/qwen/qwen3.8-27b` on Workers AI is the configured answer model: 27B,
 * 262k context, prompt caching, and priced per token, which is why the caller
 * in tools.ts puts a per-IP rate limit in front of it and why the prompt is
 * assembled from retrieval rather than stuffed with the whole archive.
 */
import { SITES } from '../site';
import { getEntry, getFacts, getResume, searchContent, type EntryType } from './retrieval';

export const ASK_MODEL = '@cf/qwen/qwen3.8-27b';

/** How much of any one source a single answer may read. */
const SOURCE_CHARS = 2400;
const RESUME_CHARS = 3500;
const FACTS_URL = `${SITES.seanbehan.url}/mcp`;

export interface AskSource {
	title: string;
	url: string;
	text: string;
}

export interface ChatMessage {
	role: 'system' | 'user';
	content: string;
}

export interface AskResult {
	answer: string;
	sources: { title: string; url: string }[];
	model: string;
}

const truncate = (text: string, length: number) =>
	text.length > length ? `${text.slice(0, length).trimEnd()}\n…` : text;

/**
 * The sources an answer may use: the canonical facts, the résumé, and the
 * top-ranked published entries. Four entries is a deliberate ceiling — enough
 * for a comparative question, small enough that a long post cannot crowd the
 * question out of a small model's attention.
 */
export async function gatherSources(question: string): Promise<AskSource[]> {
	const sources: AskSource[] = [
		{
			title: 'Canonical facts about Sean Behan',
			url: FACTS_URL,
			text: JSON.stringify(getFacts(), null, 2)
		}
	];

	const resume = await getResume();
	if (resume.text) {
		sources.push({
			title: 'Résumé (source markdown)',
			url: resume.url,
			text: truncate(resume.text, RESUME_CHARS)
		});
	}

	const { results } = await searchContent(question, 4);
	for (const result of results) {
		const entry = await getEntry(result.type as EntryType, result.slug);
		sources.push(
			entry
				? { title: entry.title, url: entry.url, text: truncate(entry.markdown, SOURCE_CHARS) }
				: { title: result.title, url: result.url, text: result.excerpt }
		);
	}

	return sources;
}

/** The complete instruction set for the answer model. Pure, so it is testable. */
export function buildAskMessages(question: string, sources: AskSource[]): ChatMessage[] {
	const system = [
		'You answer questions about Sean Behan for other software agents.',
		'Use only the SOURCES below; do not use outside knowledge.',
		'Write about Sean in the third person and never speak as him.',
		'Cite the source URL as a markdown link for every factual claim.',
		'If the sources do not contain the answer, reply exactly:',
		"The published sources don't answer that."
	].join(' ');

	const material = sources
		.map((source, index) => `[${index + 1}] ${source.title} — ${source.url}\n${source.text}`)
		.join('\n\n');

	return [
		{ role: 'system', content: system },
		{
			role: 'user',
			content: `SOURCES\n\n${material}\n\nQUESTION\n${question}\n\nAnswer in at most 200 words.`
		}
	];
}

/**
 * Workers AI returns text-generation results in more than one shape depending
 * on the model and transport; the answer is whichever of the known fields
 * carries text. Reason-only output is not an answer, so empty stays empty.
 */
export function extractModelText(raw: unknown): string {
	let text = '';
	if (typeof raw === 'string') {
		text = raw;
	} else if (raw && typeof raw === 'object') {
		const record = raw as Record<string, unknown>;
		const choices = record.choices as Array<{ message?: { content?: unknown } }> | undefined;
		text =
			[record.response, record.output_text, choices?.[0]?.message?.content].find(
				(candidate): candidate is string =>
					typeof candidate === 'string' && candidate.trim().length > 0
			) ?? '';
	}
	return text.replace(/<think(?:ing)?>[\s\S]*?<\/think(?:ing)?>/gi, '').trim();
}

/**
 * One grounded answer. `runModel` is injected so the caller owns the Workers
 * AI binding (and the tests own a stub), while this module owns retrieval,
 * prompting and response shape.
 */
export async function answerQuestion(
	question: string,
	runModel: (messages: ChatMessage[]) => Promise<unknown>
): Promise<AskResult> {
	const sources = await gatherSources(question);
	const raw = await runModel(buildAskMessages(question, sources));
	return {
		answer: extractModelText(raw),
		sources: sources.map(({ title, url }) => ({ title, url })),
		model: ASK_MODEL
	};
}

/** The model call the handler makes, kept here so the model id has one home. */
export async function runQwen(
	env: { AI: { run(model: string, inputs: Record<string, unknown>): Promise<unknown> } },
	messages: ChatMessage[]
): Promise<unknown> {
	return env.AI.run(ASK_MODEL, {
		messages,
		max_tokens: 800,
		temperature: 0.2,
		// Grounded extraction rarely benefits from reasoning tokens; the shorter
		// path is also the one that returns inside an agent's tool timeout.
		chat_template_kwargs: { enable_thinking: false }
	});
}
