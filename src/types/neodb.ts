// NeoDB API 类型定义

// NeoDB 条目（书籍/音乐/游戏/播客等）
export interface NeoDBItem {
	uuid: string;
	type: string; // "Edition" | "Album" | "Game" | "Podcast"
	title: string;
	display_title: string;
	category: string; // "book" | "music" | "game" | "podcast"
	cover_image_url?: string;
	rating?: number; // 社区均分
	rating_count?: number;
	brief?: string;
	description?: string;
	url: string; // "/book/xxx"
	id: string; // 完整 URL "https://neodb.social/book/xxx"
	external_resources?: { url: string }[];
}

// NeoDB 标记（架上的收藏记录）
export interface NeoDBMark {
	shelf_type: "complete" | "progress" | "wishlist" | "dropped";
	item: NeoDBItem;
	rating_grade?: number; // 用户评分 1-10
	created_time: string;
	comment_text?: string | null;
	tags?: string[];
}
