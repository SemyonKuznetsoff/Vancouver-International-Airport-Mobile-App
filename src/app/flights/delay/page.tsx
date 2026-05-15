import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  FootstepsIcon,
  MapIcon,
  NavigationIcon,
  PlaneIcon,
  SyncIcon,
} from "@/components/icons";

type FlightUpdate = {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  delayMinutes: number;
  before: { gate: string; time: string };
  after: { gate: string; time: string; terminal: string };
  walkMinutes: number;
  nextGate: string;
};

type Step = {
  id: string;
  index: number;
  title: string;
  detail: string;
  badge: string;
  tone: "action" | "info";
};

const UPDATE: FlightUpdate = {
  flightNumber: "AC 892",
  airline: "Air Canada",
  origin: "YVR",
  destination: "NRT",
  delayMinutes: 40,
  before: { gate: "D73", time: "14:35" },
  after: { gate: "E71", time: "15:15", terminal: "Intl Terminal" },
  walkMinutes: 8,
  nextGate: "E71",
};

const STEPS: Step[] = [
  {
    id: "head",
    index: 1,
    title: "Head to Gate E71",
    detail: "Intl Terminal · 8 min walk",
    badge: "Action",
    tone: "action",
  },
];

export default function FlightDelayPage() {
  return (
    <AppShellAuthed activeHref="/flights">
      <FlightDelayHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <FlightUpdateCard update={UPDATE} />
        <NextActionCard update={UPDATE} />
        <WhatToDoNowSection steps={STEPS} totalSteps={3} />
      </div>
    </AppShellAuthed>
  );
}

function FlightDelayHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <Link
        href={"/flights" as Route}
        aria-label="Back to My Flights"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-[var(--shadow-card)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
      >
        <ArrowLeftIcon size={16} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
        <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          My Flights
        </span>
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Flight Update
        </h1>
      </div>

      <button
        type="button"
        aria-label="Flight notifications, new alert"
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-[var(--shadow-card)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
      >
        <BellIcon size={16} />
        <span
          aria-hidden
          className="absolute right-2 top-2 inline-block h-2 w-2 rounded-full bg-[var(--color-warning)] ring-2 ring-[var(--color-surface-elevated)]"
        />
      </button>
    </header>
  );
}

