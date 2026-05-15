import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  BellIcon,
  CheckIcon,
  FootstepsIcon,
  MapIcon,
  NavigationIcon,
  PlaneIcon,
} from "@/components/icons";

type FlightDetail = {
  airlineCode: string;
  airlineName: string;
  flightNumber: string;
  status: "On time" | "Delayed" | "Boarding" | "Cancelled";
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  departs: string;
  arrives: string;
  arrivesDayOffset?: number;
  gate: string;
  terminal: string;
  updatedLabel: string;
  boardingTime: string;
  walkMinutes: number;
};

type JourneyStepStatus = "complete" | "current" | "upcoming";

type JourneyStep = {
  id: string;
  label: string;
  status: JourneyStepStatus;
};

const FLIGHT: FlightDetail = {
  airlineCode: "AC",
  airlineName: "Air Canada",
  flightNumber: "AC 892",
  status: "On time",
  origin: { code: "YVR", city: "Vancouver" },
  destination: { code: "NRT", city: "Tokyo" },
  departs: "14:35",
  arrives: "17:20",
  arrivesDayOffset: 1,
  gate: "D73",
  terminal: "International Terminal",
  updatedLabel: "Updated now",
  boardingTime: "13:50",
  walkMinutes: 8,
};

const JOURNEY: JourneyStep[] = [
  { id: "checkin", label: "Check-in", status: "complete" },
  { id: "security", label: "Security", status: "complete" },
  { id: "at-gate", label: "At Gate", status: "current" },
  { id: "boarding", label: "Boarding", status: "upcoming" },
  { id: "in-flight", label: "In Flight", status: "upcoming" },
  { id: "arrived", label: "Arrived", status: "upcoming" },
];

export default function FlightDetailPage() {
  return (
    <AppShellAuthed activeHref="/flights">
      <FlightDetailHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <FlightPassCard flight={FLIGHT} />
        <CurrentActionCard flight={FLIGHT} />
        <JourneyCard
          steps={JOURNEY}
          boardingTime={FLIGHT.boardingTime}
          walkMinutes={FLIGHT.walkMinutes}
        />
      </div>
    </AppShellAuthed>
  );
}

function FlightDetailHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton
        aria-label="Back to My Flights"
        href={"/flights" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Flight Detail
        </h1>
        <p className="text-label text-[var(--color-text-secondary)]">
          Updated now
        </p>
      </div>

      <HeaderIconButton aria-label="Flight notifications">
        <BellIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function FlightPassCard({ flight }: { flight: FlightDetail }) {
  const accessibleName = `${flight.airlineName} flight ${flight.flightNumber}, ${flight.origin.city} to ${flight.destination.city}, departs ${flight.departs}, gate ${flight.gate}, ${flight.terminal}`;
  const statusTone =
    flight.status === "On time"
      ? "success"
      : flight.status === "Delayed"
        ? "warning"
        : flight.status === "Boarding"
          ? "info"
          : "danger";
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground />
      <div className="relative flex flex-col gap-5 p-5">
        <PassHeader
          airlineCode={flight.airlineCode}
          airlineName={flight.airlineName}
          flightNumber={flight.flightNumber}
          status={flight.status}
          statusTone={statusTone}
        />
        <RouteRow origin={flight.origin} destination={flight.destination} />
        <FlightInfoModule
          departs={flight.departs}
          arrives={flight.arrives}
          arrivesDayOffset={flight.arrivesDayOffset}
          gate={flight.gate}
        />
        <PassFooter
          terminal={flight.terminal}
          updatedLabel={flight.updatedLabel}
        />
      </div>
    </HeroSurface>
  );
}

function PassDecorBackground() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 350 360"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-[var(--color-surface-hero-fg)] opacity-[0.05]"
    >
      <path
        d="M -10 80 C 80 40 180 110 360 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M -10 300 C 100 260 220 320 360 270"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <circle cx="310" cy="40" r="2" fill="currentColor" />
      <circle cx="50" cy="320" r="2" fill="currentColor" />
    </svg>
  );
}

function PassHeader({
  airlineCode,
  airlineName,
  flightNumber,
  status,
  statusTone,
}: {
  airlineCode: string;
  airlineName: string;
  flightNumber: string;
  status: FlightDetail["status"];
  statusTone: "success" | "warning" | "info" | "danger";
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <IconTile
          size={36}
          className="rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] text-section-title text-[var(--color-surface-hero-fg)]"
        >
          <span aria-hidden>{airlineCode}</span>
        </IconTile>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-muted)]">
            {airlineName}
          </span>
          <span className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
            Flight {flightNumber}
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
}: {
  origin: FlightDetail["origin"];
  destination: FlightDetail["destination"];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
          {origin.code}
        </span>
        <RouteLine />
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
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-map-mint)]" />
      <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]">
        <PlaneIcon size={12} />
      </span>
      <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
    </span>
  );
}

