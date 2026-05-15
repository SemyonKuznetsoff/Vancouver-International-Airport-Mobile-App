"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ChipFilter } from "@/components/ChipFilter";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { LiveIndicator } from "@/components/LiveIndicator";
import {
  ArrowLeftIcon,
  CarIcon,
  ChevronRightIcon,
  LocationPinIcon,
  NavigationIcon,
  ProfileIcon,
  TrainIcon,
} from "@/components/icons";

type FilterKey = "best" | "fastest" | "cheapest" | "least-walking";

type Filter = {
  key: FilterKey;
  label: string;
};

type Metric = {
  id: string;
  label: string;
  value: React.ReactNode;
  helper: string;
};

type AltOption = {
  id: string;
  title: string;
  subtitle: string;
  price?: string;
  icon: React.ReactNode;
  iconTile: "teal" | "mint" | "lavender";
  detailRows: AltDetailRow[];
  zoneLabel: string;
};

type AltDetailRow = {
  id: string;
  label: string;
  value: string;
};

const FILTERS: Filter[] = [
  { key: "best", label: "Best value" },
  { key: "fastest", label: "Fastest" },
  { key: "cheapest", label: "Cheapest" },
  { key: "least-walking", label: "Least walking" },
];

const METRICS: Metric[] = [
  {
    id: "next-train",
    label: "Next train",
    value: (
      <>
        4<span className="ml-0.5 text-label text-[var(--color-surface-hero-fg-muted)]">min</span>
      </>
    ),
    helper: "Every 6–8 min",
  },
  {
    id: "trip",
    label: "Trip",
    value: (
      <>
        26<span className="ml-0.5 text-label text-[var(--color-surface-hero-fg-muted)]">min</span>
      </>
    ),
    helper: "To Waterfront",
  },
  {
    id: "fare",
    label: "Adult fare",
    value: (
      <>
        $10<span className="ml-0.5 text-label text-[var(--color-surface-hero-fg-muted)]">.45</span>
      </>
    ),
    helper: "Compass / tap",
  },
];

const ALT_OPTIONS: AltOption[] = [
  {
    id: "rideshare",
    title: "Rideshare",
    subtitle: "Uber · Lyft",
    price: "~$28–40",
    icon: <CarIcon size={18} />,
    iconTile: "teal",
    detailRows: [
      { id: "wait", label: "Wait", value: "3–5 min" },
      { id: "walk", label: "Walk", value: "5 min" },
    ],
    zoneLabel: "Zone A · Level 1",
  },
  {
    id: "taxi",
    title: "Taxi",
    subtitle: "Yellow Cab · Metered",
    price: "~$35–50",
    icon: <CarIcon size={18} />,
    iconTile: "mint",
    detailRows: [
      { id: "wait", label: "Wait", value: "Immediate" },
      { id: "walk", label: "Walk", value: "4 min" },
    ],
    zoneLabel: "Zone A · Metered",
  },
  {
    id: "pickup",
    title: "Friend / Family Pickup",
    subtitle: "Arrivals pickup zone",
    icon: <ProfileIcon size={18} />,
    iconTile: "lavender",
    detailRows: [{ id: "cell", label: "Cell lot", value: "Available" }],
    zoneLabel: "Best for pre-arranged",
  },
  {
    id: "rental",
    title: "Car Rental",
    subtitle: "On-airport rental desks",
    icon: <CarIcon size={18} />,
    iconTile: "mint",
    detailRows: [{ id: "status", label: "Status", value: "Available now" }],
    zoneLabel: "Follow signs from arrivals",
  },
];

export default function GroundTransportPage() {
  const [filter, setFilter] = useState<FilterKey>("best");

  return (
    <AppShellAuthed activeHref="/services">
      <GroundTransportHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pt-2 pb-6">
        <ArrivalContextCard />
        <FilterRow active={filter} onSelect={setFilter} />
        <RecommendedCard />
        <AltOptionsSection options={ALT_OPTIONS} />
      </div>
    </AppShellAuthed>
  );
}

function GroundTransportHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton
        aria-label="Back to services"
        href={"/services" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Ground Transport
        </h1>
        <p className="text-label text-[var(--color-text-secondary)]">
          From International Arrivals
        </p>
      </div>

      <LivePill />
    </header>
  );
}

function LivePill() {
  return (
    <span
      role="img"
      aria-label="Live transport status"
      className="inline-flex h-8 items-center rounded-[var(--radius-pill)] bg-[var(--color-surface-elevated)] px-3 shadow-[var(--shadow-card)]"
    >
      <span aria-hidden>
        <LiveIndicator status="live" label="Live" pulse />
      </span>
    </span>
  );
}

function ArrivalContextCard() {
  return (
    <Card as="section" surface="sheet" padding="default" className="flex items-start gap-3">
      <IconTile
        size={36}
        className="rounded-[var(--radius-tile)] bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
      >
        <LocationPinIcon size={16} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-micro uppercase text-[var(--color-text-muted)]">
          You are here
        </span>
        <h2 className="text-section-title text-[var(--color-text-primary)]">
          International Arrivals Hall
        </h2>
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Follow the green arrows to Level 1 ground transport.
        </p>
      </div>
    </Card>
  );
}

function FilterRow({
  active,
  onSelect,
}: {
  active: FilterKey;
  onSelect: (key: FilterKey) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter transport options"
      className="-mx-6 overflow-x-auto px-6"
    >
      <div className="flex w-max gap-2">
        {FILTERS.map((f) => (
          <ChipFilter
            key={f.key}
            tone="teal"
            selected={f.key === active}
            onToggle={() => onSelect(f.key)}
          >
            {f.label}
          </ChipFilter>
        ))}
      </div>
    </div>
  );
}

function RecommendedCard() {
  return (
    <HeroSurface
      as="section"
      aria-label="Recommended transport: Canada Line SkyTrain"
      angle="157deg"
      className="relative flex flex-col gap-4 p-5 shadow-[var(--shadow-hero-card)]"
    >
      <HeroOrbits />

      <div className="relative flex flex-col gap-4">
        <RecommendedPills />
        <RecommendedTitle />
        <RouteStrip />
        <MetricsRow metrics={METRICS} />
        <PickupLocationLine />
        <Button
          tone="mint"
          href={"/ground-transport/directions" as Route}
          leadingIcon={<NavigationIcon size={16} />}
        >
          Get SkyTrain Directions
        </Button>
      </div>
    </HeroSurface>
  );
}

function HeroOrbits() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 330 390"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-[var(--color-map-mint)] opacity-[0.12]"
    >
      <circle cx="290" cy="40" r="120" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="290" cy="40" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="290" cy="40" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="290" cy="40" r="3" fill="currentColor" />
    </svg>
  );
}

function RecommendedPills() {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-6 items-center rounded-[var(--radius-pill)] bg-[var(--color-map-mint)] px-2.5 text-micro uppercase text-[var(--color-action-teal)]">
        Recommended
      </span>
      <span className="inline-flex h-6 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] px-2.5 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
        No traffic delays
      </span>
    </div>
  );
}

function RecommendedTitle() {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-soft)]">
          Best option · Transit
        </span>
        <p className="text-title text-[var(--color-surface-hero-fg)]">
          Canada Line SkyTrain
        </p>
      </div>
      <span
        aria-hidden
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] text-[var(--color-surface-hero-fg)]"
      >
        <TrainIcon size={18} />
      </span>
    </div>
  );
}

