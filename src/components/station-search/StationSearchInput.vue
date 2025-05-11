<template>
  <div class="station-search-input">
    <div class="input-container">
      <input
        v-model="searchText"
        type="text"
        placeholder="Enter station name"
        @input="handleInput"
        autocomplete="off"
        aria-label="Search for a station"
      />
      <button
        v-if="searchText"
        class="clear-button"
        @click="clearSearch"
        aria-label="Clear search"
      >
        ✕
      </button>
    </div>

    <div v-if="showNextCharacters && nextCharacters.length > 0" class="next-characters">
      <p>Next characters:</p>
      <div class="character-buttons">
        <button
          v-for="char in nextCharacters"
          :key="char"
          @click="appendCharacter(char)"
          class="character-button"
        >
          {{ char === ' ' ? '␣' : char }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import {useStationStore} from "../../stores/stationStore.ts";

export default defineComponent({
  name: 'StationSearchInput',
  props: {
    showNextCharacters: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const stationStore = useStationStore();
    const searchText = ref('');

    // Watch the store's searchText and update local state
    watch(() => stationStore.searchText, (newValue) => {
      searchText.value = newValue;
    });

    // Handle input changes
    const handleInput = () => {
      stationStore.updateSearch(searchText.value);
    };

    // Clear the search
    const clearSearch = () => {
      searchText.value = '';
      stationStore.updateSearch('');
    };

    // Append a character to the search
    const appendCharacter = (char: string) => {
      searchText.value += char;
      stationStore.updateSearch(searchText.value);
    };

    return {
      searchText,
      handleInput,
      clearSearch,
      appendCharacter,
      nextCharacters: () => stationStore.searchResults.nextCharacters
    };
  }
});
</script>

<style scoped>
.station-search-input {
  width: 100%;
  margin-bottom: 1rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 1rem;
  border: 2px solid var(--gray-450);
  border-radius: 4px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--shadow-primary);
}

.clear-button {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--gray-600);
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 50%;
}

.clear-button:hover {
  background-color: var(--gray-200);
}

.next-characters {
  margin-top: 0.5rem;
}

.next-characters p {
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
}

.character-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.character-button {
  background-color: var(--gray-200);
  border: 1px solid var(--gray-400);
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.character-button:hover {
  background-color: var(--gray-300);
  border-color: var(--gray-450);
}
</style>
