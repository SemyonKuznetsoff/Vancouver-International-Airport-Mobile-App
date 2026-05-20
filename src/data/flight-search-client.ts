"use client";

import type {
  FlightSearchQuery,
  FlightSearchResponse,
} from "@/lib/flights/types";

/**
 * Calls our own `/api/flights/search` route. Never reaches a provider
 * directly — the route handler picks the adapter from env and shields
 * the client from API keys + raw provider payloads.
 *
 * On a network failure (no connection, DNS, abort) the response is
 * shaped as `{ ok: false, error: "upstream_error" }` so callers have
 * one error path to render.
 */
export async function searchFlights(
  query: FlightSearchQuery,
  signal?: AbortSignal,
): Promise<FlightSearchResponse> {
  const params = new URLSearchParams({ flightNumber: query.flightNumber });
  if (query.date) params.set("date", query.date);
  if (query.airport) params.set("airport", query.airport);

  let res: Response;
  try {
    res = await fetch(`/api/flights/search?${params.toString()}`, {
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    return {
      ok: false,
      error: "upstream_error",
      message: "Couldn't reach the flight data service. Try again.",
    };
  }

  try {
    return (await res.json()) as FlightSearchResponse;
  } catch {
    return {
      ok: false,
      error: "upstream_error",
      message: "Flight data service returned an unreadable response.",
    };
  }
}
