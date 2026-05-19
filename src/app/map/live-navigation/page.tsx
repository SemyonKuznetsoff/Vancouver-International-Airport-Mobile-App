"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
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

// Prototype-only context routing for live navigation. The screen has no
// real GPS / route engine, so destination copy is selected from a small
// set of hand-authored prototype contexts keyed off the `?context=` query
// param. Default (no param) preserves the existing flight/gate scenario;
// `parking` is entered from /parking/find-my-car.
type NavContextId = "flight" | "parking";

type NavContent = {
  destination: string;
  destinationMeta: string;
  destinationChip: string;
  nextInstruction: string;
  nextDetail: string;
  nextDistance: string;
  nextDistanceUnit: string;
  progressPct: number;
  progressRemaining: string;
  progressSteps: string;
  progressLabel: string;
  secondary: {
    title: string;
    value: string;
    valueUnit: string;
    footnote: string;
  };
  stop: {
    title: string;
    detail: string;
  };
  routeSteps: RouteStep[];
};

const FLIGHT_CONTENT: NavContent = {
  destination: "Gate D73",
  destinationMeta: "International · Level 2",
  destinationChip: "Gate D73",
  nextInstruction: "Turn right at Duty Free",
  nextDetail: "Then straight 180 m to Gate D73",
  nextDistance: "60",
  nextDistanceUnit: "m",
  progressPct: 62,
  progressRemaining: "260 m remaining",
  progressSteps: "2 steps",
  progressLabel: "62% complete",
  secondary: {
    title: "Boarding on track",
    value: "42",
    valueUnit: "min buffer",
    footnote: "Boarding 14:15",
  },
  stop: {
    title: "Coffee is safe",
    detail: "+0 min route impact",
  },
  routeSteps: [
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
  ],
};

const PARKING_CONTENT: NavContent = {
  destination: "Space B-042",
  destinationMeta: "Parkade P1 · Level 2",
  destinationChip: "B-042",
  nextInstruction: "Turn right at Skybridge",
  nextDetail: "Then straight 180 m to Space B-042",
  nextDistance: "60",
  nextDistanceUnit: "m",
  progressPct: 62,
  progressRemaining: "260 m remaining",
  progressSteps: "2 steps",
  progressLabel: "62% complete",
  secondary: {
    title: "Walk on track",
    value: "4",
    valueUnit: "min walk",
    footnote: "280 m to Space B-042",
  },
  stop: {
    title: "Quick detour OK",
    detail: "+0 min route impact",
  },
  routeSteps: [
    {
      id: "skybridge",
      title: "Turn right at Skybridge",
      distance: "60 m",
      icon: <TurnRightGlyph />,
      state: "current",
    },
    {
      id: "space",
      title: "Straight toward B-042",
      distance: "180 m",
      icon: <StraightGlyph />,
      state: "upcoming",
    },
  ],
};

function resolveContent(raw: string | null): NavContent {
  const id: NavContextId = raw === "parking" ? "parking" : "flight";
  return id === "parking" ? PARKING_CONTENT : FLIGHT_CONTENT;
}

const LEVELS: LevelId[] = ["L3", "L2", "L1"];

export default function LiveNavigationPage() {
  return (
    <Suspense fallback={null}>
      <LiveNavigationView />
    </Suspense>
  );
}

function LiveNavigationView() {
  const search = useSearchParams();
  const content = resolveContent(search.get("context"));
  const [level, setLevel] = useState<LevelId>("L2");

  return (
    <AppShellAuthed activeHref="/map" hideTabBar>
      <h1 className="sr-only">{`Live navigation to ${content.destination}`}</h1>

      <NavHeader content={content} />

      <section
        aria-label={`Live route preview, ${level}. ${content.nextInstruction} in ${content.nextDistance} metres. ${content.nextDetail}.`}
        className="relative mx-4 mt-3 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border-soft)] bg-[var(--color-surface-tile)] shadow-[var(--shadow-card)]"
        style={{ height: 280 }}
      >
        <MapCanvasArt />
        <LevelSelector value={level} onChange={setLevel} />
        <DestinationMarker label={content.destinationChip} />
      </section>

      <NavSheet content={content} />
    </AppShellAuthed>
  );
}

