import { getAllTags } from '$lib/getPosts';
import type { TagInfo } from '$lib/getPosts';

export interface TagsPageData {
	tags: TagInfo[];
}

export const load = async (): Promise<TagsPageData> => ({ tags: await getAllTags() });
