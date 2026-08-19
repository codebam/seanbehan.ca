export interface PostMeta {
	title: string;
	date: string;
	tags?: string[];
	draft: boolean;
	description?: string;
	author?: string;
	/** ISO date of the last substantive edit, for `article:modified_time`. */
	updated?: string;
	/**
	 * Social card for this post, as a site-absolute path. Posts without one
	 * use the generated `/og/<slug>.png` card from tools/og.
	 */
	image?: string;
}

/** One linkable section heading within a post body. */
export interface Heading {
	/** The id on the heading element, and the fragment that reaches it. */
	id: string;
	text: string;
	/** 2 for a section, 3 for a subsection. Nothing deeper is listed. */
	level: 2 | 3;
}

export interface Post {
	path: string;
	meta: PostMeta;
	/**
	 * Estimated minutes to read the body, from src/lib/readingTime.ts. Optional
	 * because it needs the raw markdown, which not every caller that builds a
	 * Post has to hand; the display sites omit the line rather than guess.
	 */
	readingMinutes?: number;
}

export interface BlogPost extends Post {
	html: string;
	/** Section headings, in document order. Empty for a post with none. */
	headings?: Heading[];
}

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

// Page data types
export interface PostsPageData {
	posts: Post[];
	/** Page-specific <meta name="description">, resolved once in the layout. */
	description?: string;
	/** Page-specific og:title / twitter:title. */
	ogTitle?: string;
}

/** The home page shows the post list plus the featured project cards. */
export interface HomePageData extends PostsPageData {
	projects: FeaturedProject[];
}

export interface PostPageData {
	post: BlogPost;
}

export interface PostsProps {
	posts: Post[];
}
