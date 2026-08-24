/**
 * Types shared across the site's own code.
 *
 * The content types the CMS owns — posts, pages, taxonomy terms — are
 * generated into `.emdash/types.ts` from the live schema and imported from
 * `emdash` itself, so nothing here restates them. What is left is the handful
 * of things the site defines outside the database: the featured projects, and
 * the shape the post views pass around.
 */

export interface FeaturedProject {
	/** Repository name under github.com/codebam */
	repo: string;
	/** Year the repo was created; refreshed from GitHub at build time */
	since: string;
	title: string;
	description: string;
	language: string;
	stars: number;
	/** Live deployment or install link, where one exists */
	homepage?: string;
	homepageLabel?: string;
	tags: string[];
}

/** One linkable section heading within a post body. */
export interface Heading {
	/** The id on the heading element, and the fragment that reaches it. */
	id: string;
	text: string;
	/** 2 for a section, 3 for a subsection. Nothing deeper is listed. */
	level: 2 | 3;
}

/**
 * A post as the list views need it: enough to draw a row, without the body.
 *
 * Built from an EmDash entry in `src/lib/posts.ts` rather than passed straight
 * through, so the templates keep reading `meta.date` and `meta.tags` the way
 * they did when the posts were markdown files.
 */
export interface PostSummary {
	/** Site path, e.g. `/posts/nixos`. */
	path: string;
	slug: string;
	meta: {
		title: string;
		date: string;
		updated?: string;
		description?: string;
		tags: string[];
		draft: boolean;
		image?: string;
	};
	/** Estimated minutes to read the body. */
	readingMinutes?: number;
}
