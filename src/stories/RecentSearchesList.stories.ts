import type { Meta, StoryObj } from '@storybook/vue3';
import RecentSearchesList from '../components/RecentSearchesList.vue';
import { useStationStore } from '../stores/stationStore';
import { createPinia } from 'pinia';

// Create a fresh Pinia instance
const pinia = createPinia();

// Helper function to create timestamps for different times
const createTimestamp = (minutesAgo: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.getTime();
};

// Meta for the component
const meta = {
  title: 'Components/RecentSearchesList',
  component: RecentSearchesList,
  tags: ['autodocs'],
  decorators: [
    () => ({
      template: '<div style="max-width: 400px; margin: 2rem auto; padding: 1rem;"><story/></div>',
      setup() {
        return {};
      }
    })
  ],
} satisfies Meta<typeof RecentSearchesList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Empty state
export const Empty: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const store = useStationStore();
    store.$patch({
      recentSearches: []
    });
  }
};

// 5 Recent Searches
export const FiveSearches: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const store = useStationStore();
    store.$patch({
      recentSearches: [
        {
          timestamp: createTimestamp(5),
          station: { stationName: 'LONDON BRIDGE', stationCode: 'LBG' }
        },
        {
          timestamp: createTimestamp(15),
          station: { stationName: 'VICTORIA', stationCode: 'VIC' }
        },
        {
          timestamp: createTimestamp(45),
          station: { stationName: 'PADDINGTON', stationCode: 'PAD' }
        },
        {
          timestamp: createTimestamp(120), // 2 hours ago
          station: { stationName: 'LIVERPOOL STREET', stationCode: 'LST' }
        },
        {
          timestamp: createTimestamp(1440), // 1 day ago
          station: { stationName: 'WATERLOO', stationCode: 'WAT' }
        }
      ]
    });
  }
};

// 10 Recent Searches (Maximum)
export const TenSearches: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const store = useStationStore();
    store.$patch({
      recentSearches: [
        {
          timestamp: createTimestamp(2),
          station: { stationName: 'LONDON BRIDGE', stationCode: 'LBG' }
        },
        {
          timestamp: createTimestamp(10),
          station: { stationName: 'VICTORIA', stationCode: 'VIC' }
        },
        {
          timestamp: createTimestamp(30),
          station: { stationName: 'PADDINGTON', stationCode: 'PAD' }
        },
        {
          timestamp: createTimestamp(60),
          station: { stationName: 'LIVERPOOL STREET', stationCode: 'LST' }
        },
        {
          timestamp: createTimestamp(120),
          station: { stationName: 'WATERLOO', stationCode: 'WAT' }
        },
        {
          timestamp: createTimestamp(240),
          station: { stationName: 'KINGS CROSS', stationCode: 'KGX' }
        },
        {
          timestamp: createTimestamp(480),
          station: { stationName: 'EUSTON', stationCode: 'EUS' }
        },
        {
          timestamp: createTimestamp(1440), // 1 day ago
          station: { stationName: 'ST PANCRAS', stationCode: 'STP' }
        },
        {
          timestamp: createTimestamp(2880), // 2 days ago
          station: { stationName: 'CHARING CROSS', stationCode: 'CHX' }
        },
        {
          timestamp: createTimestamp(10080), // 1 week ago
          station: { stationName: 'CANNON STREET', stationCode: 'CST' }
        }
      ]
    });
  }
};
