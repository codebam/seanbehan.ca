/**
 * Search ranking for question-shaped queries.
 *
 * The archive's scorer is built for keywords: Fuse treats a multi-word query
 * as every term having to match, which is right for `nixos flakes` and wrong
 * for `what has Sean written about NixOS?` — the stopwords and the missing
 * author name make a record that does contain the answer match nothing at all.
 * That is exactly the shape an agent sends, so MCP search tries the archive's
 * rule first and, only when it returns nothing, falls back to the question's
 * content words ranked one at a time and merged.
 *
 * The fallback never replaces a direct match: a keyword query that already
 * ranked is left alone, so precision on the archive does not change.
 */
import { rank, type SearchRecord } from '../search';

/**
 * Words that carry no topic signal in a question. The names are included
 * because the facts tool already answers identity questions, and a search for
 * "SeAN" would otherwise float every post that mentions the byline.
 */
export const QUESTION_STOPWORDS = new Set([
	'a',
	'about',
	'an',
	'and',
	'are',
	'as',
	'at',
	'be',
	'been',
	'behan',
	'by',
	'can',
	'could',
	'did',
	'do',
	'does',
	'for',
	'from',
	'had',
	'has',
	'have',
	'he',
	'her',
	'his',
	'how',
	'i',
	'in',
	'is',
	'it',
	'its',
	'me',
	'my',
	'of',
	'on',
	'or',
	'our',
	'sean',
	'she',
	'should',
	'so',
	'than',
	'that',
	'the',
	'their',
	'them',
	'they',
	'this',
	'to',
	'was',
	'we',
	'were',
	'what',
	'when',
	'where',
	'which',
	'who',
	'why',
	'will',
	'with',
	'would',
	'write',
	'written',
	'wrote',
	'you',
	'your'
]);

/** The content words of a question, longest first: `nixos` outranks `sean`. */
export function questionTerms(query: string): string[] {
	const terms = query
		.toLowerCase()
		.split(/[^a-z0-9+#.]+/)
		.filter((term) => term.length >= 3 && !QUESTION_STOPWORDS.has(term));
	return [...new Set(terms)].sort((a, b) => b.length - a.length);
}

/** Ranked slugs, with the per-content-word union as the question fallback. */
export function rankedSlugs(query: string, records: SearchRecord[], limit: number): string[] {
	if (limit <= 0) return [];
	const direct = rank(query, records);
	if (direct.length || records.length === 0) return direct.slice(0, limit);

	const seen = new Set<string>();
	const out: string[] = [];
	for (const term of questionTerms(query)) {
		for (const slug of rank(term, records)) {
			if (seen.has(slug)) continue;
			seen.add(slug);
			out.push(slug);
			if (out.length >= limit) return out;
		}
	}
	return out;
}
