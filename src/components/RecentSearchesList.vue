<template>
  <div class="recent-searches">
    <div v-if="recentSearches.length > 0" class="recent-searches-container">
      <div class="recent-header">
        <h3>Recent Searches</h3>
        <button @click="clearRecentSearches" class="clear-all-button">
          Clear All
        </button>
      </div>

      <div class="recent-list-container">
        <ul class="recent-list">
          <li
            v-for="search in recentSearches"
            :key="search.timestamp"
            class="recent-item"
            @click="selectRecentSearch(search)">
            <div class="recent-text">
              <span v-if="search.station" class="recent-station">
                → {{ search.station.stationName }}
              </span>
            </div>
            <div class="recent-time">
              {{ formatTime(search.timestamp) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import {useStationStore} from "../stores/stationStore.ts";
import type {RecentSearch} from "../types/recent-search.ts";

export default defineComponent({
  name: 'RecentSearchesList',
  setup() {
    const stationStore = useStationStore();

    // Format timestamp to readable format
    const formatTime = (timestamp: number): string => {
      const date = new Date(timestamp);
      const now = new Date();

      // If it's today, just show the time
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      // If it's within the last week, show the day and time
      const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < 7) {
        return date.toLocaleDateString([], { weekday: 'short' }) + ' ' +
               date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      // Otherwise show the full date
      return date.toLocaleDateString();
    };

    // Select a recent search
    const selectRecentSearch = (search: RecentSearch) => {
      stationStore.selectRecentSearch(search);
    };

    // Clear all recent searches
    const clearRecentSearches = () => {
      stationStore.clearRecentSearches();
    };

    return {
      recentSearches: computed(() => stationStore.recentSearches),
      formatTime,
      selectRecentSearch,
      clearRecentSearches
    };
  }
});
</script>

<style scoped>
.recent-searches {
  width: 100%;
}

.recent-searches-container {
  border: 1px solid var(--gray-400);
  border-radius: 8px;
  background-color: var(--gray-100);
  overflow: hidden;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--gray-200);
  border-bottom: 1px solid var(--gray-400);
}

.recent-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-700);
}

.clear-all-button {
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
  font-weight: 500;
}

.clear-all-button:hover {
  text-decoration: underline;
}

.recent-list-container {
  max-height: 200px;
  overflow-y: auto;
}

.recent-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--gray-300);
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-item:hover {
  background-color: var(--secondary-light);
}

.recent-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.recent-station {
  color: var(--gray-600);
  font-size: 0.9rem;
}

.recent-time {
  color: var(--gray-500);
  font-size: 0.8rem;
  min-width: 60px;
  text-align: right;
}
</style>
