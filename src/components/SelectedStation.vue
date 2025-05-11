<template>
  <div v-if="selectedStation" class="selected-station">
    <div class="card">
      <div class="card-header">
        <h3>{{ selectedStation.stationName }}</h3>
        <button @click="clearSelection" class="close-button">
          ✕
        </button>
      </div>

      <div class="card-content">
        <p class="selection-info">
          Enjoy your ride!
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import {useStationStore} from "../stores/stationStore.ts";

export default defineComponent({
  name: 'SelectedStation',
  setup() {
    const stationStore = useStationStore();

    // Clear the selected station
    const clearSelection = () => {
      stationStore.selectedStation = null;
    };

    return {
      selectedStation: computed(() => stationStore.selectedStation),
      clearSelection,
    };
  }
});
</script>

<style scoped>
.selected-station {
  width: 100%;
  margin-top: 2rem;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background-color: #f8f9fa;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.close-button:hover {
  background-color: #eee;
}

.card-content {
  padding: 1.5rem;
}

.selection-info {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
</style>
