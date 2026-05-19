import Link from "next/link";
import type { Route } from "next";
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
  InfoIcon,
  NavigationIcon,
  UsersIcon,
} from "@/components/icons";

type ModeId = "standard" | "accessible" | "family";

type Mode = {
  id: ModeId;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  href: Route;
};

const MODES: Mode[] = [
  {
    id: "standard",
    label: "Standard",
    ariaLabel: "Standard route — 8 minutes",
    icon: <FootstepsIcon size={14} />,
    href: "/map/standard-route",
  },
  {
    id: "accessible",
    label: "Accessible",
    ariaLabel: "Accessible route — 12 minutes",
    icon: <AccessibilityIcon size={14} />,
    href: "/map/accessible-route",
  },
  {
    id: "family",
    label: "Family",
    ariaLabel: "Family route — 14 minutes, currently selected",
    icon: <UsersIcon size={14} />,
    href: "/map/family-route",
  },
];

type Benefit = {
  id: string;
  label: string;
};

const BENEFITS: Benefit[] = [
  { id: "lane", label: "Family security lane open" },
  { id: "stroller", label: "Stroller-accessible throughout" },
  { id: "nursing", label: "Nursing + changing rooms" },
  { id: "detours", label: "No construction detours" },
];

const GATE = "D73";
const TERMINAL = "International Terminal · Level 2";
const MAP_LEVEL = "Level 2";
const SUMMARY_LINE = "14 min · 520 m · 5 steps";
const SUPPORT_LINE = "Stroller-friendly · family lane open · restrooms on route";
const TRADEOFF_LINE = "+4 min vs standard · easier with kids and bags";
const ETA_LINE = "14 min · stroller-friendly · family lane";

export default function FamilyRoutePage() {
  return (
    <AppShellAuthed activeHref="/map">
      <RouteHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-6">
        <ModeSegmentedControl active="family" />
        <FamilyRouteCard />
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
      aria-label={`Family route to gate ${GATE}, ${TERMINAL}`}
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

        <HeaderFamilyPill />
      </div>
    </header>
  );
}

function HeaderFamilyPill() {
  return (
    <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-2.5 text-micro uppercase text-[var(--color-surface-hero-fg)]">
      <UsersIcon size={12} aria-hidden />
      Family
    </span>
  );
}

/* ----------------------------------------------------- Mode segmented */

function ModeSegmentedControl({ active }: { active: ModeId }) {
  return (
    <nav
      aria-label="Route mode"
      className="flex items-stretch gap-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-tile)] p-1"
    >
      {MODES.map((m) => {
        const isActive = m.id === active;
        const content = (
          <>
            <span aria-hidden>{m.icon}</span>
            <span>{m.label}</span>
          </>
        );
        const className = `flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] text-body-sm-emphasis transition-colors duration-150 ${
          isActive
            ? "bg-[var(--color-surface-sheet)] text-[var(--color-text-primary)] shadow-[var(--shadow-segment)]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        }`;
        if (isActive) {
          return (
            <span
              key={m.id}
              aria-current="page"
              aria-label={m.ariaLabel}
              className={className}
            >
              {content}
            </span>
          );
        }
        return (
          <Link
            key={m.id}
            href={m.href}
            aria-label={m.ariaLabel}
            className={className}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------- Family card */

function FamilyRouteCard() {
  const accessibleLabel = `Family-friendly route, high confidence. ${SUMMARY_LINE}. ${SUPPORT_LINE}. Benefits: ${BENEFITS.map(
    (b) => b.label
  ).join(", ")}. ${TRADEOFF_LINE}.`;

  return (
    <HeroSurface
      as="section"
      aria-label={accessibleLabel}
      angle="180deg"
      className="flex flex-col gap-5 p-5 shadow-[var(--shadow-hero-card)]"
    >
      <FamilyCardHeaderRow />
      <FamilyCardTitleBlock />
      <FamilyBenefitGrid benefits={BENEFITS} />
      <FamilyTradeoffNote />
    </HeroSurface>
  );
}

function FamilyCardHeaderRow() {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-label text-[var(--color-surface-hero-fg)]">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-hero-tile)] text-[var(--color-map-mint)]"
        >
          <UsersIcon size={14} />
        </span>
        Family Routing
      </span>
      <StatusPill tone="success" surface="hero" size="sm" leadingDot>
        High Confidence
      </StatusPill>
    </div>
  );
}

function FamilyCardTitleBlock() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-title text-[var(--color-surface-hero-fg)]">
        Family-friendly route
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

function FamilyBenefitGrid({ benefits }: { benefits: Benefit[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2" aria-label="Family route benefits">
      {benefits.map((b) => (
        <li key={b.id}>
          <FamilyBenefitTile label={b.label} />
        </li>
      ))}
    </ul>
  );
}

function FamilyBenefitTile({ label }: { label: string }) {
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

function FamilyTradeoffNote() {
  return (
    <div
      role="note"
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

/* ---------------------------------------------------------- Map preview */

function RouteMapPreview({ level, gate }: { level: string; gate: string }) {
  return (
    <section
      aria-label={`Mini map preview: ${level}, family-friendly route from Domestic to International heading toward gate ${gate}, live tracking.`}
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
 * Stylized terminal-layout map mirroring the Accessible Route preview —
 * Domestic / International / US zones connected by a dashed route line
 * to a destination dot over gate D73. Wrapping section carries meaning
 * via aria-label; SVG is decorative.
 */
function MapPreviewArt({ gate }: { gate: string }) {
  return (
    <span aria-hidden className="absolute inset-0">
      <svg
        viewBox="0 0 360 196"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
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

        <circle
          cx="246"
          cy="108"
          r="22"
          fill="var(--color-action-teal)"
          opacity="0.10"
        />

        <path
          d="M 50 118 Q 100 118 130 110 Q 170 100 210 108 Q 232 110 246 108"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="6"
          opacity="0.16"
          strokeLinecap="round"
        />
        <path
          d="M 50 118 Q 100 118 130 110 Q 170 100 210 108 Q 232 110 246 108"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
        />

        <circle
          cx="246"
          cy="108"
          r="5"
          fill="var(--color-action-teal)"
        />

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
      aria-label={`Start family navigation — ${etaLine}`}
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
            Start Family Navigation
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
