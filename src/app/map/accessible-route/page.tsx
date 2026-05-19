"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { StatusPill } from "@/components/StatusPill";
import {
  AccessibilityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  FootstepsIcon,
  NavigationIcon,
  UsersIcon,
} from "@/components/icons";

type ModeId = "standard" | "accessible" | "family";

type Mode = {
  id: ModeId;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
};

const MODES: Mode[] = [
  {
    id: "standard",
    label: "Standard",
    ariaLabel: "Standard route",
    icon: <FootstepsIcon size={14} />,
  },
  {
    id: "accessible",
    label: "Accessible",
    ariaLabel: "Accessible route",
    icon: <AccessibilityIcon size={14} />,
  },
  {
    id: "family",
    label: "Family",
    ariaLabel: "Family route",
    icon: <UsersIcon size={14} />,
  },
];

type StatTone = "default" | "mint";

type RouteStat = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  tone?: StatTone;
};

type RouteVerification = {
  controlLabel: string;
  title: string;
  supportLine: string;
  chips: string[];
  stats: RouteStat[];
};

const VERIFICATION: RouteVerification = {
  controlLabel: "Live Access Control",
  title: "Step-free route verified",
  supportLine: "Elevators live · Lane open · Updated just now",
  chips: ["Elevators Live", "Step-Free", "Lane Open"],
  stats: [
    { id: "time", label: "Time", value: "12", unit: "min" },
    { id: "distance", label: "Distance", value: "550", unit: "m" },
    { id: "elevators", label: "Elevators", value: "2", unit: "lifts" },
    {
      id: "confidence",
      label: "Confidence",
      value: "High",
      unit: "verified",
      tone: "mint",
    },
  ],
};

const GATE = "D73";
const TERMINAL = "International Terminal · Level 2";
const MAP_LEVEL = "Level 2";
const ETA_LINE = "12 min · step-free · live guidance";

export default function AccessibleRoutePage() {
  const [mode, setMode] = useState<ModeId>("accessible");

  return (
    <AppShellAuthed activeHref="/map">
      <RouteHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-6">
        <ModeSegmentedControl active={mode} onChange={setMode} />
        <RouteVerificationCard data={VERIFICATION} />
        <RouteMapPreview level={MAP_LEVEL} gate={GATE} />
        <StartNavigationCTA etaLine={ETA_LINE} />
      </div>
    </AppShellAuthed>
  );
}

/* ---------------------------------------------------------------- Header */

function RouteHeader() {
  return (
    <header
      aria-label={`Accessible route to gate ${GATE}, ${TERMINAL}`}
      className="px-6 pb-5 pt-2 text-[var(--color-surface-hero-fg)]"
      style={{
        backgroundImage:
          "linear-gradient(180deg, var(--color-surface-hero-start) 0%, var(--color-surface-hero-end) 100%)",
      }}
    >
      <div className="flex items-start gap-3">
        <HeaderIconButton aria-label="Back">
          <ArrowLeftIcon size={16} />
        </HeaderIconButton>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 pt-1.5 text-center">
          <h1 className="text-section-title text-[var(--color-surface-hero-fg)]">
            Route to Gate {GATE}
          </h1>
          <p className="text-label text-[var(--color-surface-hero-fg-muted)]">
            {TERMINAL}
          </p>
        </div>

        <HeaderAccessiblePill />
      </div>
    </header>
  );
}

function HeaderAccessiblePill() {
  return (
    <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] px-2.5 text-micro uppercase text-[var(--color-map-mint)]">
      <AccessibilityIcon size={12} aria-hidden />
      Accessible
    </span>
  );
}

/* ----------------------------------------------------- Mode segmented */

