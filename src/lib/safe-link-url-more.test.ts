import { describe, expect, it } from 'vitest';
import { safeLinkUrl } from './linkUrl';

// linkUrl.test.ts covers the headline dangerous schemes and the common
// non-string inputs. These are the remaining edges the sanitizer draws: the
// other allowed schemes, its exact href shape, and the ways a script URL can
// hide from a case-sensitive or whitespace-trimming check.

describe('safeLinkUrl — further schemes and edge inputs', () => {
	it.each([
		['http://example.com/post', 'http://example.com/post'],
		['HTTPS://EXAMPLE.COM/', 'HTTPS://EXAMPLE.COM/'],
		['tel:+15551234567', 'tel:+15551234567'],
		['#section', '#section']
	])('keeps the safe href %j', (value, expected) => {
		expect(safeLinkUrl(value)).toBe(expected);
	});

	it.each([
		['data:image/png;base64,AAAA', '#'],
		['ftp://example.com/file', '#'],
		['file:///etc/passwd', '#'],
		['JaVaScRiPt:alert(1)', '#'],
		['java\nscript:alert(1)', '#'],
		['/about\u0000', '#'],
		['/\\evil.example', '#'],
		['\\evil.example', '#'],
		[' https://example.com', '#'],
		['./relative', '#'],
		['?q=1', '#']
	])('rejects the unsafe href %j', (value, expected) => {
		expect(safeLinkUrl(value)).toBe(expected);
	});

	it.each([[true], [[]]])('rejects the non-string value %j', (value) => {
		expect(safeLinkUrl(value)).toBe('#');
	});
});
