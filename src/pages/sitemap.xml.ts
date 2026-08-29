/** Canonical URLs only, with lastmod only where the database can prove it. */
import type { APIRoute } from 'astro';
import { getContentSeo, getEmDashCollection } from 'emdash';
import { getPosts, tagCounts } from '../lib/posts';
import { featuredProjects } from '../lib/projects';
import { site, absolute } from '../lib/site';
import { slugifyTag } from '../lib/tags';
import type { PostSummary } from '../lib/types';

const staticPaths = () => [
	'/',
	'/about',
	'/contact',
	'/links',
	...(site.id === 'codebam' ? ['/services', '/products/cloudflare-workers-production-kit'] : []),
	...(site.id === 'seanbehan' ? ['/posts', '/posts/tags'] : []),
	...(site.showResume ? ['/resume'] : [])
];

const escapeXml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

const entry = (path: string, lastmod?: string) => `<url>
<loc>${escapeXml(absolute(path))}</loc>${lastmod ? `\n<lastmod>${escapeXml(lastmod)}</lastmod>` : ''}
</url>`;

const iso = (value: string | Date) => new Date(value).toISOString();
const postStamp = (post: PostSummary) => iso(post.meta.updated ?? post.meta.date);
const newestStamp = (list: PostSummary[]) =>
	list.reduce((latest, post) => {
		const stamp = postStamp(post);
		return stamp > latest ? stamp : latest;
	}, '');

export const GET: APIRoute = async () => {
	const { posts } = await getPosts();
	const newest = newestStamp(posts) || undefined;
	const urls = staticPaths().map((path) =>
		entry(path, path === '/' || path === '/posts' || path === '/posts/tags' ? newest : undefined)
	);

	if (site.id === 'seanbehan') {
		urls.push(...posts.map((post) => entry(post.path, postStamp(post))));

		for (const tag of tagCounts(posts).filter((candidate) => candidate.count >= 2)) {
			const tagged = posts.filter((post) =>
				post.meta.tags.some((name) => slugifyTag(name) === tag.slug)
			);
			urls.push(entry(`/posts/tag/${tag.slug}`, newestStamp(tagged) || undefined));
		}

		const { entries: pages } = await getEmDashCollection('pages', {
			status: 'published',
			orderBy: { updated_at: 'desc' },
			limit: 200
		});
		for (const page of pages) {
			if (!page.id || getContentSeo(page)?.noIndex) continue;
			const changed = page.data.updatedAt ?? page.data.publishedAt;
			urls.push(entry(`/pages/${page.id}`, changed ? iso(changed) : undefined));
		}
	} else {
		urls.push(entry('/projects'));
		urls.push(...featuredProjects.map((project) => entry(`/projects/${project.slug}`)));
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' }
	});
};
