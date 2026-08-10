import getPosts from '$lib/getPosts';
import { site, absolute } from '$lib/site';
import type { Post } from '$lib/types';

export const prerender = true;

export const GET = async () => {
	const posts = await getPosts();
	const body = render(posts);
	const headers = { 'Content-Type': 'application/xml' };
	return new Response(body, { headers });
};

/** Routes every variant publishes, plus the ones that depend on the variant. */
const staticPaths = () => ['/', '/contact', '/posts', ...(site.showResume ? ['/resume'] : [])];

const entry = (path: string, lastmod: string) => `<url>
<loc>${absolute(path)}</loc>
<lastmod>${lastmod}</lastmod>
</url>`;

const render = (posts: Post[]) => {
	const now = new Date().toISOString();
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths()
	.map((path) => entry(path, now))
	.join('\n')}
${posts.map((post) => entry(post.path, new Date(post.meta.date).toISOString())).join('\n')}
</urlset>`;
};
