import "server-only";
import { AviationstackAdapter } from "./aviationstack";
import type { FlightProviderAdapter } from "./adapter";

export type { FlightProviderAdapter } from "./adapter";
export { FlightProviderError } from "./adapter";

/**
 * Resolve the active provider adapter from environment configuration.
 *
 * Returns `null` when no provider is configured — the API route then
 * responds with a 503 "service not configured" so the UI can show
 * honest "live flight search is not connected yet" copy.
 *
 * Env vars:
 *   FLIGHT_DATA_PROVIDER  e.g. "aviationstack"
 *   FLIGHT_DATA_API_KEY   provider-issued key (server-only)
 *
 * Adding a provider:
 *   1. Implement `FlightProviderAdapter` in a sibling file.
 *   2. Add a case below.
 *   3. Document the new value of `FLIGHT_DATA_PROVIDER` in
 *      `.env.example`.
 */
export function resolveFlightProvider(): FlightProviderAdapter | null {
  const provider = process.env.FLIGHT_DATA_PROVIDER?.trim().toLowerCase();
  const apiKey = process.env.FLIGHT_DATA_API_KEY?.trim();

  if (!provider || !apiKey) return null;

  switch (provider) {
    case "aviationstack":
      return new AviationstackAdapter(apiKey);
    default:
      return null;
  }
}
