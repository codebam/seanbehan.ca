import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyText } from './clipboard';

function stubFallback(result: boolean) {
	const area = {
		value: '',
		style: { cssText: '' },
		setAttribute: vi.fn(),
		select: vi.fn(),
		remove: vi.fn()
	};
	const execCommand = vi.fn(() => result);
	vi.stubGlobal('document', {
		createElement: vi.fn(() => area),
		body: { append: vi.fn() },
		execCommand
	});
	vi.stubGlobal('navigator', {
		clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard denied')) }
	});
	return { area, execCommand };
}

afterEach(() => vi.unstubAllGlobals());

describe('copyText fallback', () => {
	it('does not report success when execCommand refuses to copy', async () => {
		const { area, execCommand } = stubFallback(false);

		await expect(copyText('hello')).resolves.toBe(false);
		expect(execCommand).toHaveBeenCalledWith('copy');
		expect(area.remove).toHaveBeenCalledOnce();
	});

	it('reports success when execCommand copies the text', async () => {
		stubFallback(true);

		await expect(copyText('hello')).resolves.toBe(true);
	});
});
