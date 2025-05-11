import type {Station} from "./station.ts";

export interface SearchResult {
  matchingStations: Station[];
  nextCharacters: string[];
}
