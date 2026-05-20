"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Card } from "@/components/Card";
import { ChipFilter } from "@/components/ChipFilter";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  PlaneIcon,
  SearchIcon,
} from "@/components/icons";

type BoardDirection = "departures" | "arrivals";

type FlightStatus = "boarding" | "on-time" | "delayed" | "scheduled";

type FilterKey = "all" | "on-time" | "boarding" | "delayed";

type StatusTone = "success" | "warning" | "info" | "neutral";

/**
 * Prototype flight rows for the public Flight Board.
 *
 * **Static prototype data.** YVR does not yet ship an airport-wide
 * board endpoint to the client, and per-flight detail pages do not
 * exist either — so this screen renders a fixed sample of plausible
 * board content rather than calling any provider. Treat it as a
 * design/UX scaffold, not a live feed. When the real board API
 * lands, replace `PROTOTYPE_DEPARTURES` / `PROTOTYPE_ARRIVALS` with
 * normalised data and wire a real freshness timestamp via
 * `LiveIndicator` if the header surfaces one.
 */
type PrototypeFlight = {
  id: string;
  flightNumber: string;
  airlineName: string;
  scheduledTime: string;
  city: string;
  airportCode: string;
  domestic: boolean;
  gate: string;
  status: FlightStatus;
};

const PROTOTYPE_DEPARTURES: ReadonlyArray<PrototypeFlight> = [
  {
    id: "ws456",
    flightNumber: "WS 456",
    airlineName: "WestJet",
    scheduledTime: "11:15",
    city: "Calgary",
    airportCode: "YYC",
    domestic: true,
    gate: "B4",
    status: "boarding",
  },
  {
    id: "ac892",
    flightNumber: "AC 892",
    airlineName: "Air Canada",
    scheduledTime: "14:35",
    city: "Tokyo Narita",
    airportCode: "NRT",
    domestic: false,
    gate: "D73",
    status: "on-time",
  },
  {
    id: "cx88",
    flightNumber: "CX 88",
    airlineName: "Cathay Pacific",
    scheduledTime: "00:20",
    city: "Hong Kong",
    airportCode: "HKG",
    domestic: false,
    gate: "E75",
    status: "delayed",
  },
  {
    id: "ba84",
    flightNumber: "BA 84",
    airlineName: "British Airways",
    scheduledTime: "17:00",
    city: "London Heathrow",
    airportCode: "LHR",
    domestic: false,
    gate: "E81",
    status: "scheduled",
  },
  {
    id: "ws164",
    flightNumber: "WS 164",
    airlineName: "WestJet",
    scheduledTime: "12:40",
    city: "Toronto",
    airportCode: "YYZ",
    domestic: true,
    gate: "C42",
    status: "on-time",
  },
];

const PROTOTYPE_ARRIVALS: ReadonlyArray<PrototypeFlight> = [
  {
    id: "ac8",
    flightNumber: "AC 8",
    airlineName: "Air Canada",
    scheduledTime: "10:48",
    city: "London Heathrow",
    airportCode: "LHR",
    domestic: false,
    gate: "E73",
    status: "on-time",
  },
  {
    id: "dl1882",
    flightNumber: "DL 1882",
    airlineName: "Delta",
    scheduledTime: "11:02",
    city: "Seattle",
    airportCode: "SEA",
    domestic: false,
    gate: "B12",
    status: "on-time",
  },
  {
    id: "cx838",
    flightNumber: "CX 838",
    airlineName: "Cathay Pacific",
    scheduledTime: "13:22",
    city: "Hong Kong",
    airportCode: "HKG",
    domestic: false,
    gate: "E50",
    status: "delayed",
  },
  {
    id: "ws712",
    flightNumber: "WS 712",
    airlineName: "WestJet",
    scheduledTime: "15:10",
    city: "Calgary",
    airportCode: "YYC",
    domestic: true,
    gate: "B22",
    status: "scheduled",
  },
];

