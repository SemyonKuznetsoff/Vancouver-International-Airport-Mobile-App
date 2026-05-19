import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { Heading } from "@/components/Heading";
import { HeroSurface } from "@/components/HeroSurface";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  ChevronRightIcon,
  ParkingIcon,
  PlaneIcon,
  ShieldCheckIcon,
} from "@/components/icons";

type DepartingTrip = {
  airline: string;
  flightNumber: string;
  status: "On time" | "Delayed" | "Boarding" | "Cancelled";
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  date: string;
  departureTime: string;
  duration: string;
  untilDeparture: string;
  gate: string;
  terminal: string;
};

type TripDetailRow = {
  id: string;
  label: string;
  value: string;
};

const TRIP: DepartingTrip = {
  airline: "Air Canada",
  flightNumber: "AC892",
  status: "On time",
  origin: { code: "YVR", city: "Vancouver" },
  destination: { code: "NRT", city: "Tokyo" },
  date: "Thu · Apr 23",
  departureTime: "14:35",
  duration: "9h 50m",
  untilDeparture: "2d 4h",
  gate: "D73",
  terminal: "Intl Terminal",
};

const TRIP_DETAILS: TripDetailRow[] = [
  { id: "flight", label: "Flight", value: "AC892 · Air Canada" },
  { id: "travel-time", label: "Travel time", value: "9h 50m" },
  { id: "departs", label: "Departs", value: "Thu · Apr 23 · 14:35" },
];

export default function DepartingPage() {
  return (
    <AppShellAuthed activeHref="/flights">
      <DepartingHeader />
      <div className="flex flex-1 flex-col gap-5 px-6 pt-2 pb-6">
        <DepartingPassCard trip={TRIP} />
        <CheckInNotice />
        <ActionsRow />
        <TripDetailsSection details={TRIP_DETAILS} />
      </div>
    </AppShellAuthed>
  );
}

