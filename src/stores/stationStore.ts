import { defineStore } from 'pinia';
import type {Station} from "../types/station.ts";
import {RecentSearchesService} from "../services/RecentSearchesService.ts";
import {StationService} from "../services/StationService.ts";
import type {RecentSearch} from "../types/recent-search.ts";
import type {SearchResult} from "../types/search-result.ts";
import {Trie} from "../utils/trie/Trie.ts";

const API_URL = import.meta.env.VITE_API_URL as string;

interface StationState {
  stations: Station[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  searchText: string;
  searchResults: SearchResult;
  selectedStation: Station | null;
  recentSearches: RecentSearch[];
  trie: Trie | null;
}

export const useStationStore = defineStore('station', {
  state: (): StationState => ({
    stations: [],
    isLoading: false,
    error: null,
    initialized: false,
    searchText: '',
    searchResults: { matchingStations: [], nextCharacters: [] },
    selectedStation: null,
    recentSearches: [],
    trie: null
  }),

  actions: {
    /**
     * Initialize the store and load data
     */
    async initialize() {
      if (this.initialized) return;

      this.isLoading = true;
      this.error = null;

      try {
        // Services
        const stationService = new StationService(API_URL);
        const recentSearchesService = new RecentSearchesService();

        // Load stations
        this.stations = await stationService.getStations();
        
        // Initialize the trie with the given stations
        this.initializeTrie();
        
        // Load recent searches
        this.recentSearches = recentSearchesService.getSearches();
        
        this.initialized = true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error initializing store:', error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Initializes the trie with current stations
     */
    initializeTrie() {
      const trie = new Trie();
      trie.buildFromStations(this.stations);
      this.trie = trie;
    },

    /**
     * Updates the search text and calls a search
     * @param text The search text
     */
    updateSearch(text: string) {
      this.searchText = text;
      this.performSearch();
    },

    /**
     * Performs a search with the current search text
     */
    performSearch() {
      if (!this.trie) {
        this.searchResults = { matchingStations: [], nextCharacters: [] };
        return;
      }

      this.searchResults = this.trie.search(this.searchText);
    },

    /**
     * Selects a station and adds it to recent searches
     * @param station The station to select
     */
    selectStation(station: Station) {
      this.selectedStation = station;
      
      // Add to recent searches
      const recentSearch: RecentSearch = {
        timestamp: Date.now(),
        station: station
      };
      
      const recentSearchesService = new RecentSearchesService();
      recentSearchesService.addSearch(recentSearch);
      
      // Update recent searches in state
      this.recentSearches = recentSearchesService.getSearches();
    },

    /**
     * Selects a recent search
     * @param search The recent search to select
     */
    selectRecentSearch(search: RecentSearch) {
      this.performSearch();
      
      if (search.station) {
        this.selectedStation = search.station;
      }
    },

    /**
     * Clears all recent searches
     */
    clearRecentSearches() {
      const recentSearchesService = new RecentSearchesService();
      recentSearchesService.clearSearches();
      this.recentSearches = [];
    },

    /**
     * Refreshes station data from the API
     */
    async refreshStations() {
      this.isLoading = true;
      this.error = null;

      try {
        const stationService = new StationService(API_URL);
        this.stations = await stationService.getStations(true);
        this.initializeTrie();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An unknown error occurred';
      } finally {
        this.isLoading = false;
      }
    }
  }
});
