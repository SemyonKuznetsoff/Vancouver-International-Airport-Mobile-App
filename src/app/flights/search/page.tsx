"use client";

import type { Route } from "next";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AirportCodePair } from "@/components/AirportCodePair";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { LiveIndicator } from "@/components/LiveIndicator";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  ArrowsVerticalIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  InfoIcon,
  PlaneIcon,
  PlusIcon,
  ScanIcon,
  SearchIcon,
  SparkleIcon,
  SpinnerIcon,
} from "@/components/icons";
import { searchFlights } from "@/data/flight-search-client";
import {
  isFlightSaved,
  saveFlight,
} from "@/data/saved-flights";
import {
  loadRecentSearches,
  recordSearch,
  type RecentFlightSearch,
} from "@/data/recent-flight-searches";
import type {
  YvrFlightSearchResult,
  YvrFlightStatus,
} from "@/lib/flights/types";

type SecondaryAction = {
  id: string;
  title: string;
  helper: string;
  icon: React.ReactNode;
  ariaLabel: string;
};

type RouteSearch = {
  origin: { code: string; city: string };
  destination: { placeholder: string };
  date: string;
  tripType: string;
};

type SearchPhase =
  | { kind: "idle" }
  | { kind: "loading"; query: string }
  | { kind: "success"; query: string; results: YvrFlightSearchResult[] }
  | { kind: "empty"; query: string }
  | { kind: "invalid"; message: string }
  | { kind: "unconfigured"; message: string }
  | { kind: "error"; message: string };

const TRACKER_STATUS_LABEL = "YVR · 02";
const FOOTER_LEFT_LABEL = "YVR Live Ops";
const FOOTER_RIGHT_LABEL = "Concierge";

const SEARCH_PLACEHOLDER = "Flight number · e.g. AC 838";

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

const ROUTE_SEARCH: RouteSearch = {
  origin: { code: "YVR", city: "Vancouver" },
  destination: { placeholder: "Any destination" },
  date: "Today, Apr 20",
  tripType: "Departures",
};

export default function FlightSearchPage() {
  return (
    <Suspense fallback={<FlightSearchPageShell />}>
      <FlightSearchPageInner />
    </Suspense>
  );
}

function FlightSearchPageShell() {
  return <AppShellAuthed activeHref="/flights"><FlightSearchHeader /></AppShellAuthed>;
}

