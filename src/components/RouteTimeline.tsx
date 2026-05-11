import { PlaneIcon } from "./icons";

type Endpoint = {
  /** Three-letter IATA code. Rendered uppercase. */
  code: string;
  /** City name beneath the code. */
  city: string;
  /** Local time at this endpoint, e.g. "14:35". */
  time: string;
  /**
   * Optional offset suffix beside the time, e.g. "+1" for next-day arrival.
   * Rendered in muted secondary type so the time stays the anchor.
   */
  offset?: string;
};

type RouteTimelineProps = {
  origin: Endpoint;
  destination: Endpoint;
  /**
   * Centre-line label — duration + stop pattern, e.g. "10h 45 · Nonstop"
   * or "12h 10 · 1 stop".
   */
  duration?: string;
  className?: string;
};

/**
 * Split flight-route timeline — left endpoint, centre dashed line with a
 * plane glyph and duration, right endpoint. Used inside trip / next-trip
 * cards where a single-line `<AirportCodePair>` would not carry enough
 * information.
 *
 * Both codes render via `text-title tabular-nums uppercase` so they align
 * with `<AirportCodePair>` and `<GateDisplay>` typography. The centre
 * line is decorative; the codes are read out as
 * "<origin code> to <destination code>" via `aria-label`.
 *
 * Numeric values use `tabular-nums` so the time/code columns don't shift
 * when underlying data changes (14:35 → 15:20).
 */
export function RouteTimeline({
  origin,
  destination,
  duration,
  className = "",
}: RouteTimelineProps) {
  return (
    <div
      aria-label={`${origin.code} to ${destination.code}`}
      className={`flex w-full items-start gap-4 ${className}`.trim()}
    >
      <Endpoint endpoint={origin} align="left" />
      <div className="mt-1 flex flex-1 flex-col items-center gap-2 pt-2">
        <div className="flex w-full items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-text-primary)]"
          />
          <span
            aria-hidden
            className="h-px flex-1 border-t border-dashed border-[var(--color-text-muted)]"
          />
          <span aria-hidden className="text-[var(--color-text-primary)]">
            <PlaneIcon size={14} />
          </span>
          <span
            aria-hidden
            className="h-px flex-1 border-t border-dashed border-[var(--color-text-muted)]"
          />
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-text-primary)]"
          />
        </div>
        {duration ? (
          <span className="text-label tabular-nums text-[var(--color-text-secondary)]">
            {duration}
          </span>
        ) : null}
      </div>
      <Endpoint endpoint={destination} align="right" />
    </div>
  );
}

function Endpoint({
  endpoint,
  align,
}: {
  endpoint: Endpoint;
  align: "left" | "right";
}) {
  const alignClass = align === "left" ? "items-start text-left" : "items-end text-right";
  return (
    <div className={`flex shrink-0 flex-col gap-1 ${alignClass}`}>
      <span className="text-title tabular-nums uppercase text-[var(--color-text-primary)]">
        {endpoint.code}
      </span>
      <span className="text-label text-[var(--color-text-secondary)]">
        {endpoint.city}
      </span>
      <span className="text-body-sm tabular-nums text-[var(--color-text-primary)]">
        {endpoint.time}
        {endpoint.offset ? (
          <span className="text-[var(--color-text-secondary)]"> {endpoint.offset}</span>
        ) : null}
      </span>
    </div>
  );
}
