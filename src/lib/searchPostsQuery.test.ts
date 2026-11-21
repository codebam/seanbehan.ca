import Fuse from 'fuse.js';
import { describe, expect, it, vi } from 'vitest';
import { MAX_QUERY_LENGTH, searchPosts } from './search';
import type { PostSummary } from './types';

function post(slug: string, title: string, description: string, tags: string[]): PostSummary {
	return {
		path: `/posts/${slug}`,
		slug,
		meta: { title, date: '2026-01-01', description, tags, draft: false }
	};
}

const posts = [
	post(
		'booting-linux',
		'Booting Linux the slow way',
		'What actually happens between power-on and a shell.',
		['linux']
	),
	post('rust-servers', 'Rust for people who run web servers', '', ['systemd']),
	post('garden', 'Composting in a cold climate', '', ['garden'])
];

// buildRecords reads bodies by slug, so the body-only terms live here rather
// than in the PostSummary fixtures above.
const bodies = new Map([
	['booting-linux', 'The kernel asks the firmware for memory, then hands off to init.'],
	['rust-servers', 'One chapter is all about linux: linux kernels, linux panics, linux all day.'],
	['garden', 'Carrot tops, coffee grounds, and a bin that never fully freezes.']
]);

describe('searchPosts', () => {
	it('returns matching slugs with the strongest title hit first', () => {
		const slugs = searchPosts('linux', posts, bodies);

		expect(slugs).toContain('booting-linux');
		expect(slugs).toContain('rust-servers');
		expect(slugs.indexOf('booting-linux')).toBeLessThan(slugs.indexOf('rust-servers'));
	});

	it('reaches a term that appears only in a body', () => {
		expect(searchPosts('panics', posts, bodies)).toContain('rust-servers');
	});

	it('matches a tag even when no prose mentions it', () => {
		expect(searchPosts('systemd', posts, bodies)).toContain('rust-servers');
	});

	it('leaves out a post that matches nothing', () => {
		expect(searchPosts('quantum entanglement', posts, bodies)).not.toContain('garden');
	});

	it('clamps an overlong query before handing it to Fuse', () => {
		const search = vi.spyOn(Fuse.prototype, 'search');
		try {
			expect(() => searchPosts('x'.repeat(10_000), posts, bodies)).not.toThrow();
			expect(search).toHaveBeenCalledWith('x'.repeat(MAX_QUERY_LENGTH));
		} finally {
			search.mockRestore();
		}
	});
});