function ModeSegmentedControl({
  active,
  onChange,
}: {
  active: ModeId;
  onChange: (id: ModeId) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Route mode"
      className="flex items-stretch gap-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-tile)] p-1"
    >
      {MODES.map((m) => {
        const isActive = m.id === active;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={m.ariaLabel}
            onClick={() => onChange(m.id)}
            className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] text-body-sm-emphasis transition-colors duration-150 ${
              isActive
                ? "bg-[var(--color-surface-sheet)] text-[var(--color-text-primary)] shadow-[var(--shadow-segment)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <span aria-hidden>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------- Verification card */

function RouteVerificationCard({ data }: { data: RouteVerification }) {
  const accessibleLabel = `${data.controlLabel}: ${data.title}. ${data.supportLine}. ${data.stats
    .map((s) => `${s.label}: ${s.value}${s.unit ? ` ${s.unit}` : ""}`)
    .join(", ")}.`;

  return (
    <HeroSurface
      as="section"
      aria-label={accessibleLabel}
      angle="180deg"
      className="flex flex-col gap-5 p-5 shadow-[var(--shadow-hero-card)]"
    >
      <VerificationHeaderRow controlLabel={data.controlLabel} />
      <VerificationTitleBlock
        title={data.title}
        supportLine={data.supportLine}
      />
      <VerificationChipsRow chips={data.chips} />
      <VerificationStatsGrid stats={data.stats} />
    </HeroSurface>
  );
}

function VerificationHeaderRow({ controlLabel }: { controlLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-label text-[var(--color-surface-hero-fg)]">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-hero-tile)] text-[var(--color-map-mint)]"
        >
          <AccessibilityIcon size={14} />
        </span>
        {controlLabel}
      </span>
      <StatusPill tone="success" surface="hero" size="sm" leadingDot>
        Live
      </StatusPill>
    </div>
  );
}

function VerificationTitleBlock({
  title,
  supportLine,
}: {
  title: string;
  supportLine: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-title text-[var(--color-surface-hero-fg)]">
        {title}
      </h2>
      <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        {supportLine}
      </p>
    </div>
  );
}

function VerificationChipsRow({ chips }: { chips: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Route conditions">
      {chips.map((c) => (
        <li
          key={c}
          className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] px-2.5 text-micro uppercase text-[var(--color-map-mint)]"
        >
          <CheckIcon size={11} aria-hidden />
          {c}
        </li>
      ))}
    </ul>
  );
}

function VerificationStatsGrid({ stats }: { stats: RouteStat[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2" aria-label="Route stats">
      {stats.map((s) => (
        <li key={s.id}>
          <RouteStatTile stat={s} />
        </li>
      ))}
    </ul>
  );
}

function RouteStatTile({ stat }: { stat: RouteStat }) {
  const valueClass =
    stat.tone === "mint"
      ? "text-[var(--color-map-mint)]"
      : "text-[var(--color-surface-hero-fg)]";
  const unitClass =
    stat.tone === "mint"
      ? "text-[var(--color-map-mint)]"
      : "text-[var(--color-surface-hero-fg-muted)]";
  return (
    <div
      aria-label={`${stat.label}: ${stat.value}${stat.unit ? ` ${stat.unit}` : ""}`}
      className="flex flex-col gap-1 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-4 py-3"
    >
      <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
        {stat.label}
      </span>
      <span className={`text-title tabular-nums ${valueClass}`}>
        {stat.value}
      </span>
      {stat.unit ? (
        <span className={`text-label ${unitClass}`}>{stat.unit}</span>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------- Map preview */

function RouteMapPreview({ level, gate }: { level: string; gate: string }) {
  return (
    <section
      aria-label={`Mini map preview: ${level}, step-free route from Domestic to International heading toward gate ${gate}, live tracking.`}
      className="relative overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-border-soft)] bg-[var(--color-surface-tile)] shadow-[var(--shadow-card)]"
      style={{ height: 196 }}
    >
      <div className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sheet)] px-2.5 py-1 text-micro uppercase text-[var(--color-text-primary)] shadow-[var(--shadow-card)]">
        <span aria-hidden className="inline-flex">
          <NavigationIcon size={11} />
        </span>
        {level}
      </div>

      <div className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-2.5 py-1 text-micro uppercase text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
        />
        Live
      </div>

      <MapPreviewArt gate={gate} />
    </section>
  );
}

/**
 * Stylized terminal-layout map. Three concourse zones (Domestic,
 * International, US) connected by a dashed route line, with a current
 * location marker centered over the International zone. All decorative —
 * the wrapping section carries the meaning via `aria-label`.
 */
function MapPreviewArt({ gate }: { gate: string }) {
  return (
    <span aria-hidden className="absolute inset-0">
      <svg
        viewBox="0 0 360 196"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {/* Three terminal zones */}
        <rect
          x="14"
          y="78"
          width="100"
          height="80"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <rect
          x="130"
          y="60"
          width="120"
          height="98"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <rect
          x="266"
          y="78"
          width="80"
          height="80"
          rx="14"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />

        {/* Zone labels (small, decorative) */}
        <text
          x="64"
          y="124"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-muted)"
        >
          DOMESTIC
        </text>
        <text
          x="190"
          y="116"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-secondary)"
        >
          INTERNATIONAL
        </text>
        <text
          x="306"
          y="124"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-text-muted)"
        >
          US
        </text>

        {/* Destination halo near the right edge of International zone */}
        <circle
          cx="246"
          cy="108"
          r="22"
          fill="var(--color-action-teal)"
          opacity="0.10"
        />

        {/* Route path — soft glow under-stroke */}
        <path
          d="M 50 118 Q 100 118 130 110 Q 170 100 210 108 Q 232 110 246 108"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="6"
          opacity="0.16"
          strokeLinecap="round"
        />
        {/* Route path — crisp dashed */}
        <path
          d="M 50 118 Q 100 118 130 110 Q 170 100 210 108 Q 232 110 246 108"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />

        {/* Destination dot */}
        <circle
          cx="246"
          cy="108"
          r="5"
          fill="var(--color-action-teal)"
        />

        {/* Gate label by destination */}
        <text
          x="246"
          y="148"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.08em"
          fontWeight="600"
          fill="var(--color-action-teal)"
        >
          GATE {gate}
        </text>
      </svg>

      {/* Current-location pulse marker */}
      <span
        className="absolute inline-flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-action-teal)] ring-4 ring-[var(--color-action-teal-soft)]"
        style={{ left: "14%", top: "60%" }}
      />
    </span>
  );
}

/* ------------------------------------------------------------ Start CTA */

function StartNavigationCTA({ etaLine }: { etaLine: string }) {
  return (
    <Link
      href="/map/live-navigation"
      aria-label={`Start accessible navigation — ${etaLine}`}
      className="relative block w-full overflow-hidden rounded-[var(--radius-card)] p-4 text-left text-[var(--color-surface-hero-fg)] shadow-[var(--shadow-hero-card)] transition-opacity duration-150 hover:opacity-95 active:opacity-90"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--color-surface-hero-start) 0%, var(--color-surface-hero-end) 100%)",
      }}
    >
      <span className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-hero-tile)] text-[var(--color-map-mint)]"
        >
          <NavigationIcon size={18} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
            Start Accessible Navigation
          </span>
          <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
            {etaLine}
          </span>
        </span>
        <span
          aria-hidden
          className="inline-flex shrink-0 items-center justify-center text-[var(--color-surface-hero-fg)]"
        >
          <ArrowRightIcon size={16} />
        </span>
      </span>
    </Link>
  );
}
