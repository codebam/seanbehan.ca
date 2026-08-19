import { site, absolute } from '$lib/site';

export const prerender = true;

/**
 * RFC 9116 security.txt — where to send a vulnerability report.
 *
 * The site already publishes a PGP key at /publickey.txt with nothing pointing
 * at it and no stated contact for security specifically; this is the file
 * researchers actually look for, and it names both.
 *
 * `Expires` is required by the RFC and is generated a year out from the build.
 * Every deploy pushes it forward, so it only goes stale on a site that has
 * stopped being deployed at all — which is exactly what the field is for.
 */
const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const expires = new Date(Date.now() + YEAR_MS).toISOString().replace(/\.\d{3}Z$/, 'Z');

const body = `Contact: mailto:${site.email}
Expires: ${expires}
Encryption: ${absolute('/publickey.txt')}
Preferred-Languages: en
Canonical: ${absolute('/.well-known/security.txt')}
`;

export const GET = async () =>
	new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
