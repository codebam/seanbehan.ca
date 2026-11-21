import { describe, expect, it } from 'vitest';
import { PRODUCT, artifactMatches, entitledRelease } from './product';

const bytes = (hex: string) =>
	Uint8Array.from(hex.match(/../g)!.map((byte) => Number.parseInt(byte, 16))).buffer;

describe('artifactMatches checksum guards', () => {
	it('rejects an artifact with no md5 even when its size matches', () => {
		const release = PRODUCT.currentRelease;
		expect(artifactMatches(release, { size: release.size })).toBe(false);
		expect(artifactMatches(release, { size: release.size, checksums: {} })).toBe(false);
	});

	it('rejects a matching-size artifact whose md5 differs', () => {
		const release = PRODUCT.currentRelease;
		const last = release.md5.slice(-1);
		const changed = release.md5.slice(0, -1) + (last === '0' ? '1' : '0');
		expect(changed).not.toBe(release.md5);
		expect(
			artifactMatches(release, { size: release.size, checksums: { md5: bytes(changed) } })
		).toBe(false);
	});
});

describe('entitledRelease update window', () => {
	const release = PRODUCT.currentRelease;
	// A year before the release is the last instant the release still falls inside the window.
	const windowOpen = Date.UTC(2025, 7, 28) / 1000;

	it('keeps a release shipped exactly at the end of the update year', () => {
		expect(entitledRelease(release.version, windowOpen)).toBe(release);
	});

	it('falls back to the purchased release when the window closed before it shipped', () => {
		expect(entitledRelease(release.version, windowOpen - 1)).toBe(release);
		expect(entitledRelease(release.version, Date.UTC(2024, 0, 1) / 1000)).toBe(release);
	});

	it('has no answer without a version the deployment recorded', () => {
		expect(entitledRelease(undefined, windowOpen)).toBeUndefined();
	});
});
