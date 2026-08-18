import { describe, it, expect } from 'vitest';
import { headingId, withHeadingAnchors } from './renderPost';

describe('headingId', () => {
	it('slugifies the way the tag pages do', () => {
		expect(headingId('Flake Structure')).toBe('flake-structure');
		expect(headingId('Managing Dependencies with flake.lock')).toBe(
			'managing-dependencies-with-flake-lock'
		);
	});

	it('carries no leading or trailing hyphen', () => {
		expect(headingId('  …Setup!  ')).toBe('setup');
	});
});

describe('withHeadingAnchors', () => {
	it('gives h2 and h3 an id and a self-link', () => {
		const { html, headings } = withHeadingAnchors('<h2>Setup</h2><p>x</p><h3>Details</h3>');

		expect(html).toContain('<h2 id="setup"><a class="heading-anchor" href="#setup">Setup</a></h2>');
		expect(headings).toEqual([
			{ id: 'setup', text: 'Setup', level: 2 },
			{ id: 'details', text: 'Details', level: 3 }
		]);
	});

	it('leaves h1 and h4 alone', () => {
		const { html, headings } = withHeadingAnchors('<h1>Title</h1><h4>Aside</h4>');

		expect(html).toBe('<h1>Title</h1><h4>Aside</h4>');
		expect(headings).toEqual([]);
	});

	it('suffixes a repeated heading so both ids are reachable', () => {
		const { headings } = withHeadingAnchors('<h2>Setup</h2><h2>Setup</h2><h2>Setup</h2>');

		expect(headings.map((h) => h.id)).toEqual(['setup', 'setup-2', 'setup-3']);
	});

	it('reads through inline markup and entities for the label', () => {
		const { headings } = withHeadingAnchors('<h2>Using <code>nix &amp; flakes</code></h2>');

		expect(headings[0]).toEqual({
			id: 'using-nix-flakes',
			text: 'Using nix & flakes',
			level: 2
		});
	});

	it('leaves a heading that already carries an id untouched', () => {
		const source = '<h2 id="mine">Mine</h2>';

		expect(withHeadingAnchors(source)).toEqual({ html: source, headings: [] });
	});
});
