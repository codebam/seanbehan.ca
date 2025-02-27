export interface Post {
    path: string;
    meta: {
        title: string;
        date: string;
        tags?: string[];
        draft: boolean;
    };
}

export interface BlogPost extends Post {
    html: string;
}

export interface SearchResult {
    item: Post;
    refIndex: number;
    score: number;
}