/** Roughly the pace of a reader who is skimming prose, not studying it. */
const WORDS_PER_MINUTE = 200;

/**
 * What a word inside a code block is worth against a word of prose.
 *
 * Neither extreme is honest. Counting a config dump at full prose speed says a
 * post is three times longer than it reads; dropping code entirely says a
 * tutorial that is mostly a shell transcript takes one minute. Readers do work
 * their way through a snippet, just faster than a sentence, so it counts at
 * half.
 */
const CODE_WEIGHT = 0.5;

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---/;
const FENCED_CODE = /```[\s\S]*?```/g;
const INLINE_CODE = /`[^`]*`/g;
/** Link and image syntax: keep the text, drop the URL. */
const LINK = /!?\[([^\]]*)\]\([^)]*\)/g;
const HTML_TAG = /<[^>]+>/g;

/**
 * Words in a run of text. A token counts only if it contains a letter or a
 * digit, so a bare "##" or "-" is punctuation rather than a word.
 */
export function countWords(text: string): number {
	return text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

/** Prose words and code words in a markdown body, counted separately. */
export function splitWords(markdown: string): { prose: number; code: number } {
	let code = 0;

	// Fences first, then inline. The other order double-counts: the ``` of a
	// fence is itself a pair of backticks, so the inline pattern matches inside
	// a block that has already been counted.
	const withoutCode = markdown
		.replace(FRONTMATTER, '')
		.replace(FENCED_CODE, (block) => {
			// The info string ("```sh") is a marker, not something anyone reads.
			code += countWords(block.replace(/^```[^\n]*/, ' ').replace(/```$/, ' '));
			return ' ';
		})
		.replace(INLINE_CODE, (span) => {
			code += countWords(span.replace(/`/g, ' '));
			return ' ';
		});

	const prose = countWords(withoutCode.replace(LINK, '$1').replace(HTML_TAG, ' '));

	return { prose, code };
}

/**
 * Estimated minutes to read a markdown body. Always at least 1: "0 min read"
 * reads as a bug, and a post short enough to round to zero still costs a
 * reader the click.
 */
export function readingMinutes(markdown: string): number {
	const { prose, code } = splitWords(markdown);
	return Math.max(1, Math.ceil((prose + code * CODE_WEIGHT) / WORDS_PER_MINUTE));
}
