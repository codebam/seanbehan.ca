import { describe, it, expect } from 'vitest';
import { renderBodyHtml } from './renderBody';

// rssFeed.test.ts already pins the happy paths through the feed (asset.url,
// empty alt with numeric dimensions, and sh code with shiki markup dropped).
// These cases cover the edges those fixtures leave open.

describe('renderBodyHtml language handling', () => {
	it('normalises a language tag to lower case in the class', async () => {
		const html = await renderBodyHtml([{ _type: 'code', _key: 'c', language: 'TS', code: 'x' }]);

		expect(html).toBe('<pre><code class="language-ts">x</code></pre>');
	});

	it.each([undefined, null, 42, 'c++', 'two words', 'x" onload="bad'])(
		'omits the class for the unusable language %j',
		async (language) => {
			const html = await renderBodyHtml([{ _type: 'code', _key: 'c', language, code: 'x' }]);

			expect(html).toBe('<pre><code>x</code></pre>');
		}
	);

	it('drops a code block whose code is not a string', async () => {
		const html = await renderBodyHtml([{ _type: 'code', _key: 'c', language: 'sh', code: 42 }]);

		expect(html).toBe('');
	});
});

describe('renderBodyHtml image attributes', () => {
	it('escapes quotes and ampersands in src and alt', async () => {
		const html = await renderBodyHtml([
			{
				_type: 'image',
				_key: 'i',
				asset: { url: '/img/a"b.webp' },
				alt: 'say "hi" & bye'
			}
		]);

		expect(html).toBe('<img src="/img/a&quot;b.webp" alt="say &quot;hi&quot; &amp; bye" />');
	});

	it.each([
		['843', 'width', ' width="843"'],
		[381, 'height', ' height="381"'],
		[0, 'width', ''],
		[-5, 'width', ''],
		[1.5, 'height', ''],
		['12px', 'width', '']
	])('coerces a %j %s value to %j', async (value, attribute, expected) => {
		const html = await renderBodyHtml([
			{ _type: 'image', _key: 'i', asset: { url: '/img/x.webp' }, [attribute]: value }
		]);

		expect(html).toBe(`<img src="/img/x.webp" alt=""${expected} />`);
	});

	it('falls back to the legacy src field when asset.url is absent', async () => {
		const html = await renderBodyHtml([{ _type: 'image', _key: 'i', src: '/img/old.webp' }]);

		expect(html).toBe('<img src="/img/old.webp" alt="" />');
	});

	it.each([42, true, { url: '/img/object.webp' }, ['/img/array.webp']])(
		'drops an image whose legacy src is not a string: %j',
		async (src) => {
			expect(await renderBodyHtml([{ _type: 'image', _key: 'i', src }])).toBe('');
		}
	);

	it('prefers asset.url over a legacy src field', async () => {
		const html = await renderBodyHtml([
			{ _type: 'image', _key: 'i', src: '/img/old.webp', asset: { url: '/img/new.webp' } }
		]);

		expect(html).toBe('<img src="/img/new.webp" alt="" />');
	});
});

describe('renderBodyHtml input guard', () => {
	it.each([undefined, null, 'text', 42, { _type: 'block' }])(
		'returns an empty string for the non-array value %j',
		async (value) => {
			expect(await renderBodyHtml(value)).toBe('');
		}
	);
});
