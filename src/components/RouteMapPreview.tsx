import { NavigationIcon } from "./icons";

type RouteMapPreviewProps = {
  level: string;
  gate: string;
  /**
   * Route descriptor interpolated into the section's `aria-label`. The
   * three callers use distinct phrases so the announcement matches the
   * mode they're on:
   * - "step-free route"        (Accessible)
   * - "family-friendly route"  (Family)
   * - "direct route"           (Standard)
   */
  routeKind: string;
};

/**
 * Shared mini-map preview shown above the Start Navigation CTA on the
 * three route mode screens. Renders a stylized terminal-layout SVG
 * (Domestic / International / US) with a dashed route line to the
 * destination gate, a level chip, and a live tag. The SVG is decorative;
 * meaning is carried by the wrapping section's `aria-label`.
 *
 * Chrome (height, border, shadow, chip tones, route stroke) is preserved
 * byte-for-byte from the three page-local copies that preceded this.
 */
export function RouteMapPreview({ level, gate, routeKind }: RouteMapPreviewProps) {
  return (
    <section
      aria-label={`Mini map preview: ${level}, ${routeKind} from Domestic to International heading toward gate ${gate}, live tracking.`}
      className="relative overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-border-soft)] bg-[var(--color-surface-tile)] shadow-[var(--shadow-card)]"
      style={{ height: 196 }}
    >
      <div className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sheet)] px-2.5 py-1 text-micro uppercase text-[var(--color-text-primary)] shadow-[var(--shadow-card)]">
        <span aria-hidden className="inline-flex">
          <NavigationIcon size={11} />
        </span>
        {level}
      </div>

      <div className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-2.5 py-1 text-micro uppercase text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
        />
        Live
      </div>

      <MapPreviewArt gate={gate} />
    </section>
  );
}

function MapPreviewArt({ gate }: { gate: string }) {
  return (
    <span aria-hidden className="absolute inset-0">
      <svg
        viewBox="0 0 360 196"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <rect
          x="14"
          y="78"
          width="100"
          height="80"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <rect
          x="130"
          y="60"
          width="120"
          height="98"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <rect
          x="266"
          y="78"
          width="80"
          height="80"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />

        <text
          x="64"
          y="124"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-muted)"
        >
          DOMESTIC
        </text>
        <text
          x="190"
          y="116"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-secondary)"
        >
          INTERNATIONAL
        </text>
        <text
          x="306"
          y="124"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-muted)"
        >
          US
        </text>

        <circle
          cx="246"
          cy="108"
          r="22"
          fill="var(--color-action-teal)"
          opacity="0.10"
        />

        <path
          d="M 50 118 Q 100 118 130 110 Q 170 100 210 108 Q 232 110 246 108"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="6"
          opacity="0.16"
          strokeLinecap="round"
        />
        <path
          d="M 50 118 Q 100 118 130 110 Q 170 100 210 108 Q 232 110 246 108"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />

        <circle cx="246" cy="108" r="5" fill="var(--color-action-teal)" />

        <text
          x="246"
          y="148"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-action-teal)"
        >
          GATE {gate}
        </text>
      </svg>

      <span
        className="absolute inline-flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-action-teal)] ring-4 ring-[var(--color-action-teal-soft)]"
        style={{ left: "14%", top: "60%" }}
      />
    </span>
  );
}
