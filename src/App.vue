
<template>
  <div class="app">
    <header>
      <h1>Train Ticket Machine</h1>
    </header>

    <main>
      <div v-if="!isInitialized" class="initializing-fullscreen">
        <div class="loading-spinner"></div>
        <p>Loading station data...</p>
      </div>

      <div v-else-if="stationStore.selectedStation" class="selected-station-container">
        <SelectedStation />
        <div class="back-button-container">
          <button class="back-button" @click="returnToMainScreen()">Back to Search</button>
        </div>
      </div>

      <div v-else class="ticket-machine-interface">
        <div class="main-column">
          <div class="search-block">
            <div class="keyboard-container">
              <TouchscreenKeyboard />
            </div>
            <div class="results-container">
              <StationSearchResults />
            </div>
          </div>
          <div class="recent-searches-container">
            <RecentSearchesList />
          </div>
        </div>
      </div>
    </main>

    <footer>
      <p> 2025 Train Station Seeker | For job seeking purposes only 😎</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStationStore } from './stores/stationStore';
import StationSearchResults from './components/station-search/StationSearchResults.vue';
import TouchscreenKeyboard from "./components/TouchscreenKeyboard.vue";
import RecentSearchesList from "./components/RecentSearchesList.vue";
import SelectedStation from "./components/SelectedStation.vue";

// Load store data
const stationStore = useStationStore();
const isInitialized = ref(false);

onMounted(async () => {
  try {
    // Initialize station data
    await stationStore.initialize();
    isInitialized.value = true;
  } catch (error) {
    console.error('Error initializing app:', error);
  }
});

const returnToMainScreen = () => {
  stationStore.selectedStation = null
  stationStore.updateSearch('');
}
</script>

<style>
:root {
  --primary-color: #007bff;
  --primary-dark: #0069d9;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --border-color: #eee;
  --error-color: #dc3545;
  --success-color: #28a745;
  --warning-color: #ffc107;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: #f5f7fa;
}

.app {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

header {
  margin-bottom: 2rem;
  text-align: center;
}

header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.offline-indicator {
  display: inline-flex;
  align-items: center;
  background-color: #fff3cd;
  color: #856404;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.offline-icon {
  margin-right: 0.5rem;
}

main {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
  min-height: 700px;
  display: flex;
  flex-direction: column;
}

.initializing-fullscreen {
  padding: 2rem;
  text-align: center;
  color: #666;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.ticket-machine-interface {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
  align-items: stretch;
}

.search-block {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.keyboard-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.results-container {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  height: 0;
  height: 510px;
  width: 380px;
}

.results-container h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--text-color);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  height: 510px;
  overflow-y: scroll;
}

/* Mobile vs Desktop visibility classes */
.mobile-only {
  display: none;
}

.desktop-only {
  display: block;
}

/* Media queries for responsive layout */
@media (max-width: 768px) {
  .search-block {
    flex-direction: column;
    gap: 3vmin;
  }

  .mobile-only {
    display: block;
  }

  .desktop-only {
    display: none;
  }



  .keyboard-container {
    width: 100%;
  }
}


.recent-searches-container {
}

.selected-station-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.back-button-container {
  margin-top: 2rem;
  text-align: center;
}

.back-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: var(--primary-dark);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

footer {
  text-align: center;
  font-size: 0.8rem;
  color: #666;
}
</style>