function RouteStrip() {
  return (
    <div className="flex flex-col gap-2 px-1">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-surface-hero-chip)] text-[var(--color-surface-hero-fg)]"
        >
          <TrainIcon size={12} />
        </span>
        <span aria-hidden className="relative flex flex-1 items-center">
          <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-map-mint)]" />
          <span className="h-px flex-1 bg-[var(--color-surface-hero-tile-border)]" />
          <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
        </span>
      </div>
      <div className="flex items-center justify-between px-0.5">
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg)]">
          YVR-Airport
        </span>
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
          Canada Line
        </span>
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg)]">
          Waterfront
        </span>
      </div>
    </div>
  );
}

function MetricsRow({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]">
      {metrics.map((m, i) => (
        <div
          key={m.id}
          className={`flex flex-col gap-1 px-3 py-3 ${
            i > 0 ? "border-l border-[var(--color-surface-hero-tile-border)]" : ""
          }`}
        >
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            {m.label}
          </span>
          <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
            {m.value}
          </span>
          <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
            {m.helper}
          </span>
        </div>
      ))}
    </div>
  );
}

function PickupLocationLine() {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-body-sm text-[var(--color-surface-hero-fg)]">
        <LocationPinIcon size={14} aria-hidden />
        Level 1 · Domestic Terminal
      </span>
      <span className="text-label text-[var(--color-surface-hero-fg-soft)]">
        3 min walk
      </span>
    </div>
  );
}

function AltOptionsSection({ options }: { options: AltOption[] }) {
  return (
    <section aria-label="Other transport options" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-section-title text-[var(--color-text-primary)]">
          Other options
        </h2>
        <span className="text-label text-[var(--color-text-muted)]">
          {options.length} nearby
        </span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {options.map((opt) => (
          <li key={opt.id}>
            <AltOptionCard option={opt} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const ALT_TILE_CLASSES: Record<AltOption["iconTile"], string> = {
  teal: "bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]",
  mint: "bg-[var(--color-map-mint-bg)] text-[var(--color-action-teal)]",
  lavender:
    "bg-[var(--color-surface-tile)] text-[var(--color-text-secondary)]",
};

function AltOptionCard({ option }: { option: AltOption }) {
  const accessibleName = option.price
    ? `${option.title}, ${option.subtitle}, ${option.price}`
    : `${option.title}, ${option.subtitle}`;
  return (
    <Card
      as="div"
      surface="sheet"
      padding="none"
      className="overflow-hidden"
    >
      <button
        type="button"
        aria-label={accessibleName}
        className="flex w-full items-start gap-3 p-4 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
      >
        <IconTile
          size={40}
          className={`rounded-[var(--radius-tile)] ${ALT_TILE_CLASSES[option.iconTile]}`}
        >
          {option.icon}
        </IconTile>

        <span className="flex min-w-0 flex-1 flex-col gap-3">
          <span className="flex items-start justify-between gap-3">
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-section-title text-[var(--color-text-primary)]">
                {option.title}
              </span>
              <span className="truncate text-body-sm text-[var(--color-text-secondary)]">
                {option.subtitle}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              {option.price ? (
                <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
                  {option.price}
                </span>
              ) : null}
              <span aria-hidden className="inline-flex text-[var(--color-text-muted)]">
                <ChevronRightIcon size={16} />
              </span>
            </span>
          </span>

          <span className="flex flex-wrap gap-2">
            {option.detailRows.map((row) => (
              <DetailChip key={row.id} label={row.label} value={row.value} />
            ))}
            <ZoneChip>{option.zoneLabel}</ZoneChip>
          </span>
        </span>
      </button>
    </Card>
  );
}

function DetailChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex h-6 items-center gap-1 rounded-[var(--radius-chip)] bg-[var(--color-surface-tile)] px-2 text-label text-[var(--color-text-primary)]">
      <span className="text-label text-[var(--color-text-muted)]">{label}</span>
      <span>{value}</span>
    </span>
  );
}

function ZoneChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-[var(--radius-chip)] bg-[var(--color-action-teal-soft)] px-2 text-label text-[var(--color-action-teal)]">
      {children}
    </span>
  );
}
