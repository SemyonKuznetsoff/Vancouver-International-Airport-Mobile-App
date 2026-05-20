"use client";

import type { YvrFlightSearchResult } from "@/lib/flights/types";

/**
 * Local-only saved-flights utility.
 *
 * Persists the user's selected flight results to `localStorage` so
 * they survive a reload. There is no backend sync and no auth — these
 * records live entirely on this device.
 *
 * Dedupe rule: a flight is the same if it shares `id` with an
 * existing entry, OR if it shares the combination of `flightNumber`
 * and the date portion of `scheduledTime` (so the same flight on the
 * same day cannot be saved twice even if the provider issues two
 * different ids).
 */

const STORAGE_KEY = "yvr.savedFlights";

export type SavedFlight = YvrFlightSearchResult & {
  /** When the user saved this flight (ISO 8601). */
  savedAt: string;
};

function dayOf(iso: string | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

function readStorage(): SavedFlight[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as SavedFlight[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(next: SavedFlight[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage disabled / quota exceeded — silently no-op so the UI
    // continues to navigate.
  }
}

export function loadSavedFlights(): SavedFlight[] {
  return readStorage();
}

export function saveFlight(result: YvrFlightSearchResult): SavedFlight[] {
  const existing = readStorage();
  const resultDay = dayOf(result.scheduledTime);
  const isDuplicate = (e: SavedFlight) =>
    e.id === result.id ||
    (e.flightNumber === result.flightNumber &&
      dayOf(e.scheduledTime) === resultDay &&
      resultDay !== "");
  if (existing.some(isDuplicate)) {
    return existing;
  }
  const next: SavedFlight[] = [
    { ...result, savedAt: new Date().toISOString() },
    ...existing,
  ];
  writeStorage(next);
  return next;
}

export function removeSavedFlight(id: string): SavedFlight[] {
  const existing = readStorage();
  const next = existing.filter((e) => e.id !== id);
  if (next.length === existing.length) return existing;
  writeStorage(next);
  return next;
}

export function isFlightSaved(result: YvrFlightSearchResult): boolean {
  const existing = readStorage();
  const resultDay = dayOf(result.scheduledTime);
  return existing.some(
    (e) =>
      e.id === result.id ||
      (e.flightNumber === result.flightNumber &&
        dayOf(e.scheduledTime) === resultDay &&
        resultDay !== ""),
  );
}
