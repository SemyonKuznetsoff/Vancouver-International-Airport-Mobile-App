"use client";

import { useState } from "react";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { StatusPill } from "@/components/StatusPill";
import {
  CloseIcon,
  DiningIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@/components/icons";

type LevelId = "L1" | "L2" | "L3";

type RouteStep = {
  id: string;
  title: string;
  distance: string;
  icon: React.ReactNode;
  state: "current" | "upcoming";
};

const DESTINATION = "Gate D73";
const DESTINATION_META = "International · Level 2";
const NEXT_INSTRUCTION = "Turn right at Duty Free";
const NEXT_DETAIL = "Then straight 180 m to Gate D73";
const NEXT_DISTANCE = "60";
const NEXT_DISTANCE_UNIT = "m";
const PROGRESS_PCT = 62;
const PROGRESS_REMAINING = "260 m remaining";
const PROGRESS_STEPS = "2 steps";
const PROGRESS_LABEL = "62% complete";

const BOARDING_LINE = "Boarding 14:15";
const BOARDING_BUFFER = "42 min buffer";
const BOARDING_TITLE = "Boarding on track";

const STOP_TITLE = "Coffee is safe";
const STOP_DETAIL = "+0 min route impact";

const LEVELS: LevelId[] = ["L3", "L2", "L1"];

const ROUTE_STEPS: RouteStep[] = [
  {
    id: "duty-free",
    title: "Turn right at Duty Free",
    distance: "60 m",
    icon: <TurnRightGlyph />,
    state: "current",
  },
  {
    id: "gate",
    title: "Straight toward D73",
    distance: "180 m",
    icon: <StraightGlyph />,
    state: "upcoming",
  },
];

export default function LiveNavigationPage() {
  const [level, setLevel] = useState<LevelId>("L2");

  return (
    <AppShellAuthed activeHref="/map" hideTabBar>
      <h1 className="sr-only">{`Live navigation to ${DESTINATION}`}</h1>

      <NavHeader />

      <section
        aria-label={`Live route preview, ${level}. Turn right at Duty Free in 60 metres, then straight 180 metres to ${DESTINATION}.`}
        className="relative mx-4 mt-3 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-[var(--color-surface-tile)] shadow-[var(--shadow-card)]"
        style={{ height: 280 }}
      >
        <MapCanvasArt />
        <LevelSelector value={level} onChange={setLevel} />
        <GateMarker />
      </section>

      <NavSheet />
    </AppShellAuthed>
  );
}

/* ----------------------------------------------------------- Top header */

function NavHeader() {
  return (
    <header className="flex items-start gap-3 px-4 pt-1">
      <HeaderIconButton aria-label="Exit live navigation" href="/map">
        <CloseIcon size={16} />
      </HeaderIconButton>
      <Card
        as="section"
        padding="compact"
        aria-label={`Active destination ${DESTINATION}, ${DESTINATION_META}, on track`}
        className="flex flex-1 items-center gap-3"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            {DESTINATION}
          </span>
          <span className="text-label text-[var(--color-text-secondary)]">
            {DESTINATION_META}
          </span>
        </div>
        <StatusPill tone="success" size="sm" leadingDot>
          On Track
        </StatusPill>
      </Card>
    </header>
  );
}

/* ------------------------------------------------------- Gate marker chip */

function GateMarker() {
  return (
    <span className="pointer-events-none absolute right-12 top-2 z-20 inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-2 py-0.5 text-micro uppercase text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button-teal)]">
      Gate D73
    </span>
  );
}

/* --------------------------------------------------- Level selector */

function LevelSelector({
  value,
  onChange,
}: {
  value: LevelId;
  onChange: (next: LevelId) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Map level"
      className="absolute right-3 top-12 z-20 flex flex-col gap-1 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sheet)] p-1 shadow-[var(--shadow-card)]"
    >
      {LEVELS.map((id) => {
        const isActive = id === value;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`Level ${id.slice(1)}`}
            onClick={() => onChange(id)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] text-label transition-colors duration-150 ${
              isActive
                ? "bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button-teal)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span className="font-semibold tabular-nums">{id}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------- Map canvas SVG */

function MapCanvasArt() {
  return (
    <span aria-hidden className="absolute inset-0">
      <svg
        viewBox="0 0 360 280"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <pattern
            id="ln-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M32 0H0V32"
              fill="none"
              stroke="var(--color-border-soft)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        <rect width="360" height="280" fill="url(#ln-grid)" opacity="0.55" />

        {/* Café (top-left) */}
        <rect
          x="32"
          y="64"
          width="86"
          height="60"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text
          x="75"
          y="98"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-muted)"
        >
          CAFÉ
        </text>

        {/* Security (bottom-left) */}
        <rect
          x="32"
          y="196"
          width="92"
          height="60"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text
          x="78"
          y="230"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-muted)"
        >
          SECURITY
        </text>

        {/* Lounge (bottom-centre) */}
        <rect
          x="146"
          y="196"
          width="82"
          height="60"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text
          x="187"
          y="230"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-muted)"
        >
          LOUNGE
        </text>

        {/* Duty Free (centre — the turn point) */}
        <rect
          x="160"
          y="92"
          width="110"
          height="78"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-action-teal)"
          strokeWidth="1.5"
        />
        <text
          x="215"
          y="124"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          DUTY FREE
        </text>
        <text
          x="215"
          y="140"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.04em"
          fill="var(--color-text-secondary)"
        >
          turn point
        </text>

        {/* Past-route segment (dotted, faded) — behind current position */}
        <path
          d="M 24 168 L 60 168 L 96 168 L 132 168"
          fill="none"
          stroke="var(--color-text-muted)"
          strokeWidth="2"
          strokeDasharray="2 4"
          strokeLinecap="round"
        />

        {/* Active route line — soft glow */}
        <path
          d="M 132 168 L 168 168 L 200 168 L 215 168 L 215 132 L 285 132 L 320 132 L 340 100"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="6"
          opacity="0.14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Active route line — crisp */}
        <path
          d="M 132 168 L 168 168 L 200 168 L 215 168 L 215 132 L 285 132 L 320 132 L 340 100"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Turn marker — open circle at the Duty Free corner */}
        <circle
          cx="215"
          cy="168"
          r="9"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-action-teal)"
          strokeWidth="2"
        />
        <path
          d="M 211 170 L 215 165 L 219 170"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current-location dot */}
        <circle
          cx="132"
          cy="168"
          r="9"
          fill="var(--color-action-teal)"
          opacity="0.18"
        />
        <circle
          cx="132"
          cy="168"
          r="5"
          fill="var(--color-action-teal)"
        />
      </svg>
    </span>
  );
}

