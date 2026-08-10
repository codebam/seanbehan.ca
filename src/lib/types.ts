export interface PostMeta {
	title: string;
	date: string;
	tags?: string[];
	draft: boolean;
	description?: string;
	author?: string;
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
}

export interface SearchResult {
	item: Post;
	refIndex: number;
	score: number;
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
}

/** The home page shows the post list plus the featured project cards. */
export interface HomePageData extends PostsPageData {
	projects: FeaturedProject[];
}

export interface PostPageData {
	post: BlogPost;
}

// API response types
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
}

// Component prop types
export interface PostsProps {
	posts: Post[];
}

export interface PostProps {
	post: Post;
}
