import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import { SettingsRow } from "@/components/SettingsRow";
import { StatusPill } from "@/components/StatusPill";
import {
  AccessibilityIcon,
  ArrowRightIcon,
  CarIcon,
  DiningIcon,
  LifeBuoyIcon,
  LocationPinIcon,
  LoungesIcon,
  ParkingIcon,
  SearchIcon,
  ShieldCheckIcon,
  SignpostIcon,
  SparkleIcon,
  TrainIcon,
} from "@/components/icons";

type HeroMetric = {
  id: string;
  label: string;
  value: string;
  unit: string;
  footer: string;
  icon: React.ReactNode;
  dotTone: "mint" | "accent";
};

type QuickAction = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

type ServiceRow = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

type ServiceGroup = {
  id: string;
  heading: string;
  rows: ServiceRow[];
};

const heroMetrics: HeroMetric[] = [
  {
    id: "security",
    label: "Security",
    value: "12",
    unit: "min",
    footer: "Intl · Low wait",
    icon: <ShieldCheckIcon size={13} />,
    dotTone: "mint",
  },
  {
    id: "parking",
    label: "Parking",
    value: "40",
    unit: "% full",
    footer: "P1 open",
    icon: <ParkingIcon size={13} />,
    dotTone: "mint",
  },
  {
    id: "skytrain",
    label: "SkyTrain",
    value: "4",
    unit: "min",
    footer: "Next train",
    icon: <TrainIcon size={13} />,
    dotTone: "accent",
  },
  {
    id: "lounges",
    label: "Lounges",
    value: "3",
    unit: "open",
    footer: "Near your gate",
    icon: <LoungesIcon size={13} />,
    dotTone: "mint",
  },
];

const quickActions: QuickAction[] = [
  {
    id: "wayfinding",
    label: "Wayfinding",
    href: "/map",
    icon: <SignpostIcon size={13} />,
  },
  {
    id: "security",
    label: "Security",
    href: "/security",
    icon: <ShieldCheckIcon size={13} />,
  },
  {
    id: "parking",
    label: "Parking",
    href: "/parking",
    icon: <ParkingIcon size={13} />,
  },
  {
    id: "transport",
    label: "Transport",
    href: "/transport",
    icon: <CarIcon size={13} />,
  },
  {
    id: "lounges",
    label: "Lounges",
    href: "/services/lounges",
    icon: <LoungesIcon size={13} />,
  },
];

const serviceGroups: ServiceGroup[] = [
  {
    id: "parking-getting-there",
    heading: "Parking & getting there",
    rows: [
      {
        id: "parking",
        title: "Parking",
        description: "P1 open · Reserve, find your car, live availability",
        href: "/parking",
        icon: <ParkingIcon size={18} />,
      },
      {
        id: "ground-transport",
        title: "Ground Transport",
        description: "SkyTrain 4 min · Rideshare, taxi, car rental",
        href: "/transport",
        icon: <CarIcon size={18} />,
      },
    ],
  },
  {
    id: "airport-experience",
    heading: "Airport experience",
    rows: [
      {
        id: "dining-shops",
        title: "Dining & Shops",
        description: "32 open now · Near your gate",
        href: "/services/shops-dining",
        icon: <DiningIcon size={18} />,
      },
      {
        id: "lounges",
        title: "Lounges",
        description: "3 open · SkyTeam, Plaza Premium",
        href: "/services/lounges",
        icon: <LoungesIcon size={18} />,
      },
      {
        id: "restrooms",
        title: "Restrooms & Amenities",
        description: "Family rooms, water stations, prayer rooms",
        href: "/services/amenities",
        icon: <LocationPinIcon size={18} />,
      },
    ],
  },
  {
    id: "support",
    heading: "Support",
    rows: [
      {
        id: "concierge",
        title: "Help & Concierge",
        description: "Ask YVR · Lost items, support, questions",
        href: "/services/customer-care",
        icon: <LifeBuoyIcon size={18} />,
      },
      {
        id: "accessibility",
        title: "Accessibility Support",
        description: "Mobility, sensory, hidden disabilities",
        href: "/services/accessibility",
        icon: <AccessibilityIcon size={18} />,
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <AppShellAuthed tone="warm">
      <ServicesHero />
      <div className="-mt-14 px-5">
        <RecommendationCard />
      </div>
      <div className="mt-8 flex flex-col gap-8 pb-4">
        <QuickActionsSection />
        {serviceGroups.map((group) => (
          <ServiceGroupSection key={group.id} group={group} />
        ))}
      </div>
    </AppShellAuthed>
  );
}

function ServicesHero() {
  return (
    <section
      aria-labelledby="services-heading"
      className="relative overflow-hidden rounded-b-[var(--radius-card)] px-6 pb-7"
      style={{
        marginTop: "calc(-1 * max(env(safe-area-inset-top), 16px))",
        paddingTop: "calc(max(env(safe-area-inset-top), 16px) + 40px)",
        backgroundColor: "var(--color-surface-hero-start)",
      }}
    >
      <HeroDecorations />

      <div className="relative flex items-center justify-between gap-3">
        <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-accent)]">
          YVR network active
        </span>
        <LivePill />
      </div>

      <Heading
        as="h1"
        size="display"
        tone="hero"
        className="relative mt-6"
      >
        <span id="services-heading">Services</span>
      </Heading>
      <p className="relative mt-2 text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        YVR operational status · Mon 20 Apr
      </p>

      <ul className="relative mt-6 grid grid-cols-2 gap-3">
        {heroMetrics.map((metric) => (
          <li key={metric.id}>
            <HeroMetricCard metric={metric} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function HeroDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute right-[-40px] top-[-96px] block size-[340px] rounded-full border border-[var(--color-surface-hero-tile-border)] opacity-60" />
      <span className="absolute right-[-30px] top-[-40px] block size-[240px] rounded-full border border-[var(--color-surface-hero-tile-border)] opacity-50" />
      <span className="absolute right-[-20px] top-[48px] block size-[150px] rounded-full border border-[var(--color-surface-hero-tile-border)] opacity-40" />
      <span className="absolute bottom-0 left-[-80px] block size-[260px] rounded-full border border-[var(--color-surface-hero-fg-accent)] opacity-10" />
    </div>
  );
}

function LivePill() {
  return (
    <span
      aria-label="Live data feed"
      className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-3 py-1"
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-surface-hero-fg-accent)]"
      />
      <span className="text-micro uppercase text-[var(--color-surface-hero-fg)]">
        Live
      </span>
    </span>
  );
}

function HeroMetricCard({ metric }: { metric: HeroMetric }) {
  const dotColor =
    metric.dotTone === "mint"
      ? "bg-[var(--color-surface-hero-fg-accent)]"
      : "bg-[var(--color-hero-tier-gold-fg)]";

  return (
    <article
      aria-label={`${metric.label} — ${metric.value} ${metric.unit}, ${metric.footer}`}
      className="flex h-full flex-col gap-2 rounded-[var(--radius-button)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] p-4"
    >
      <div className="flex items-center gap-1.5">
        <span aria-hidden className="text-[var(--color-surface-hero-fg-accent)]">
          {metric.icon}
        </span>
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg-accent)]">
          {metric.label}
        </span>
      </div>
      <p className="inline-flex items-baseline gap-1 text-[var(--color-surface-hero-fg)]">
        <span className="text-title tabular-nums font-semibold">{metric.value}</span>
        <span className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          {metric.unit}
        </span>
      </p>
      <p className="inline-flex items-center gap-2 text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        <span aria-hidden className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor}`} />
        <span>{metric.footer}</span>
      </p>
    </article>
  );
}

