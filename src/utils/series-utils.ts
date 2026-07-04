import type { CollectionEntry } from "astro:content";
import { getPostUrlBySlug } from "./url-utils";

/**
 * 系列标签：以 emoji 开头的 tag 即为「系列」
 * 例：🗃️当月事 · ⏳又一年 · 💕呼唤爱 · 🗺小行迹
 */
const SERIES_TAG_RE = /^\p{Extended_Pictographic}/u;

/** 在 tag 数组中找出第一个系列标签（emoji 开头的标签）；找不到返回 null */
export function findSeriesTag(
	tags: readonly string[] | undefined | null,
): string | null {
	if (!tags) return null;
	for (const t of tags) {
		if (SERIES_TAG_RE.test(t)) return t;
	}
	return null;
}

export interface SeriesPost {
	slug: string;
	title: string;
	published: Date;
	url: string;
}

export interface SeriesData {
	tag: string;
	posts: SeriesPost[];
	currentSlug: string;
}

/** 给定系列标签 + 全量已排序文章，过滤出该系列下所有文章（按发布时间正序） */
export function buildSeriesPosts(
	seriesTag: string,
	allPosts: CollectionEntry<"posts">[],
): SeriesPost[] {
	return allPosts
		.filter(
			(p) => Array.isArray(p.data.tags) && p.data.tags.includes(seriesTag),
		)
		.map((p) => ({
			slug: p.id,
			title: p.data.title,
			published: p.data.published,
			url: getPostUrlBySlug(p.id),
		}))
		.sort((a, b) => a.published.getTime() - b.published.getTime());
}

export interface SeriesGroup {
	tag: string;
	posts: SeriesPost[];
}

/** 获取所有系列及其文章（用于总览页），按系列文章数量降序排列 */
export function getAllSeries(
	allPosts: CollectionEntry<"posts">[],
): SeriesGroup[] {
	const seriesMap = new Map<string, SeriesPost[]>();

	for (const post of allPosts) {
		const tag = findSeriesTag(post.data.tags);
		if (!tag) continue;
		if (!seriesMap.has(tag)) {
			seriesMap.set(tag, []);
		}
		const posts = seriesMap.get(tag)!;
		if (!posts.some((p) => p.slug === post.id)) {
			posts.push({
				slug: post.id,
				title: post.data.title,
				published: post.data.published,
				url: getPostUrlBySlug(post.id),
			});
		}
	}

	// 每个系列内部按时间正序
	const result: SeriesGroup[] = [];
	for (const [tag, posts] of seriesMap) {
		posts.sort((a, b) => a.published.getTime() - b.published.getTime());
		result.push({ tag, posts });
	}

	// 按系列文章数量降序
	result.sort((a, b) => b.posts.length - a.posts.length);
	return result;
}