/* ----------------------------------------------------------- Top header */

function NavHeader({ content }: { content: NavContent }) {
  return (
    <header className="flex items-start gap-3 px-4 pt-1">
      <HeaderIconButton aria-label="Exit live navigation" href="/map">
        <CloseIcon size={16} />
      </HeaderIconButton>
      <Card
        as="section"
        padding="compact"
        aria-label={`Active destination ${content.destination}, ${content.destinationMeta}, on track`}
        className="flex flex-1 items-center gap-3"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            {content.destination}
          </span>
          <span className="text-label text-[var(--color-text-secondary)]">
            {content.destinationMeta}
          </span>
        </div>
        <StatusPill tone="success" size="sm" leadingDot>
          On Track
        </StatusPill>
      </Card>
    </header>
  );
}

/* -------------------------------------------------- Destination marker chip */

function DestinationMarker({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute right-12 top-2 z-20 inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-2 py-0.5 text-micro uppercase text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button-teal)]">
      {label}
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

function NavSheet({ content }: { content: NavContent }) {
  return (
    <section
      aria-label="Live navigation details"
      className="relative mt-3 flex flex-1 flex-col gap-3 rounded-t-[var(--radius-card)] border-t border-[var(--color-border)] bg-[var(--color-surface-sheet)] px-4 pt-3 pb-6 shadow-[var(--shadow-sheet)]"
    >
      <SheetGrabber />
      <InstructionCard content={content} />
      <div className="grid grid-cols-2 gap-3">
        <SecondaryCard content={content} />
        <StopCard content={content} />
      </div>
      <RouteTimelineList steps={content.routeSteps} />
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

function InstructionCard({ content }: { content: NavContent }) {
  return (
    <section
      aria-label={`In ${content.nextDistance} metres: ${content.nextInstruction}. ${content.nextDetail}. ${content.progressRemaining}, ${content.progressSteps}, ${content.progressLabel}.`}
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
              {content.nextDistance}
            </span>
            <span className="text-section-title text-[var(--color-surface-hero-fg-muted)]">
              {content.nextDistanceUnit}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <p className="text-section-title text-[var(--color-surface-hero-fg)]">
          {content.nextInstruction}
        </p>
        <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          {content.nextDetail}
        </p>
      </div>

      <div className="mt-4">
        <div
          role="progressbar"
          aria-label="Route progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={content.progressPct}
          aria-valuetext={content.progressLabel}
          className="h-1.5 w-full overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-surface-hero-tile)]"
        >
          <span
            aria-hidden
            className="block h-full rounded-[var(--radius-pill)] bg-[var(--color-map-mint)]"
            style={{ width: `${content.progressPct}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-label">
          <span className="text-[var(--color-surface-hero-fg-muted)]">
            {content.progressRemaining}
          </span>
          <span className="text-[var(--color-surface-hero-fg-muted)]">
            {content.progressSteps}
          </span>
          <span className="text-[var(--color-map-mint)]">
            {content.progressLabel}
          </span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- Support cards (row) */

function SecondaryCard({ content }: { content: NavContent }) {
  const { secondary } = content;
  return (
    <Card
      as="section"
      padding="compact"
      aria-label={`${secondary.title}. ${secondary.value} ${secondary.valueUnit}. ${secondary.footnote}.`}
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
          {secondary.title}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-baseline gap-1">
          <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
            {secondary.value}
          </span>
          <span className="text-label text-[var(--color-text-secondary)]">
            {secondary.valueUnit}
          </span>
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {secondary.footnote}
        </span>
      </div>
    </Card>
  );
}

function StopCard({ content }: { content: NavContent }) {
  const { stop } = content;
  return (
    <Card
      as="section"
      padding="compact"
      aria-label={`${stop.title}. ${stop.detail}.`}
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
          {stop.title}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label text-[var(--color-text-secondary)]">
          {stop.detail}
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

function RouteTimelineList({ steps }: { steps: RouteStep[] }) {
  return (
    <ol
      aria-label="Upcoming route steps"
      className="flex flex-col gap-3 pt-1"
    >
      {steps.map((step, index) => (
        <RouteStepRow
          key={step.id}
          step={step}
          isLast={index === steps.length - 1}
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
