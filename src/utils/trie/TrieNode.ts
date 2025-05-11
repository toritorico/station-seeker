export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  stationCodes: string[];

  constructor() {
    this.children = new Map<string, TrieNode>();
    this.isEndOfWord = false;
    this.stationCodes = [];
  }
}
``