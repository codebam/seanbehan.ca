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
}

export interface BlogPost extends Post {
	html: string;
}

export interface SearchResult {
	item: Post;
	refIndex: number;
	score: number;
}

// Page data types
export interface PostsPageData {
	posts: Post[];
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
