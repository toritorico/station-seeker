import type { Meta, StoryObj } from '@storybook/vue3';
import TouchscreenKeyboard from '../components/TouchscreenKeyboard.vue';
import { useStationStore } from '../stores/stationStore';
import { createPinia } from 'pinia';

// Create a fresh Pinia instance
const pinia = createPinia();

// Meta for the component
const meta = {
  title: 'Components/TouchscreenKeyboard',
  component: TouchscreenKeyboard,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="max-width: 600px; margin: 2rem auto; padding: 1rem; color: #333;"><story/></div>',
      setup() {
        // Initialize store with mock data
        const store = useStationStore(pinia);
        store.$patch({
          stations: [
            { id: '1', name: 'DARTFORD' },
            { id: '2', name: 'DARTON' },
            { id: '3', name: 'TOWER HILL' },
            { id: '4', name: 'DERBY' }
          ],
          searchResults: {
            matchingStations: [],
            nextCharacters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ']
          },
          initialized: true
        });
        return { store };
      }
    })
  ],
} satisfies Meta<typeof TouchscreenKeyboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base story - Initial state
export const Initial: Story = {
  args: {},
};

// Story with some text entered and specific next characters
export const WithSearchText: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const store = useStationStore();
    store.updateSearch('DART');
    store.$patch({
      trie: undefined,
      searchResults: {
        matchingStations: [
          { id: '1', name: 'DARTFORD' },
          { id: '2', name: 'DARTON' }
        ],
        nextCharacters: ['F', 'O']
      }
    });
  }
};

// Story showing disabled state
export const AllDisabled: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const store = useStationStore();
    store.updateSearch('KINGS');
    store.$patch({
      searchResults: {
        matchingStations: [],
        nextCharacters: []
      }
    });
  }
};