function FlightUpdateCard({ update }: { update: FlightUpdate }) {
  const accessibleName = `Live flight update for ${update.airline} flight ${update.flightNumber}: gate change to ${update.after.gate}, delayed ${update.delayMinutes} minutes.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground />
      <div className="relative flex flex-col gap-4 p-5">
        <UpdateMetaRow />
        <UpdateTitleRow delayMinutes={update.delayMinutes} />
        <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          Review your updated gate and timing.
        </p>
        <FlightRow
          flightNumber={update.flightNumber}
          airline={update.airline}
          origin={update.origin}
          destination={update.destination}
        />
        <GateChangeModule before={update.before} after={update.after} />
      </div>
    </HeroSurface>
  );
}

function PassDecorBackground() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 350 480"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-[var(--color-surface-hero-fg)] opacity-[0.05]"
    >
      <path
        d="M -10 100 C 80 60 200 130 360 80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M -10 380 C 100 340 230 410 360 360"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
    </svg>
  );
}

function UpdateMetaRow() {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-micro uppercase text-[var(--color-surface-hero-fg)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]"
        />
        Live flight update
      </span>
      <span className="inline-flex items-center gap-1.5 text-label text-[var(--color-surface-hero-fg-muted)]">
        <SyncIcon size={12} aria-hidden />
        Updated now
      </span>
    </div>
  );
}

function UpdateTitleRow({ delayMinutes }: { delayMinutes: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <h2 className="text-title text-[var(--color-surface-hero-fg)]">
        Gate Change{" "}
        <span className="text-[var(--color-map-mint)]" aria-hidden>
          +
        </span>{" "}
        Delay
      </h2>
      <DelayPill minutes={delayMinutes} />
    </div>
  );
}

function DelayPill({ minutes }: { minutes: number }) {
  return (
    <span
      className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-3 text-micro uppercase text-[var(--color-warning-fg)]"
      aria-label={`Delayed ${minutes} minutes`}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]"
      />
      Delayed {minutes} min
    </span>
  );
}

function FlightRow({
  flightNumber,
  airline,
  origin,
  destination,
}: {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
}) {
  return (
    <Link
      href={"/flights" as Route}
      aria-label={`${airline} flight ${flightNumber}, ${origin} to ${destination}`}
      className="inline-flex items-center gap-3 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--color-surface-hero-chip)]"
    >
      <IconTile
        size={32}
        className="rounded-[var(--radius-tile)] bg-[var(--color-surface-hero-chip)] text-[var(--color-surface-hero-fg)]"
      >
        <PlaneIcon size={14} />
      </IconTile>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
          {flightNumber} · {airline}
        </span>
        <span className="text-label tabular-nums text-[var(--color-surface-hero-fg-soft)]">
          {origin} → {destination}
        </span>
      </span>
      <span aria-hidden className="inline-flex text-[var(--color-surface-hero-fg-muted)]">
        <ArrowRightIcon size={14} />
      </span>
    </Link>
  );
}

function GateChangeModule({
  before,
  after,
}: {
  before: FlightUpdate["before"];
  after: FlightUpdate["after"];
}) {
  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <GateCard label="Before" gate={before.gate} time={before.time} tone="muted" />
      <GateChangeArrow />
      <GateCard
        label="New gate"
        gate={after.gate}
        time={after.time}
        helper={after.terminal}
        tone="warning"
      />
    </div>
  );
}

function GateCard({
  label,
  gate,
  time,
  helper,
  tone,
}: {
  label: string;
  gate: string;
  time: string;
  helper?: string;
  tone: "muted" | "warning";
}) {
  const isWarning = tone === "warning";
  return (
    <div
      className={`flex flex-col gap-1.5 rounded-[var(--radius-tile)] border px-3.5 py-3 ${
        isWarning
          ? "border-[var(--color-warning-border)] bg-[var(--color-warning-bg)]"
          : "border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]"
      }`}
    >
      <span
        className={`text-micro uppercase ${
          isWarning
            ? "text-[var(--color-warning-fg)]"
            : "text-[var(--color-surface-hero-fg-soft)]"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-title tabular-nums ${
          isWarning
            ? "text-[var(--color-warning-fg)]"
            : "line-through text-[var(--color-surface-hero-fg-soft)]"
        }`}
      >
        {gate}
      </span>
      <span
        className={`text-label tabular-nums ${
          isWarning
            ? "text-[var(--color-warning-fg)]"
            : "text-[var(--color-surface-hero-fg-soft)]"
        }`}
      >
        {time}
        {helper ? <span aria-hidden> · {helper}</span> : null}
        {helper ? <span className="sr-only">, {helper}</span> : null}
      </span>
    </div>
  );
}

function GateChangeArrow() {
  return (
    <span
      aria-hidden
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-warning)] text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button)]"
    >
      <ArrowRightIcon size={14} />
    </span>
  );
}

function NextActionCard({ update }: { update: FlightUpdate }) {
  return (
    <Card as="section" surface="sheet" padding="default" className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-eyebrow uppercase text-[var(--color-action-teal)]">
          Next action
        </span>
        <span className="inline-flex items-center gap-1.5 text-label text-[var(--color-text-secondary)]">
          <FootstepsIcon size={12} aria-hidden />
          {update.walkMinutes} min walk
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
            Head to Gate {update.nextGate}
          </h2>
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            International Terminal · best route avoids the central concourse.
          </p>
        </div>
      </div>

      <div className="flex items-stretch gap-2">
        <div className="min-w-0 flex-1">
          <Button
            tone="teal"
            href={"/flights/delay/navigate" as Route}
            trailingIcon={<ArrowRightIcon size={16} />}
          >
            Start Walking
          </Button>
        </div>
        <div className="w-[110px] shrink-0">
          <Button
            variant="secondary"
            href={"/flights/delay/map" as Route}
            leadingIcon={<MapIcon size={14} />}
          >
            Map
          </Button>
        </div>
      </div>
    </Card>
  );
}

function WhatToDoNowSection({
  steps,
  totalSteps,
}: {
  steps: Step[];
  totalSteps: number;
}) {
  return (
    <section aria-label="What to do now" className="flex flex-col gap-3 pt-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-section-title text-[var(--color-text-primary)]">
          What to do now
        </h2>
        <span className="text-label text-[var(--color-text-secondary)]">
          {totalSteps} steps
        </span>
      </div>
      <ol className="flex flex-col gap-2">
        {steps.map((step) => (
          <li key={step.id}>
            <StepCard step={step} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  return (
    <Card
      as="article"
      surface="sheet"
      padding="default"
      className="flex items-center gap-3"
    >
      <span
        aria-hidden
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-warning)] text-body-sm-emphasis text-[var(--color-action-primary-fg)]"
      >
        {step.index}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
          {step.title}
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {step.detail}
        </span>
      </div>
      <span
        className={`inline-flex h-6 shrink-0 items-center rounded-[var(--radius-pill)] px-2.5 text-micro uppercase ${
          step.tone === "action"
            ? "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]"
            : "bg-[var(--color-surface-tile)] text-[var(--color-text-secondary)]"
        }`}
      >
        {step.badge}
      </span>
    </Card>
  );
}