function FlightInfoModule({
  departs,
  arrives,
  arrivesDayOffset,
  gate,
}: {
  departs: string;
  arrives: string;
  arrivesDayOffset?: number;
  gate: string;
}) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]">
      <InfoCell label="Departs" value={departs} />
      <InfoCell
        label="Arrives"
        value={
          <span className="inline-flex items-baseline gap-0.5 tabular-nums">
            {arrives}
            {arrivesDayOffset != null ? (
              <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
                +{arrivesDayOffset}
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

function PassFooter({
  terminal,
  updatedLabel,
}: {
  terminal: string;
  updatedLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[var(--color-surface-hero-tile-border)] pt-4">
      <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
        {terminal}
      </span>
      <span className="inline-flex items-center gap-1.5 text-label text-[var(--color-surface-hero-fg-muted)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
        />
        {updatedLabel}
      </span>
    </div>
  );
}

function CurrentActionCard({ flight }: { flight: FlightDetail }) {
  return (
    <Card as="section" surface="sheet" padding="default" className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          Current action
        </span>
        <span className="inline-flex h-6 items-center rounded-[var(--radius-pill)] bg-[var(--color-map-mint-bg)] px-2.5 text-micro uppercase text-[var(--color-action-teal)]">
          Next step
        </span>
      </div>

      <div className="flex items-start gap-3">
        <IconTile
          size={40}
          className="rounded-[var(--radius-tile)] bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]"
        >
          <NavigationIcon size={18} />
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="text-section-title text-[var(--color-text-primary)]">
            Navigate to Gate {flight.gate}
          </h2>
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            {flight.walkMinutes} min walk · {flight.terminal}
          </p>
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Boarding starts {flight.boardingTime}
          </p>
        </div>
      </div>

      <div className="flex items-stretch gap-2">
        <div className="min-w-0 flex-1">
          <Button
            tone="teal"
            href={"/flights/detail/navigate" as Route}
            leadingIcon={<NavigationIcon size={16} />}
          >
            Start Walking
          </Button>
        </div>
        <div className="w-[110px] shrink-0">
          <Button
            variant="secondary"
            href={"/flights/detail/map" as Route}
            leadingIcon={<MapIcon size={14} />}
          >
            Map
          </Button>
        </div>
      </div>
    </Card>
  );
}

function JourneyCard({
  steps,
  boardingTime,
  walkMinutes,
}: {
  steps: JourneyStep[];
  boardingTime: string;
  walkMinutes: number;
}) {
  const currentLabel = steps.find((s) => s.status === "current")?.label ?? "";
  return (
    <Card as="section" surface="sheet" padding="default" className="flex flex-col gap-4" aria-label="Your journey progress">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
            Your journey
          </span>
          <span className="text-section-title text-[var(--color-text-primary)]">
            {currentLabel}
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
            Boarding
          </span>
          <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
            {boardingTime}
          </span>
        </div>
      </div>

      <JourneyTimeline steps={steps} />

      <WalkToGateRow walkMinutes={walkMinutes} />
    </Card>
  );
}

function JourneyTimeline({ steps }: { steps: JourneyStep[] }) {
  return (
    <ol
      aria-label="Journey steps"
      className="grid"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((step, i) => (
        <JourneyStepCell
          key={step.id}
          step={step}
          isFirst={i === 0}
          isLast={i === steps.length - 1}
        />
      ))}
    </ol>
  );
}

function JourneyStepCell({
  step,
  isFirst,
  isLast,
}: {
  step: JourneyStep;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <li
      aria-current={step.status === "current" ? "step" : undefined}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative flex h-6 w-full items-center justify-center">
        <span
          aria-hidden
          className={`absolute left-0 top-1/2 h-px w-1/2 -translate-y-1/2 ${
            isFirst
              ? ""
              : step.status === "upcoming"
                ? "bg-[var(--color-border-soft)]"
                : "bg-[var(--color-action-teal)]"
          }`}
        />
        <span
          aria-hidden
          className={`absolute right-0 top-1/2 h-px w-1/2 -translate-y-1/2 ${
            isLast
              ? ""
              : step.status === "complete"
                ? "bg-[var(--color-action-teal)]"
                : "bg-[var(--color-border-soft)]"
          }`}
        />
        <JourneyStepDot status={step.status} />
      </div>
      <span
        className={`text-label ${
          step.status === "current"
            ? "text-[var(--color-text-primary)]"
            : "text-[var(--color-text-secondary)]"
        }`}
      >
        {step.label}
      </span>
      <span className="sr-only">
        {step.status === "complete"
          ? "completed"
          : step.status === "current"
            ? "current step"
            : "upcoming"}
      </span>
    </li>
  );
}

function JourneyStepDot({ status }: { status: JourneyStepStatus }) {
  if (status === "complete") {
    return (
      <span
        aria-hidden
        className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]"
      >
        <CheckIcon size={12} />
      </span>
    );
  }
  if (status === "current") {
    return (
      <span
        aria-hidden
        className="relative inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--color-action-teal)] bg-[var(--color-surface-sheet)]"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-action-teal)]" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface-sheet)]"
    />
  );
}

function WalkToGateRow({ walkMinutes }: { walkMinutes: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-tile)] bg-[var(--color-surface-tile)] px-3 py-3">
      <div className="inline-flex items-center gap-2 text-body-sm text-[var(--color-text-primary)]">
        <span
          aria-hidden
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-action-teal)]"
        >
          <FootstepsIcon size={12} />
        </span>
        Walk to gate
      </div>
      <span className="text-body-sm-emphasis tabular-nums text-[var(--color-text-primary)]">
        {walkMinutes} min
      </span>
    </div>
  );
}
