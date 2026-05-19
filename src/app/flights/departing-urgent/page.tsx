import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { Heading } from "@/components/Heading";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  ChevronRightIcon,
  ClockIcon,
  NavigationIcon,
  PlaneIcon,
} from "@/components/icons";

type UrgentTrip = {
  airline: string;
  flightNumber: string;
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  date: string;
  departureTime: string;
  boardingTime: string;
  boardingInMinutes: number;
  walkMinutes: number;
  securityMinutes: number;
  bufferMinutes: number;
  duration: string;
  gate: string;
  terminal: string;
};

type TripDetailRow = {
  id: string;
  label: string;
  value: string;
};

const TRIP: UrgentTrip = {
  airline: "Air Canada",
  flightNumber: "AC892",
  origin: { code: "YVR", city: "Vancouver" },
  destination: { code: "NRT", city: "Tokyo" },
  date: "Thu · Apr 23",
  departureTime: "14:35",
  boardingTime: "14:15",
  boardingInMinutes: 28,
  walkMinutes: 12,
  securityMinutes: 8,
  bufferMinutes: 6,
  duration: "9h 50m",
  gate: "D73",
  terminal: "Intl Terminal",
};

const TRIP_DETAILS: TripDetailRow[] = [
  { id: "flight", label: "Flight", value: "AC892 · Air Canada" },
  { id: "boarding", label: "Boarding", value: "14:15" },
  { id: "gate", label: "Gate", value: "D73 · Intl Terminal" },
  { id: "walk", label: "Walk time", value: "12 min" },
];

export default function DepartingUrgentPage() {
  return (
    <AppShellAuthed activeHref="/flights">
      <DepartingUrgentHeader />
      <div className="flex flex-1 flex-col gap-5 px-6 pt-2 pb-8">
        <DepartingUrgentPass trip={TRIP} />
        <LeaveNowGuidanceCard trip={TRIP} />
        <PrimaryRouteCTA gate={TRIP.gate} />
        <ViewBoardingPassLink />
        <TripDetailsSection details={TRIP_DETAILS} />
      </div>
    </AppShellAuthed>
  );
}