const FILTERS: ReadonlyArray<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "on-time", label: "On Time" },
  { key: "boarding", label: "Boarding" },
  { key: "delayed", label: "Delayed" },
];

const DIRECTION_LABEL: Record<BoardDirection, string> = {
  departures: "Departures",
  arrivals: "Arrivals",
};

export default function FlightBoardPage() {
  const [direction, setDirection] = useState<BoardDirection>("departures");
  const [filter, setFilter] = useState<FilterKey>("all");

  const flights =
    direction === "departures" ? PROTOTYPE_DEPARTURES : PROTOTYPE_ARRIVALS;

  const priority = useMemo(
    () => flights.find((f) => f.status === "boarding") ?? null,
    [flights],
  );

  const list = useMemo(() => {
    const rest = priority
      ? flights.filter((f) => f.id !== priority.id)
      : [...flights];
    if (filter === "all") return rest;
    if (filter === "on-time") return rest.filter((f) => f.status === "on-time");
    if (filter === "boarding")
      return rest.filter((f) => f.status === "boarding");
    if (filter === "delayed") return rest.filter((f) => f.status === "delayed");
    return rest;
  }, [flights, filter, priority]);

  return (
    <AppShellAuthed activeHref="/flights">
      <FlightBoardHeader />
      <div className="flex flex-1 flex-col gap-5 px-6 pb-6">
        <DirectionTabs value={direction} onChange={setDirection} />
        <FilterChips value={filter} onChange={setFilter} />
        {priority ? (
          <PriorityFlightPass flight={priority} direction={direction} />
        ) : null}
        <BoardList
          flights={list}
          direction={direction}
          hasPriority={priority != null}
          filter={filter}
        />
      </div>
    </AppShellAuthed>
  );
}

