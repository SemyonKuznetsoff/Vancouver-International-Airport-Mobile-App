import "server-only";
import type { FlightSearchQuery, YvrFlightSearchResult } from "../types";

/**
 * Contract every flight-data provider must honour. Adapters live in
 * sibling files (e.g. `./aviationstack.ts`) and are selected at
 * request time by `./index.ts` based on the `FLIGHT_DATA_PROVIDER`
 * environment variable.
 *
 * Adapters MUST:
 * - run server-side only (we mark this module `server-only` so any
 *   accidental client import fails the build),
 * - never throw raw provider payloads back to the caller — return
 *   normalised `YvrFlightSearchResult`s,
 * - throw `FlightProviderError` on upstream failure so the route
 *   handler can map it to a single 502 path.
 */
export type FlightProviderAdapter = {
  /** Stable provider id, e.g. "aviationstack". Goes into `result.source`. */
  readonly id: string;
  search(query: FlightSearchQuery): Promise<YvrFlightSearchResult[]>;
};

export type FlightProviderErrorKind = "upstream_error" | "rate_limited";

export class FlightProviderError extends Error {
  readonly kind: FlightProviderErrorKind;

  constructor(kind: FlightProviderErrorKind, message: string) {
    super(message);
    this.name = "FlightProviderError";
    this.kind = kind;
  }
}
