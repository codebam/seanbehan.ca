import { describe, expect, it } from 'vitest';
import { PRODUCT_RELEASES, artifactMatches, releaseByVersion } from './product';

const bytes = (hex: string) =>
	Uint8Array.from(hex.match(/../g)!.map((byte) => Number.parseInt(byte, 16))).buffer;

describe('PRODUCT_RELEASES catalogue', () => {
	it('gives every release a unique version', () => {
		const versions = PRODUCT_RELEASES.map((release) => release.version);
		expect(new Set(versions).size).toBe(versions.length);
	});
});

describe('releaseByVersion', () => {
	it('finds a release by its exact version', () => {
		for (const release of PRODUCT_RELEASES) {
			expect(releaseByVersion(release.version)).toBe(release);
		}
	});

	it('returns undefined for a missing or absent version', () => {
		expect(releaseByVersion('missing')).toBeUndefined();
		expect(releaseByVersion(undefined)).toBeUndefined();
	});
});

describe('artifactMatches', () => {
	it('accepts an artifact carrying the release metadata', () => {
		for (const release of PRODUCT_RELEASES) {
			expect(
				artifactMatches(release, {
					size: release.size,
					checksums: { md5: bytes(release.md5) }
				})
			).toBe(true);
		}
	});

	it('rejects a wrong md5 even when the size matches', () => {
		const release = PRODUCT_RELEASES[0];
		expect(
			artifactMatches(release, {
				size: release.size,
				checksums: { md5: bytes('00000000000000000000000000000000') }
			})
		).toBe(false);
	});

	it('rejects an artifact with no checksum', () => {
		const release = PRODUCT_RELEASES[0];
		expect(artifactMatches(release, { size: release.size })).toBe(false);
	});
});
