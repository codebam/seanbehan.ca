import { describe, expect, it } from 'vitest';
import {
	PRODUCT,
	PRODUCT_RELEASES,
	artifactMatches,
	entitledRelease,
	releaseByVersion
} from './product';

const bytes = (hex: string) =>
	Uint8Array.from(hex.match(/../g)!.map((byte) => Number.parseInt(byte, 16))).buffer;

describe('releaseByVersion edge inputs', () => {
	it('returns undefined for an absent version', () => {
		expect(releaseByVersion(undefined)).toBeUndefined();
	});

	it('finds each catalogue release by its exact version', () => {
		for (const release of PRODUCT_RELEASES) {
			expect(releaseByVersion(release.version)).toBe(release);
		}
	});
});

describe('artifactMatches rejection branches', () => {
	it('rejects a wrong md5 even when the size matches', () => {
		const release = PRODUCT_RELEASES[0]!;
		expect(
			artifactMatches(release, {
				size: release.size,
				checksums: { md5: bytes('00000000000000000000000000000000') }
			})
		).toBe(false);
	});

	it('rejects an artifact with no checksums at all', () => {
		const release = PRODUCT_RELEASES[0]!;
		expect(artifactMatches(release, { size: release.size })).toBe(false);
	});

	it('rejects missing md5 without reading the artifact size', () => {
		const release = PRODUCT_RELEASES[0]!;
		expect(artifactMatches(release, { size: 0, checksums: {} })).toBe(false);
	});
});

describe('entitledRelease window edges', () => {
	it('returns undefined when the purchased version is unknown', () => {
		expect(entitledRelease(undefined, Date.now() / 1000)).toBeUndefined();
	});

	it('still returns the purchased release after its update year has ended', () => {
		// The window closed years before this release shipped, so the filter is
		// empty and the documented fallback keeps the buyer's own release.
		const beforeRelease = Date.UTC(2020, 0, 1) / 1000;
		expect(entitledRelease('1.0.0', beforeRelease)).toBe(releaseByVersion('1.0.0'));
	});

	it('picks the newest release inside a purchase year that covers it', () => {
		const inWindow = Date.UTC(2026, 0, 1) / 1000;
		expect(entitledRelease('1.0.0', inWindow)).toBe(PRODUCT.currentRelease);
	});
});

describe('release catalogue shape', () => {
	it('points the current release at the last shipped version', () => {
		expect(PRODUCT.currentRelease).toBe(PRODUCT_RELEASES.at(-1));
		expect(new Set(PRODUCT_RELEASES.map((release) => release.version)).size).toBe(
			PRODUCT_RELEASES.length
		);
	});
});
