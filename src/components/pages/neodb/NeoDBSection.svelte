<script lang="ts">
import ClientPagination from "@/components/common/ClientPagination.svelte";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { NeoDBMark } from "@/types/neodb";
import FilterControls from "../../common/FilterControls.svelte";
import Card from "./Card.svelte";

interface Props {
	sectionId: string;
	items: NeoDBMark[];
	isActive: boolean;
	itemsPerPage?: number;
}

const { sectionId, items, isActive, itemsPerPage = 24 }: Props = $props();

const SHELF_FILTERS = ["complete", "progress", "wishlist", "dropped"] as const;

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
	movie: {
		wishlist: I18nKey.neodbMovieWish,
		progress: I18nKey.neodbMovieDoing,
		complete: I18nKey.neodbMovieDone,
		dropped: I18nKey.neodbMovieDropped,
	},
	tv: {
		wishlist: I18nKey.neodbTvWish,
		progress: I18nKey.neodbTvDoing,
		complete: I18nKey.neodbTvDone,
		dropped: I18nKey.neodbTvDropped,
	},
};

function getShelfLabel(shelf: string): string {
	const cat = STATUS_LABELS[sectionId];
	const key = cat?.[shelf];
	return key ? i18n(key) : shelf;
}

const shelfCounts = $derived(() => {
	const counts: Record<string, number> = {};
	for (const mark of items) {
		const s = mark.shelf_type;
		counts[s] = (counts[s] || 0) + 1;
	}
	return counts;
});

const filters = $derived(() => {
	const counts = shelfCounts();
	return [
		{
			value: "all",
			label: i18n(I18nKey.neodbFilterAll),
			count: items.length,
		},
		...SHELF_FILTERS.map((shelf) => ({
			value: shelf,
			label: getShelfLabel(shelf),
			count: counts[shelf] || 0,
		})),
	].filter((f) => f.value === "all" || f.count > 0);
});

let activeFilter = $state("all");
let currentPage = $state(1);

const filteredItems = $derived(
	activeFilter === "all"
		? items
		: items.filter((mark) => mark.shelf_type === activeFilter),
);

const totalPages = $derived(
	Math.max(1, Math.ceil(filteredItems.length / itemsPerPage)),
);

const pagedItems = $derived(
	filteredItems.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	),
);

function handleFilterChange(filter: string) {
	activeFilter = filter;
	currentPage = 1;
}

function goToPage(page: number) {
	if (page >= 1 && page <= totalPages) {
		currentPage = page;
	}
}
</script>

<div class="neodb-section" class:hidden={!isActive} data-section={sectionId}>
  {#if items.length > 0}
    <FilterControls
      filters={filters()}
      activeFilter={activeFilter}
      onFilterChange={handleFilterChange}
    />

    <div class="neodb-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {#each pagedItems as mark (mark.item.uuid)}
        <div class="neodb-item" data-item-section={sectionId} data-item-status={mark.shelf_type}>
          <Card {mark} loadImage={isActive} />
        </div>
      {/each}
    </div>

    <ClientPagination
      totalItems={filteredItems.length}
      {itemsPerPage}
      currentPage={currentPage}
      onPageChange={goToPage}
    />
  {:else}
    <div class="text-center py-12">
      <h3 class="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">{i18n(I18nKey.neodbNoData)}</h3>
    </div>
  {/if}
</div>
