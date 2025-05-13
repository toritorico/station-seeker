import type { Meta, StoryObj } from '@storybook/vue3';
import StationSearchResults from '../components/station-search/StationSearchResults.vue';
import { useStationStore } from '../stores/stationStore';

// Meta for the component
const meta = {
  title: 'Components/StationSearchResults',
  component: StationSearchResults,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="max-width: 600px; margin: 2rem auto; padding: 1rem; border: 1px solid #eee; border-radius: 8px; color: #333;"><story/></div>',
      setup() {
        return {};
      }
    })
  ],
} satisfies Meta<typeof StationSearchResults>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base story - Loading state
export const Loading: Story = {
  args: {},
  play: async () => {
    const store = useStationStore();
    store.$patch({
      isLoading: true,
      searchText: 'CH',
      searchResults: {
        matchingStations: [],
        nextCharacters: []
      }
    });
  }
};

// Story with search results for "CH"
export const WithResults: Story = {
  args: {},
  play: async () => {
    const store = useStationStore();
    store.$patch({
      isLoading: false,
      searchText: 'CH',
      searchResults: {
        matchingStations: [
          { stationName: 'CHADWELL HEATH', stationCode: 'CTH' },
          { stationName: 'CHAFFORD HUNDRED LAKESIDE', stationCode: 'CFH' },
          { stationName: 'CHALFONT & LATIMER', stationCode: 'CFO' }
        ],
        nextCharacters: ['A']
      }
    });
  }
};

// Story with no results
export const NoResults: Story = {
  args: {},
  play: async () => {
    const store = useStationStore();
    store.$patch({
      isLoading: false,
      searchText: 'X',
      searchResults: {
        matchingStations: [],
        nextCharacters: []
      }
    });
  }
};

// Story with error state
export const Error: Story = {
  args: {},
  play: async () => {
    const store = useStationStore();
    store.$patch({
      isLoading: false,
      error: 'Failed to load stations. Please try again.',
      searchText: '',
      searchResults: {
        matchingStations: [],
        nextCharacters: []
      }
    });
  }
};
