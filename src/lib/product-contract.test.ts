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

describe('release manifest', () => {
	it('exposes the current release as the last entry in the manifest', () => {
		expect(PRODUCT.currentRelease).toBe(PRODUCT_RELEASES.at(-1));
		expect(PRODUCT_RELEASES.map((release) => release.version)).toEqual(['1.0.0']);
	});

	it('matches versions exactly and never matches an unknown one', () => {
		expect(releaseByVersion(undefined)).toBeUndefined();
		expect(releaseByVersion('1.0.0')).toBe(PRODUCT_RELEASES[0]);
		expect(releaseByVersion('1.0')).toBeUndefined();
		expect(releaseByVersion('1.0.0 ')).toBeUndefined();
		expect(releaseByVersion('V1.0.0')).toBeUndefined();
	});

	it('publishes stable product identifiers, pricing and checkout URLs', () => {
		expect(PRODUCT.id).toBe('cloudflare-workers-production-kit');
		expect(PRODUCT.name).toBe('Cloudflare Workers Production Kit');
		expect(PRODUCT.price).toBe(59);
		expect(PRODUCT.currency).toBe('CAD');
		expect(PRODUCT.updatesForYears).toBe(1);
		expect(PRODUCT.url).toBe('https://seanbehan.ca/products/cloudflare-workers-production-kit');
		expect(PRODUCT.checkoutPath).toBe('/checkout/cloudflare-workers-production-kit');
		expect(PRODUCT.successUrl).toBe('https://seanbehan.ca/checkout/success');
		expect(PRODUCT.downloadUrl).toBe('https://seanbehan.ca/checkout/download');
	});

	it('records a complete immutable release entry', () => {
		const release = PRODUCT_RELEASES[0];
		expect(release.version).toBe('1.0.0');
		expect(release.releasedAt).toBe(Date.UTC(2026, 7, 28) / 1000);
		expect(release.filename).toBe(release.artifactKey);
		expect(release.md5).toMatch(/^[0-9a-f]{32}$/);
		expect(release.sha256).toMatch(/^[0-9a-f]{64}$/);
		expect(release.size).toBeGreaterThan(0);
	});
});

describe('artifactMatches', () => {
	const release = PRODUCT.currentRelease;

	it('rejects an artifact with no md5 checksum even when the size matches', () => {
		expect(artifactMatches(release, { size: release.size })).toBe(false);
		expect(artifactMatches(release, { size: release.size, checksums: {} })).toBe(false);
	});

	it('rejects a same-size artifact whose md5 differs', () => {
		expect(
			artifactMatches(release, {
				size: release.size,
				checksums: { md5: bytes('00000000000000000000000000000000') }
			})
		).toBe(false);
	});

	it('accepts the exact size and checksum', () => {
		expect(
			artifactMatches(release, {
				size: release.size,
				checksums: { md5: bytes(release.md5) }
			})
		).toBe(true);
	});
});

describe('entitledRelease', () => {
	it('returns undefined when the purchased version is unknown', () => {
		const now = Date.now() / 1000;
		expect(entitledRelease(undefined, now)).toBeUndefined();
		expect(entitledRelease('', now)).toBeUndefined();
		expect(entitledRelease('9.9.9', now)).toBeUndefined();
	});

	it('keeps a buyer on the shipped release at the boundary of the update year', () => {
		const purchasedAt = PRODUCT.currentRelease.releasedAt;
		expect(entitledRelease('1.0.0', purchasedAt)).toBe(PRODUCT.currentRelease);
		expect(entitledRelease('1.0.0', purchasedAt - 1)).toBe(PRODUCT.currentRelease);
		expect(entitledRelease('1.0.0', purchasedAt + 365 * 24 * 60 * 60)).toBe(PRODUCT.currentRelease);
	});

	it('never falls back to a release older than the one purchased', () => {
		expect(entitledRelease('1.0.0', Date.UTC(2099, 0, 1) / 1000)).toBe(PRODUCT.currentRelease);
	});
});