function FlightBoardHeader() {
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
          YVR · Today
        </span>
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Flight Board
        </h1>
      </div>
      <HeaderIconButton
        aria-label="Search flights"
        href={"/flights/search" as Route}
      >
        <SearchIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function DirectionTabs({
  value,
  onChange,
}: {
  value: BoardDirection;
  onChange: (next: BoardDirection) => void;
}) {
  // Segmented selector for board direction. Built from two ChipFilter
  // pills with mutually exclusive selection so we don't introduce a
  // bespoke tab primitive for one screen. ChipFilter renders as a real
  // <button aria-pressed>; the wrapping role="group" + aria-label gives
  // the segmented pair its own landmark for AT users.
  return (
    <div
      role="group"
      aria-label="Flight board direction"
      className="flex items-center gap-2"
    >
      {(Object.keys(DIRECTION_LABEL) as BoardDirection[]).map((key) => (
        <ChipFilter
          key={key}
          selected={value === key}
          onToggle={() => onChange(key)}
          tone="teal"
        >
          {DIRECTION_LABEL[key]}
        </ChipFilter>
      ))}
    </div>
  );
}

function FilterChips({
  value,
  onChange,
}: {
  value: FilterKey;
  onChange: (next: FilterKey) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter flights"
      className="-mx-6 flex items-center gap-2 overflow-x-auto px-6 pb-1"
    >
      {FILTERS.map((f) => (
        <ChipFilter
          key={f.key}
          selected={value === f.key}
          onToggle={() => onChange(f.key)}
        >
          {f.label}
        </ChipFilter>
      ))}
    </div>
  );
}

function PriorityFlightPass({
  flight,
  direction,
}: {
  flight: PrototypeFlight;
  direction: BoardDirection;
}) {
  const statusTone = toneFor(flight.status);
  const statusLabel = labelFor(flight.status);
  const routeFrom = direction === "departures" ? "YVR" : flight.airportCode;
  const routeTo = direction === "departures" ? flight.airportCode : "YVR";
  const fromCity =
    direction === "departures" ? "Vancouver" : flight.city;
  const toCity = direction === "departures" ? flight.city : "Vancouver";
  const timeLabel = direction === "departures" ? "Departs" : "Arrives";
  const accessibleName = `Priority ${direction === "departures" ? "departure" : "arrival"} ${flight.flightNumber}, ${flight.airlineName}, ${routeFrom} to ${routeTo}, ${statusLabel}, ${timeLabel.toLowerCase()} ${flight.scheduledTime}, gate ${flight.gate}`;

  return (
    <section
      aria-label="Priority flight"
      className="flex flex-col gap-3"
    >
      <PriorityEyebrow flight={flight} direction={direction} />
      <HeroSurface
        as="article"
        aria-label={accessibleName}
        className="shadow-[var(--shadow-hero-card)]"
      >
        <PassDecorBackground variant="tall" />
        <div className="relative flex flex-col gap-5 p-6">
          <PassDocumentBand direction={direction} />
          <PassIdentityRow
            airlineName={flight.airlineName}
            flightNumber={flight.flightNumber}
            statusTone={statusTone}
            statusLabel={statusLabel}
          />
          <PassRoute
            from={routeFrom}
            to={routeTo}
            fromCity={fromCity}
            toCity={toCity}
          />
          <PassInfoModule
            timeLabel={timeLabel}
            time={flight.scheduledTime}
            gate={flight.gate}
            zone={flight.domestic ? "Domestic" : "International"}
          />
          <PassPerforation />
          <PassFooter
            airlineName={flight.airlineName}
            flightNumber={flight.flightNumber}
            direction={direction}
            zone={flight.domestic ? "Domestic" : "International"}
          />
        </div>
      </HeroSurface>
    </section>
  );
}

function PriorityEyebrow({
  flight,
  direction,
}: {
  flight: PrototypeFlight;
  direction: BoardDirection;
}) {
  const label =
    direction === "departures"
      ? `Priority · ${labelFor(flight.status).toLowerCase()} now`
      : `Priority · ${labelFor(flight.status).toLowerCase()} arrival`;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-micro uppercase text-[var(--color-action-teal)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
        />
        {label}
      </span>
      <span className="text-micro uppercase text-[var(--color-text-muted)]">
        Today’s board
      </span>
    </div>
  );
}

function PassDocumentBand({ direction }: { direction: BoardDirection }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-map-mint)]"
        />
        YVR Flight Board
      </span>
      <span className="text-micro uppercase tabular-nums text-[var(--color-surface-hero-fg-soft)]">
        {direction === "departures" ? "Departure" : "Arrival"} · Today
      </span>
    </div>
  );
}

function PassIdentityRow({
  airlineName,
  flightNumber,
  statusTone,
  statusLabel,
}: {
  airlineName: string;
  flightNumber: string;
  statusTone: StatusTone;
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
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-eyebrow uppercase text-[var(--color-surface-hero-fg-soft)]">
            {airlineName}
          </span>
          <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
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

function PassRoute({
  from,
  to,
  fromCity,
  toCity,
}: {
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
          {from}
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
          {to}
        </span>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          {fromCity}
        </span>
        <span aria-hidden />
        <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
          {toCity}
        </span>
      </div>
    </div>
  );
}

function PassInfoModule({
  timeLabel,
  time,
  gate,
  zone,
}: {
  timeLabel: string;
  time: string;
  gate: string;
  zone: string;
}) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]">
      <PassInfoCell label={timeLabel} value={time} />
      <PassInfoCell label="Gate" value={gate} divider highlight />
      <PassInfoCell label="Zone" value={zone} divider />
    </div>
  );
}

