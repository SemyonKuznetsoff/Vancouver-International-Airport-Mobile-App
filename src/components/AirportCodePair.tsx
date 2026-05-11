type AirportCodePairProps = {
  origin: string;
  destination: string;
  flightNumber?: string;
  subtitle?: string;
  className?: string;
};

/**
 * Airport-code pair — "YVR → SFO" rendering with a guaranteed U+2192 arrow
 * and a documented support line carrying optional flight number + subtitle
 * (city pair, route name). Codes render uppercase regardless of input case.
 *
 * Accessibility: the arrow is decorative (`aria-hidden`). The whole code
 * block carries `aria-label="<origin> to <destination>"` so screen readers
 * read "YVR to SFO" instead of "YVR right arrow SFO".
 *
 * Use for: flight headers, journey timelines, ticket cards, search
 * results. Always pass three-letter IATA codes — see
 * `docs/content-guide.md` §6 for the formatting rule.
 */
export function AirportCodePair({
  origin,
  destination,
  flightNumber,
  subtitle,
  className = "",
}: AirportCodePairProps) {
  const support = [flightNumber, subtitle].filter(Boolean).join(" · ");

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`.trim()}>
      <span
        aria-label={`${origin} to ${destination}`}
        className="text-title tabular-nums uppercase text-[var(--color-text-primary)]"
      >
        <span>{origin}</span>
        <span aria-hidden> → </span>
        <span>{destination}</span>
      </span>
      {support ? (
        <span className="text-label text-[var(--color-text-secondary)]">
          {support}
        </span>
      ) : null}
    </div>
  );
}
