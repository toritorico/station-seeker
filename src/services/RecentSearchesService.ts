import type {RecentSearch} from "../types/recent-search.ts";

const RECENT_SEARCHES_KEY = 'train-ticket-recent-searches';
const MAX_RECENT_SEARCHES = 10;

export class RecentSearchesService {
  /**
   * Adds a search to the recent searches list
   * @param search The search to add
   */
  addSearch(search: RecentSearch): void {
    try {
      const searches = this.getSearches();

      // Remove any existing search with the same station name
      const filteredSearches = searches.filter(s => s.station !== search.station);

      // Add the new search to the beginning
      filteredSearches.unshift(search);

      // Keep only the most recent MAX_RECENT_SEARCHES
      const trimmedSearches = filteredSearches.slice(0, MAX_RECENT_SEARCHES);

      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(trimmedSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }

  /**
   * Gets all recent searches
   * @returns Array of recent searches
   */
  getSearches(): RecentSearch[] {
    try {
      const searchesJson = localStorage.getItem(RECENT_SEARCHES_KEY);
      return searchesJson ? JSON.parse(searchesJson) : [];
    } catch (error) {
      console.error('Error retrieving recent searches:', error);
      return [];
    }
  }

  /**
   * Clears all recent searches
   */
  clearSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }
}
