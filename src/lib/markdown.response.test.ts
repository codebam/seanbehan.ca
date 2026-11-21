import { describe, expect, it } from 'vitest';
import { jsonResponse, markdownResponse, notFoundResponse } from './markdown';

// The .md and .json endpoints are thin wrappers around these three helpers, so
// the status line and content type they answer with live here. Pin them here
// rather than through the endpoints: no bindings, no CMS, just the response.
describe('export responses', () => {
	it('serves markdown as markdown, byte for byte', async () => {
		const response = markdownResponse('# Title\n\nBody.\n');

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
		expect(await response.text()).toBe('# Title\n\nBody.\n');
	});

	it('serialises the JSON document with the JSON content type', async () => {
		const payload = { title: 'NixOS "Flakes"', description: 'Café — flakes', tags: ['nix'] };
		const response = jsonResponse(payload);
		const clone = response.clone();

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
		expect(await response.text()).toBe(JSON.stringify(payload));
		expect(await clone.json()).toEqual(payload);
	});

	it('answers a missing slug with a plain-text 404', async () => {
		const response = notFoundResponse();

		expect(response.status).toBe(404);
		expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
		expect(await response.text()).toBe('Not Found\n');
	});
});
