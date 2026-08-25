/** Every page a crawler should know about, with the date it last changed. */
import type { APIRoute } from 'astro';
import { getPosts, tagCounts } from '../lib/posts';
import { site, absolute } from '../lib/site';
import { slugifyTag } from '../lib/tags';
import type { PostSummary } from '../lib/types';

/** Routes every variant publishes, plus the ones that depend on the variant. */
const staticPaths = () => [
	'/',
	'/contact',
	'/posts',
	'/links',
	// The tag index is linked from the writing page, so it is a page a reader
	// can land on — it was missing here while every individual tag page was in.
	'/posts/tags',
	...(site.showResume ? ['/resume'] : [])
];

const entry = (path: string, lastmod: string) => `<url>
<loc>${absolute(path)}</loc>
<lastmod>${lastmod}</lastmod>
</url>`;

const iso = (value: string) => new Date(value).toISOString();

const postStamp = (post: PostSummary) => iso(post.meta.updated ?? post.meta.date);

const newestStamp = (list: PostSummary[]) =>
	list.reduce((latest, post) => {
		const stamp = postStamp(post);
		return stamp > latest ? stamp : latest;
	}, '');

export const GET: APIRoute = async () => {
	const { posts } = await getPosts();
	const tags = tagCounts(posts);

	const newest = newestStamp(posts) || new Date().toISOString();
	const tagPages = tags.map((tag) => {
		const tagged = posts.filter((post) =>
			post.meta.tags.some((name) => slugifyTag(name) === tag.slug)
		);
		return { path: `/posts/tag/${tag.slug}`, lastmod: newestStamp(tagged) || newest };
	});

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths()
	.map((path) => entry(path, newest))
	.join('\n')}
${posts.map((post) => entry(post.path, postStamp(post))).join('\n')}
${tagPages.map(({ path, lastmod }) => entry(path, lastmod)).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' }
	});
};
