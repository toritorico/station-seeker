<template>
  <div class="station-search-results">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading stations...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="refreshStations" class="retry-button">
        Retry
      </button>
    </div>

    <div v-else-if="matchingStations.length === 0" class="no-results">
      <p>No stations found matching "{{ searchText }}"</p>
    </div>

    <ul v-else class="results-list">
      <li
        v-for="station in matchingStations"
        :key="station.stationCode"
        class="station-item"
        @click="selectStation(station)"
        :class="{ 'highlighted': station.stationName.toUpperCase() === searchText }"
      >
        <div class="station-info">
          <div class="station-name">{{ station.stationName }}</div>
          <div class="station-code">{{ station.stationCode }}</div>
        </div>
        <div class="select-button">
          <span class="arrow-icon">→</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, getCurrentInstance } from 'vue';
import { useStationStore } from "../../stores/stationStore.ts";
import type { Station } from "../../types/station.ts";
import { SimpleAnalytics } from "../../services/analytics";

export default defineComponent({
  name: 'StationSearchResults',
  setup() {
    // Access the global $statsig instance
    const { appContext } = getCurrentInstance()!;
    const statsig = appContext.config.globalProperties.$statsig;
    const stationStore = useStationStore();
    const searchStartTime = ref<number>(Date.now());

    // Select a station
    const selectStation = (station: Station) => {
      // Local analytics for station selection
      SimpleAnalytics.trackEvent('station_selected', {
        station_name: station.stationName,
        station_code: station.stationCode,
        from_search: stationStore.searchText,
        selection_time_ms: Date.now() - searchStartTime.value
      });
      // Statsig event for station selection
      if (statsig) {
        statsig.logEvent('station_selected', station.stationCode, {
          station_name: station.stationName,
          from_search: stationStore.searchText,
          selection_time_ms: Date.now() - searchStartTime.value
        });
      }
      stationStore.selectStation(station);
    };

    // Refresh stations data
    const refreshStations = async () => {
      await stationStore.refreshStations();
      searchStartTime.value = Date.now();
    };

    // Watch for search results changes
    watch(() => stationStore.searchResults.matchingStations, (stations) => {
      // Local analytics for station search
      SimpleAnalytics.trackEvent('search_results', {
        query: stationStore.searchText,
        results_count: stations.length,
        next_chars: stationStore.searchResults.nextCharacters.join('')
      });
      // Statsig event for station search
      if (statsig) {
        statsig.logEvent('station_search', stationStore.searchText, {
          results_count: stations.length,
          next_chars: stationStore.searchResults.nextCharacters.join(''),
          results: stations.map(s => ({ name: s.stationName, code: s.stationCode }))
        });
      }
    });

    return {
      isLoading: computed(() => stationStore.isLoading),
      error: computed(() => stationStore.error),
      searchText: computed(() => stationStore.searchText),
      matchingStations: computed(() => stationStore.searchResults.matchingStations),
      selectStation,
      refreshStations
    };
  }
});
</script>

<style scoped>
.station-search-results {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.loading-container, .error-container, .no-results {
  padding: 2rem;
  text-align: center;
  color: var(--gray-600);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  margin-top: 1rem;
  padding: 8px 16px;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.retry-button:hover {
  background-color: var(--primary-dark);
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.station-item {
  padding: 15px;
  border-bottom: 1px solid var(--gray-300);
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.station-item:last-child {
  border-bottom: none;
}

.station-item:hover {
  background-color: var(--gray-150);
}

.highlighted, .highlighted:hover {
  background-color: var(--secondary-light);
  border-left: 4px solid var(--secondary);
}

.station-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.station-name {
  font-weight: 500;
  font-size: 1.1rem;
}

.station-code {
  color: var(--gray-600);
  font-size: 0.85rem;
  padding: 2px 6px;
  background-color: var(--gray-200);
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.select-button {
  color: var(--secondary);
  font-size: 1.5rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  opacity: 0.7;
}

.station-item:hover .arrow-icon {
  opacity: 1;
}
</style>
