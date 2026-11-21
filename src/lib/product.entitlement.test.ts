import { describe, expect, it } from 'vitest';
import { PRODUCT, artifactMatches, entitledRelease, releaseByVersion } from './product';

const release = PRODUCT.currentRelease;
const bytes = (hex: string) =>
	Uint8Array.from(hex.match(/../g)!.map((byte) => Number.parseInt(byte, 16))).buffer;

describe('artifactMatches', () => {
	it('refuses an artifact with no checksum to verify', () => {
		expect(artifactMatches(release, { size: release.size })).toBe(false);
		expect(artifactMatches(release, { size: release.size, checksums: {} })).toBe(false);
	});

	it('refuses a correct-size artifact whose digest differs', () => {
		expect(
			artifactMatches(release, {
				size: release.size,
				checksums: { md5: bytes('00000000000000000000000000000000') }
			})
		).toBe(false);
	});
});

describe('entitledRelease', () => {
	it('has no answer without a recorded purchase version', () => {
		expect(entitledRelease(undefined, Date.now() / 1000)).toBeUndefined();
		expect(entitledRelease('', Date.now() / 1000)).toBeUndefined();
	});

	it('keeps the purchased release when the update window predates it', () => {
		// Bought two years before this release shipped: nothing falls inside
		// the one-year window, so the buyer keeps the version they paid for.
		const early = release.releasedAt - 2 * 365 * 24 * 60 * 60;
		expect(entitledRelease(release.version, early)).toBe(release);
	});

	it('looks up a version exactly, without surrounding whitespace', () => {
		expect(releaseByVersion(`${release.version} `)).toBeUndefined();
	});
});
