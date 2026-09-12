/**
 * The site, briefed for a language model.
 *
 * `/llms.txt` as proposed at llmstxt.org (v2): a small markdown file an agent
 * reads before it starts fetching — what the site is, which pages matter, and
 * in what forms they answer. The forms are the news here: every post and CMS
 * page grew markdown and JSON siblings (src/lib/accept.ts and the suffixed
 * routes), so this file is where that machinery is written down for the only
 * audience that cannot see it in the rendered page.
 *
 * A route rather than a file in `public/` for the robots.txt reason: every
 * link has to be absolute, and the two variants split the site between them —
 * each origin names both halves from their canonical homes, and only the
 * title, the summary and the pointers to "this origin" follow the variant.
 * It is deliberately short: the spec's whole point is that the file earns its
 * place in a context window, and the detail lives behind the links.
 */
import type { APIRoute } from 'astro';
import { getEmDashCollection } from 'emdash';
import { getPosts } from '../lib/posts';
import { LEGAL_NAME, SITES, site } from '../lib/site';

/** Writing has one canonical origin, whatever door a request came in at. */
const WRITING = SITES.seanbehan.url;
const WORK = SITES.codebam.url;

/** How many recent posts to name. Enough to steer; small enough to stay in. */
const RECENT_LIMIT = 10;

/** CMS pages are added one at a time and are rare; the brief names them all. */
const PAGE_LIMIT = 50;

export const GET: APIRoute = async () => {
	const { posts, cacheHint } = await getPosts({ includeBodies: false });
	// CMS pages are the other collection whose entries answer in three forms;
	// see the Pages section below for why they are fetched but not always named.
	const { entries: cmsEntries, cacheHint: pagesHint } = await getEmDashCollection('pages', {
		status: 'published',
		orderBy: { updated_at: 'desc' },
		limit: PAGE_LIMIT
	});
	// The Astro global is absent where the sandbox runs the endpoint, so the
	// guard is a typeof rather than a direct read.
	if (typeof Astro !== 'undefined' && Astro.cache?.enabled) {
		Astro.cache.set(cacheHint);
		Astro.cache.set(pagesHint);
	}

	/** Entries with a slug; a page without one has no URL to name. */
	const cmsPages = cmsEntries.filter((page) => page.id);

	const recent = posts
		.slice(0, RECENT_LIMIT)
		.map((post) => {
			const when = post.meta.date.slice(0, 10);
			const tags = post.meta.tags.length ? ` Tagged ${post.meta.tags.join(', ')}.` : '';
			return `- [${post.meta.title}](${WRITING}${post.path}.md): ${when}.${tags}`;
		})
		.join('\n');

	/**
	 * An agent cannot enumerate `/pages/<slug>` — there is no index route, and
	 * the only listing is the sitemap — so the brief names the namespace only
	 * when a published page is behind it, and lists those pages when it does.
	 * Naming a pattern with no discoverable member is the same over-promise the
	 * fetch section was rewritten to avoid.
	 */
	const cmsClause = cmsPages.length
		? ', and every CMS page (`/pages/<slug>`, listed under **Pages**)'
		: '';

	const pagesSection = cmsPages.length
		? `## Pages

CMS pages are written in the admin rather than the repository — the site's own
pages are templates — and each is a stored entry served at \`/pages/<slug>\` on
the writing origin, answering in the same three forms as a post. Published:

${cmsPages.map((page) => `- [${page.data.title}](${WRITING}/pages/${page.id}.md)`).join('\n')}

`
		: '';

	const body = `# ${site.name}

> ${site.description}

${WRITING} is the writing — posts, pages and the résumé of ${LEGAL_NAME}.
${WORK} is the work — open-source projects, products and services. One
repository, one database, two front doors: each origin answers requests for
the other's sections with a 301 to the canonical URL, so follow redirects
rather than guessing which door serves what.

How to fetch this site:

- Entries that live in the database answer in three forms of one stored
  source: the HTML page, a markdown document, and JSON. That is every post
  (\`/posts/<slug>\`)${cmsClause}. Append \`.md\` or
  \`.json\` to the entry's URL, or request it with \`Accept: text/markdown\` or
  \`Accept: application/json\`. HTML stays the answer for browsers, for
  \`*/*\`, and for any client that does not name a format — there is no
  user-agent sniffing to trip over.
- Everything else is HTML only, and appending a suffix is a 404 rather than a
  variant. The section pages — the home page, \`/about\`, \`/contact\` and
  \`/links\`, plus \`/projects\`, \`/products\` and \`/services\` on the work
  origin — are hand-written templates with no stored entry behind them; the
  archive \`/posts\` and the tag index \`/posts/tags\` are navigation over the
  entries. A post's markdown and JSON hang off the post's own URL, never the
  archive's. The résumé is the one section page that also answers as a
  document (below).
- The markdown forms open with a metadata header (canonical URL, author,
  published and updated dates, tags, reading time) and carry the body with
  fenced code and absolute image URLs. The JSON forms hold the same facts as
  fields, the markdown body in \`content\`, and the page's heading anchors in
  \`sections\`.
- Content pages advertise their alternates with \`<link rel="alternate">\` and
  this file with \`<link rel="describedby">\`.
- The RSS feed carries the full text of recent posts in \`content:encoded\`,
  which answers questions about the corpus in one request rather than ten.
- Unpublished drafts appear in no list, feed or file here; a draft's URL
  still renders if you already hold it, marked noindex.

## Writing

- [All posts](${WRITING}/posts): the archive, newest first, with the title search over it.
- [Post feed](${WRITING}/rss.xml): recent posts with full text, HTML.
- [Tags](${WRITING}/posts/tags): the topic index with counts; each tag has its own feed under ${WRITING}/posts/tag/.
- [Search](${site.url}/search.json): ranked slugs for a query in \`?q=\`; words are matched over titles, descriptions, tags and bodies.
- [Résumé](${WRITING}/resume.md): the CV in its source markdown — the same file the HTML page, the PDF and the plain text are generated from. The PDF is ${WRITING}/resume.pdf; the plain text is ${WRITING}/resume.txt.

${pagesSection}## Work

- [Projects](${WORK}/projects): case studies of the software that runs, with what each one had to survive.
- [Products](${WORK}/products): paid work, with prices.
- [Services](${WORK}/services): what kind of engagements are taken on.
- [Contact](${site.url}/contact): the forms and the address.

## Recent writing

${recent}

## Optional

- [Sitemap for this origin](${site.url}/sitemap.xml): every indexable URL it serves.
- [Sitemap for the other origin](${site.id === 'codebam' ? WRITING : WORK}/sitemap.xml): the same, across.
- [robots.txt](${site.url}/robots.txt): crawl rules — everything is open apart from the admin, and the few scrapers that take without giving back.
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
