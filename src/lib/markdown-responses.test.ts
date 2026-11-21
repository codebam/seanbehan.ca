import { describe, expect, it } from 'vitest';
import { jsonResponse, markdownResponse, notFoundResponse } from './markdown';

describe('markdownResponse', () => {
	it('serves the body as UTF-8 markdown with a success status', async () => {
		const response = markdownResponse('# NixOS Flakes\n');
		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
		expect(await response.text()).toBe('# NixOS Flakes\n');
	});

	it('keeps an empty body empty', async () => {
		expect(await markdownResponse('').text()).toBe('');
	});
});

describe('jsonResponse', () => {
	it('serialises the payload once, with a JSON content type', async () => {
		const payload = { slug: 'nixos', tags: ['nix'], updated: null };
		const response = jsonResponse(payload);
		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
		expect(await response.text()).toBe(JSON.stringify(payload));
		expect(JSON.parse(await jsonResponse([1, 2, 3]).text())).toEqual([1, 2, 3]);
	});
});

describe('notFoundResponse', () => {
	it('answers with a plain-text 404 and the conventional body', async () => {
		const response = notFoundResponse();
		expect(response.status).toBe(404);
		expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
		expect(await response.text()).toBe('Not Found\n');
	});
});
