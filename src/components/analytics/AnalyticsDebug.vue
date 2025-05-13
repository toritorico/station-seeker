<template>
  <div class="analytics-debug" :class="{ 'is-expanded': isExpanded }">
    <button class="toggle-button" @click="toggleExpanded">
      {{ isExpanded ? 'Hide Analytics' : 'Show Analytics' }}
    </button>
    
    <div v-if="isExpanded" class="debug-content">
      <div class="header">
        <h3>Analytics Events ({{ events.length }})</h3>
        <button class="clear-button" @click="clearEvents">Clear Events</button>
      </div>
      
      <div class="events-container">
        <div v-for="(event, index) in events" :key="index" class="event-card">
          <div class="event-header">
            <span class="event-name">{{ event.eventName }}</span>
            <span class="event-time">{{ formatTime(event.timestamp) }}</span>
          </div>
          <pre class="event-params" v-if="event.parameters">{{ JSON.stringify(event.parameters, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { SimpleAnalytics } from '../../services/analytics';

export default defineComponent({
  name: 'AnalyticsDebug',
  setup() {
    const isExpanded = ref(false);
    const events = ref<any[]>([]);

    const toggleExpanded = () => {
      isExpanded.value = !isExpanded.value;
      if (isExpanded.value) {
        refreshEvents();
      }
    };

    const refreshEvents = () => {
      events.value = SimpleAnalytics.loadEvents();
    };

    const clearEvents = () => {
      SimpleAnalytics.clearEvents();
      events.value = [];
    };

    const formatTime = (timestamp: number) => {
      return new Date(timestamp).toLocaleTimeString();
    };

    // Create a wrapper for trackEvent that updates the UI
    const originalTrackEvent = SimpleAnalytics.trackEvent.bind(SimpleAnalytics);
    SimpleAnalytics.trackEvent = function(eventName: string, parameters?: Record<string, any>) {
      originalTrackEvent(eventName, parameters);
      if (isExpanded.value) {
        refreshEvents();
      }
    }.bind(SimpleAnalytics);

    onMounted(() => {
      refreshEvents();
    });

    return {
      isExpanded,
      events,
      toggleExpanded,
      clearEvents,
      formatTime,
    };
  },
});
</script>

<style scoped>
.analytics-debug {
  position: fixed;
  bottom: 0;
  right: 20px;
  width: 400px;
  background: var(--white);
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.toggle-button {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-weight: 500;
}

.toggle-button:hover {
  background: var(--primary-dark);
}

.debug-content {
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
  background: var(--white);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h3 {
  margin: 0;
  color: var(--gray-800);
}

.clear-button {
  padding: 6px 12px;
  background: var(--gray-200);
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.clear-button:hover {
  background: var(--gray-300);
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-card {
  padding: 12px;
  background: var(--gray-100);
  border: 1px solid var(--gray-300);
  border-radius: 6px;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.event-name {
  font-weight: 500;
  color: var(--primary);
}

.event-time {
  font-size: 0.85rem;
  color: var(--gray-600);
}

.event-params {
  margin: 0;
  padding: 8px;
  background: var(--gray-50);
  border-radius: 4px;
  font-size: 0.9rem;
  white-space: pre-wrap;
}
</style>
