"use client";

/**
 * Local-only recent-searches utility.
 *
 * Records each flight-number search the user submits so the Add Flight
 * screen can show their last few queries. Lives entirely on this
 * device — no backend.
 */

const STORAGE_KEY = "yvr.recentFlightSearches";
const MAX_ENTRIES = 10;

export type RecentFlightSearch = {
  /** Normalised query (e.g. "AC838") — also used for dedupe. */
  query: string;
  /** What the user actually typed (e.g. "ac 838"). Display-only. */
  rawQuery: string;
  /** Optional date filter at search time (YYYY-MM-DD). */
  date?: string;
  /** When this search was submitted (ISO 8601). */
  searchedAt: string;
  /** Number of results the API returned for this search. */
  resultCount: number;
};

function readStorage(): RecentFlightSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as RecentFlightSearch[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(next: RecentFlightSearch[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage disabled / quota exceeded — silently no-op.
  }
}

export function loadRecentSearches(): RecentFlightSearch[] {
  return readStorage();
}

/**
 * Push a search to the front of the recent list and dedupe by
 * normalised `query`. Returns the updated list (newest first, capped
 * at `MAX_ENTRIES`).
 */
export function recordSearch(
  entry: Omit<RecentFlightSearch, "searchedAt"> & {
    searchedAt?: string;
  },
): RecentFlightSearch[] {
  const stamped: RecentFlightSearch = {
    query: entry.query,
    rawQuery: entry.rawQuery,
    date: entry.date,
    resultCount: entry.resultCount,
    searchedAt: entry.searchedAt ?? new Date().toISOString(),
  };
  const existing = readStorage().filter((e) => e.query !== stamped.query);
  const next = [stamped, ...existing].slice(0, MAX_ENTRIES);
  writeStorage(next);
  return next;
}

export function clearRecentSearches(): void {
  writeStorage([]);
}
