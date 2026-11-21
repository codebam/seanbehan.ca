import { describe, expect, it } from 'vitest';
import { responseEncoding, sseFrame } from './mcp/protocol';

describe('responseEncoding', () => {
	it('treats an empty or whitespace-only Accept as JSON', () => {
		expect(responseEncoding('')).toBe('json');
		expect(responseEncoding('   ')).toBe('json');
	});

	it('matches media types case-insensitively and ignores parameters and whitespace', () => {
		expect(responseEncoding(' TEXT/Event-Stream ; charset=utf-8')).toBe('sse');
		expect(responseEncoding('Application/JSON; charset=utf-8')).toBe('json');
	});

	it('prefers JSON or a wildcard over SSE regardless of order', () => {
		expect(responseEncoding('text/event-stream, application/json')).toBe('json');
		expect(responseEncoding('text/event-stream, */*')).toBe('json');
	});

	it('ignores q-values when choosing the encoding', () => {
		expect(responseEncoding('text/event-stream;q=0')).toBe('sse');
	});

	it('rejects a list that contains neither supported type', () => {
		expect(responseEncoding('text/html, image/png')).toBe('unsupported');
	});
});

describe('sseFrame', () => {
	it('serialises non-object payloads with JSON.stringify', () => {
		expect(sseFrame(null)).toBe('event: message\ndata: null\n\n');
		expect(sseFrame('hello')).toBe('event: message\ndata: "hello"\n\n');
		expect(sseFrame([1, 2])).toBe('event: message\ndata: [1,2]\n\n');
	});

	it('keeps embedded newlines escaped on one data line', () => {
		expect(sseFrame({ message: 'a\nb' })).toBe('event: message\ndata: {"message":"a\\nb"}\n\n');
	});

	it('emits exactly one message event terminated by a blank line', () => {
		const frame = sseFrame({ ok: true });
		expect(frame.startsWith('event: message\ndata: ')).toBe(true);
		expect(frame.endsWith('\n\n')).toBe(true);
		expect(frame.match(/event:/g)).toHaveLength(1);
		expect(frame).not.toContain('id:');
		expect(frame).not.toContain('retry:');
	});
});
