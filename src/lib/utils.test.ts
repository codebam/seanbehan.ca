import { describe, it, expect, vi, beforeEach } from 'vitest';
import { debounce, sanitizeHTML, isValidExternalURL } from './utils';

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
