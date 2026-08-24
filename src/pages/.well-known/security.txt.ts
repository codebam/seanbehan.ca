/**
 * RFC 9116 security.txt — where to send a vulnerability report.
 *
 * The site already publishes a PGP key at /publickey.txt with nothing pointing
 * at it and no stated contact for security specifically; this is the file
 * researchers actually look for, and it names both.
 *
 * `Expires` is required by the RFC. It is a year out from whenever the page is
 * served, which on a server-rendered site means it can no longer go stale at
 * all — the file is generated per request rather than per deploy.
 */
import type { APIRoute } from 'astro';
import { site, absolute } from '../../lib/site';

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export const GET: APIRoute = async () => {
	const expires = new Date(Date.now() + YEAR_MS).toISOString().replace(/\.\d{3}Z$/, 'Z');

	const body = `Contact: mailto:${site.email}
Expires: ${expires}
Encryption: ${absolute('/publickey.txt')}
Preferred-Languages: en
Canonical: ${absolute('/.well-known/security.txt')}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'max-age=86400' }
	});
};
