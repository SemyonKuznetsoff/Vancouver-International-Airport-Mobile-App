/**
 * Normalised flight-search shapes used between the server API route
 * (`/api/flights/search`) and every client consumer (the Add Flight
 * search page, the saved-flights utility, etc.).
 *
 * Provider adapters live in `./providers/` and return values of this
 * shape — raw provider payloads never leave the server. The browser
 * only ever sees `YvrFlightSearchResult` and `FlightSearchResponse`.
 */

export type YvrFlightStatus =
  | "scheduled"
  | "boarding"
  | "departed"
  | "arrived"
  | "delayed"
  | "cancelled"
  | "unknown";

export type YvrFlightDirection = "arrival" | "departure" | "unknown";

export type YvrFlightSearchResult = {
  /** Stable per-result id. Provider id when available, else a deterministic synth. */
  id: string;
  /** Normalised, no-space carrier+number — e.g. `AC838`. */
  flightNumber: string;
  /** Human-readable carrier name (e.g. "Air Canada"). May be empty if upstream omits it. */
  airlineName: string;
  status: YvrFlightStatus;
  direction: YvrFlightDirection;
  /** IATA code if known. */
  origin?: string;
  /** IATA code if known. */
  destination?: string;
  /** ISO 8601, local-to-airport semantics preserved by the provider. */
  scheduledTime?: string;
  estimatedTime?: string;
  actualTime?: string;
  gate?: string;
  terminal?: string;
  carousel?: string;
  /** Provider id (e.g. "aviationstack") for diagnostics. */
  source: string;
  /** When the provider was last queried for this record (ISO 8601). */
  updatedAt: string;
};

export type FlightSearchQuery = {
  /** Normalised carrier+number, e.g. `AC838`. */
  flightNumber: string;
  /** YYYY-MM-DD. */
  date?: string;
  /** IATA airport filter. Defaults to YVR upstream. */
  airport?: string;
};

export type FlightSearchSuccess = {
  ok: true;
  data: YvrFlightSearchResult[];
  /** Provider id that served this response. */
  source: string;
  /** When this response was assembled (ISO 8601). */
  updatedAt: string;
};

export type FlightSearchErrorCode =
  | "invalid_query"
  | "unconfigured"
  | "upstream_error"
  | "rate_limited";

export type FlightSearchFailure = {
  ok: false;
  error: FlightSearchErrorCode;
  message: string;
};

export type FlightSearchResponse = FlightSearchSuccess | FlightSearchFailure;
