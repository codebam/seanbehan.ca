import { describe, expect, it } from 'vitest';
import { bodyMarkdown } from './markdown';

// The existing suite walks a whole body, covering links and inline code among
// other blocks. These cases isolate the other span marks the CMS converter
// renders, so a change to one mark is visible on its own. Marks are names on a
// span; a link resolves its name through the block's markDefs.
const block = (children: unknown[], markDefs?: unknown[]) => ({
	_type: 'block',
	style: 'normal',
	children,
	...(markDefs ? { markDefs } : {})
});

const span = (text: string, marks: string[] = []) => ({ _type: 'span', text, marks });

const linkDef = (href: string) => ({ _key: 'lk', _type: 'link', href });

describe('bodyMarkdown span marks', () => {
	it('renders strong and em as bold and italic', () => {
		expect(bodyMarkdown([block([span('bold', ['strong'])])])).toBe('**bold**\n');
		expect(bodyMarkdown([block([span('italic', ['em'])])])).toBe('*italic*\n');
	});

	it('renders both spellings of the strike mark as a strikethrough', () => {
		// The admin writes `strike-through`; older bodies carry
		// `strikethrough`. Both have to come out as GFM's ~~ deletion.
		for (const mark of ['strike-through', 'strikethrough']) {
			expect(bodyMarkdown([block([span('gone', [mark])])])).toBe('~~gone~~\n');
		}
	});

	it('stacks text marks on a single span', () => {
		expect(bodyMarkdown([block([span('both', ['strong', 'em'])])])).toBe('***both***\n');
	});

	it('wraps a linked span in its destination, inside its text marks', () => {
		const body = [block([span('docs', ['strong', 'lk'])], [linkDef('https://example.com/a')])];
		expect(bodyMarkdown(body)).toBe('[**docs**](https://example.com/a)\n');
	});

	it('leaves a mark with no matching link definition as plain text', () => {
		expect(bodyMarkdown([block([span('here', ['missing'])])])).toBe('here\n');
	});

	it('renders a link definition with no href as an empty destination', () => {
		const body = [block([span('here', ['lk'])], [{ _key: 'lk', _type: 'link' }])];
		expect(bodyMarkdown(body)).toBe('[here]()\n');
	});
});

describe('bodyMarkdown span text', () => {
	it('escapes markdown punctuation in prose', () => {
		expect(bodyMarkdown([block([span('cost *5* and [x] <y> ~z~ `q` _u_')])])).toBe(
			'cost \\*5\\* and \\[x\\] \\<y\\> \\~z\\~ \\`q\\` \\_u\\_\n'
		);
	});

	it('escapes link text but leaves the URL untouched', () => {
		const body = [block([span('a * b', ['lk'])], [linkDef('https://example.com/a*b')])];
		expect(bodyMarkdown(body)).toBe('[a \\* b](https://example.com/a*b)\n');
	});

	it('chooses a code fence wider than the backticks inside the span', () => {
		expect(bodyMarkdown([block([span('run `npm` now', ['code'])])])).toBe('``run `npm` now``\n');
	});

	it('pads inline code that begins or ends with a space or backtick', () => {
		expect(bodyMarkdown([block([span(' `lead` ', ['code'])])])).toBe('``  `lead`  ``\n');
	});

	it('coalesces adjacent spans that carry the same marks', () => {
		const body = [block([span('for ', ['strong']), span('example', ['strong'])])];
		expect(bodyMarkdown(body)).toBe('**for example**\n');
	});

	it('keeps adjacent spans with different marks separate', () => {
		const body = [block([span('for ', ['strong']), span('example', ['em'])])];
		expect(bodyMarkdown(body)).toBe('**for** *example*\n');
	});

	it('normalises line breaks inside a span to a hard line break', () => {
		// CRLF comes from bodies imported when the site was SvelteKit; a bare
		// \n comes from the admin. Both need the backslash markdown reads as a
		// break, or the two halves run together in the exported document.
		for (const text of ['first\nsecond', 'first\r\nsecond']) {
			expect(bodyMarkdown([block([span(text)])])).toBe('first\\\nsecond\n');
		}
	});
});
