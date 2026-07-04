export interface MastodonAccount {
	username: string;
	display_name: string;
	avatar: string;
	url: string;
}

export interface MastodonMediaAttachment {
	id: string;
	type: "image" | "video" | "gifv" | "audio";
	url: string;
	preview_url: string;
	description?: string;
}

export interface MastodonStatus {
	id: string;
	created_at: string;
	content: string;
	text?: string;
	visibility: string;
	language?: string;
	url: string;
	replies_count: number;
	reblogs_count: number;
	favourites_count: number;
	pinned: boolean;
	in_reply_to_id?: string;
	in_reply_to_account_id?: string;
	account: MastodonAccount;
	media_attachments: MastodonMediaAttachment[];
	tags: Array<{ name: string; url: string }>;
	mentions: Array<{ id: string; username: string; url: string }>;
	reblog?: MastodonStatus | null;
}

export interface TalksData {
	instance: string;
	account: MastodonAccount | null;
	talks: MastodonStatus[];
}
