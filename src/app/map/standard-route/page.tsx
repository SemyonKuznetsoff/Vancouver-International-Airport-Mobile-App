import Link from "next/link";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { RouteMapPreview } from "@/components/RouteMapPreview";
import { RouteModeSelector } from "@/components/RouteModeSelector";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  FootstepsIcon,
  InfoIcon,
  NavigationIcon,
} from "@/components/icons";

type Benefit = {
  id: string;
  label: string;
};

const BENEFITS: Benefit[] = [
  { id: "fastest", label: "Fastest option" },
  { id: "security", label: "Security A open" },
  { id: "direct", label: "Direct concourse route" },
  { id: "delays", label: "No major delays" },
];

const GATE = "D73";
const TERMINAL = "International Terminal · Level 2";
const MAP_LEVEL = "Level 2";
const SUMMARY_LINE = "8 min · 420 m · 4 steps";
const SUPPORT_LINE = "Direct route · security checkpoint clear · gate route open";
const TRADEOFF_LINE = "Includes stairs/escalator section · choose Accessible for step-free";
const ETA_LINE = "8 min · direct · security clear";

export default function StandardRoutePage() {
  return (
    <AppShellAuthed activeHref="/map">
      <RouteHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-6">
        <RouteModeSelector active="standard" />
        <StandardRouteCard />
        <RouteMapPreview level={MAP_LEVEL} gate={GATE} routeKind="direct route" />
        <StartNavigationCTA etaLine={ETA_LINE} />
      </div>
    </AppShellAuthed>
  );
}

/* ---------------------------------------------------------------- Header */

function RouteHeader() {
  return (
    <header
      aria-label={`Standard route to gate ${GATE}, ${TERMINAL}`}
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

        <HeaderStandardPill />
      </div>
    </header>
  );
}

function HeaderStandardPill() {
  return (
    <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-2.5 text-micro uppercase text-[var(--color-surface-hero-fg)]">
      <FootstepsIcon size={12} aria-hidden />
      Standard
    </span>
  );
}

/* ------------------------------------------------------- Standard card */

function StandardRouteCard() {
  const accessibleLabel = `Fastest route, live conditions. ${SUMMARY_LINE}. ${SUPPORT_LINE}. Benefits: ${BENEFITS.map(
    (b) => b.label
  ).join(", ")}. ${TRADEOFF_LINE}.`;

  return (
    <HeroSurface
      as="section"
      aria-label={accessibleLabel}
      angle="180deg"
      className="flex flex-col gap-5 p-5 shadow-[var(--shadow-hero-card)]"
    >
      <StandardCardHeaderRow />
      <StandardCardTitleBlock />
      <StandardBenefitGrid benefits={BENEFITS} />
      <StandardTradeoffNote />
    </HeroSurface>
  );
}

function StandardCardHeaderRow() {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-label text-[var(--color-surface-hero-fg)]">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-hero-tile)] text-[var(--color-map-mint)]"
        >
          <FootstepsIcon size={14} />
        </span>
        Live Conditions
      </span>
      <StatusPill tone="success" surface="hero" size="sm" leadingDot>
        Live
      </StatusPill>
    </div>
  );
}

function StandardCardTitleBlock() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-title text-[var(--color-surface-hero-fg)]">
        Fastest route
      </h2>
      <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        {SUMMARY_LINE}
      </p>
      <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        {SUPPORT_LINE}
      </p>
    </div>
  );
}

function StandardBenefitGrid({ benefits }: { benefits: Benefit[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2" aria-label="Standard route benefits">
      {benefits.map((b) => (
        <li key={b.id}>
          <StandardBenefitTile label={b.label} />
        </li>
      ))}
    </ul>
  );
}

function StandardBenefitTile({ label }: { label: string }) {
  return (
    <div
      className="flex h-full items-start gap-2 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-3 py-3"
    >
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
      >
        <CheckIcon size={11} />
      </span>
      <span className="text-body-sm text-[var(--color-surface-hero-fg)]">
        {label}
      </span>
    </div>
  );
}

function StandardTradeoffNote() {
  return (
    <div
      aria-label={TRADEOFF_LINE}
      className="flex items-start gap-2 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-3 py-3"
    >
      <span
        aria-hidden
        className="mt-0.5 inline-flex shrink-0 text-[var(--color-surface-hero-fg-muted)]"
      >
        <InfoIcon size={14} />
      </span>
      <span className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        {TRADEOFF_LINE}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------ Start CTA */

function StartNavigationCTA({ etaLine }: { etaLine: string }) {
  return (
    <Link
      href="/map/live-navigation"
      aria-label={`Start navigation — ${etaLine}`}
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
            Start Navigation
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
