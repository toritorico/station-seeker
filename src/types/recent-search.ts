import type {Station} from "./station.ts";

export interface RecentSearch {
  timestamp: number;
  station: Station;
}