function FlightSearchPageInner() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<SearchPhase>({ kind: "idle" });
  const [recents, setRecents] = useState<RecentFlightSearch[]>([]);
  const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const abortRef = useRef<AbortController | null>(null);
  const autoSearchRanRef = useRef(false);

  useEffect(() => {
    setRecents(loadRecentSearches());
  }, []);

  const refreshSaved = useCallback(
    (results: readonly YvrFlightSearchResult[]) => {
      setSavedIds(
        new Set(results.filter(isFlightSaved).map((r) => r.id)),
      );
    },
    [],
  );

  const runSearch = useCallback(
    async (rawInput: string) => {
      const trimmed = rawInput.trim();
      const normalised = trimmed.toUpperCase().replace(/[\s-]+/g, "");

      if (normalised === "") {
        setPhase({
          kind: "invalid",
          message: "Enter a flight number to search.",
        });
        return;
      }
      if (!/^[A-Z0-9]{2,3}\d{1,4}$/.test(normalised)) {
        setPhase({
          kind: "invalid",
          message: "Flight number must look like AC838 or CX838.",
        });
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setPhase({ kind: "loading", query: normalised });
      let response;
      try {
        response = await searchFlights(
          { flightNumber: normalised },
          controller.signal,
        );
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setPhase({
          kind: "error",
          message: "Couldn't reach the flight data service. Try again.",
        });
        return;
      }

      if (response.ok) {
        const next = recordSearch({
          query: normalised,
          rawQuery: trimmed,
          resultCount: response.data.length,
        });
        setRecents(next);
        refreshSaved(response.data);
        setPhase(
          response.data.length === 0
            ? { kind: "empty", query: normalised }
            : {
                kind: "success",
                query: normalised,
                results: response.data,
              },
        );
        return;
      }

      if (response.error === "unconfigured") {
        setPhase({ kind: "unconfigured", message: response.message });
      } else if (response.error === "invalid_query") {
        setPhase({ kind: "invalid", message: response.message });
      } else {
        setPhase({ kind: "error", message: response.message });
      }
    },
    [refreshSaved],
  );

  useEffect(() => {
    if (autoSearchRanRef.current) return;
    const rawFlightNumber = searchParams.get("flightNumber");
    const auto = searchParams.get("autoSearch");
    if (!rawFlightNumber || auto !== "1") return;
    autoSearchRanRef.current = true;
    setInput(rawFlightNumber);
    void runSearch(rawFlightNumber);
  }, [searchParams, runSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch(input);
  };

  const handleSelectRecent = (query: string) => {
    setInput(query);
    void runSearch(query);
  };

  const handleSaveResult = (result: YvrFlightSearchResult) => {
    saveFlight(result);
    setSavedIds((prev) => {
      if (prev.has(result.id)) return prev;
      const next = new Set(prev);
      next.add(result.id);
      return next;
    });
  };

  return (
    <AppShellAuthed activeHref="/flights">
      <FlightSearchHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <LiveTrackerPass
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          submitting={phase.kind === "loading"}
        />
        <SearchPhaseBlock
          phase={phase}
          savedIds={savedIds}
          onSave={handleSaveResult}
          onRetry={() => runSearch(input)}
        />
        <RouteSearchCard route={ROUTE_SEARCH} />
        {recents.length > 0 ? (
          <RecentSearchesSection
            recents={recents}
            onSelect={handleSelectRecent}
          />
        ) : null}
      </div>
    </AppShellAuthed>
  );
}

function FlightSearchHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton
        aria-label="Back to My Flights"
        href={"/flights" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
        <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          My Flights
        </span>
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Add Flight
        </h1>
      </div>

      <HeaderIconButton aria-label="Flight alerts, new alert" badgeDot>
        <BellIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

type LiveTrackerProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
};

function LiveTrackerPass(props: LiveTrackerProps) {
  return (
    <HeroSurface
      as="section"
      aria-label="YVR Live Tracker — track a flight for real-time updates"
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-5 p-5">
        <LiveTrackerHeader />
        <LiveTrackerIdentity />
        <FlightNumberSearch {...props} />
        <SecondaryActionRow actions={SECONDARY_ACTIONS} />

        <PassPerforation inset="-mx-5" />

        <LiveTrackerFooter />
      </div>
    </HeroSurface>
  );
}

function LiveTrackerHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <StatusPill tone="success" surface="hero" leadingDot size="sm">
        Live tracker
      </StatusPill>
      <span className="text-micro uppercase tabular-nums text-[var(--color-surface-hero-fg-soft)]">
        {TRACKER_STATUS_LABEL}
      </span>
    </div>
  );
}

function LiveTrackerIdentity() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
        Track a flight
      </span>
      <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        Fastest way to get real-time updates.
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
        placeholder={SEARCH_PLACEHOLDER}
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

