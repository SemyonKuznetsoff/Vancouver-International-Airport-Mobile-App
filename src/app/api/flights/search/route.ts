import "server-only";
import { NextResponse } from "next/server";
import {
  FlightProviderError,
  resolveFlightProvider,
} from "@/lib/flights/providers";
import { validateFlightSearchQuery } from "@/lib/flights/validate";
import type { FlightSearchResponse } from "@/lib/flights/types";

/**
 * GET /api/flights/search?flightNumber=AC838&date=YYYY-MM-DD&airport=YVR
 *
 * Server-only flight-search route handler. The browser never speaks
 * to the upstream provider directly — it calls this route, which
 * picks an adapter from env, and returns a normalised
 * `FlightSearchResponse`. Raw provider payloads never leave the
 * server.
 *
 * Status codes:
 *   200 — success (zero or more results)
 *   400 — invalid query (returns `{ ok: false, error: "invalid_query" }`)
 *   502 — upstream error (provider unreachable or returned garbage)
 *   503 — provider not configured (returns `{ ok: false, error: "unconfigured" }`)
 *   429 — upstream rate-limited the caller
 */
export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const validation = validateFlightSearchQuery(url.searchParams);

  if (!validation.ok) {
    return json(
      {
        ok: false,
        error: "invalid_query",
        message: validation.message,
      },
      400,
    );
  }

  const provider = resolveFlightProvider();
  if (!provider) {
    return json(
      {
        ok: false,
        error: "unconfigured",
        message: "Flight data service is not configured.",
      },
      503,
    );
  }

  try {
    const data = await provider.search(validation.query);
    return json(
      {
        ok: true,
        data,
        source: provider.id,
        updatedAt: new Date().toISOString(),
      },
      200,
      {
        // Brief edge cache to absorb retries without serving stale
        // status info. Browsers won't cache (private) so a fresh
        // pull is one tap away.
        "Cache-Control":
          "private, max-age=15, stale-while-revalidate=30",
      },
    );
  } catch (err) {
    if (err instanceof FlightProviderError) {
      const status = err.kind === "rate_limited" ? 429 : 502;
      return json(
        { ok: false, error: err.kind, message: err.message },
        status,
      );
    }
    // Last-resort guard — never leak internals to the client.
    return json(
      {
        ok: false,
        error: "upstream_error",
        message: "Flight data service returned an error.",
      },
      502,
    );
  }
}

function json(
  body: FlightSearchResponse,
  status: number,
  headers: Record<string, string> = {},
): NextResponse {
  return NextResponse.json(body, { status, headers });
}
