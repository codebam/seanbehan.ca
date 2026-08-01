import { describe, it, expect, vi, beforeEach } from 'vitest';
import { debounce, sanitizeHTML, isValidExternalURL, renderInlineMarkdown } from './utils';

describe('debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it('should delay function execution', () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn('test');
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledWith('test');
	});

	it('should cancel previous calls', () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn('first');
		debouncedFn('second');

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('second');
	});
});

describe('sanitizeHTML', () => {
	it('should escape HTML tags', () => {
		const input = '<script>alert("xss")</script>';
		const result = sanitizeHTML(input);
		expect(result).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
	});

	it('should handle plain text', () => {
		const input = 'Hello world';
		const result = sanitizeHTML(input);
		expect(result).toBe('Hello world');
	});
});

describe('isValidExternalURL', () => {
	it('should accept valid HTTPS URLs', () => {
		expect(isValidExternalURL('https://example.com')).toBe(true);
		expect(isValidExternalURL('https://api.example.com/data')).toBe(true);
	});

	it('should reject HTTP URLs', () => {
		expect(isValidExternalURL('http://example.com')).toBe(false);
	});

	it('should reject localhost URLs', () => {
		expect(isValidExternalURL('https://localhost:3000')).toBe(false);
	});

	it('should reject invalid URLs', () => {
		expect(isValidExternalURL('not-a-url')).toBe(false);
		expect(isValidExternalURL('')).toBe(false);
	});
});

describe('renderInlineMarkdown', () => {
	it('should render bold', () => {
		expect(renderInlineMarkdown('a **bold** word')).toBe('a <strong>bold</strong> word');
		expect(renderInlineMarkdown('a __bold__ word')).toBe('a <strong>bold</strong> word');
	});

	it('should render italics with asterisks but leave underscores alone', () => {
		expect(renderInlineMarkdown('an *emphasised* word')).toBe('an <em>emphasised</em> word');
		expect(renderInlineMarkdown('the snake_case_name')).toBe('the snake_case_name');
	});

	it('should prefer bold over italics for double markers', () => {
		expect(renderInlineMarkdown('**both**')).toBe('<strong>both</strong>');
	});

	it('should render inline code', () => {
		expect(renderInlineMarkdown('run `npm run dev`')).toBe('run <code>npm run dev</code>');
	});

	it('should render http(s) links only', () => {
		expect(renderInlineMarkdown('[site](https://example.com)')).toBe(
			'<a href="https://example.com" target="_blank" rel="noopener noreferrer">site</a>'
		);
		expect(renderInlineMarkdown('[x](javascript:alert(1))')).toBe('[x](javascript:alert(1))');
	});

	it('should escape HTML in the model output', () => {
		expect(renderInlineMarkdown('<img src=x onerror=alert(1)>')).toBe(
			'&lt;img src=x onerror=alert(1)&gt;'
		);
		expect(renderInlineMarkdown('**<b>hi</b>**')).toBe('<strong>&lt;b&gt;hi&lt;/b&gt;</strong>');
	});

	it('should convert newlines to line breaks', () => {
		expect(renderInlineMarkdown('one\ntwo')).toBe('one<br />two');
		expect(renderInlineMarkdown('one\n\ntwo')).toBe('one<br /><br />two');
	});

	it('should leave an unterminated marker as literal text mid-stream', () => {
		expect(renderInlineMarkdown('a **partial')).toBe('a **partial');
	});
});