function DepartingUrgentHeader() {
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

      <HeaderIconButton
        aria-label="Flight notifications, new alert"
        href={"/profile/notifications" as Route}
        badgeDot
      >
        <BellIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function DepartingUrgentPass({ trip }: { trip: UrgentTrip }) {
  const accessibleName = `Urgent departing flight from ${trip.origin.city} ${trip.origin.code} to ${trip.destination.city} ${trip.destination.code}, ${trip.airline} ${trip.flightNumber}, boarding at ${trip.boardingTime}, gate ${trip.gate}, start route now.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-6 p-6">
        <PassIntro
          gate={trip.gate}
          boardingInMinutes={trip.boardingInMinutes}
        />
        <DepartureMetaRow
          date={trip.date}
          departureTime={trip.departureTime}
        />
        <RouteModule origin={trip.origin} destination={trip.destination} />
        <FlightContextRow
          duration={trip.duration}
          airline={trip.airline}
          flightNumber={trip.flightNumber}
        />
        <PassPerforation />
        <UrgencyMetricsModule
          boardingInMinutes={trip.boardingInMinutes}
          walkMinutes={trip.walkMinutes}
          gate={trip.gate}
          terminal={trip.terminal}
        />
      </div>
    </HeroSurface>
  );
}

function PassIntro({
  gate,
  boardingInMinutes,
}: {
  gate: string;
  boardingInMinutes: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow tone="hero">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]"
          />
          Boarding soon · Leave now
        </span>
      </Eyebrow>
      <Heading as="h2" size="display" tone="hero">
        Boarding soon.
        <br />
        <em>Leave for Gate {gate}.</em>
      </Heading>
      <p className="text-body text-[var(--color-surface-hero-fg-muted)]">
        Boarding starts in {boardingInMinutes} min. Leave now to stay on track.
      </p>
    </div>
  );
}

function DepartureMetaRow({
  date,
  departureTime,
}: {
  date: string;
  departureTime: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-body-sm tabular-nums text-[var(--color-surface-hero-fg-muted)]">
        {date} · {departureTime}
      </span>
      <StatusPill tone="warning" surface="hero" leadingDot size="sm">
        Leave now
      </StatusPill>
    </div>
  );
}

function RouteModule({
  origin,
  destination,
}: {
  origin: UrgentTrip["origin"];
  destination: UrgentTrip["destination"];
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

type MetricTone = "warning" | "neutral" | "mint";

function UrgencyMetricsModule({
  boardingInMinutes,
  walkMinutes,
  gate,
  terminal,
}: {
  boardingInMinutes: number;
  walkMinutes: number;
  gate: string;
  terminal: string;
}) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]">
      <MetricCell
        label="Boarding in"
        value={`${boardingInMinutes}m`}
        srValue={`${boardingInMinutes} minutes`}
        tone="warning"
      />
      <MetricCell
        label="Walk"
        value={`${walkMinutes}m`}
        srValue={`${walkMinutes} minutes`}
        tone="neutral"
        divider
      />
      <MetricCell
        label="Gate"
        value={gate}
        helper={terminal}
        tone="mint"
        divider
      />
    </div>
  );
}

function MetricCell({
  label,
  value,
  helper,
  srValue,
  tone,
  divider = false,
}: {
  label: string;
  value: string;
  helper?: string;
  srValue?: string;
  tone: MetricTone;
  divider?: boolean;
}) {
  const surfaceClass =
    tone === "warning"
      ? "bg-[var(--color-warning-bg)]"
      : tone === "mint"
        ? "bg-[var(--color-map-mint-bg)]"
        : "";
  const labelClass =
    tone === "warning"
      ? "text-[var(--color-warning-fg)]"
      : tone === "mint"
        ? "text-[var(--color-map-mint)]"
        : "text-[var(--color-surface-hero-fg-soft)]";
  const valueClass =
    tone === "warning"
      ? "text-[var(--color-warning-fg)]"
      : tone === "mint"
        ? "text-[var(--color-map-mint)]"
        : "text-[var(--color-surface-hero-fg)]";
  return (
    <div
      className={`flex flex-col gap-1 px-3 py-3 ${
        divider ? "border-l border-[var(--color-surface-hero-tile-border)]" : ""
      } ${surfaceClass}`.trim()}
    >
      <span className={`text-micro uppercase ${labelClass}`}>{label}</span>
      <span className={`text-section-title tabular-nums ${valueClass}`}>
        <span aria-hidden>{value}</span>
        {srValue ? <span className="sr-only">{srValue}</span> : null}
      </span>
      {helper ? (
        <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
          {helper}
        </span>
      ) : null}
    </div>
  );
}

function LeaveNowGuidanceCard({ trip }: { trip: UrgentTrip }) {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="default"
      aria-label={`Leave now to stay on track. Security is ${trip.securityMinutes} minutes. You have a ${trip.bufferMinutes} minute buffer.`}
      className="flex items-start gap-3"
    >
      <IconTile
        size={36}
        className="rounded-[var(--radius-tile)] bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]"
      >
        <ClockIcon size={16} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
          Leave now to stay on track.
        </span>
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Security is {trip.securityMinutes} min. You have a {trip.bufferMinutes} min buffer.
        </span>
      </div>
    </Card>
  );
}

function PrimaryRouteCTA({ gate }: { gate: string }) {
  return (
    <Button
      tone="primary"
      href={"/map/live-navigation" as Route}
      leadingIcon={<NavigationIcon size={16} />}
      trailingIcon={<ArrowRightIcon size={16} />}
      aria-label={`Start route to gate ${gate} now`}
    >
      Start route to {gate} now
    </Button>
  );
}

function ViewBoardingPassLink() {
  return (
    <div className="flex justify-center">
      <Link
        href={"/flights/check-in" as Route}
        className="inline-flex h-11 items-center gap-1 text-body-sm-emphasis text-[var(--color-action-teal)] hover:opacity-80"
        aria-label="View boarding pass"
      >
        View boarding pass
        <ChevronRightIcon size={14} aria-hidden />
      </Link>
    </div>
  );
}

function TripDetailsSection({ details }: { details: TripDetailRow[] }) {
  return (
    <section aria-label="Trip details" className="flex flex-col gap-3 pt-2">
      <h2 className="text-section-title text-[var(--color-text-primary)]">
        Trip details
      </h2>
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