function RecommendationCard() {
  return (
    <Card
      as="article"
      padding="lg"
      tone="solid"
      aria-label="Best service for right now"
      className="shadow-[var(--shadow-hero-composite)]"
    >
      <header className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-eyebrow uppercase text-[var(--color-surface-hero-start)]">
          <SparkleIcon size={13} />
          <span>Best for right now</span>
        </span>
        <StatusPill tone="success" size="sm">
          Optimal
        </StatusPill>
      </header>

      <h2 className="mt-4 text-section-title text-[var(--color-text-primary)]">
        Head to International Security
      </h2>
      <p className="mt-2 text-body-sm text-[var(--color-text-secondary)]">
        Current checkpoint wait is at its lowest this morning. Domestic is at
        6 min if closer.
      </p>

      <Link
        href={"/security" as Route}
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-surface-hero-start)] px-4 text-body-sm-emphasis text-[var(--color-surface-hero-fg)] transition-opacity duration-150 hover:opacity-90"
      >
        <span>View all checkpoints</span>
        <ArrowRightIcon size={15} />
      </Link>
    </Card>
  );
}

function QuickActionsSection() {
  return (
    <section
      aria-labelledby="quick-actions-heading"
      className="flex flex-col gap-3"
    >
      <header className="flex items-center justify-between gap-3 px-6">
        <Eyebrow tone="secondary">
          <span id="quick-actions-heading">Quick actions</span>
        </Eyebrow>
        <Link
          href={"/services/search" as Route}
          aria-label="Search services"
          className="inline-flex h-11 w-11 -mr-3 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]"
        >
          <SearchIcon size={14} />
        </Link>
      </header>

      <ul
        role="list"
        className="-mx-1 flex gap-2 overflow-x-auto px-6 pb-1"
      >
        {quickActions.map((action) => (
          <li key={action.id} className="shrink-0">
            <QuickActionChip action={action} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function QuickActionChip({ action }: { action: QuickAction }) {
  return (
    <Link
      href={action.href as Route}
      aria-label={action.label}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border-solid)] bg-[var(--color-surface-solid)] px-3 text-body-sm text-[var(--color-text-primary)] shadow-[var(--shadow-card-solid)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
    >
      <span aria-hidden>{action.icon}</span>
      <span>{action.label}</span>
    </Link>
  );
}

function ServiceGroupSection({ group }: { group: ServiceGroup }) {
  return (
    <section
      aria-labelledby={`group-${group.id}`}
      className="flex flex-col gap-3 px-5"
    >
      <Eyebrow tone="secondary" className="px-1">
        <span id={`group-${group.id}`}>{group.heading}</span>
      </Eyebrow>
      <Card
        padding="none"
        tone="solid"
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-solid)]"
      >
        {group.rows.map((row) => (
          <SettingsRow
            key={row.id}
            href={row.href as Route}
            icon={row.icon}
            title={row.title}
            description={row.description}
          />
        ))}
      </Card>
    </section>
  );
}
