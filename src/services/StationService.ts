import type {Station} from "../types/station.ts";

const STATIONS_CACHE_KEY = 'train-ticket-stations';
const CACHE_TIMESTAMP_KEY = 'train-ticket-stations-timestamp';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24h

export class StationService {
  private readonly apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Fetches all stations from the API or cache
   * @param forceFresh Force a fresh fetch from the API
   * @returns Promise resolving to the array of stations
   */
  async getStations(forceFresh: boolean = false): Promise<Station[]> {
    // Check if we have a fresh cached data
    if (!forceFresh) {
      const cachedStations = this.getStationsFromCache();
      if (cachedStations) {
        console.log('Using cached stations data');
        return cachedStations;
      }
    }

    try {
      // Fetch fresh data from API
      console.log('Fetching stations from API');
      const response = await fetch(this.apiUrl);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const stations: Station[] = await response.json();

      // Update cache
      this.saveStationsToCache(stations);

      return stations;
    } catch (error) {
      console.error('Error fetching stations:', error);

      // Fall back to cache if it exists (even if it's expired)
      const cachedStations = this.getStationsFromCache(true);
      if (cachedStations) {
        console.log('API error, falling back to cached data');
        return cachedStations;
      }

      // Re-throw if we couldn't get data from cache either
      throw error;
    }
  }

  /**
   * Gets stations from localStorage cache
   * @param ignoreExpiry Whether to ignore cache expiry
   * @returns Array of stations or null if cache is missing or expired
   */
  private getStationsFromCache(ignoreExpiry = false): Station[] | null {
    try {
      const cachedData = localStorage.getItem(STATIONS_CACHE_KEY);
      const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (!cachedData || !timestampStr) {
        return null;
      }

      // Check if cache is expired
      if (!ignoreExpiry) {
        const timestamp = parseInt(timestampStr, 10);
        const now = Date.now();

        if (now - timestamp > CACHE_EXPIRY_TIME) {
          console.log('Cache is expired');
          return null;
        }
      }

      return JSON.parse(cachedData);
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Saves stations to localStorage cache
   * @param stations The stations to cache
   */
  private saveStationsToCache(stations: Station[]): void {
    try {
      localStorage.setItem(STATIONS_CACHE_KEY, JSON.stringify(stations));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }
}
