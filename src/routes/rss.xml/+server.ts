import getPosts from '$lib/getPosts';

export const GET = async () => {
	const posts = await getPosts();
	console.log(posts);
	const body = render(posts);
	const headers = { 'Content-Type': 'application/xml' };
	return new Response(body, { headers });
};

const render = (posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<atom:link href="https://seanbehan.ca/rss" rel="self" type="application/rss+xml" />
<title>Sean Behan</title>
<link>https://seanbehan.ca</link>
<description>Sean Behan's website and blog</description>
${posts
	.map(
		(post) => `<item>
<guid>https://seanbehan.ca${post.path}</guid>
<title>${post.meta.title}</title>
<link>https://seanbehan.ca${post.path}</link>
<pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
</item>`
	)
	.join('')}
</channel>
</rss>`;
