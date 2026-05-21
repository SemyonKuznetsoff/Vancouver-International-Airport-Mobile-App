"use client";

import { HeroSurface } from "./HeroSurface";
import { PassDecorBackground } from "./PassDecorBackground";
import { PassPerforation } from "./PassPerforation";
import { StatusPill } from "./StatusPill";
import {
  PlaneIcon,
  ScanIcon,
  SearchIcon,
  SparkleIcon,
  SpinnerIcon,
} from "./icons";

/**
 * YVR Live Tracker pass — the dark Spruce HeroSurface card that
 * fronts the Add Flight experience. Currently consumed by:
 *  - `/flights/search` — runs the live flight-number search in-place.
 *  - `/flights` (empty state) — navigates the user into
 *    `/flights/search?flightNumber=…&autoSearch=1` so the same search
 *    logic runs there, without duplicating fetch/save plumbing.
 *
 * The component is presentational + controlled-input only. Validation,
 * normalisation, navigation, and submission all live with the parent.
 * Pair with `<HeroSurface>` rules (§15b "Official airport document
 * surface") — this is a YVR-signed live-tracker document.
 */
export type LiveTrackerProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  /**
   * Context label shown in the top-left pill. Defaults to
   * `"Live tracker"` — matches the active flight-finder framing on
   * `/flights/search`. The `/flights` empty state overrides this with
   * `"Add a flight"` so the surface reads as an entry point rather
   * than claiming a tracking session is already live.
   */
  pillLabel?: string;
  /**
   * One-line body under the identity eyebrow. Defaults to the
   * `/flights/search` copy. Override for first-use surfaces where the
   * helper sentence should explain *why* a user adds a flight.
   */
  description?: string;
};

type SecondaryAction = {
  id: string;
  title: string;
  helper: string;
  icon: React.ReactNode;
  ariaLabel: string;
};

const TRACKER_STATUS_LABEL = "YVR · 02";
const FOOTER_LEFT_LABEL = "YVR Live Ops";
const FOOTER_RIGHT_LABEL = "Concierge";

export const FLIGHT_SEARCH_PLACEHOLDER = "Flight number · e.g. AC 838";

const SECONDARY_ACTIONS: SecondaryAction[] = [
  {
    id: "scan-pass",
    title: "Scan Pass",
    helper: "Soon",
    icon: <ScanIcon size={16} />,
    ariaLabel: "Scan boarding pass to auto-add a flight",
  },
  {
    id: "track-arrival",
    title: "Track Arrival",
    helper: "Soon",
    icon: <PlaneIcon size={16} />,
    ariaLabel: "Track an arriving flight for pickup",
  },
];

export function LiveTrackerPass({
  pillLabel = "Live tracker",
  description = "Fastest way to get real-time updates.",
  ...inputProps
}: LiveTrackerProps) {
  return (
    <HeroSurface
      as="section"
      aria-label={`${pillLabel} — track a flight for real-time updates`}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-5 p-5">
        <LiveTrackerHeader pillLabel={pillLabel} />
        <LiveTrackerIdentity description={description} />
        <FlightNumberSearch {...inputProps} />
        <SecondaryActionRow actions={SECONDARY_ACTIONS} />

        <PassPerforation inset="-mx-5" />

        <LiveTrackerFooter />
      </div>
    </HeroSurface>
  );
}

function LiveTrackerHeader({ pillLabel }: { pillLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <StatusPill tone="success" surface="hero" leadingDot size="sm">
        {pillLabel}
      </StatusPill>
      <span className="text-micro uppercase tabular-nums text-[var(--color-surface-hero-fg-soft)]">
        {TRACKER_STATUS_LABEL}
      </span>
    </div>
  );
}

function LiveTrackerIdentity({ description }: { description: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
        Track a flight
      </span>
      <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        {description}
      </p>
    </div>
  );
}

function FlightNumberSearch({
  value,
  onChange,
  onSubmit,
  submitting,
}: LiveTrackerProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2.5 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] py-2 pl-3.5 pr-2 transition-colors duration-150 focus-within:border-[var(--color-map-mint-soft)]"
    >
      <label htmlFor="flight-number-input" className="sr-only">
        Flight number
      </label>
      <span
        aria-hidden
        className="inline-flex shrink-0 text-[var(--color-map-mint)]"
      >
        <PlaneIcon size={14} />
      </span>
      <input
        id="flight-number-input"
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={FLIGHT_SEARCH_PLACEHOLDER}
        className="h-11 min-w-0 flex-1 bg-transparent text-body-sm tabular-nums text-[var(--color-surface-hero-fg)] placeholder:text-[var(--color-surface-hero-fg-soft)] focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search flight number"
        aria-busy={submitting || undefined}
        disabled={submitting}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button)] transition-opacity duration-150 hover:opacity-90 disabled:opacity-[var(--opacity-disabled)] disabled:cursor-progress"
      >
        {submitting ? (
          <SpinnerIcon size={14} aria-hidden />
        ) : (
          <SearchIcon size={14} aria-hidden />
        )}
      </button>
    </form>
  );
}

function SecondaryActionRow({ actions }: { actions: SecondaryAction[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {actions.map((a) => (
        <SecondaryActionTile key={a.id} action={a} />
      ))}
    </div>
  );
}

function SecondaryActionTile({ action }: { action: SecondaryAction }) {
  return (
    <button
      type="button"
      aria-label={`${action.ariaLabel} — coming soon`}
      aria-disabled
      disabled
      className="flex items-center gap-3 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-3.5 py-3.5 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hero-chip)] disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]"
    >
      <span
        aria-hidden
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
      >
        {action.icon}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
          {action.title}
        </span>
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
          {action.helper}
        </span>
      </span>
    </button>
  );
}

function LiveTrackerFooter() {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
        />
        {FOOTER_LEFT_LABEL}
      </span>
      <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
        <SparkleIcon size={11} aria-hidden />
        {FOOTER_RIGHT_LABEL}
      </span>
    </div>
  );
}
