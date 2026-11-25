import { afterEach, describe, expect, it, vi } from 'vitest';

type MediaListener = (event: { matches: boolean }) => void;

function setup(wide: boolean) {
	let expanded = false;
	let toggleListener = () => {};
	let mediaListener: MediaListener = () => {};
	const details = {
		open: true,
		classList: {
			toggle: vi.fn((_name: string, force?: boolean) => {
				expanded = force ?? !expanded;
			})
		},
		querySelector: vi.fn(() => ({ addEventListener: vi.fn() })),
		addEventListener: vi.fn((_type: string, listener: () => void) => {
			toggleListener = listener;
		})
	};
	const media = {
		matches: wide,
		addEventListener: vi.fn((_type: string, listener: MediaListener) => {
			mediaListener = listener;
		})
	};
	vi.stubGlobal('document', { querySelector: vi.fn(() => details) });
	vi.stubGlobal('window', { matchMedia: vi.fn(() => media) });

	return {
		details,
		isExpanded: () => expanded,
		toggle: () => toggleListener(),
		changeViewport(matches: boolean) {
			media.matches = matches;
			mediaListener({ matches });
		}
	};
}

async function loadToc() {
	vi.resetModules();
	await import('./toc');
}

afterEach(() => {
	vi.unstubAllGlobals();
	vi.resetModules();
});

describe('table of contents', () => {
	it('keeps native details state and the mobile visual fold in sync', async () => {
		const ui = setup(false);
		await loadToc();

		expect(ui.details.open).toBe(false);
		expect(ui.isExpanded()).toBe(false);

		ui.details.open = true;
		ui.toggle();
		expect(ui.details.open).toBe(true);
		expect(ui.isExpanded()).toBe(true);

		ui.details.open = false;
		ui.toggle();
		expect(ui.details.open).toBe(false);
		expect(ui.isExpanded()).toBe(false);
	});

	it('opens the contents again when the viewport becomes desktop-sized', async () => {
		const ui = setup(false);
		await loadToc();
		ui.details.open = false;

		ui.changeViewport(true);

		expect(ui.details.open).toBe(true);
		expect(ui.isExpanded()).toBe(true);
	});
});
