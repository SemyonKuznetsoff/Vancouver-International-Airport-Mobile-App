"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadSavedFlights, type SavedFlight } from "@/data/saved-flights";
import {
  loadRecentSearches,
  type RecentFlightSearch,
} from "@/data/recent-flight-searches";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { Heading } from "@/components/Heading";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { LiveTrackerPass } from "@/components/LiveTrackerPass";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import { VancouverDateLabel } from "@/components/VancouverDateLabel";
import {
  ChevronRightIcon,
  InfoIcon,
  PlaneIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/icons";
import type { YvrFlightStatus } from "@/lib/flights/types";

type RadarFlight = {
  id: string;
  variant: "scheduled" | "pickup";
  date?: string;
  time?: string;
  route: string;
  detail: string;
  meta?: string;
  metaLabel?: string;
  highlight?: string;
  /**
   * Destination route for the card's primary tap target. Pickup
   * cards route to the live arrival concierge at `/home/pickup-waiting`;
   * scheduled flight cards route to the flight detail screen. There is
   * no per-flight dynamic detail route in this app, so multiple radar
   * cards may share `/flights/detail` until real per-flight pages exist.
   */
  href: Route;
};

const RADAR_FLIGHTS: RadarFlight[] = [
  {
    id: "ws456",
    variant: "scheduled",
    date: "Tomorrow",
    time: "11:15",
    route: "YVR → YYC",
    detail: "WS 456 · Calgary",
    meta: "B4",
    metaLabel: "Gate",
    href: "/flights/detail" as Route,
  },
  {
    id: "cx838",
    variant: "pickup",
    route: "HKG → YVR",
    detail: "CX 838 · Arrives 09:22",
    highlight: "Pickup",
    meta: "4h 41m left",
    href: "/home/pickup-waiting" as Route,
  },
];

/**
 * `loadedFromStorage` gates the swap between the Add Flight mode
 * (server render + no saved flights) and the saved-flights view
 * (after `useEffect` reads `localStorage`). The server can't read
 * `localStorage` so it always paints Add Flight mode; once the client
 * resolves storage we either:
 *  - keep Add Flight mode if no saved flights exist, or
 *  - swap in the saved-flight cards (+ "also on your radar" preview)
 *    so the user's real data dominates the screen.
 *
 * Add Flight mode reuses the shared `<LiveTrackerPass>` (the same dark
 * Spruce search card used on `/flights/search`) and on submit
 * navigates to `/flights/search?flightNumber=…&autoSearch=1`. Live
 * search and save logic stay at `/flights/search` — this page never
 * calls the flight-data API or writes to storage directly.
 */
export default function MyFlightsPage() {
  const [savedFlights, setSavedFlights] = useState<SavedFlight[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentFlightSearch[]>(
    [],
  );
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  useEffect(() => {
    setSavedFlights(loadSavedFlights());
    setRecentSearches(loadRecentSearches());
    setLoadedFromStorage(true);
  }, []);

  const showSavedView = loadedFromStorage && savedFlights.length > 0;

  return (
    <AppShellAuthed activeHref="/flights">
      <div className="flex flex-1 flex-col gap-6 px-6 pt-2 pb-6">
        <FlightsHeader />
        {showSavedView ? (
          <>
            <SavedFlightsSection flights={savedFlights} />
            <OnYourRadarSection flights={RADAR_FLIGHTS} previewMode />
          </>
        ) : (
          <AddFlightModeView recentSearches={recentSearches} />
        )}
      </div>
    </AppShellAuthed>
  );
}

function FlightsHeader() {
  return (
    <header className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-2">
        <VancouverDateLabel className="text-eyebrow uppercase text-[var(--color-text-muted)]" />
        <Heading as="h1" size="display">
          My Flights
        </Heading>
      </div>
      <HeaderIconButton
        aria-label="Add flight"
        href={"/flights/search" as Route}
      >
        <PlusIcon size={18} />
      </HeaderIconButton>
    </header>
  );
}

function SavedFlightsSection({ flights }: { flights: SavedFlight[] }) {
  return (
    <section
      aria-labelledby="saved-flights-heading"
      className="flex flex-col gap-3"
    >
      <h2
        id="saved-flights-heading"
        className="text-eyebrow uppercase text-[var(--color-text-muted)]"
      >
        Saved flights
      </h2>
      <ul className="flex flex-col gap-3">
        {flights.map((f) => (
          <li key={f.id}>
            <SavedFlightHero flight={f} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Premium boarding-pass / ticket surface for a saved live flight.
 * Mirrors the prototype `<ActiveFlightCard>` chrome (HeroSurface +
 * PassDecorBackground + display-size route codes + segmented info
 * module + PassPerforation + footer trust line) but is driven
 * entirely by normalised `YvrFlightSearchResult` fields — no fake
 * passenger name, seat, boarding group, QR code, or aircraft type is
 * invented.
 *
 * The card is intentionally display-only: there is no per-saved-flight
 * detail route in the app yet, so adding a "View" / "Boarding pass"
 * CTA would lie about destination state. The Add (+) button in the
 * page header is the only entry into the flow, and it points at the
 * real `/flights/search` route.
 */
function SavedFlightHero({ flight }: { flight: SavedFlight }) {
  const statusTone = mapStatusToTone(flight.status);
  const statusLabel = mapStatusToLabel(flight.status);
  const carrier =
    flight.airlineName?.trim() || flight.flightNumber.slice(0, 2);
  const timeCell = describeTimeCell(flight);
  const gateCell = flight.gate
    ? { label: "Gate", value: flight.gate, highlight: true }
    : null;
  const cells: PassCell[] = [];
  if (timeCell) cells.push(timeCell);
  if (gateCell) cells.push(gateCell);

  const accessibleName = [
    `Saved flight ${flight.flightNumber}`,
    carrier,
    `${flight.origin ?? "origin TBD"} to ${flight.destination ?? "destination TBD"}`,
    statusLabel,
    timeCell ? `${timeCell.label} ${timeCell.value}` : null,
    flight.gate ? `gate ${flight.gate}` : null,
    `saved ${formatRelative(flight.savedAt)}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <HeroSurface
      as="article"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-5 p-6">
        <SavedPassDocumentBand origin={flight.origin} />
        <SavedPassIdentityRow
          carrier={carrier}
          flightNumber={flight.flightNumber}
          statusTone={statusTone}
          statusLabel={statusLabel}
        />
        <SavedPassRoute
          origin={flight.origin ?? "—"}
          destination={flight.destination ?? "—"}
        />
        {cells.length > 0 ? <SavedPassInfoModule cells={cells} /> : null}
        <PassPerforation />
        <SavedPassFooter
          carrier={carrier}
          flightNumber={flight.flightNumber}
          savedAt={flight.savedAt}
        />
      </div>
    </HeroSurface>
  );
}

type PassCell = { label: string; value: string; highlight?: boolean };

function SavedPassDocumentBand({ origin }: { origin?: string }) {
  // Slim top band that reads like the title row of a printed flight
  // document. Left chip says the snapshot is live data captured at
  // save-time (not a continuous tracker); right chip frames the
  // surface as the user's "saved flight" filed against YVR (or the
  // departure airport on the snapshot, if known).
  const airportContext = (origin ?? "YVR").toUpperCase();
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-map-mint)]"
        />
        Live snapshot
      </span>
      <span className="text-micro uppercase tabular-nums text-[var(--color-surface-hero-fg-soft)]">
        Saved flight · {airportContext}
      </span>
    </div>
  );
}

function SavedPassIdentityRow({
  carrier,
  flightNumber,
  statusTone,
  statusLabel,
}: {
  carrier: string;
  flightNumber: string;
  statusTone: "success" | "warning" | "danger" | "info" | "neutral";
  statusLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <IconTile
          size={36}
          className="rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] text-[var(--color-surface-hero-fg)]"
        >
          <PlaneIcon size={16} />
        </IconTile>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-eyebrow uppercase text-[var(--color-surface-hero-fg-soft)]">
            {carrier}
          </span>
          <span className="text-title tabular-nums text-[var(--color-surface-hero-fg)]">
            {flightNumber}
          </span>
        </div>
      </div>
      <StatusPill tone={statusTone} surface="hero" leadingDot size="sm">
        {statusLabel}
      </StatusPill>
    </div>
  );
}

function SavedPassRoute({
  origin,
  destination,
}: {
  origin: string;
  destination: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <span className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
        {origin}
      </span>
      <span aria-hidden className="relative flex w-full items-center">
        <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-map-mint)]" />
        <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]">
          <PlaneIcon size={11} />
        </span>
        <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
        <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
      </span>
      <span className="text-display tabular-nums text-[var(--color-surface-hero-fg-muted)]">
        {destination}
      </span>
    </div>
  );
}

function SavedPassInfoModule({ cells }: { cells: PassCell[] }) {
  const colsClass = cells.length === 1 ? "grid-cols-1" : "grid-cols-2";
  return (
    <div
      className={`grid ${colsClass} overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]`}
    >
      {cells.map((cell, i) => (
        <SavedPassCell
          key={cell.label}
          label={cell.label}
          value={cell.value}
          divider={i > 0}
          highlight={cell.highlight ?? false}
        />
      ))}
    </div>
  );
}

function SavedPassCell({
  label,
  value,
  divider = false,
  highlight = false,
}: {
  label: string;
  value: string;
  divider?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 px-3 py-3 ${
        divider ? "border-l border-[var(--color-surface-hero-tile-border)]" : ""
      } ${highlight ? "bg-[var(--color-map-mint-bg)]" : ""}`}
    >
      <span
        className={`text-micro uppercase ${
          highlight
            ? "text-[var(--color-map-mint)]"
            : "text-[var(--color-surface-hero-fg-soft)]"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-section-title tabular-nums ${
          highlight
            ? "text-[var(--color-map-mint)]"
            : "text-[var(--color-surface-hero-fg)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SavedPassFooter({
  carrier,
  flightNumber,
  savedAt,
}: {
  carrier: string;
  flightNumber: string;
  savedAt: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="inline-flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
        >
          <PlaneIcon size={12} />
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-label text-[var(--color-surface-hero-fg-muted)]">
            {carrier} · {flightNumber}
          </span>
          <span className="truncate text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            Saved {formatRelative(savedAt)} · Live data snapshot
          </span>
        </span>
      </div>
      <SavedPassBarcodeMarks
        aria-label={`${carrier} ${flightNumber} saved pass`}
      />
    </div>
  );
}

function SavedPassBarcodeMarks({ "aria-label": ariaLabel }: { "aria-label": string }) {
  // Decorative bar pattern. Not scannable — there is no real
  // boarding-pass barcode tied to a saved-search snapshot, so this
  // exists purely as visual texture matching the YVR pass language.
  const heights = [10, 16, 8, 14, 12, 18, 10];
  return (
    <span
      aria-label={ariaLabel}
      role="img"
      className="inline-flex shrink-0 items-end gap-[3px]"
      style={{ height: 18 }}
    >
      {heights.map((h, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block w-0.5 rounded-full bg-[var(--color-surface-hero-fg-soft)]"
          style={{ height: h }}
        />
      ))}
    </span>
  );
}

function describeTimeCell(flight: SavedFlight): PassCell | null {
  if (flight.actualTime) {
    const value = formatTime(flight.actualTime);
    if (flight.status === "arrived") return { label: "Arrived", value };
    if (flight.status === "departed") return { label: "Departed", value };
    return { label: "Actual", value };
  }
  if (flight.estimatedTime) {
    return { label: "Estimated", value: formatTime(flight.estimatedTime) };
  }
  if (flight.scheduledTime) {
    return { label: "Scheduled", value: formatTime(flight.scheduledTime) };
  }
  return null;
}

function AddFlightModeView({
  recentSearches,
}: {
  recentSearches: RecentFlightSearch[];
}) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (next: string) => {
    setInput(next);
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    const normalised = trimmed.toUpperCase().replace(/[\s-]+/g, "");

    if (normalised === "") {
      setError("Enter a flight number to search.");
      return;
    }
    if (!/^[A-Z0-9]{2,3}\d{1,4}$/.test(normalised)) {
      setError("Flight number must look like AC838 or CX838.");
      return;
    }

    setError(null);
    router.push(
      `/flights/search?flightNumber=${encodeURIComponent(normalised)}&autoSearch=1` as Route,
    );
  };

  return (
    <>
      <LiveTrackerPass
        value={input}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={false}
        pillLabel="Add a flight"
        description="Add a flight to track gates, times, and updates in one place."
      />
      {error ? <AddFlightValidation message={error} /> : null}
      {recentSearches.length > 0 ? (
        <AddFlightRecentSearches recents={recentSearches} />
      ) : null}
      <FlightBoardEntryLink />
    </>
  );
}

function AddFlightValidation({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="inline-flex items-center gap-2 rounded-[var(--radius-tile)] border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-3 py-2 text-body-sm text-[var(--color-warning-fg)]"
    >
      <InfoIcon size={14} aria-hidden />
      <span>{message}</span>
    </p>
  );
}

function AddFlightRecentSearches({
  recents,
}: {
  recents: RecentFlightSearch[];
}) {
  return (
    <section
      aria-labelledby="add-flight-recent-heading"
      className="flex flex-col gap-3"
    >
      <h2
        id="add-flight-recent-heading"
        className="text-eyebrow uppercase text-[var(--color-text-muted)]"
      >
        Recent searches
      </h2>
      <ul className="flex flex-col gap-2.5">
        {recents.slice(0, 3).map((s) => (
          <li key={s.query}>
            <RecentSearchLink search={s} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecentSearchLink({ search }: { search: RecentFlightSearch }) {
  const relative = formatRelative(search.searchedAt);
  const href =
    `/flights/search?flightNumber=${encodeURIComponent(search.query)}&autoSearch=1` as Route;
  return (
    <Link
      href={href}
      aria-label={`Search again for ${search.query}, ${relative}`}
      className="block w-full text-left"
    >
      <Card
        as="div"
        surface="sheet"
        padding="compact"
        className="flex items-center gap-3 transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
      >
        <IconTile
          size={36}
          className="bg-[var(--color-surface-tile)] text-[var(--color-text-secondary)]"
        >
          <SearchIcon size={14} />
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-body-sm-emphasis tabular-nums text-[var(--color-text-primary)]">
            {search.query}
          </span>
          <span className="truncate text-label text-[var(--color-text-secondary)]">
            {relative}
          </span>
        </div>
        <span
          aria-hidden
          className="inline-flex shrink-0 text-[var(--color-text-muted)]"
        >
          <ChevronRightIcon size={14} />
        </span>
      </Card>
    </Link>
  );
}

function OnYourRadarSection({
  flights,
  previewMode = false,
}: {
  flights: RadarFlight[];
  previewMode?: boolean;
}) {
  return (
    <section aria-label="Upcoming flights" className="flex flex-col gap-3 pt-2">
      <h2 className="text-eyebrow uppercase text-[var(--color-text-muted)]">
        {previewMode ? "Also on your radar · preview" : "Also on your radar"}
      </h2>
      <ul className="flex flex-col gap-2.5">
        {flights.map((f) => (
          <li key={f.id}>
            {f.variant === "pickup" ? (
              <PickupFlightCard flight={f} />
            ) : (
              <ScheduledFlightCard flight={f} />
            )}
          </li>
        ))}
      </ul>
      <FlightBoardEntryLink />
    </section>
  );
}

function FlightBoardEntryLink() {
  return (
    <div className="flex justify-center pt-1">
      <Link
        href={"/flights/board" as Route}
        className="inline-flex h-11 items-center gap-1.5 text-body-sm-emphasis text-[var(--color-action-teal)] hover:opacity-80"
      >
        View YVR flight board
        <ChevronRightIcon size={14} aria-hidden />
      </Link>
    </div>
  );
}

function ScheduledFlightCard({ flight }: { flight: RadarFlight }) {
  return (
    <Card as="div" surface="sheet" padding="none" className="overflow-hidden">
      <Link
        href={flight.href}
        aria-label={`${flight.route}, ${flight.detail}, ${flight.date ?? ""} ${flight.time ?? ""}`}
        className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
      >
        <span className="flex w-[68px] shrink-0 flex-col">
          {flight.date ? (
            <span className="text-micro uppercase text-[var(--color-text-muted)]">
              {flight.date}
            </span>
          ) : null}
          {flight.time ? (
            <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
              {flight.time}
            </span>
          ) : null}
        </span>
        <span aria-hidden className="block h-9 w-px bg-[var(--color-border-soft)]" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            {flight.route}
          </span>
          <span className="text-label text-[var(--color-text-secondary)]">
            {flight.detail}
          </span>
        </span>
        {flight.meta ? (
          <span className="flex shrink-0 flex-col items-end">
            {flight.metaLabel ? (
              <span className="text-micro uppercase text-[var(--color-text-muted)]">
                {flight.metaLabel}
              </span>
            ) : null}
            <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
              {flight.meta}
            </span>
          </span>
        ) : null}
      </Link>
    </Card>
  );
}

function PickupFlightCard({ flight }: { flight: RadarFlight }) {
  return (
    <Card as="div" surface="sheet" padding="none" className="overflow-hidden">
      <Link
        href={flight.href}
        aria-label={`Open pickup tracking for ${flight.route}, ${flight.detail}, ${flight.meta ?? ""}`}
        className="relative flex w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
      >
        <span
          aria-hidden
          className="absolute left-0 top-3 bottom-3 w-1 rounded-r-[var(--radius-pill)] bg-[var(--color-map-mint)]"
        />
        <IconTile
          size={40}
          className="rounded-[var(--radius-tile)] bg-[var(--color-map-mint-bg)] text-[var(--color-action-teal)]"
        >
          <PlaneIcon size={18} />
        </IconTile>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="inline-flex items-center gap-2">
            <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
              {flight.route}
            </span>
            {flight.highlight ? (
              <span className="inline-flex h-5 items-center rounded-[var(--radius-pill)] bg-[var(--color-map-mint-bg)] px-2 text-micro uppercase text-[var(--color-action-teal)]">
                {flight.highlight}
              </span>
            ) : null}
          </span>
          <span className="text-label text-[var(--color-text-secondary)]">
            {flight.detail}
            {flight.meta ? (
              <>
                {" · "}
                <span className="text-[var(--color-text-primary)]">
                  {flight.meta}
                </span>
              </>
            ) : null}
          </span>
        </span>
        <span aria-hidden className="inline-flex shrink-0 text-[var(--color-text-muted)]">
          <ChevronRightIcon size={16} />
        </span>
      </Link>
    </Card>
  );
}

function mapStatusToTone(
  status: YvrFlightStatus,
): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "scheduled":
    case "boarding":
    case "departed":
    case "arrived":
      return "info";
    case "delayed":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

function mapStatusToLabel(status: YvrFlightStatus): string {
  switch (status) {
    case "scheduled":
      return "Scheduled";
    case "boarding":
      return "Boarding";
    case "departed":
      return "Departed";
    case "arrived":
      return "Arrived";
    case "delayed":
      return "Delayed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Status TBD";
  }
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "recently";
  const diffMs = Date.now() - then;
  const diffMin = Math.max(0, Math.round(diffMs / 60000));
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString();
}
