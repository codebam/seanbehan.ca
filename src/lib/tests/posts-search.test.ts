import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import Posts from '$lib/components/Posts.svelte';
import type { Post } from '$lib/types';

const posts: Post[] = [
	{
		path: '/posts/podman-quadlets',
		meta: { title: 'Podman Quadlets', date: '2025-03-28', draft: false }
	},
	{ path: '/posts/nixos-flakes', meta: { title: 'NixOS Flakes', date: '2024-06-01', draft: false } }
];

/**
 * Type only after the mount-time debounce window has passed, the way a real
 * user does. Typing immediately hides the bug this file guards: the single
 * timer created on mount fires 300ms later and reads whatever `query` holds by
 * then, so an instant keystroke gets filtered by accident.
 */
const DEBOUNCE_MS = 300;
const afterInitialDebounce = () => new Promise((resolve) => setTimeout(resolve, DEBOUNCE_MS * 2));

describe('Posts search', () => {
	it('filters the list as you type', async () => {
		render(Posts, { props: { posts } });

		expect(screen.queryByText('Podman Quadlets')).not.toBeNull();
		expect(screen.queryByText('NixOS Flakes')).not.toBeNull();

		await afterInitialDebounce();
		const input = screen.getByRole('searchbox');
		await fireEvent.input(input, { target: { value: 'Podman' } });

		// Guards a bug where the debounce $effect read `query` only inside its
		// setTimeout callback, so Svelte tracked no dependency and the effect
		// never re-ran — every post stayed visible no matter what was typed.
		await waitFor(() => expect(screen.queryByText('NixOS Flakes')).toBeNull(), { timeout: 2000 });
		expect(screen.queryByText('Podman Quadlets')).not.toBeNull();
	});

	it('shows every post again when the query is cleared', async () => {
		render(Posts, { props: { posts } });
		await afterInitialDebounce();
		const input = screen.getByRole('searchbox');

		await fireEvent.input(input, { target: { value: 'Podman' } });
		await waitFor(() => expect(screen.queryByText('NixOS Flakes')).toBeNull(), { timeout: 2000 });

		await fireEvent.input(input, { target: { value: '' } });
		await waitFor(() => expect(screen.queryByText('NixOS Flakes')).not.toBeNull(), {
			timeout: 2000
		});
	});

	it('reports when nothing matches', async () => {
		render(Posts, { props: { posts } });
		await afterInitialDebounce();
		const input = screen.getByRole('searchbox');

		await fireEvent.input(input, { target: { value: 'zzzznotathing' } });
		await waitFor(() => expect(screen.queryByText('No posts found')).not.toBeNull(), {
			timeout: 2000
		});
	});
});
