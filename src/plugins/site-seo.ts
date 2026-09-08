import { definePlugin } from 'emdash';
import type { PluginDescriptor } from 'emdash';

interface SiteSeoOptions {
	authorName: string;
	authorHandle: string;
	authorUrl: string;
	githubUrl: string;
	mastodonUrl: string;
	linkedinUrl: string;
	/** The role the Person is offered for, in the words the résumé uses. */
	jobTitle: string;
	/** Where the work happens — the fact a remote-first search filters on. */
	homeLocation: { '@type': 'PostalAddress'; addressRegion: string; addressCountry: string };
	/** Subjects the writing and the repositories both bear on. */
	knowsAbout: string[];
}

/**
 * EmDash owns the page's metadata. This first-party contribution only replaces
 * its generic Organization graph: this is a personal site, and one stable
 * Person id keeps the two public identities attached to the same author.
 *
 * The Person carries the facts a hiring reader or their tooling looks for —
 * the role, the location, the subjects — because those are stable and already
 * stated on the page. What it does not carry is availability: that is a
 * business decision that changes, and it lives in site.data.js where the copy
 * does, so a machine never ends up asserting an "open to work" the site has
 * stopped saying.
 */
export function createPlugin(options: SiteSeoOptions) {
	return definePlugin({
		id: 'site-seo',
		version: '1.0.0',
		hooks: {
			'page:metadata': async ({ page }) => {
				const personId = `${options.authorUrl}/#person`;
				const person = {
					'@type': 'Person',
					'@id': personId,
					name: options.authorName,
					alternateName: options.authorHandle,
					url: options.authorUrl,
					image: `${options.authorUrl}/profile.webp`,
					jobTitle: options.jobTitle,
					homeLocation: options.homeLocation,
					knowsAbout: options.knowsAbout,
					// No alumniOf. Trent appears on the résumé as coursework toward a
					// degree that was not completed, and alumniOf asserts the
					// graduation; a structured-data claim is the worst place to
					// overstate one, because it is read by machines that cannot see
					// the qualification beside it.
					sameAs: [options.githubUrl, options.mastodonUrl, options.linkedinUrl]
				};

				if (page.pageType === 'article' && page.canonical) {
					return {
						kind: 'jsonld' as const,
						id: 'primary',
						graph: {
							'@context': 'https://schema.org',
							'@graph': [
								{
									'@type': 'BlogPosting',
									'@id': page.canonical,
									mainEntityOfPage: { '@type': 'WebPage', '@id': page.canonical },
									url: page.canonical,
									headline: page.pageTitle ?? page.title,
									description: page.description ?? undefined,
									image: page.seo?.ogImage ?? page.image ?? undefined,
									datePublished: page.articleMeta?.publishedTime ?? undefined,
									dateModified:
										page.articleMeta?.modifiedTime ?? page.articleMeta?.publishedTime ?? undefined,
									author: { '@id': personId },
									publisher: { '@id': personId },
									isPartOf: { '@id': `${page.siteUrl ?? options.authorUrl}/#website` }
								},
								person
							]
						}
					};
				}

				const siteUrl = page.siteUrl ?? new URL(page.url).origin;
				return {
					kind: 'jsonld' as const,
					id: 'primary',
					graph: {
						'@context': 'https://schema.org',
						'@graph': [
							{
								'@type': 'WebSite',
								'@id': `${siteUrl}/#website`,
								url: siteUrl,
								name: page.siteName,
								description: page.description ?? undefined,
								inLanguage: 'en-CA',
								publisher: { '@id': personId }
							},
							person
						]
					}
				};
			}
		}
	});
}

export function siteSeo(options: SiteSeoOptions): PluginDescriptor<SiteSeoOptions> {
	return {
		id: 'site-seo',
		version: '1.0.0',
		format: 'native',
		entrypoint: '/src/plugins/site-seo.ts',
		options
	};
}
