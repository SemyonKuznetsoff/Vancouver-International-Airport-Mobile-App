import Link from "next/link";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { RouteMapPreview } from "@/components/RouteMapPreview";
import { RouteModeSelector } from "@/components/RouteModeSelector";
import { StatusPill } from "@/components/StatusPill";
import {
  AccessibilityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  NavigationIcon,
} from "@/components/icons";

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
  supportLine: "Elevators live · Lane open",
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
  return (
    <AppShellAuthed activeHref="/map">
      <RouteHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-6">
        <RouteModeSelector active="accessible" />
        <RouteVerificationCard data={VERIFICATION} />
        <RouteMapPreview level={MAP_LEVEL} gate={GATE} routeKind="step-free route" />
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
        <HeaderIconButton aria-label="Back to map" href="/map">
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
