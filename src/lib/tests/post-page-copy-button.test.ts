import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import Page from '../../routes/posts/[slug]/+page.svelte';

const props = {
	data: {
		post: {
			path: '/posts/test-post',
			meta: {
				title: 'Test Post',
				date: '2025-01-01',
				draft: false,
				tags: []
			},
			html: '<p>Intro</p>\n<pre class="shiki"><code>echo hi</code></pre>\n<p>After</p>'
		},
		newer: null,
		older: null,
		related: [],
		publishedTagSlugs: []
	}
};

/**
 * jsdom has no clipboard API; give the page one that records what it was
 * asked to write, then assert against the record.
 */
function withClipboard() {
	const writeText = vi.fn().mockResolvedValue(undefined);
	Object.defineProperty(navigator, 'clipboard', {
		value: { writeText },
		configurable: true
	});
	return writeText;
}

describe('Post page code blocks', () => {
	it('sits a copy button in every code block, outside the code itself', () => {
		render(Page, { props });

		const pre = document.querySelector('pre');
		// The block is wrapped, and the button is a sibling of the pre — not a
		// child, so the code text a reader copies stays clean.
		expect(pre?.parentElement?.classList.contains('code-block')).toBe(true);
		expect(screen.getAllByRole('button', { name: 'Copy' })).toHaveLength(1);
	});

	it('copies the block when pressed', async () => {
		const writeText = withClipboard();
		render(Page, { props });

		await fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

		expect(writeText).toHaveBeenCalledTimes(1);
		expect(writeText).toHaveBeenCalledWith('echo hi');
		await waitFor(() => expect(screen.getByRole('button', { name: 'Copied' })).not.toBeNull());
	});

	it('announces the result to assistive technology', async () => {
		withClipboard();
		render(Page, { props });

		await fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

		// The live region the screen reader hears, asserted on its text rather
		// than an accessible-name match (flaky on role=status in jsdom).
		await waitFor(() => {
			const status = document.querySelector('[role="status"]');
			expect(status?.textContent).toBe('Code copied');
		});
	});
});
