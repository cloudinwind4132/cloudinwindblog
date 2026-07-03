<script lang="ts">
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { NeoDBMark } from "@/types/neodb";

interface Props {
	mark: NeoDBMark;
	loadImage?: boolean;
}

const { mark, loadImage = false }: Props = $props();

const SHELF_COLORS: Record<string, string> = {
	wishlist: "bg-blue-500",
	progress: "bg-yellow-500",
	complete: "bg-green-500",
	dropped: "bg-red-500",
};

// 各分类 × 架位的状态文案
const STATUS_LABELS: Record<string, Record<string, I18nKey>> = {
	book: {
		wishlist: I18nKey.neodbBookWish,
		progress: I18nKey.neodbBookDoing,
		complete: I18nKey.neodbBookDone,
		dropped: I18nKey.neodbBookDropped,
	},
	music: {
		wishlist: I18nKey.neodbMusicWish,
		progress: I18nKey.neodbMusicDoing,
		complete: I18nKey.neodbMusicDone,
		dropped: I18nKey.neodbMusicDropped,
	},
	game: {
		wishlist: I18nKey.neodbGameWish,
		progress: I18nKey.neodbGameDoing,
		complete: I18nKey.neodbGameDone,
		dropped: I18nKey.neodbGameDropped,
	},
	podcast: {
		wishlist: I18nKey.neodbPodcastWish,
		progress: I18nKey.neodbPodcastDoing,
		complete: I18nKey.neodbPodcastDone,
		dropped: I18nKey.neodbPodcastDropped,
	},
};

const item = $derived(mark.item);
const coverSrc = $derived(item.cover_image_url || "");
const title = $derived(item.display_title || item.title || "");
const score = $derived(item.rating || 0);
const statusColor = $derived(SHELF_COLORS[mark.shelf_type] || "bg-gray-500");
const statusText = $derived(
	i18n(
		STATUS_LABELS[item.category]?.[mark.shelf_type] ||
			I18nKey.neodbBookDone,
	),
);
const tags = $derived(mark.tags || []);
const visibleTags = $derived(tags.slice(0, 3));
const hiddenTagCount = $derived(Math.max(tags.length - visibleTags.length, 0));
const link = $derived(item.id || `https://neodb.social${item.url || ""}`);

function handleLoad(e: Event) {
	const img = e.currentTarget as HTMLImageElement;
	img.style.opacity = "1";
	const ph = img.parentElement?.querySelector(".lqip-placeholder");
	if (ph) ph.classList.add("loaded");
}
</script>

<a
  href={link}
  target="_blank"
  rel="noopener noreferrer nofollow"
  class="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] block"
>
  <div class="aspect-2/3 relative overflow-hidden">
    {#if coverSrc}
      <div class="lqip-placeholder absolute inset-0 pointer-events-none" style="background: var(--muted)" aria-hidden="true"></div>
      <img
        src={loadImage ? coverSrc : undefined}
        data-src={loadImage ? undefined : coverSrc}
        alt={title}
        class="w-full h-full object-cover pointer-events-none opacity-0 transition-all duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        decoding="async"
        onload={handleLoad}
      />
    {:else}
      <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <div class="text-gray-400 text-4xl">📚</div>
      </div>
    {/if}

    <!-- 状态徽章 -->
    <div class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs text-white font-medium {statusColor}">
      {statusText}
    </div>

    <!-- 评分徽章 -->
    {#if score > 0}
      <div class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white font-medium bg-black/50 backdrop-blur-sm flex items-center gap-1">
        <span class="text-yellow-400">⭐</span>{score.toFixed(1)}
      </div>
    {/if}

    <!-- 渐变遮罩 + 信息 -->
    <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
    <div class="absolute bottom-0 left-0 right-0 p-3">
      <h3 class="font-bold text-sm text-white line-clamp-2 drop-shadow-lg">{title}</h3>
      {#if mark.comment_text}
        <p class="text-xs text-white/75 line-clamp-1 mt-1 leading-relaxed" title={mark.comment_text}>{mark.comment_text}</p>
      {/if}
      {#if visibleTags.length > 0}
        <div class="flex flex-wrap gap-1 mt-1.5">
          {#each visibleTags as tag}
            <span class="text-[0.6rem] px-1.5 py-0.5 rounded bg-white/20 text-white/90 backdrop-blur-sm">{tag}</span>
          {/each}
          {#if hiddenTagCount > 0}
            <span class="text-[0.6rem] px-1.5 py-0.5 rounded bg-white/20 text-white/60 backdrop-blur-sm">+{hiddenTagCount}</span>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</a>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-1 {
    display: -webkit-box;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