function DepartingHeader() {
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
          Departing
        </h1>
      </div>

      <HeaderIconButton aria-label="Flight notifications">
        <BellIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function DepartingPassCard({ trip }: { trip: DepartingTrip }) {
  const accessibleName = `Upcoming flight from ${trip.origin.city} ${trip.origin.code} to ${trip.destination.city} ${trip.destination.code}, ${trip.airline} ${trip.flightNumber}, departing ${trip.date} at ${trip.departureTime}, ${trip.status}. Gate ${trip.gate}, ${trip.terminal}. ${trip.untilDeparture} until departure.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-6 p-6">
        <PassIntro />
        <DepartureMetaRow
          date={trip.date}
          departureTime={trip.departureTime}
          status={trip.status}
        />
        <RouteModule origin={trip.origin} destination={trip.destination} />
        <FlightContextRow
          duration={trip.duration}
          airline={trip.airline}
          flightNumber={trip.flightNumber}
        />
        <PassPerforation />
        <DepartureFooterModule
          untilDeparture={trip.untilDeparture}
          gate={trip.gate}
          terminal={trip.terminal}
        />
      </div>
    </HeroSurface>
  );
}

function PassIntro() {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow tone="hero">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
          />
          Upcoming trip · In 2 days
        </span>
      </Eyebrow>
      <Heading as="h2" size="display" tone="hero">
        Ready when
        <br />
        <em>you are.</em>
      </Heading>
      <p className="text-body text-[var(--color-surface-hero-fg-muted)]">
        We&rsquo;ll guide you from home to gate.
      </p>
    </div>
  );
}

function DepartureMetaRow({
  date,
  departureTime,
  status,
}: {
  date: string;
  departureTime: string;
  status: DepartingTrip["status"];
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
    <div className="flex items-center justify-between gap-3">
      <span className="text-body-sm tabular-nums text-[var(--color-surface-hero-fg-muted)]">
        {date} · {departureTime}
      </span>
      <StatusPill tone={statusTone} surface="hero" leadingDot size="sm">
        {status}
      </StatusPill>
    </div>
  );
}

function RouteModule({
  origin,
  destination,
}: {
  origin: DepartingTrip["origin"];
  destination: DepartingTrip["destination"];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            {origin.city}
          </span>
          <span className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
            {origin.code}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            {destination.city}
          </span>
          <span className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
            {destination.code}
          </span>
        </div>
      </div>
      <RouteLine />
    </div>
  );
}

function RouteLine() {
  return (
    <span aria-hidden className="relative flex w-full items-center">
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-map-mint)]" />
      <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]">
        <PlaneIcon size={14} />
      </span>
      <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
    </span>
  );
}

function FlightContextRow({
  duration,
  airline,
  flightNumber,
}: {
  duration: string;
  airline: string;
  flightNumber: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-body-sm tabular-nums text-[var(--color-surface-hero-fg-muted)]">
        {duration}
      </span>
      <span className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        {airline} · {flightNumber}
      </span>
    </div>
  );
}

function DepartureFooterModule({
  untilDeparture,
  gate,
  terminal,
}: {
  untilDeparture: string;
  gate: string;
  terminal: string;
}) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]">
      <DepartureCell
        label="Until departure"
        value={
          <CountdownValue raw={untilDeparture} />
        }
      />
      <DepartureCell
        label="Gate"
        value={gate}
        helper={terminal}
        divider
        highlight
      />
    </div>
  );
}

function DepartureCell({
  label,
  value,
  helper,
  divider = false,
  highlight = false,
}: {
  label: string;
  value: React.ReactNode;
  helper?: string;
  divider?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 px-4 py-3 ${
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
        className={`text-title tabular-nums ${
          highlight
            ? "text-[var(--color-map-mint)]"
            : "text-[var(--color-surface-hero-fg)]"
        }`}
      >
        {value}
      </span>
      {helper ? (
        <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
          {helper}
        </span>
      ) : null}
    </div>
  );
}

function CountdownValue({ raw }: { raw: string }) {
  const match = raw.match(/^(\d+)d\s*(\d+)h$/i);
  if (!match) {
    return <span>{raw}</span>;
  }
  const [, days, hours] = match;
  return (
    <span className="inline-flex items-baseline gap-0.5">
      <span aria-hidden>{days}</span>
      <span
        aria-hidden
        className="text-label text-[var(--color-surface-hero-fg-soft)]"
      >
        d
      </span>
      <span aria-hidden className="ml-1.5">
        {hours}
      </span>
      <span
        aria-hidden
        className="text-label text-[var(--color-surface-hero-fg-soft)]"
      >
        h
      </span>
      <span className="sr-only">
        {days} days {hours} hours
      </span>
    </span>
  );
}

function CheckInNotice() {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="compact"
      aria-label="Check-in opens 24 hours before departure"
      className="flex items-start gap-3"
    >
      <span
        aria-hidden
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
      >
        <ShieldCheckIcon size={14} />
      </span>
      <p className="text-body-sm text-[var(--color-text-secondary)]">
        Check-in opens 24h before departure. We&rsquo;ll let you know.
      </p>
    </Card>
  );
}

function ActionsRow() {
  return (
    <div className="flex items-stretch gap-2">
      <div className="min-w-0 flex-1">
        <Button
          tone="primary"
          href={"/flights/detail" as Route}
          trailingIcon={<ArrowRightIcon size={16} />}
          aria-label="Review trip details"
        >
          Review Trip
        </Button>
      </div>
      <div className="w-[130px] shrink-0">
        <Button
          variant="secondary"
          href={"/parking" as Route}
          leadingIcon={<ParkingIcon size={14} />}
          aria-label="Find parking"
        >
          Parking
        </Button>
      </div>
    </div>
  );
}

function TripDetailsSection({ details }: { details: TripDetailRow[] }) {
  return (
    <section aria-label="Trip details" className="flex flex-col gap-3 pt-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-section-title text-[var(--color-text-primary)]">
          Trip details
        </h2>
        <Link
          href={"/flights/check-in" as Route}
          className="inline-flex h-11 items-center gap-1 text-body-sm-emphasis text-[var(--color-action-teal)] hover:opacity-80"
          aria-label="View boarding pass"
        >
          View boarding pass
          <ChevronRightIcon size={14} aria-hidden />
        </Link>
      </div>
      <Card
        as="div"
        surface="sheet"
        padding="none"
        className="overflow-hidden"
      >
        <ul className="flex flex-col">
          {details.map((row, index) => (
            <li
              key={row.id}
              className={`flex items-center justify-between gap-3 px-5 py-3 ${
                index > 0 ? "border-t border-[var(--color-border-soft)]" : ""
              }`}
            >
              <span className="text-body-sm text-[var(--color-text-secondary)]">
                {row.label}
              </span>
              <span className="text-body-sm-emphasis tabular-nums text-[var(--color-text-primary)]">
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
