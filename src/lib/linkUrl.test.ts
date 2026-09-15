import { describe, expect, it } from 'vitest';
import { safeLinkUrl } from './linkUrl';

describe('safeLinkUrl', () => {
	it.each([
		['javascript:alert(1)', '#'],
		['data:text/html,<script>alert(1)</script>', '#'],
		['vbscript:msgbox(1)', '#'],
		['//evil.example/path', '#'],
		['https://example.com/post', 'https://example.com/post'],
		['/relative', '/relative'],
		['mailto:a@b', 'mailto:a@b']
	])('turns %j into %j', (value, expected) => {
		expect(safeLinkUrl(value)).toBe(expected);
	});

	it.each([[''], ['   '], [undefined], [null], [42], [{ href: 'https://example.com' }]])(
		'turns the non-link value %j into #',
		(value) => {
			expect(safeLinkUrl(value)).toBe('#');
		}
	);
});
