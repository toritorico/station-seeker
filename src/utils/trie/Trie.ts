import { TrieNode } from './TrieNode';
import type {Station} from "../../types/station.ts";

export class Trie {
  private root: TrieNode;
  private stations: Map<string, Station>;

  constructor() {
    this.root = new TrieNode();
    this.stations = new Map<string, Station>();
  }

  /**
   * Inserts a station into the trie
   * @param station The station to insert
   */
  insert(station: Station): void {
    const stationName = station.stationName.toUpperCase();
    let current = this.root;

    for (const char of stationName) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }

    current.isEndOfWord = true;
    current.stationCodes.push(station.stationCode);
    this.stations.set(station.stationCode, station);
  }

  /**
   * Builds the trie from a list of stations
   * @param stations The list of stations to build the trie from
   */
  buildFromStations(stations: Station[]): void {
    this.root = new TrieNode();
    this.stations.clear();

    for (const station of stations) {
      this.insert(station);
    }
  }

  /**
   * Searches for stations with the given prefix
   * @param prefix The prefix to search for
   * @returns An object containing matching stations and next possible characters
   */
  search(prefix: string): { matchingStations: Station[], nextCharacters: string[] } {
    prefix = prefix.toUpperCase();
    let current = this.root;

    // Navigate to the node representing the prefix
    for (const char of prefix) {
      if (!current.children.has(char)) {
        return { matchingStations: [], nextCharacters: [] };
      }
      current = current.children.get(char)!;
    }

    // Find all stations with this prefix
    const stationCodes = this.collectStationCodes(current, prefix);
    const matchingStations = stationCodes.map(code => this.stations.get(code)!);

    // Find all valid next characters
    const nextCharacters = Array.from(current.children.keys());

    return { matchingStations, nextCharacters };
  }

  /**
   * Collects all station codes in the subtree rooted at the given node
   * @param node The starting node
   * @param prefix The prefix that led to this node
   * @returns Array of station codes
   */
  private collectStationCodes(node: TrieNode, prefix: string): string[] {
    const stationCodes: string[] = [...node.stationCodes];

    // Recursively collect station codes from all child nodes
    for (const [char, childNode] of node.children.entries()) {
      const childStationCodes = this.collectStationCodes(childNode, prefix + char);
      stationCodes.push(...childStationCodes);
    }

    return stationCodes;
  }
}
