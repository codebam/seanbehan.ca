import { describe, expect, it } from 'vitest';
import { highlight } from './highlight';

// The <code> span is the grammar's work. The <pre> around it also carries the
// fence label as aria-label, which is not the grammar that ended up resolving.
const tokens = (html: string) =>
	html.slice(html.indexOf('<code>') + '<code>'.length, html.lastIndexOf('</code>'));

describe('highlight', () => {
	it.each([
		['sh', 'echo hi'],
		['shell', 'echo hi'],
		['bash', 'echo hi'],
		['shellscript', 'echo hi'],
		['typescript', 'const x = 1;'],
		['javascript', 'const x = 1;'],
		['jsx', 'const x = <div/>;'],
		['svelte', '<div>hi</div>'],
		['css', 'a { color: red; }'],
		['html', '<div>hi</div>'],
		['json', '{"a":1}'],
		['yaml', 'key: value'],
		['nix', '{ a = 1; }'],
		['rust', 'fn main() {}'],
		['toml', 'key = "value"'],
		['ini', '[section]\nkey = value'],
		['sql', 'SELECT 1;'],
		['nginx', 'server { listen 80; }'],
		['systemd', '[Unit]\nDescription=hi'],
		['dockerfile', 'FROM alpine'],
		['diff', '-old\n+new']
	])('marks up %s code with shiki token styles', async (label, code) => {
		const html = await highlight(code, label);

		expect(html).toContain('<pre class="shiki');
		expect(html).toContain('<code>');
		expect(tokens(html)).toContain('--shiki-light:');
		expect(tokens(html)).toContain('--shiki-dark:');
		expect(html).toContain(`aria-label="Code block: ${label}"`);
	});

	it('lowercases a fence label before resolving it', async () => {
		const html = await highlight('const x = 1;', 'TYPESCRIPT');

		expect(tokens(html)).toBe(tokens(await highlight('const x = 1;', 'typescript')));
		expect(html).toContain('aria-label="Code block: typescript"');
	});

	// The four fence labels that are not shiki language ids. Each resolves to
	// its canonical grammar, but the aria-label keeps the word the author wrote.
	it.each([
		['conf', 'ini', '[section]\nkey = value'],
		['yml', 'yaml', 'key: value'],
		['docker', 'dockerfile', 'FROM alpine'],
		['patch', 'diff', '-old\n+new']
	])('%s renders the same tokens as %s', async (alias, canonical, code) => {
		const html = await highlight(code, alias);

		expect(tokens(html)).toBe(tokens(await highlight(code, canonical)));
		expect(tokens(html)).toContain('--shiki-light:');
	});

	it('names the fence label, not the resolved grammar, in the alias aria-label', async () => {
		const html = await highlight('key: value', 'yml');

		expect(html).toContain('aria-label="Code block: yml"');
		expect(html).not.toContain('aria-label="Code block: yaml"');
	});

	it('falls back to plaintext for an unknown label without throwing', async () => {
		const html = await highlight('const x = 1;', 'not-a-language');

		expect(html).toContain('<pre');
		expect(html).toContain('aria-label="Code block: not-a-language"');
		expect(tokens(html)).not.toContain('--shiki-light:');
		expect(tokens(html)).toContain('<span>const x = 1;</span>');
	});

	it('uses a bare label when no language is given', async () => {
		const html = await highlight('const x = 1;');

		expect(tokens(html)).not.toContain('--shiki-light:');
		expect(html).toContain('aria-label="Code block"');
		expect(html).not.toContain('aria-label="Code block:');
	});
});
