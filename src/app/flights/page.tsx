import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  ChevronRightIcon,
  NavigationIcon,
  PlaneIcon,
  PlusIcon,
  QrCodeIcon,
} from "@/components/icons";

type ActiveFlight = {
  airline: string;
  flightNumber: string;
  aircraft: string;
  status: "On time" | "Delayed" | "Boarding" | "Cancelled";
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  duration: string;
  departs: string;
  lands: string;
  landsDayOffset?: number;
  gate: string;
};

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

const ACTIVE_FLIGHT: ActiveFlight = {
  airline: "Air Canada",
  flightNumber: "AC 892",
  aircraft: "Boeing 787",
  status: "On time",
  origin: { code: "YVR", city: "Vancouver" },
  destination: { code: "NRT", city: "Tokyo" },
  duration: "9h 45m",
  departs: "14:35",
  lands: "17:20",
  landsDayOffset: 1,
  gate: "D73",
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

export default function MyFlightsPage() {
  return (
    <AppShellAuthed activeHref="/flights">
      <div className="flex flex-1 flex-col gap-6 px-6 pt-2 pb-6">
        <FlightsHeader date="Saturday · May 9" />
        <HappeningSoonRow />
        <ActiveFlightCard flight={ACTIVE_FLIGHT} />
        <ViewTripDetailsLink />
        <OnYourRadarSection flights={RADAR_FLIGHTS} />
      </div>
    </AppShellAuthed>
  );
}

function FlightsHeader({ date }: { date: string }) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-2">
        <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          {date}
        </span>
        <h1 className="text-title text-[var(--color-text-primary)]">
          My Flights
        </h1>
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

function HappeningSoonRow() {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-micro uppercase text-[var(--color-action-teal)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
        />
        Happening soon
      </span>
      <span className="text-micro uppercase text-[var(--color-text-muted)]">
        In 3h 12m
      </span>
    </div>
  );
}

function ActiveFlightCard({ flight }: { flight: ActiveFlight }) {
  const accessibleName = `${flight.airline} flight ${flight.flightNumber}, ${flight.origin.city} to ${flight.destination.city}, departs ${flight.departs}, gate ${flight.gate}`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-5 p-6">
        <AirlineRow
          airline={flight.airline}
          flightNumber={flight.flightNumber}
          aircraft={flight.aircraft}
          status={flight.status}
        />
        <RouteRow
          origin={flight.origin}
          destination={flight.destination}
          duration={flight.duration}
        />
        <FlightInfoModule
          departs={flight.departs}
          lands={flight.lands}
          landsDayOffset={flight.landsDayOffset}
          gate={flight.gate}
        />
        <PassPerforation />
        <CTARow flightNumber={flight.flightNumber} gate={flight.gate} />
      </div>
    </HeroSurface>
  );
}

function AirlineRow({
  airline,
  flightNumber,
  aircraft,
  status,
}: {
  airline: string;
  flightNumber: string;
  aircraft: string;
  status: ActiveFlight["status"];
}) {
  const statusTone =
    status === "On time"
      ? "success"
      : status === "Delayed"
        ? "warning"
        : status === "Boarding"
          ? "info"
          : "danger";
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <IconTile
          size={36}
          className="rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] text-[var(--color-surface-hero-fg)]"
        >
          <PlaneIcon size={16} />
        </IconTile>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
            {airline}
          </span>
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
            {flightNumber} · {aircraft}
          </span>
        </div>
      </div>
      <StatusPill tone={statusTone} surface="hero" leadingDot size="sm">
        {status}
      </StatusPill>
    </div>
  );
}

function RouteRow({
  origin,
  destination,
  duration,
}: {
  origin: ActiveFlight["origin"];
  destination: ActiveFlight["destination"];
  duration: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
          {origin.code}
        </span>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            {duration}
          </span>
          <RouteLine />
        </div>
        <span className="text-display tabular-nums text-[var(--color-surface-hero-fg-muted)]">
          {destination.code}
        </span>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          {origin.city}
        </span>
        <span aria-hidden />
        <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
          {destination.city}
        </span>
      </div>
    </div>
  );
}

function RouteLine() {
  return (
    <span aria-hidden className="relative flex w-full items-center">
      <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-map-mint)]" />
      <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]">
        <PlaneIcon size={11} />
      </span>
      <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
    </span>
  );
}

function FlightInfoModule({
  departs,
  lands,
  landsDayOffset,
  gate,
}: {
  departs: string;
  lands: string;
  landsDayOffset?: number;
  gate: string;
}) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]">
      <InfoCell label="Departs" value={departs} />
      <InfoCell
        label="Lands"
        value={
          <span className="inline-flex items-baseline gap-0.5 tabular-nums">
            {lands}
            {landsDayOffset != null ? (
              <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
                +{landsDayOffset}
              </span>
            ) : null}
          </span>
        }
        divider
      />
      <InfoCell label="Gate" value={gate} divider highlight />
    </div>
  );
}

function InfoCell({
  label,
  value,
  divider = false,
  highlight = false,
}: {
  label: string;
  value: React.ReactNode;
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

function CTARow({ flightNumber, gate }: { flightNumber: string; gate: string }) {
  return (
    <div className="flex items-stretch gap-2">
      <div className="min-w-0 flex-1">
        <Button
          tone="inverse"
          href={"/flights/check-in" as Route}
          leadingIcon={<QrCodeIcon size={16} />}
          aria-label={`Open check-in for ${flightNumber}`}
        >
          Boarding Pass
        </Button>
      </div>
      <Link
        href={"/flights/detail" as Route}
        aria-label={`View gate details for ${flightNumber}, gate ${gate}`}
        className="inline-flex h-[54px] w-28 shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-4 text-body-sm-emphasis text-[var(--color-surface-hero-fg)] transition-colors duration-150 hover:bg-[var(--color-surface-hero-chip)]"
      >
        <NavigationIcon size={14} aria-hidden />
        Gate {gate}
      </Link>
    </div>
  );
}

function ViewTripDetailsLink() {
  return (
    <div className="flex justify-center">
      <Link
        href={"/flights/departing" as Route}
        className="inline-flex h-11 items-center text-body-sm-emphasis text-[var(--color-action-teal)] hover:opacity-80"
      >
        View trip details
      </Link>
    </div>
  );
}

function OnYourRadarSection({ flights }: { flights: RadarFlight[] }) {
  return (
    <section aria-label="Upcoming flights" className="flex flex-col gap-3 pt-2">
      <h2 className="text-eyebrow uppercase text-[var(--color-text-muted)]">
        Also on your radar
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
    </section>
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
