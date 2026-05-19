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
  reference: string;
  boardingTime: string;
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
  reference: "AC892-E71",
  boardingTime: "Boarding 13:50",
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
        <WhatToDoNowSection steps={STEPS} totalSteps={STEPS.length} />
      </div>
    </AppShellAuthed>
  );
}

function FlightDelayHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton
        aria-label="Back to flight detail"
        href={"/flights/detail" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
        <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          My Flights
        </span>
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Flight Update
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

function FlightUpdateCard({ update }: { update: FlightUpdate }) {
  const accessibleName = `Live flight update for ${update.airline} flight ${update.flightNumber}: gate change to ${update.after.gate}, delayed ${update.delayMinutes} minutes.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="delay" />
      <div className="relative flex flex-col gap-5 p-5">
        {/* Pass header — status + sync */}
        <UpdateMetaRow />

        {/* Main identity — title, pill, supporting copy */}
        <div className="flex flex-col gap-3">
          <UpdateTitleRow delayMinutes={update.delayMinutes} />
          <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
            Review your updated gate and timing.
          </p>
        </div>

        {/* Flight identity row */}
        <FlightIdentityRow
          flightNumber={update.flightNumber}
          airline={update.airline}
          origin={update.origin}
          destination={update.destination}
        />

        <PassPerforation inset="-mx-5" />

        {/* Document metadata zone — scan tile + reference/updated/valid */}
        <PassDocumentBlock
          reference={update.reference}
          boardingTime={update.boardingTime}
        />

        {/* Gate change zone */}
        <GateChangeModule before={update.before} after={update.after} />

        {/* Pass footer — terminal chip + barcode stripe */}
        <PassFooter terminal={update.after.terminal} />
      </div>
    </HeroSurface>
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

function FlightIdentityRow({
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
      href={"/flights/detail" as Route}
      aria-label={`View ${airline} flight ${flightNumber} details, ${origin} to ${destination}`}
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

function PassDocumentBlock({
  reference,
  boardingTime,
}: {
  reference: string;
  boardingTime: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <FlightUpdateScanTile />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            Reference
          </span>
          <span className="font-mono text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
            {reference}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            Updated
          </span>
          <span className="text-body-sm text-[var(--color-surface-hero-fg)]">
            Gate change · Delay
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            Valid
          </span>
          <span className="text-body-sm tabular-nums text-[var(--color-surface-hero-fg)]">
            {boardingTime}
          </span>
        </div>
      </div>
    </div>
  );
}

function FlightUpdateScanTile() {
  return (
    <div
      aria-hidden
      className="relative flex shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-hero-fg)] p-3 shadow-[var(--shadow-card)]"
      style={{ width: 116, height: 116 }}
    >
      <FlightUpdateGlyph />
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-action-teal)] text-[var(--color-surface-hero-fg)]"
        >
          <PlaneIcon size={14} />
        </span>
      </span>
    </div>
  );
}

/**
 * Abstract pass glyph — three finder-pattern corner blocks like a QR
 * code, with sparse internal cells for "document scan tile" feel.
 * Not a scannable code. Decorative only (`aria-hidden` on the tile
 * wrapper).
 */
function FlightUpdateGlyph() {
  return (
    <svg
      viewBox="0 0 21 21"
      className="h-full w-full text-[var(--color-text-primary)]"
      aria-hidden
    >
      {FLIGHT_GLYPH_CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
      <FinderPatternMini x={0} y={0} />
      <FinderPatternMini x={14} y={0} />
      <FinderPatternMini x={0} y={14} />
    </svg>
  );
}

function FinderPatternMini({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={5} height={5} fill="currentColor" />
      <rect
        x={x + 1}
        y={y + 1}
        width={3}
        height={3}
        fill="var(--color-surface-hero-fg)"
      />
      <rect x={x + 2} y={y + 2} width={1} height={1} fill="currentColor" />
    </g>
  );
}

const FLIGHT_GLYPH_CELLS: ReadonlyArray<readonly [number, number]> = [
  [8, 0], [10, 0], [12, 0],
  [9, 1], [11, 1],
  [7, 2], [13, 2],
  [6, 3], [10, 3], [14, 3],
  [8, 4], [12, 4],
  [11, 5],
  [7, 6], [9, 6], [13, 6],
  [0, 7], [2, 7], [4, 7], [9, 7], [11, 7], [16, 7], [18, 7], [20, 7],
  [1, 8], [3, 8], [5, 8], [7, 8], [13, 8], [15, 8], [17, 8], [19, 8],
  [0, 9], [4, 9], [10, 9], [12, 9], [16, 9], [20, 9],
  [2, 10], [6, 10], [8, 10], [14, 10], [18, 10],
  [1, 11], [3, 11], [11, 11], [15, 11], [19, 11],
  [9, 12], [13, 12], [17, 12],
  [7, 13], [11, 13], [15, 13], [20, 13],
  [9, 14], [13, 14], [16, 14], [18, 14],
  [11, 15], [14, 15], [19, 15],
  [8, 16], [12, 16], [15, 16], [17, 16], [20, 16],
  [10, 17], [13, 17], [18, 17],
  [8, 18], [11, 18], [14, 18], [16, 18], [20, 18],
  [9, 19], [12, 19], [15, 19], [17, 19], [19, 19],
  [10, 20], [13, 20], [16, 20], [18, 20], [20, 20],
];

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
        {isWarning ? gate : <s>{gate}</s>}
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

function PassFooter({ terminal }: { terminal: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[var(--color-surface-hero-tile-border)] pt-4">
      <div className="inline-flex min-w-0 items-center gap-2.5">
        <PassTerminalChip />
        <span className="truncate text-label text-[var(--color-surface-hero-fg-muted)]">
          Show update at gate · {terminal}
        </span>
      </div>
      <PassBarcodeMarks />
    </div>
  );
}

function PassTerminalChip() {
  return (
    <span
      aria-hidden
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
    >
      <SyncIcon size={12} />
    </span>
  );
}

function PassBarcodeMarks() {
  const widths = [10, 16, 8, 14, 12, 18, 10];
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-end gap-[3px]"
      style={{ height: 18 }}
    >
      {widths.map((h, i) => (
        <span
          key={i}
          className="inline-block w-0.5 rounded-full bg-[var(--color-surface-hero-fg-soft)]"
          style={{ height: h }}
        />
      ))}
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
            trailingIcon={<ArrowRightIcon size={16} />}
            aria-label={`Start walking to gate ${update.nextGate}`}
          >
            Start Walking
          </Button>
        </div>
        <div className="w-28 shrink-0">
          <Button
            variant="secondary"
            leadingIcon={<MapIcon size={14} />}
            aria-label="Open terminal map"
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
          {totalSteps} {totalSteps === 1 ? "step" : "steps"}
        </span>
      </div>
      <ol className="flex flex-col gap-2">
        {steps.map((step) => (
          <li
            key={step.id}
            aria-current={step.tone === "action" ? "step" : undefined}
          >
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
