/**
 * Answering a program that asks for the page in a form it can parse.
 *
 * Bots — crawlers building an index, agents reading a post on someone's
 * behalf — say what they can consume in the request's `Accept` header, and a
 * browser's `Accept` never mentions `text/markdown` at all. So the signal is
 * taken at face value and nothing else is guessed: no user-agent sniffing, no
 * treating a wildcard as a preference. A reader gets markdown or JSON only
 * when it asks for that type over HTML by name; everyone else, including the
 * wildcard a `curl` sends by default, gets the page they have always got.
 *
 * The answer is a path, not a response: `/posts/nixos` asked as markdown is
 * served by `/posts/nixos.md`, an endpoint of its own. One URL per variant
 * keeps the edge cache honest — the existing key is built from the pathname,
 * so each format is stored and evicted under its own entry, with no `Vary`
 * for the Cache API to lose track of — and it means a bot may skip the header
 * dance entirely and append the suffix, which is how several of them probe.
 *
 * (One rule for edits to this file: a wildcard media range cannot be written
 * literally inside a block comment. Its slash-star closes the comment early.)
 */

/** The formats a content page can be answered in besides HTML. */
export type ContentFormat = 'md' | 'json';

/**
 * Detail pages of the two collections whose words live in the database. Lists
 * and tag archives are navigation rather than content, and the hand-written
 * templates (home, about, contact) have no stored body to convert; projects and
 * products belong to the other origin's templates.
 */
const NEGOTIABLE = /^\/(?:posts|pages)\/[^/]+$/;

/**
 * The résumé answers in markdown only: its words were written as the file
 * `/resume.md` serves (see that route), so there is nothing to convert and
 * less still to hand a bot as JSON. A reader asking for the last is not
 * refused — just left with the page they were given before this existed.
 */
const MD_ONLY = new Set(['/resume']);

/** A request already for one of the variants: nothing left to negotiate. */
const ALREADY_VARIANT = /\.(md|json)$/i;

/** One parsed token of an Accept header. */
interface Range {
	type: string;
	q: number;
}

/**
 * Split an `Accept` header into media ranges.
 *
 * A `q` that does not parse counts as `0` rather than `1`: a header malformed
 * enough to state a preference it cannot mean should not win anything. A `q`
 * outside `0..1` is likewise rejected by RFC 9110, and dropping it keeps the
 * negotiation from being steered by garbage.
 */
function parseRanges(accept: string): Range[] {
	const ranges: Range[] = [];
	for (const part of accept.split(',')) {
		const [type, ...params] = part.trim().split(';');
		if (!type) continue;
		let q = 1;
		for (const param of params) {
			const [name, value] = param.split('=');
			if (name.trim().toLowerCase() !== 'q') continue;
			const parsed = Number(value?.trim());
			q = Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0;
		}
		ranges.push({ type: type.trim().toLowerCase(), q });
	}
	return ranges;
}

/** The highest q among exact matches for a type; 0 when the type is absent. */
const qualityOf = (ranges: Range[], type: string) =>
	ranges.reduce((best, range) => (range.type === type ? Math.max(best, range.q) : best), 0);

/**
 * The format this `Accept` header asks for, if any.
 *
 * A type is *claimed* only by naming it — `text/markdown` or
 * `application/json` — because the wildcards that cover everything name
 * nothing. HTML's score is different: `text/html` and the covering ranges
 * keep it preferred, which is exactly what a browser (or curl) sends and is
 * why neither has to know this feature exists. A claim has to outscore HTML
 * outright, or tie the other claim in which case markdown wins the tie: it is
 * the format both kinds of reader were probably reaching for when they listed
 * them together.
 */
export function requestedFormat(accept: string | null): ContentFormat | null {
	if (!accept) return null;
	const ranges = parseRanges(accept);

	const html = Math.max(
		qualityOf(ranges, 'text/html'),
		qualityOf(ranges, 'text/*'),
		qualityOf(ranges, '*/*')
	);
	const md = qualityOf(ranges, 'text/markdown');
	const json = qualityOf(ranges, 'application/json');

	if (md > html && md >= json) return 'md';
	if (json > html && json > md) return 'json';
	return null;
}

/**
 * The suffixed path that answers this request, or null when the request is
 * for HTML, or is not a page with more than one possible answer.
 *
 * The query string travels with the rewrite so a preview token keeps working
 * on the variant, exactly as it does on the page itself.
 */
export function negotiatedPath(request: Request, url: URL): string | null {
	if (request.method !== 'GET' && request.method !== 'HEAD') return null;
	if (ALREADY_VARIANT.test(url.pathname)) return null;
	const format = requestedFormat(request.headers.get('Accept'));
	if (!format) return null;
	if (NEGOTIABLE.test(url.pathname)) return `${url.pathname}.${format}${url.search}`;
	if (format === 'md' && MD_ONLY.has(url.pathname)) return `${url.pathname}.md${url.search}`;
	return null;
}
