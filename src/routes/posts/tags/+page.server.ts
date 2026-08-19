import { getAllTags } from '$lib/getPosts';
import type { TagInfo } from '$lib/getPosts';
import { site } from '$lib/site';

export interface TagsPageData {
	tags: TagInfo[];
	description: string;
	ogTitle: string;
}

const DESCRIPTION = 'Browse every post by topic.';

export const load = async (): Promise<TagsPageData> => ({
	tags: await getAllTags(),
	description: DESCRIPTION,
	ogTitle: `Tags — ${site.name}`
});
