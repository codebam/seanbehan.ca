import { describe, it, expect } from 'vitest';
import { markdownResponse, jsonResponse, notFoundResponse } from './markdown';

describe('markdownResponse', () => {
	it('serves the body with a UTF-8 markdown content type', async () => {
		const res = markdownResponse('# Title\n\nBody\n');

		expect(res.status).toBe(200);
		expect(res.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
		expect(await res.text()).toBe('# Title\n\nBody\n');
	});
});

describe('jsonResponse', () => {
	it('serializes the payload as UTF-8 JSON', async () => {
		const payload = { title: 'NixOS Flakes', tags: ['nix', 'linux'] };
		const res = jsonResponse(payload);

		expect(res.status).toBe(200);
		expect(res.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
		expect(await res.json()).toEqual(payload);
	});

	it('serializes null and arrays without wrapping them', async () => {
		expect(await jsonResponse(null).json()).toBeNull();
		expect(await jsonResponse([1, 2, 3]).json()).toEqual([1, 2, 3]);
	});
});

describe('notFoundResponse', () => {
	it('is a 404 plain-text response with a trailing newline', async () => {
		const res = notFoundResponse();

		expect(res.status).toBe(404);
		expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
		expect(await res.text()).toBe('Not Found\n');
	});
});