function PassInfoCell({
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

function PassFooter({
  airlineName,
  flightNumber,
  direction,
  zone,
}: {
  airlineName: string;
  flightNumber: string;
  direction: BoardDirection;
  zone: string;
}) {
  const contextLine =
    direction === "departures"
      ? `YVR departures · ${zone}`
      : `YVR arrivals · ${zone}`;
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
            {airlineName} · {flightNumber}
          </span>
          <span className="truncate text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            {contextLine}
          </span>
        </span>
      </div>
      <PassBarcodeMarks ariaLabel={`${airlineName} ${flightNumber} pass marks`} />
    </div>
  );
}

function PassBarcodeMarks({ ariaLabel }: { ariaLabel: string }) {
  // Decorative bar pattern. Not a real boarding-pass barcode — the
  // Flight Board renders public-board prototype data, not the user's
  // pass, so there's nothing scannable here. Exists purely as visual
  // texture matching the YVR pass-document language.
  const heights = [10, 16, 8, 14, 12, 18, 10];
  return (
    <span
      role="img"
      aria-label={ariaLabel}
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

function BoardList({
  flights,
  direction,
  hasPriority,
  filter,
}: {
  flights: ReadonlyArray<PrototypeFlight>;
  direction: BoardDirection;
  hasPriority: boolean;
  filter: FilterKey;
}) {
  // When a priority flight sits above the list, the heading flips to
  // "Other …" so it isn't misleading about coverage. Without a priority
  // flight, the list shows everything and the heading reflects that.
  const sectionTitle = hasPriority
    ? direction === "departures"
      ? "Other departures"
      : "Other arrivals"
    : direction === "departures"
      ? "All departures"
      : "All arrivals";

  return (
    <section aria-label={sectionTitle} className="flex flex-col gap-3 pt-1">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          {sectionTitle}
        </h2>
        <span className="text-micro uppercase tabular-nums text-[var(--color-text-muted)]">
          {flights.length} {flights.length === 1 ? "flight" : "flights"}
        </span>
      </div>
      {flights.length === 0 ? (
        <EmptyFilterCard filter={filter} />
      ) : (
        <Card as="div" surface="sheet" padding="none" className="overflow-hidden">
          <ul className="flex flex-col divide-y divide-[var(--color-border-soft)]">
            {flights.map((f) => (
              <FlightRow key={f.id} flight={f} direction={direction} />
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}

function FlightRow({
  flight,
  direction,
}: {
  flight: PrototypeFlight;
  direction: BoardDirection;
}) {
  const tone = toneFor(flight.status);
  const label = labelFor(flight.status);
  const timeLabel = direction === "departures" ? "Departs" : "Arrives";
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <div className="flex w-[60px] shrink-0 flex-col">
        <span className="text-micro uppercase text-[var(--color-text-muted)]">
          {timeLabel}
        </span>
        <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
          {flight.scheduledTime}
        </span>
      </div>
      <span
        aria-hidden
        className="block h-9 w-px bg-[var(--color-border-soft)]"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="inline-flex items-baseline gap-2">
          <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
            {flight.airportCode}
          </span>
          <span className="truncate text-body-sm text-[var(--color-text-secondary)]">
            {flight.city}
          </span>
        </span>
        <span className="truncate text-label text-[var(--color-text-secondary)]">
          {flight.flightNumber} · Gate {flight.gate}
        </span>
      </div>
      <StatusPill tone={tone} leadingDot size="sm" className="shrink-0">
        {label}
      </StatusPill>
    </li>
  );
}

function EmptyFilterCard({ filter }: { filter: FilterKey }) {
  const filterLabel = FILTERS.find((f) => f.key === filter)?.label ?? "this filter";
  return (
    <Card as="div" surface="sheet" padding="default">
      <p className="text-body text-[var(--color-text-secondary)]">
        No flights match {filterLabel}.
      </p>
    </Card>
  );
}

function toneFor(status: FlightStatus): StatusTone {
  switch (status) {
    case "boarding":
      return "info";
    case "on-time":
      return "success";
    case "delayed":
      return "warning";
    case "scheduled":
    default:
      return "neutral";
  }
}

function labelFor(status: FlightStatus): string {
  switch (status) {
    case "boarding":
      return "Boarding";
    case "on-time":
      return "On Time";
    case "delayed":
      return "Delayed";
    case "scheduled":
    default:
      return "Scheduled";
  }
}
