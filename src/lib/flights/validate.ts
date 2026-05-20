import type { FlightSearchQuery } from "./types";

/**
 * Normalises and validates incoming search query params.
 *
 * Accepts flight numbers like "AC838", "ac 838", "AC-838", "CX 838".
 * Strips internal whitespace and dashes; uppercases the carrier code.
 * The IATA-style format is two or three letters/digits followed by
 * 1–4 digits — e.g. WS 456, AC 838, 9W 123.
 *
 * Returns the normalised query or a structured validation error so
 * the route handler can respond with a single 400 path.
 */
export type ValidateResult =
  | { ok: true; query: FlightSearchQuery }
  | { ok: false; message: string };

const FLIGHT_NUMBER_PATTERN = /^[A-Z0-9]{2,3}\d{1,4}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const AIRPORT_PATTERN = /^[A-Z]{3}$/;

export function validateFlightSearchQuery(
  raw: URLSearchParams,
): ValidateResult {
  const rawFlightNumber = raw.get("flightNumber");
  if (rawFlightNumber == null || rawFlightNumber.trim() === "") {
    return {
      ok: false,
      message: "Enter a flight number like AC838 or CX838.",
    };
  }
  const flightNumber = rawFlightNumber
    .toUpperCase()
    .replace(/[\s-]+/g, "");
  if (!FLIGHT_NUMBER_PATTERN.test(flightNumber)) {
    return {
      ok: false,
      message: "Flight number must look like AC838 or CX838.",
    };
  }

  const rawDate = raw.get("date");
  let date: string | undefined;
  if (rawDate != null && rawDate.trim() !== "") {
    if (!DATE_PATTERN.test(rawDate)) {
      return {
        ok: false,
        message: "Date must be in YYYY-MM-DD format.",
      };
    }
    date = rawDate;
  }

  const rawAirport = raw.get("airport");
  let airport: string | undefined;
  if (rawAirport != null && rawAirport.trim() !== "") {
    const upper = rawAirport.toUpperCase();
    if (!AIRPORT_PATTERN.test(upper)) {
      return {
        ok: false,
        message: "Airport must be a three-letter IATA code (e.g. YVR).",
      };
    }
    airport = upper;
  }

  return {
    ok: true,
    query: { flightNumber, date, airport },
  };
}
