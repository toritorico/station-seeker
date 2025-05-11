<template>
  <div class="touchscreen-keyboard">
    <div class="keyboard-display">
      <div class="search-text">{{ searchText || '_' }}</div>
      <button
        v-if="searchText"
        class="clear-button"
        @click="clearSearch"
        aria-label="Clear search"
      >
        Clear
      </button>
    </div>

    <div class="keyboard-grid">
      <div
        v-for="row in keyboardLayout"
        :key="row.join('')"
        class="keyboard-row"
      >
        <template v-for="key in row" :key="key">
          <!-- Regular letter key -->
          <button
            v-if="key !== 'SPACE' && key !== 'DELETE'"
            class="keyboard-key"
            :class="{
              'valid-next': nextCharacters.includes(key),
              'disabled': !nextCharacters.includes(key) && searchText.length > 0
            }"
            @click="appendCharacter(key)"
            :disabled="!nextCharacters.includes(key) && searchText.length > 0"
          >
            {{ key }}
          </button>

          <!-- Space key -->
          <button
            v-else-if="key === 'SPACE'"
            class="keyboard-key space-key"
            :class="{
              'valid-next': nextCharacters.includes(' '),
              'disabled': !nextCharacters.includes(' ') && searchText.length > 0
            }"
            @click="appendCharacter(' ')"
            :disabled="!nextCharacters.includes(' ') && searchText.length > 0"
          >
            Space
          </button>

          <!-- Delete key -->
          <button
            v-else
            class="keyboard-key delete-key"
            @click="deleteLastCharacter"
            :disabled="!searchText.length"
          >
            Backspace
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import {useStationStore} from "../stores/stationStore.ts";

export default defineComponent({
  name: 'TouchscreenKeyboard',
  setup() {
    const stationStore = useStationStore();
    const searchText = ref('');

    // Define keyboard layout
    const keyboardLayout = [
      ['A', 'B', 'C', 'D', 'E'],
      ['F', 'G', 'H', 'I', 'J'],
      ['K', 'L', 'M', 'N', 'O'],
      ['P', 'Q', 'R', 'S', 'T'],
      ['U', 'V', 'W', 'X', 'Y'],
      ['Z', 'SPACE', 'DELETE']
    ];

    // Watch the store's searchText and update local state
    watch(() => stationStore.searchText, (newValue) => {
      searchText.value = newValue;
    });

    // Compute next available characters
    const nextCharacters = computed(() => {
      // If no search text, all keys are valid
      if (!searchText.value.length) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('');
      }
      return stationStore.searchResults.nextCharacters;
    });

    // Clear the search
    const clearSearch = () => {
      searchText.value = '';
      stationStore.updateSearch('');
    };

    // Append a character to the search
    const appendCharacter = (char: string) => {
      if (nextCharacters.value.includes(char)) {
        searchText.value += char;
        stationStore.updateSearch(searchText.value);
      }
    };

    // Delete the last character from the search
    const deleteLastCharacter = () => {
      if (searchText.value.length > 0) {
        searchText.value = searchText.value.slice(0, -1);
        stationStore.updateSearch(searchText.value);
      }
    };

    return {
      searchText,
      keyboardLayout,
      nextCharacters,
      clearSearch,
      appendCharacter,
      deleteLastCharacter
    };
  }
});
</script>

<style scoped>
.touchscreen-keyboard {
  width: 100%;
  border: 1px solid var(--gray-400);
  border-radius: 8px;
  padding: 15px;
  background: var(--gray-100);
}

.keyboard-display {
  background: var(--white);
  border: 1px solid var(--gray-450);
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 15px;
  min-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-text {
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.clear-button {
  background: var(--danger);
  color: var(--white);
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
}

.keyboard-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keyboard-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.keyboard-key {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border: 1px solid var(--gray-450);
  border-radius: 6px;
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.keyboard-key:hover:not(.disabled) {
  background: var(--gray-300);
}

.valid-next {
  background: var(--secondary-light);
  border-color: var(--secondary);
  color: var(--secondary);
  font-weight: bold;
}

.valid-next:hover {
  background: var(--primary-light);
}

.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.space-key {
  width: 130px;
  font-size: 1rem;
}

.delete-key {
  width: 130px;
  background: var(--danger-lighter);
  border-color: var(--danger);
  color: var(--danger);
  font-size: 1rem;
}

.delete-key:hover:not(:disabled) {
  background: var(--danger-light);
}
</style>
