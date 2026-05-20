const VANCOUVER_TIME_ZONE = "America/Vancouver";

/**
 * Format a Date as the YVR app's signature top-level date label using
 * the `America/Vancouver` IANA zone so the value tracks PST/PDT
 * automatically (no hardcoded offset). Output shape:
 *
 *   "Saturday · May 9"
 *
 * Pair with `.toUpperCase()` when the surrounding row uses the
 * eyebrow/uppercase rhythm (e.g. the My Flights header).
 */
export function formatVancouverDateLabel(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: VANCOUVER_TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).formatToParts(date);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";

  return `${weekday} · ${month} ${day}`;
}

/**
 * Accessible long-form variant for screen readers — "Tuesday, May 20".
 */
export function formatVancouverDateAccessible(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: VANCOUVER_TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}
