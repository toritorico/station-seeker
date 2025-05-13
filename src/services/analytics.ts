interface AnalyticsEvent {
  eventName: string;
  timestamp: number;
  parameters?: Record<string, any>;
}

export class SimpleAnalytics {
  private static events: AnalyticsEvent[] = [];
  
  static trackEvent(eventName: string, parameters?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      eventName,
      timestamp: Date.now(),
      parameters
    };
    
    this.events.push(event);
    console.log('Analytics event:', event);
    this.persistEvents();
  }
  
  static persistEvents(): void {
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events));
    } catch (err) {
      console.warn('Failed to persist analytics events:', err);
    }
  }
  
  static loadEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Failed to load analytics events:', err);
    }
    return this.events;
  }
  
  static getEventsDebugHTML(): string {
    return `
      <div class="analytics-debug">
        <h3>Tracked Events (${this.events.length})</h3>
        <pre>${JSON.stringify(this.events, null, 2)}</pre>
      </div>
    `;
  }

  static clearEvents(): void {
    this.events = [];
    try {
      localStorage.removeItem('analytics_events');
    } catch (err) {
      console.warn('Failed to clear analytics events:', err);
    }
  }

  // Initialize events from localStorage when the module loads
  static {
    this.loadEvents();
  }
}
