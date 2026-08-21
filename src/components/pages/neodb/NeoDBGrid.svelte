<script lang="ts">
import { onMount } from "svelte";
import type { NeoDBMark } from "@/types/neodb";
import TabNav from "../../common/TabNav.svelte";
import NeoDBSection from "./NeoDBSection.svelte";

interface Props {
	tabs: Array<{ id: string; name: string; count: number }>;
	initialActiveTab?: string;
	neodbData: Record<string, NeoDBMark[]>;
}

const { tabs, initialActiveTab, neodbData }: Props = $props();

let activeTab = $state(initialActiveTab || tabs[0]?.id || "");

function handleTabChange(tabId: string) {
	activeTab = tabId;
}

// 从 URL hash 恢复 tab
function restoreTabFromHash() {
	const hash = window.location.hash.replace(/^#/, "");
	if (hash) {
		try {
			const decoded = decodeURIComponent(hash);
			if (tabs.some((t) => t.id === decoded)) {
				activeTab = decoded;
			}
		} catch {
			// ignore
		}
	}
}

onMount(() => {
	restoreTabFromHash();
});
</script>

{#if tabs.length > 0}
  <TabNav {tabs} {activeTab} onTabChange={handleTabChange} />

  {#each tabs as tab (tab.id)}
    <NeoDBSection
      sectionId={tab.id}
      items={neodbData[tab.id] || []}
      isActive={tab.id === activeTab}
      itemsPerPage={24}
    />
  {/each}
{/if}
