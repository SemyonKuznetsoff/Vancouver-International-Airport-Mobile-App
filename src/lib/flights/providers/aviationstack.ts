import "server-only";
import type {
  FlightSearchQuery,
  YvrFlightDirection,
  YvrFlightSearchResult,
  YvrFlightStatus,
} from "../types";
import {
  FlightProviderError,
  type FlightProviderAdapter,
} from "./adapter";

/**
 * Aviationstack adapter.
 *
 * Selected when `FLIGHT_DATA_PROVIDER=aviationstack` and a key is set
 * in `FLIGHT_DATA_API_KEY`. The key is read once at construction time
 * and is **never** sent to the browser — this module is marked
 * `server-only` and the API route returns only normalised results.
 *
 * Endpoint: `GET https://api.aviationstack.com/v1/flights`
 * Docs:    https://aviationstack.com/documentation
 *
 * Note: the free Aviationstack plan only supports HTTP, not HTTPS.
 * That's an acceptable provider quirk because the call lives behind
 * our own `/api/flights/search` route — the browser → Vercel hop is
 * HTTPS, and the Vercel → provider hop happens server-side. Upgrade
 * the URL to HTTPS in production where the paid plan allows it.
 */
export class AviationstackAdapter implements FlightProviderAdapter {
  readonly id = "aviationstack";
  private readonly apiKey: string;
  private readonly endpoint: string;

  constructor(apiKey: string, endpoint?: string) {
    this.apiKey = apiKey;
    this.endpoint =
      endpoint ?? "https://api.aviationstack.com/v1/flights";
  }

  async search(
    query: FlightSearchQuery,
  ): Promise<YvrFlightSearchResult[]> {
    const url = this.buildUrl(query);
    let res: Response;
    try {
      res = await fetch(url, {
        // Flight data changes minute-to-minute. Cache for a brief
        // window on the edge to absorb retries without serving stale
        // status info.
        next: { revalidate: 30 },
      });
    } catch {
      throw new FlightProviderError(
        "upstream_error",
        "Could not reach flight data service.",
      );
    }

    if (res.status === 429) {
      throw new FlightProviderError(
        "rate_limited",
        "Flight data service is rate-limiting requests. Try again shortly.",
      );
    }
    if (!res.ok) {
      throw new FlightProviderError(
        "upstream_error",
        "Flight data service returned an error.",
      );
    }

    let payload: AviationstackPayload;
    try {
      payload = (await res.json()) as AviationstackPayload;
    } catch {
      throw new FlightProviderError(
        "upstream_error",
        "Flight data service returned an unreadable response.",
      );
    }

    const rows = Array.isArray(payload.data) ? payload.data : [];
    const updatedAt = new Date().toISOString();
    return rows
      .map((row) => this.normalise(row, updatedAt))
      .filter((row): row is YvrFlightSearchResult => row !== null);
  }

  private buildUrl(query: FlightSearchQuery): string {
    const params = new URLSearchParams({
      access_key: this.apiKey,
      flight_iata: query.flightNumber,
    });
    if (query.date) params.set("flight_date", query.date);
    if (query.airport) {
      // Aviationstack matches against either departure or arrival
      // IATA. Pass it under `dep_iata` when the airport is YVR
      // (most common case for this app); otherwise the caller
      // narrowed in another way.
      params.set("dep_iata", query.airport);
    }
    return `${this.endpoint}?${params.toString()}`;
  }

  private normalise(
    row: AviationstackFlight,
    updatedAt: string,
  ): YvrFlightSearchResult | null {
    const flightNumber = row.flight?.iata?.toUpperCase().replace(/\s+/g, "");
    if (!flightNumber) return null;

    const origin = row.departure?.iata?.toUpperCase();
    const destination = row.arrival?.iata?.toUpperCase();

    const direction = inferDirection(origin, destination);

    return {
      id: synthId(flightNumber, row.flight_date),
      flightNumber,
      airlineName: row.airline?.name ?? "",
      status: mapStatus(row.flight_status),
      direction,
      origin,
      destination,
      scheduledTime: row.departure?.scheduled ?? undefined,
      estimatedTime:
        row.departure?.estimated ?? row.arrival?.estimated ?? undefined,
      actualTime:
        row.departure?.actual ?? row.arrival?.actual ?? undefined,
      gate: row.departure?.gate ?? row.arrival?.gate ?? undefined,
      terminal:
        row.departure?.terminal ?? row.arrival?.terminal ?? undefined,
      carousel: row.arrival?.baggage ?? undefined,
      source: "aviationstack",
      updatedAt,
    };
  }
}

function synthId(flightNumber: string, date: string | undefined): string {
  return date ? `${flightNumber}-${date}` : flightNumber;
}

function inferDirection(
  origin: string | undefined,
  destination: string | undefined,
): YvrFlightDirection {
  if (origin === "YVR") return "departure";
  if (destination === "YVR") return "arrival";
  return "unknown";
}

const STATUS_MAP: Record<string, YvrFlightStatus> = {
  scheduled: "scheduled",
  active: "departed",
  landed: "arrived",
  cancelled: "cancelled",
  incident: "delayed",
  diverted: "delayed",
};

function mapStatus(raw: string | undefined): YvrFlightStatus {
  if (!raw) return "unknown";
  return STATUS_MAP[raw.toLowerCase()] ?? "unknown";
}

// Provider-shape contract — narrow subset of the Aviationstack
// response we actually consume. Kept intentionally permissive so the
// normaliser tolerates fields disappearing in a future plan tier.
type AviationstackPayload = {
  data?: AviationstackFlight[];
};

type AviationstackFlight = {
  flight_date?: string;
  flight_status?: string;
  airline?: { name?: string };
  flight?: { iata?: string; number?: string };
  departure?: {
    iata?: string;
    scheduled?: string;
    estimated?: string;
    actual?: string;
    gate?: string;
    terminal?: string;
  };
  arrival?: {
    iata?: string;
    scheduled?: string;
    estimated?: string;
    actual?: string;
    gate?: string;
    terminal?: string;
    baggage?: string;
  };
};
