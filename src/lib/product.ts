import { SITES } from './site.data.js';

export interface ProductRelease {
	version: string;
	releasedAt: number;
	artifactKey: string;
	filename: string;
	size: number;
	md5: string;
	sha256: string;
}

interface ArtifactMetadata {
	size: number;
	checksums?: { md5?: ArrayBuffer };
}

export const PRODUCT_RELEASES: readonly ProductRelease[] = [
	{
		version: '1.0.0',
		releasedAt: Date.UTC(2026, 7, 28) / 1000,
		artifactKey: 'cloudflare-workers-production-kit-v1.0.0.zip',
		filename: 'cloudflare-workers-production-kit-v1.0.0.zip',
		size: 93470,
		md5: 'd423d3e04c697e673ee97f90188a096d',
		sha256: 'd8d55c83662bdb10eb5ba8c7443521ee8735882c4c3505dcb9e7ccdfc790a2f0'
	}
];

export const PRODUCT = {
	id: 'cloudflare-workers-production-kit',
	name: 'Cloudflare Workers Production Kit',
	price: 59,
	currency: 'CAD',
	url: `${SITES.codebam.url}/products/cloudflare-workers-production-kit`,
	checkoutPath: '/checkout/cloudflare-workers-production-kit',
	successUrl: `${SITES.codebam.url}/checkout/success`,
	downloadUrl: `${SITES.codebam.url}/checkout/download`,
	updatesForYears: 1,
	currentRelease: PRODUCT_RELEASES.at(-1)!
} as const;

export function releaseByVersion(version: string | undefined): ProductRelease | undefined {
	return PRODUCT_RELEASES.find((release) => release.version === version);
}

export function artifactMatches(release: ProductRelease, artifact: ArtifactMetadata): boolean {
	const md5 = artifact.checksums?.md5;
	if (!md5) return false;
	const checksum = Array.from(new Uint8Array(md5), (byte) =>
		byte.toString(16).padStart(2, '0')
	).join('');
	return artifact.size === release.size && checksum === release.md5;
}

/** A buyer keeps every release shipped during their update year, even after it ends. */
export function entitledRelease(
	purchasedVersion: string | undefined,
	purchasedAt: number
): ProductRelease | undefined {
	const purchased = releaseByVersion(purchasedVersion);
	if (!purchased) return undefined;

	const updatesUntil = new Date(purchasedAt * 1000);
	updatesUntil.setUTCFullYear(updatesUntil.getUTCFullYear() + PRODUCT.updatesForYears);

	return (
		PRODUCT_RELEASES.filter(
			(release) =>
				release.releasedAt >= purchased.releasedAt &&
				release.releasedAt * 1000 <= updatesUntil.getTime()
		).at(-1) ?? purchased
	);
}
