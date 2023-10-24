import getPosts from '$lib/getPosts';

export const GET = async () => {
	const posts = await getPosts();
	console.log(posts);
	const body = render(posts);
	const headers = { 'Content-Type': 'application/xml' };
	return new Response(body, { headers });
};

const render = (posts) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://seanbehan.ca</loc>
<lastmod>${new Date().toISOString()}</lastmod>
</url>
<url>
<loc>https://seanbehan.ca/contact</loc>
<lastmod>${new Date().toISOString()}</lastmod>
</url>
<url>
<loc>https://seanbehan.ca/posts</loc>
<lastmod>${new Date().toISOString()}</lastmod>
</url>
<url>
<loc>https://seanbehan.ca/resume</loc>
<lastmod>${new Date().toISOString()}</lastmod>
</url>
<url>
<loc>https://seanbehan.ca/playlists</loc>
<lastmod>${new Date().toISOString()}</lastmod>
</url>
${posts
	.map(
		(post) => `<url>
<loc>https://seanbehan.ca${post.path}</loc>
<lastmod>${new Date(post.meta.date).toISOString()}</lastmod>
</url>`
	)
	.join('')}
</urlset>`;