function SearchPhaseBlock({
  phase,
  savedIds,
  onSave,
  onRetry,
}: {
  phase: SearchPhase;
  savedIds: ReadonlySet<string>;
  onSave: (result: YvrFlightSearchResult) => void;
  onRetry: () => void;
}) {
  if (phase.kind === "idle") return null;

  if (phase.kind === "loading") {
    return (
      <section
        aria-live="polite"
        aria-busy
        className="flex items-center gap-3 px-1 pt-1 text-body-sm text-[var(--color-text-secondary)]"
      >
        <SpinnerIcon size={14} aria-hidden />
        <span>Searching for {phase.query}…</span>
      </section>
    );
  }

  if (phase.kind === "invalid") {
    return (
      <StatusMessage tone="warning" message={phase.message} />
    );
  }

  if (phase.kind === "unconfigured") {
    return (
      <StatusMessage
        tone="info"
        message="Live flight search is not connected yet."
        helper="Once a flight-data provider is configured, real results will appear here."
      />
    );
  }

  if (phase.kind === "error") {
    return (
      <StatusMessage
        tone="warning"
        message={phase.message}
        action={{ label: "Try again", onClick: onRetry }}
      />
    );
  }

  if (phase.kind === "empty") {
    return (
      <StatusMessage
        tone="neutral"
        message={`No flights found for ${phase.query}.`}
        helper="Double-check the flight number or try a different date."
      />
    );
  }

  return (
    <section
      aria-label={`Results for ${phase.query}`}
      aria-live="polite"
      className="flex flex-col gap-2.5 pt-1"
    >
      <h2 className="text-eyebrow uppercase text-[var(--color-text-muted)]">
        Results for {phase.query}
      </h2>
      <ul className="flex flex-col gap-2.5">
        {phase.results.map((r) => (
          <li key={r.id}>
            <ResultRow
              result={r}
              saved={savedIds.has(r.id)}
              onSave={onSave}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatusMessage({
  tone,
  message,
  helper,
  action,
}: {
  tone: "info" | "warning" | "neutral";
  message: string;
  helper?: string;
  action?: { label: string; onClick: () => void };
}) {
  const toneClasses =
    tone === "warning"
      ? "border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]"
      : tone === "info"
        ? "border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--color-info-fg)]"
        : "border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)]";

  return (
    <section
      role="status"
      aria-live="polite"
      className={`flex flex-col gap-2 rounded-[var(--radius-panel)] border px-4 py-3 ${toneClasses}`}
    >
      <span className="inline-flex items-center gap-2 text-body-sm-emphasis">
        <InfoIcon size={14} aria-hidden />
        <span>{message}</span>
      </span>
      {helper ? (
        <span className="text-label text-[var(--color-text-secondary)]">
          {helper}
        </span>
      ) : null}
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex h-11 w-fit items-center text-body-sm-emphasis text-[var(--color-action-teal)] hover:opacity-80"
        >
          {action.label}
        </button>
      ) : null}
    </section>
  );
}

function ResultRow({
  result,
  saved,
  onSave,
}: {
  result: YvrFlightSearchResult;
  saved: boolean;
  onSave: (r: YvrFlightSearchResult) => void;
}) {
  const statusTone = mapStatusToTone(result.status);
  const statusLabel = mapStatusToLabel(result.status);
  const carrier =
    result.airlineName?.trim() || result.flightNumber.slice(0, 2);
  const timeCell = describeTimeCell(result);
  const gateCell = result.gate
    ? { label: "Gate", value: result.gate, highlight: true }
    : null;
  const cells = [timeCell, gateCell].filter(
    (c): c is ResultCell => c !== null,
  );
  const accessibleName = [
    result.flightNumber,
    `${result.origin ?? "origin TBD"} to ${result.destination ?? "destination TBD"}`,
    carrier,
    timeCell ? `${timeCell.label} ${timeCell.value}` : "time TBD",
    statusLabel,
  ].join(", ");

  return (
    <Card
      as="article"
      surface="sheet"
      padding="default"
      aria-label={accessibleName}
      className="flex flex-col gap-4"
    >
      <ResultDocumentBand />

      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-eyebrow uppercase text-[var(--color-text-secondary)]">
            {carrier}
          </span>
          <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
            {result.flightNumber}
          </span>
        </div>
        <StatusPill tone={statusTone} size="sm" leadingDot>
          {statusLabel}
        </StatusPill>
      </div>

      <AirportCodePair
        origin={result.origin ?? "—"}
        destination={result.destination ?? "—"}
      />

      {cells.length > 0 ? <ResultInfoModule cells={cells} /> : null}

      <Button
        variant="secondary"
        leadingIcon={
          saved ? <CheckIcon size={14} /> : <PlusIcon size={14} />
        }
        onClick={() => onSave(result)}
        disabled={saved}
        aria-label={
          saved
            ? `${result.flightNumber} saved to your flights`
            : `Save ${result.flightNumber} to your flights`
        }
      >
        {saved ? "Saved" : "Save flight"}
      </Button>

      <LiveIndicator
        status="live"
        label={`Live data · Updated ${formatRelative(result.updatedAt)}`}
      />
    </Card>
  );
}

type ResultCell = { label: string; value: string; highlight?: boolean };

/**
 * Slim top band that frames the result card as a document-style
 * preview rather than a generic search row. Left chip carries the
 * "live" signal (real upstream call, fresh fetch); right chip is a
 * neutral "Result" label so the surface reads like a compact ticket
 * preview filed against the active query. The provider id stays
 * server-side — the band is intentionally generic so the user never
 * sees "aviationstack".
 */
function ResultDocumentBand() {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-micro uppercase text-[var(--color-action-teal)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success)]"
        />
        Live data
      </span>
      <span className="text-micro uppercase tabular-nums text-[var(--color-text-muted)]">
        Result
      </span>
    </div>
  );
}

function ResultInfoModule({ cells }: { cells: ResultCell[] }) {
  const colsClass = cells.length === 1 ? "grid-cols-1" : "grid-cols-2";
  return (
    <div
      className={`grid ${colsClass} overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]`}
    >
      {cells.map((cell, i) => (
        <ResultInfoCell
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

function ResultInfoCell({
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
        divider ? "border-l border-[var(--color-border)]" : ""
      } ${highlight ? "bg-[var(--color-action-teal-soft)]" : ""}`}
    >
      <span
        className={`text-micro uppercase ${
          highlight
            ? "text-[var(--color-action-teal)]"
            : "text-[var(--color-text-muted)]"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-section-title tabular-nums ${
          highlight
            ? "text-[var(--color-action-teal)]"
            : "text-[var(--color-text-primary)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function describeTimeCell(result: YvrFlightSearchResult): ResultCell | null {
  if (result.actualTime) {
    const value = formatTime(result.actualTime);
    if (result.status === "arrived") return { label: "Arrived", value };
    if (result.status === "departed") return { label: "Departed", value };
    return { label: "Actual", value };
  }
  if (result.estimatedTime) {
    return { label: "Estimated", value: formatTime(result.estimatedTime) };
  }
  if (result.scheduledTime) {
    return { label: "Scheduled", value: formatTime(result.scheduledTime) };
  }
  return null;
}

function RouteSearchCard({ route }: { route: RouteSearch }) {
  const accessibleName = `Search flights by route from ${route.origin.city} (${route.origin.code}) to ${route.destination.placeholder}, ${route.tripType.toLowerCase()} on ${route.date}.`;
  return (
    <section
      aria-label={accessibleName}
      className="flex flex-col gap-3 pt-1"
    >
      <RouteSearchDivider />
      <Card
        as="div"
        surface="sheet"
        padding="default"
        className="flex flex-col gap-4"
      >
        <RouteRow
          origin={route.origin}
          destinationPlaceholder={route.destination.placeholder}
        />
        <RouteSearchSeparator />
        <DateAndCtaRow
          date={route.date}
          tripType={route.tripType}
        />
      </Card>
    </section>
  );
}

function RouteSearchDivider() {
  return (
    <div
      aria-hidden
      className="flex items-center gap-3 pb-1"
    >
      <span className="h-px flex-1 bg-[var(--color-border-soft)]" />
      <span className="text-micro uppercase text-[var(--color-text-muted)]">
        Or search by route
      </span>
      <span className="h-px flex-1 bg-[var(--color-border-soft)]" />
    </div>
  );
}

function RouteRow({
  origin,
  destinationPlaceholder,
}: {
  origin: RouteSearch["origin"];
  destinationPlaceholder: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-micro uppercase text-[var(--color-text-muted)]">
          From
        </span>
        <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
          {origin.code}
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {origin.city}
        </span>
      </div>
      <button
        type="button"
        aria-label="Swap origin and destination — coming soon"
        aria-disabled
        disabled
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-tile)] text-[var(--color-action-teal)] transition-colors duration-150 hover:bg-[var(--color-action-teal-soft)] disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]"
      >
        <span aria-hidden className="inline-flex rotate-90">
          <ArrowsVerticalIcon size={14} />
        </span>
      </button>
      <div className="flex min-w-0 flex-col items-end gap-0.5 text-right">
        <span className="text-micro uppercase text-[var(--color-text-muted)]">
          To
        </span>
        <span className="text-section-title tabular-nums text-[var(--color-text-muted)]">
          ———
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {destinationPlaceholder}
        </span>
      </div>
    </div>
  );
}

function RouteSearchSeparator() {
  return (
    <span
      aria-hidden
      className="block h-px w-full bg-[var(--color-border-soft)]"
    />
  );
}

function DateAndCtaRow({
  date,
  tripType,
}: {
  date: string;
  tripType: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <IconTile
          size={36}
          className="rounded-[var(--radius-tile)] bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
        >
          <CalendarIcon size={16} />
        </IconTile>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-micro uppercase text-[var(--color-text-muted)]">
            {date}
          </span>
          <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            {tripType}
          </span>
        </div>
      </div>
      <div className="w-36 shrink-0">
        <Button
          disabled
          tone="teal"
          aria-label={`Route search for ${tripType.toLowerCase()} on ${date} is coming soon`}
        >
          Coming soon
        </Button>
      </div>
    </div>
  );
}

function RecentSearchesSection({
  recents,
  onSelect,
}: {
  recents: RecentFlightSearch[];
  onSelect: (query: string) => void;
}) {
  return (
    <section
      aria-labelledby="recent-searches-heading"
      className="flex flex-col gap-3 pt-1"
    >
      <h2
        id="recent-searches-heading"
        className="text-eyebrow uppercase text-[var(--color-text-muted)]"
      >
        Recent searches
      </h2>
      <ul className="flex flex-col gap-2.5">
        {recents.map((s) => (
          <li key={s.query}>
            <RecentSearchRow search={s} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecentSearchRow({
  search,
  onSelect,
}: {
  search: RecentFlightSearch;
  onSelect: (query: string) => void;
}) {
  const countLabel =
    search.resultCount === 1 ? "1 result" : `${search.resultCount} results`;
  const relative = formatRelative(search.searchedAt);
  return (
    <button
      type="button"
      onClick={() => onSelect(search.query)}
      aria-label={`Search again for ${search.query}, ${countLabel}, ${relative}`}
      className="w-full text-left"
    >
      <Card
        as="div"
        surface="sheet"
        padding="compact"
        className="flex items-center gap-3 transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
      >
        <IconTile size={36} className="bg-[var(--color-surface-tile)]">
          <span className="text-[var(--color-text-secondary)]">
            <SearchIcon size={14} aria-hidden />
          </span>
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-body-sm-emphasis tabular-nums text-[var(--color-text-primary)]">
            {search.query}
          </span>
          <span className="truncate text-label text-[var(--color-text-secondary)]">
            {countLabel} · {relative}
          </span>
        </div>
      </Card>
    </button>
  );
}

function mapStatusToTone(
  status: YvrFlightStatus,
): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    // Operational states — neutral "info" tone. We deliberately keep
    // `departed` and `arrived` off the success palette so green is
    // reserved for outcomes the user is actually rooting for (e.g.
    // "On time", "Saved"), not for a fact-of-the-matter status.
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
  if (Number.isNaN(then)) return "Recently";
  const diffMs = Date.now() - then;
  const diffMin = Math.max(0, Math.round(diffMs / 60000));
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString();
}
