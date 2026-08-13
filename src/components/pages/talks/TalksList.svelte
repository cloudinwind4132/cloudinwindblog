<script lang="ts">
	import type { TalksData, MastodonStatus } from "@/types/mastodon";

	// Inline SVG icons (astro-icon not usable in Svelte SSR)
	const icons = {
		pin: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>',
		reply: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>',
		repeat: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
		favorite: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
		empty: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
	};

	import { onMount } from "svelte";

	interface Props {
		talksData: TalksData;
		instance: string;
		userId: string;
	}

	let { talksData, instance, userId }: Props = $props();

	// ---- client-side fallback fetch ----
	let localTalks = $state(talksData.talks);
	let localAccount = $state(talksData.account);
	let isLoading = $state(false);
	let loadError = $state(false);

	async function clientFetch() {
		if (localTalks.length > 0 || isLoading) return;
		isLoading = true;
		loadError = false;
		try {
			const all: MastodonStatus[] = [];
			let lastId: string | null = null;
			for (let i = 0; i < 20; i++) {
				let url = `https://${instance}/api/v1/accounts/${userId}/statuses?limit=40`;
				if (lastId) url += `&max_id=${lastId}`;
				const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
				if (!res.ok) break;
				const data = await res.json();
				if (!data || data.length === 0) break;
				const filtered = data.filter(
					(t: MastodonStatus) =>
						!t.reblog &&
						(!t.in_reply_to_account_id ||
							t.in_reply_to_account_id === userId),
				);
				all.push(...filtered);
				lastId = data[data.length - 1].id;
			}
			if (all.length > 0) {
				all.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
				localTalks = all.slice(0, 500);
				localAccount = {
					username: all[0].account.username,
					display_name: all[0].account.display_name,
					avatar: all[0].account.avatar,
					url: all[0].account.url,
				};
			}
		} catch {
			loadError = true;
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		if (localTalks.length === 0) {
			clientFetch();
		}
	});

	// Use local state for rendering
	const displayTalks = $derived(localTalks);
	const displayAccount = $derived(localAccount);

	// ---- thread building ----
	interface Thread {
		id: string;
		root: MastodonStatus;
		replies: MastodonStatus[];
		pinned: boolean;
	}

	function buildThreads(statuses: MastodonStatus[]): Thread[] {
		const statusMap = new Map<string, MastodonStatus>();
		for (const s of statuses) statusMap.set(s.id, s);

		function findRoot(s: MastodonStatus): MastodonStatus {
			if (!s.in_reply_to_id) return s;
			const parent = statusMap.get(s.in_reply_to_id);
			return parent ? findRoot(parent) : s;
		}

		const threadMap = new Map<string, Thread>();
		for (const s of statuses) {
			const root = findRoot(s);
			if (!threadMap.has(root.id)) {
				threadMap.set(root.id, {
					id: root.id,
					root,
					replies: [],
					pinned: root.pinned,
				});
			}
			if (s.id !== root.id) {
				threadMap.get(root.id)!.replies.push(s);
			}
		}

		// sort replies ascending within each thread
		for (const t of threadMap.values()) {
			t.replies.sort(
				(a, b) =>
					new Date(a.created_at).getTime() -
					new Date(b.created_at).getTime(),
			);
		}

		// sort threads: pinned first, then by date desc
		const threads = [...threadMap.values()];
		threads.sort((a, b) => {
			if (a.pinned && !b.pinned) return -1;
			if (!a.pinned && b.pinned) return 1;
			return (
				new Date(b.root.created_at).getTime() -
				new Date(a.root.created_at).getTime()
			);
		});
		return threads;
	}

	const threads = $derived(buildThreads(displayTalks));

	// ---- pagination ----
	const ITEMS_PER_PAGE = 10;
	let currentPage = $state(1);
	let scrollContainer: HTMLElement | null = $state(null);

	const totalPages = $derived(
		Math.max(1, Math.ceil(threads.length / ITEMS_PER_PAGE)),
	);
	const pageThreads = $derived(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return threads.slice(start, start + ITEMS_PER_PAGE);
	});

	function goToPage(page: number) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
		scrollContainer?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	// ---- render helpers ----
	function formatDate(dateStr: string): string {
		const d = new Date(dateStr);
		return d.toLocaleDateString("zh-CN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	function mediaGridClass(count: number): string {
		if (count === 1) return "grid-1";
		if (count === 2) return "grid-2";
		if (count === 3) return "grid-3";
		if (count === 4) return "grid-4";
		return "grid-more";
	}
</script>

<div bind:this={scrollContainer} class="talks-container">
	{#if displayTalks.length === 0}
		{#if isLoading}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="talks-spinner mb-4"></div>
				<p class="text-sm text-black/50 dark:text-white/50">加载中...</p>
			</div>
		{:else if loadError}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="w-20 h-20 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
					<span class="text-4xl text-black/25 dark:text-white/25">!</span>
				</div>
				<h2 class="text-xl font-semibold text-black/50 dark:text-white/50 mb-2">加载失败</h2>
				<p class="text-sm text-black/30 dark:text-white/30 mb-4">无法获取数据，请稍后重试</p>
				<button class="talks-pagination-btn" onclick={clientFetch}>重试</button>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="w-20 h-20 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
					<span class="text-black/25 dark:text-white/25">{@html icons.empty}</span>
				</div>
				<h2 class="text-xl font-semibold text-black/50 dark:text-white/50 mb-2">暂无说说</h2>
				<p class="text-sm text-black/30 dark:text-white/30">
					还没有发表过说说，去
					<a href="https://{talksData.instance}/@{displayAccount?.username ?? ''}" class="text-(--primary) hover:underline" target="_blank" rel="noopener noreferrer">{talksData.instance}</a>
					看看吧
				</p>
			</div>
		{/if}
	{:else}
		<!-- Threads -->
		{#each pageThreads() as thread (thread.id)}
			<div class="talk-thread" class:is-pinned={thread.pinned}>
				<!-- Root card -->
				<div class="talk-card" class:is-pinned={thread.pinned}>
					{#if thread.pinned && thread.root.pinned}
						<div class="talk-pinned-label">
							<span class="text-(--primary)">{@html icons.pin}</span>
							<span>置顶</span>
						</div>
					{/if}
					<div class="talk-header">
						<img
							src={displayAccount?.avatar ?? ""}
							alt="avatar"
							class="talk-avatar"
							loading="lazy"
						/>
						<div class="talk-account-info">
							<a
								href={displayAccount?.url ?? "#"}
								class="talk-display-name"
								target="_blank"
								rel="noopener noreferrer"
							>
								{displayAccount?.display_name ?? displayAccount?.username ?? ""}
							</a>
							<span class="talk-username">
								@{displayAccount?.username ?? ""}@{talksData.instance}
							</span>
						</div>
						<div class="talk-date">
							<a
								href={thread.root.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								{formatDate(thread.root.created_at)}
							</a>
						</div>
					</div>

					<div class="talk-content">
						{@html thread.root.content}
					</div>

					{#if thread.root.media_attachments && thread.root.media_attachments.length > 0}
						<div class="talk-media-grid {mediaGridClass(thread.root.media_attachments.length)}">
							{#each thread.root.media_attachments as media}
								<div class="talk-media-item">
									<img
										src={media.preview_url || media.url}
										alt={media.description || ""}
										loading="lazy"
									/>
								</div>
							{/each}
						</div>
					{/if}

					<div class="talk-stats">
						<span class="talk-stat-item">
							<a href={thread.root.url} target="_blank" rel="noopener noreferrer">
								{@html icons.reply}
								<span>{thread.root.replies_count}</span>
							</a>
						</span>
						<span class="talk-stat-item">
							<a href={thread.root.url} target="_blank" rel="noopener noreferrer">
								{@html icons.repeat}
								<span>{thread.root.reblogs_count}</span>
							</a>
						</span>
						<span class="talk-stat-item">
							<a href={thread.root.url} target="_blank" rel="noopener noreferrer">
								{@html icons.favorite}
								<span>{thread.root.favourites_count}</span>
							</a>
						</span>
					</div>
				</div>

				<!-- Replies -->
				{#if thread.replies.length > 0}
					<div class="talk-replies">
						{#each thread.replies as reply (reply.id)}
							<div class="talk-card">
								<div class="talk-header">
									<img
										src={reply.account.avatar}
										alt="avatar"
										class="talk-avatar"
										loading="lazy"
									/>
									<div class="talk-account-info">
										<span class="talk-display-name">
											{reply.account.display_name || reply.account.username}
										</span>
										<span class="talk-username">
											@{reply.account.username}
										</span>
									</div>
									<div class="talk-date">
										<a
											href={reply.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											{formatDate(reply.created_at)}
										</a>
									</div>
								</div>

								<div class="talk-content">
									{@html reply.content}
								</div>

								{#if reply.media_attachments && reply.media_attachments.length > 0}
									<div class="talk-media-grid {mediaGridClass(reply.media_attachments.length)}">
										{#each reply.media_attachments as media}
											<div class="talk-media-item">
												<img
													src={media.preview_url || media.url}
													alt={media.description || ""}
													loading="lazy"
												/>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="talks-pagination">
				<button
					class="talks-pagination-btn"
					disabled={currentPage <= 1}
					onclick={() => goToPage(currentPage - 1)}
				>
					上一页
				</button>
				<span class="talks-pagination-info">
					第 {currentPage} 页 / 共 {totalPages} 页
				</span>
				<button
					class="talks-pagination-btn"
					disabled={currentPage >= totalPages}
					onclick={() => goToPage(currentPage + 1)}
				>
					下一页
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.talks-container {
		max-width: 800px;
		margin: 0 auto;
	}

	.talks-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--line-divider, rgba(128, 128, 128, 0.15));
		border-top-color: var(--primary);
		border-radius: 50%;
		animation: talks-spin 0.8s linear infinite;
	}
	@keyframes talks-spin {
		to { transform: rotate(360deg); }
	}

	/* Card */
	.talk-thread {
		margin-bottom: 0.5rem;
	}
	.talk-card {
		background: var(--card-bg);
		border: 1px solid var(--line-divider, rgba(128, 128, 128, 0.15));
		border-radius: 12px;
		padding: 1.25rem;
		margin-bottom: 1.25rem;
		transition:
			transform 0.25s,
			box-shadow 0.25s;
	}
	.talk-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
	}
	.talk-card.is-pinned {
		border-color: var(--primary);
	}

	.talk-pinned-label {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-bottom: 0.75rem;
		color: var(--primary);
		font-size: 0.85rem;
		font-weight: 500;
	}
	.talk-pinned-label :global(svg) {
		width: 16px;
		height: 16px;
	}

	.talk-header {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}
	.talk-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		margin-right: 0.85rem;
		border: 2px solid var(--line-divider, rgba(128, 128, 128, 0.15));
		object-fit: cover;
		flex-shrink: 0;
	}
	.talk-account-info {
		flex: 1;
		min-width: 0;
	}
	.talk-display-name {
		font-weight: 500;
		font-size: 0.95rem;
		display: block;
		color: var(--text-color, inherit);
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.talk-display-name:hover {
		color: var(--primary);
	}
	.talk-username {
		color: var(--text-muted, #999);
		font-size: 0.825rem;
	}
	.talk-date {
		flex-shrink: 0;
		font-size: 0.8rem;
		color: var(--text-muted, #999);
		margin-left: 0.75rem;
	}
	.talk-date a {
		color: inherit;
		text-decoration: none;
	}
	.talk-date a:hover {
		color: var(--primary);
	}

	.talk-content {
		line-height: 1.75;
		color: var(--text-color, inherit);
		font-size: 0.95rem;
		margin-bottom: 1rem;
		word-break: break-word;
	}
	.talk-content :global(p) {
		margin: 0 0 0.5rem;
	}
	.talk-content :global(p:last-child) {
		margin-bottom: 0;
	}
	.talk-content :global(a) {
		color: var(--primary);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
		transition: border-color 0.2s;
	}
	.talk-content :global(a:hover) {
		border-bottom-color: var(--primary);
	}

	/* Media grid */
	.talk-media-grid {
		display: grid;
		gap: 8px;
		margin: 1rem 0;
	}
	.talk-media-grid.grid-1 {
		grid-template-columns: 1fr;
		max-width: 400px;
	}
	.talk-media-grid.grid-2 {
		grid-template-columns: repeat(2, 1fr);
	}
	.talk-media-grid.grid-3 {
		grid-template-columns: repeat(3, 1fr);
	}
	.talk-media-grid.grid-4 {
		grid-template-columns: repeat(2, 1fr);
	}
	.talk-media-grid.grid-more {
		grid-template-columns: repeat(3, 1fr);
	}
	.talk-media-item {
		border-radius: 8px;
		overflow: hidden;
		background: var(--card-bg);
		cursor: pointer;
		transition: transform 0.2s;
	}
	.talk-media-item:hover {
		transform: scale(1.02);
	}
	.talk-media-item img {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		display: block;
	}
	.grid-1 .talk-media-item img {
		aspect-ratio: auto;
		max-height: 400px;
		object-fit: contain;
	}

	/* Stats */
	.talk-stats {
		display: flex;
		gap: 1.5rem;
		padding-top: 0.85rem;
		border-top: 1px solid var(--line-divider, rgba(128, 128, 128, 0.15));
		color: var(--text-muted, #999);
		font-size: 0.85rem;
	}
	.talk-stat-item {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.talk-stat-item a {
		color: var(--text-muted, #999);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		transition: color 0.2s;
	}
	.talk-stat-item a:hover {
		color: var(--primary);
	}
	.talk-stat-item :global(svg) {
		width: 15px;
		height: 15px;
	}

	/* Thread replies */
	.talk-replies {
		position: relative;
		margin-top: 0.5rem;
		padding-left: 1.25rem;
	}
	.talk-replies::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		bottom: 1.25rem;
		width: 2px;
		background: color-mix(in srgb, var(--primary) 25%, transparent);
		border-radius: 1px;
	}
	.talk-replies .talk-card {
		margin-bottom: 0.75rem;
	}
	.talk-replies .talk-card:last-child {
		margin-bottom: 0;
	}

	/* Pagination */
	.talks-pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.25rem;
		margin-top: 2.5rem;
		padding: 1rem 0;
	}
	.talks-pagination-btn {
		padding: 0.5rem 1.25rem;
		background: var(--card-bg);
		color: var(--text-color, inherit);
		border: 1px solid var(--line-divider, rgba(128, 128, 128, 0.15));
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
		transition:
			background 0.2s,
			transform 0.2s;
	}
	.talks-pagination-btn:hover:not(:disabled) {
		background: var(--toc-btn-hover, rgba(128, 128, 128, 0.1));
		transform: translateY(-1px);
	}
	.talks-pagination-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.talks-pagination-info {
		color: var(--text-muted, #999);
		font-size: 0.875rem;
		font-weight: 500;
	}

	@media (max-width: 640px) {
		.talk-header {
			flex-wrap: wrap;
		}
		.talk-avatar {
			width: 40px;
			height: 40px;
		}
		.talk-date {
			margin-left: 0;
			width: 100%;
			margin-top: 0.25rem;
		}
		.talk-media-grid.grid-2,
		.talk-media-grid.grid-3,
		.talk-media-grid.grid-4,
		.talk-media-grid.grid-more {
			grid-template-columns: repeat(2, 1fr);
		}
		.talks-pagination {
			flex-direction: column;
			gap: 0.75rem;
		}
		.talk-stats {
			gap: 1rem;
		}
	}
</style>
