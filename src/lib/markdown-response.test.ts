import { describe, expect, it } from 'vitest';
import { jsonResponse, markdownResponse, notFoundResponse } from './markdown';

describe('export response helpers', () => {
	it('markdownResponse serves the body verbatim as markdown', async () => {
		const res = markdownResponse('# Title\n\nBody.\n');
		expect(res.status).toBe(200);
		expect(res.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
		expect(await res.text()).toBe('# Title\n\nBody.\n');
	});

	it('jsonResponse serializes the payload as JSON', async () => {
		const res = jsonResponse({ title: 'NixOS Flakes', tags: ['nix'] });
		expect(res.status).toBe(200);
		expect(res.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
		expect(await res.json()).toEqual({ title: 'NixOS Flakes', tags: ['nix'] });
	});

	it('notFoundResponse is a 404 plain-text response', async () => {
		const res = notFoundResponse();
		expect(res.status).toBe(404);
		expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
		expect(await res.text()).toBe('Not Found\n');
	});
});
