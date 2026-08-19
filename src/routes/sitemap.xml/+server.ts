import getPosts, { getAllTags } from '$lib/getPosts';
import type { TagInfo } from '$lib/getPosts';
import { site, absolute } from '$lib/site';
import { slugifyTag } from '$lib/tags';
import type { Post } from '$lib/types';

export const prerender = true;

export const GET = async () => {
	const posts = await getPosts();
	const tags = await getAllTags();
	const body = render(posts, tags);
	const headers = { 'Content-Type': 'application/xml' };
	return new Response(body, { headers });
};

/** Routes every variant publishes, plus the ones that depend on the variant. */
const staticPaths = () => [
	'/',
	'/contact',
	'/posts',
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

const postStamp = (post: Post) => iso(post.meta.updated ?? post.meta.date);

const newestStamp = (list: Post[]) =>
	list.reduce((latest, post) => {
		const stamp = postStamp(post);
		return stamp > latest ? stamp : latest;
	}, '');

const render = (posts: Post[], tags: TagInfo[]) => {
	const newest = newestStamp(posts) || new Date().toISOString();
	const tagPages = tags.map((t) => {
		const tagged = posts.filter((p) => p.meta.tags?.some((tag) => slugifyTag(tag) === t.slug));
		return { path: `/posts/tag/${t.slug}`, lastmod: newestStamp(tagged) || newest };
	});
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths()
	.map((path) => entry(path, newest))
	.join('\n')}
${posts.map((post) => entry(post.path, postStamp(post))).join('\n')}
${tagPages.map(({ path, lastmod }) => entry(path, lastmod)).join('\n')}
</urlset>`;
};
