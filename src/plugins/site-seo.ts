import { definePlugin } from 'emdash';
import type { PluginDescriptor } from 'emdash';

interface SiteSeoOptions {
	authorName: string;
	authorHandle: string;
	authorUrl: string;
	githubUrl: string;
	mastodonUrl: string;
	linkedinUrl: string;
}

/**
 * EmDash owns the page's metadata. This first-party contribution only replaces
 * its generic Organization graph: this is a personal site, and one stable
 * Person id keeps the two public identities attached to the same author.
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