/* ----------------------------------------------- Bottom navigation sheet */

function NavSheet() {
  return (
    <section
      aria-label="Live navigation details"
      className="relative mt-3 flex flex-1 flex-col gap-3 rounded-t-[var(--radius-card)] border-t border-[var(--color-border)] bg-[var(--color-surface-sheet)] px-4 pt-3 pb-6 shadow-[var(--shadow-sheet)]"
    >
      <SheetGrabber />
      <InstructionCard />
      <div className="grid grid-cols-2 gap-3">
        <BoardingCard />
        <StopCard />
      </div>
      <RouteTimelineList />
    </section>
  );
}

function SheetGrabber() {
  return (
    <span
      aria-hidden
      className="mx-auto inline-block h-1 w-10 rounded-[var(--radius-pill)] bg-[var(--color-border)]"
    />
  );
}

/* ----------------------------------------------- Instruction (hero) card */

function InstructionCard() {
  return (
    <section
      aria-label={`In ${NEXT_DISTANCE} metres: ${NEXT_INSTRUCTION}. ${NEXT_DETAIL}. ${PROGRESS_REMAINING}, ${PROGRESS_STEPS}, ${PROGRESS_LABEL}.`}
      className="relative overflow-hidden rounded-[var(--radius-card)] p-5 text-[var(--color-surface-hero-fg)] shadow-[var(--shadow-hero-card)]"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--color-surface-hero-start) 0%, var(--color-surface-hero-end) 100%)",
      }}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-hero-tile)] text-[var(--color-map-mint)]"
        >
          <TurnRightGlyph size={28} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col items-end gap-0.5 text-right">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
            In
          </span>
          <span className="flex items-baseline gap-1">
            <span className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
              {NEXT_DISTANCE}
            </span>
            <span className="text-section-title text-[var(--color-surface-hero-fg-muted)]">
              {NEXT_DISTANCE_UNIT}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <p className="text-section-title text-[var(--color-surface-hero-fg)]">
          {NEXT_INSTRUCTION}
        </p>
        <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          {NEXT_DETAIL}
        </p>
      </div>

      <div className="mt-4">
        <div
          role="progressbar"
          aria-label="Route progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={PROGRESS_PCT}
          aria-valuetext={PROGRESS_LABEL}
          className="h-1.5 w-full overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-surface-hero-tile)]"
        >
          <span
            aria-hidden
            className="block h-full rounded-[var(--radius-pill)] bg-[var(--color-map-mint)]"
            style={{ width: `${PROGRESS_PCT}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-label">
          <span className="text-[var(--color-surface-hero-fg-muted)]">
            {PROGRESS_REMAINING}
          </span>
          <span className="text-[var(--color-surface-hero-fg-muted)]">
            {PROGRESS_STEPS}
          </span>
          <span className="text-[var(--color-map-mint)]">
            {PROGRESS_LABEL}
          </span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- Support cards (row) */

function BoardingCard() {
  return (
    <Card
      as="section"
      padding="compact"
      aria-label={`${BOARDING_TITLE}. ${BOARDING_BUFFER}. ${BOARDING_LINE}.`}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-map-mint-bg)] text-[var(--color-action-teal)]"
        >
          <ShieldCheckIcon size={14} />
        </span>
        <span className="text-label text-[var(--color-text-primary)]">
          {BOARDING_TITLE}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-baseline gap-1">
          <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
            42
          </span>
          <span className="text-label text-[var(--color-text-secondary)]">
            min buffer
          </span>
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {BOARDING_LINE}
        </span>
      </div>
    </Card>
  );
}

function StopCard() {
  return (
    <Card
      as="section"
      padding="compact"
      aria-label={`${STOP_TITLE}. ${STOP_DETAIL}.`}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-map-mint-bg)] text-[var(--color-action-teal)]"
        >
          <DiningIcon size={14} />
        </span>
        <span className="text-label text-[var(--color-text-primary)]">
          {STOP_TITLE}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label text-[var(--color-text-secondary)]">
          {STOP_DETAIL}
        </span>
        <Button
          href="/map/search-results"
          variant="secondary"
          leadingIcon={<PlusIcon size={14} />}
          className="h-11 text-label"
          aria-label="Add a stop to the route"
        >
          Add stop
        </Button>
      </div>
    </Card>
  );
}

/* --------------------------------------------------- Route timeline */

function RouteTimelineList() {
  return (
    <ol
      aria-label="Upcoming route steps"
      className="flex flex-col gap-3 pt-1"
    >
      {ROUTE_STEPS.map((step, index) => (
        <RouteStepRow
          key={step.id}
          step={step}
          isLast={index === ROUTE_STEPS.length - 1}
        />
      ))}
    </ol>
  );
}

function RouteStepRow({
  step,
  isLast,
}: {
  step: RouteStep;
  isLast: boolean;
}) {
  const isCurrent = step.state === "current";
  const dotClass = isCurrent
    ? "bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] border-[var(--color-action-teal)]"
    : "bg-[var(--color-surface-sheet)] text-[var(--color-text-muted)] border-[var(--color-border)]";
  const titleClass = isCurrent
    ? "text-[var(--color-text-primary)]"
    : "text-[var(--color-text-secondary)]";

  return (
    <li
      aria-current={isCurrent ? "step" : undefined}
      className="flex items-center gap-3"
    >
      <span className="relative flex flex-col items-center">
        <span
          aria-hidden
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${dotClass}`}
        >
          {step.icon}
        </span>
        {!isLast ? (
          <span
            aria-hidden
            className="absolute top-7 h-3 w-px bg-[var(--color-border)]"
          />
        ) : null}
      </span>
      <span className={`flex-1 text-body-sm-emphasis ${titleClass}`}>
        {step.title}
      </span>
      <span className="text-label tabular-nums text-[var(--color-text-secondary)]">
        {step.distance}
      </span>
    </li>
  );
}

/* ----------------------------------------------------- Local glyphs */

function TurnRightGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
    >
      <path d="M5 18V11a4 4 0 0 1 4-4h9" />
      <path d="m14 3 5 4-5 4" />
    </svg>
  );
}

function StraightGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
    >
      <path d="M12 21V5" />
      <path d="m7 10 5-5 5 5" />
    </svg>
  );
}

