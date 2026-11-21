import { describe, expect, it } from 'vitest';
import { jsonResponse, markdownResponse, notFoundResponse } from './markdown';

describe('markdownResponse', () => {
	it('answers 200 with the body unchanged as markdown', async () => {
		const body = '# NixOS Flakes\n\nSome words.';
		const response = markdownResponse(body);

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
		expect(await response.text()).toBe(body);
	});
});

describe('jsonResponse', () => {
	it('answers 200 with the payload serialized as JSON', async () => {
		const payload = { title: 'NixOS Flakes', tags: ['nix'], draft: false };
		const response = jsonResponse(payload);

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
		expect(await response.text()).toBe(JSON.stringify(payload));
	});
});

describe('notFoundResponse', () => {
	it('answers 404 with the short plain-text body', async () => {
		const response = notFoundResponse();

		expect(response.status).toBe(404);
		expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
		expect(await response.text()).toBe('Not Found\n');
	});
});
