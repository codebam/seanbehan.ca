import { describe, expect, it } from 'vitest';
import { PRODUCT, artifactMatches, entitledRelease, releaseByVersion } from './product';

const bytes = (hex: string) =>
	Uint8Array.from(hex.match(/../g)!.map((byte) => Number.parseInt(byte, 16))).buffer;

describe('product releases', () => {
	it('resolves the release recorded at checkout', () => {
		expect(releaseByVersion('1.0.0')).toBe(PRODUCT.currentRelease);
		expect(releaseByVersion('missing')).toBeUndefined();
	});

	it('keeps a buyer on a known release', () => {
		expect(entitledRelease('1.0.0', Date.UTC(2026, 7, 30) / 1000)).toBe(PRODUCT.currentRelease);
	});

	it('rejects a release that this deployment does not know', () => {
		expect(entitledRelease('2.0.0', Date.now() / 1000)).toBeUndefined();
	});

	it('matches the immutable R2 object to its release manifest', () => {
		expect(
			artifactMatches(PRODUCT.currentRelease, {
				size: PRODUCT.currentRelease.size,
				checksums: { md5: bytes(PRODUCT.currentRelease.md5) }
			})
		).toBe(true);
		expect(
			artifactMatches(PRODUCT.currentRelease, {
				size: PRODUCT.currentRelease.size + 1,
				checksums: { md5: bytes(PRODUCT.currentRelease.md5) }
			})
		).toBe(false);
	});
});
