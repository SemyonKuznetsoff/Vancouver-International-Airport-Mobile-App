import Link from "next/link";
import type { Route } from "next";
import {
  PROTOTYPE_DEPARTING_STATE,
  departingHref,
} from "@/data/departing-state";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { BrandMark } from "@/components/BrandMark";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import { HeroSurface } from "@/components/HeroSurface";
import { HomeFlightSearch } from "@/components/HomeFlightSearch";
import { IconTile } from "@/components/IconTile";
import { LiveIndicator } from "@/components/LiveIndicator";
import { MetricBlock } from "@/components/MetricBlock";
import { SettingsRow } from "@/components/SettingsRow";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowRightIcon,
  BellIcon,
  LifeBuoyIcon,
  MapIcon,
  NavigationIcon,
  ParkingIcon,
  PlaneIcon,
  ProfileIcon,
  ShieldCheckIcon,
  SignpostIcon,
  SparkleIcon,
  TrainIcon,
} from "@/components/icons";

type AirportStatus = {
  airport: string;
  temperature: string;
  conditions: string;
  overall: "On time" | "Boarding" | "Delayed";
  updated: string;
};

type LiveMetric = {
  id: string;
  href: Route;
  label: string;
  icon: React.ReactNode;
  value: string;
  unit?: string;
  footer: React.ReactNode;
};

type IntentCard = {
  id: string;
  href: Route;
  title: string;
  description: string;
  icon: React.ReactNode;
};

type ServiceRow = {
  id: string;
  href: Route;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const airportStatus: AirportStatus = {
  airport: "YVR",
  temperature: "11°C",
  conditions: "Calm",
  overall: "On time",
  updated: "just now",
};

const liveMetrics: LiveMetric[] = [
  {
    id: "security",
    href: "/services/security-wait",
    label: "Security",
    icon: <ShieldCheckIcon size={14} />,
    value: "8",
    unit: "min",
    footer: (
      <StatusPill tone="success" size="sm" leadingDot>
        Low
      </StatusPill>
    ),
  },
  {
    id: "parking",
    href: "/parking",
    label: "Parking",
    icon: <ParkingIcon size={14} />,
    value: "62",
    unit: "%",
    footer: (
      <span className="text-micro uppercase text-[var(--color-text-primary)]">
        P1 · P2 open
      </span>
    ),
  },
  {
    id: "skytrain",
    href: "/ground-transport",
    label: "SkyTrain",
    icon: <TrainIcon size={14} />,
    value: "4",
    unit: "min",
    footer: (
      <span className="text-micro uppercase text-[var(--color-text-primary)]">
        → Waterfront
      </span>
    ),
  },
];

const intentDeparting: IntentCard = {
  id: "departing",
  href: departingHref(PROTOTYPE_DEPARTING_STATE),
  title: "Departing",
  description: "Check-in, gate and wayfinding",
  icon: <PlaneIcon size={16} />,
};

const intentSecondary: IntentCard[] = [
  {
    id: "arriving",
    href: "/services/arrival-assistant",
    title: "Arriving",
    description: "Bags · transit",
    icon: <NavigationIcon size={16} />,
  },
  {
    id: "pickup",
    href: "/home/pickup-waiting",
    title: "Pickup",
    description: "Drop-off · curbside",
    icon: <MapIcon size={16} />,
  },
];

const exploreCard: IntentCard = {
  id: "explore",
  href: "/map",
  title: "Explore the airport",
  description: "Terminal map · 3 levels · indoor wayfinding",
  icon: <SignpostIcon size={18} />,
};

const services: ServiceRow[] = [
  {
    id: "customer-care",
    href: "/help-support",
    title: "Customer Care",
    description: "24/7 · Level 3",
    icon: <LifeBuoyIcon size={18} />,
  },
  {
    id: "parking-transport",
    href: "/parking",
    title: "Parking & Transport",
    description: "P1 · P2 · SkyTrain",
    icon: <MapIcon size={18} />,
  },
];

export default function HomePage() {
  return (
    <AppShellAuthed>
      <HomeHeader />
      <div className="flex flex-col gap-8 px-6 pb-8">
        <HeroAddTripCard status={airportStatus} />
        <LiveAtYvrSection metrics={liveMetrics} updated={airportStatus.updated} />
        <ImHereToSection
          departing={intentDeparting}
          secondary={intentSecondary}
          explore={exploreCard}
        />
        <UnlockConciergeBanner />
        <AirportServicesSection services={services} />
      </div>
    </AppShellAuthed>
  );
}

function HomeHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pt-2 pb-4">
      <BrandMark />
      <div className="flex items-center gap-2">
        <Link
          href="/profile/notifications"
          aria-label="Notifications"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
        >
          <BellIcon size={16} />
        </Link>
        <Link
          href="/profile"
          aria-label="Open profile"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] transition-colors duration-150 hover:opacity-90"
        >
          <ProfileIcon size={16} />
        </Link>
      </div>
    </header>
  );
}

function HeroAddTripCard({ status }: { status: AirportStatus }) {
  return (
    <HeroSurface as="section" aria-label="Plan today" className="p-6">
      <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-3 py-1 text-micro uppercase text-[var(--color-surface-hero-fg)]">
        <SparkleIcon size={12} />
        <span>
          {status.airport} · {status.temperature} · {status.conditions}
        </span>
      </span>

      <Heading size="display" tone="hero" className="mt-8">
        Where to,
        <br />
        <em>today?</em>
      </Heading>

      <p className="mt-4 text-body text-[var(--color-surface-hero-fg-muted)]">
        Add a trip and we&rsquo;ll guide every step — from curb to gate, calmly.
      </p>

      <div className="mt-6">
        <HomeFlightSearch />
      </div>
    </HeroSurface>
  );
}

function LiveAtYvrSection({
  metrics,
  updated,
}: {
  metrics: LiveMetric[];
  updated: string;
}) {
  return (
    <section
      aria-labelledby="live-at-yvr-heading"
      className="flex flex-col gap-3"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Eyebrow tone="primary">
            <span id="live-at-yvr-heading">Live at YVR</span>
          </Eyebrow>
          <LiveIndicator status="live" label="On time" />
        </div>
        <span className="text-label text-[var(--color-text-muted)]">
          Updated · {updated}
        </span>
      </header>

      <Card
        as="article"
        padding="none"
        aria-label="Live airport metrics"
        className="grid grid-cols-3 divide-x divide-[var(--color-border-soft)]"
      >
        {metrics.map((metric) => (
          <LiveMetricColumn key={metric.id} metric={metric} />
        ))}
      </Card>
    </section>
  );
}

function LiveMetricColumn({ metric }: { metric: LiveMetric }) {
  return (
    <Link
      href={metric.href}
      aria-label={`${metric.label} — ${metric.value}${metric.unit ?? ""}`}
      className="flex flex-col gap-2 px-4 py-4 transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
    >
      <span className="inline-flex items-center gap-1 text-micro uppercase text-[var(--color-text-secondary)]">
        <span aria-hidden className="text-[var(--color-text-primary)]">
          {metric.icon}
        </span>
        <span>{metric.label}</span>
      </span>
      <MetricBlock
        value={
          <span className="inline-flex items-baseline gap-1">
            <span>{metric.value}</span>
            {metric.unit ? (
              <span className="text-label text-[var(--color-text-secondary)]">
                {metric.unit}
              </span>
            ) : null}
          </span>
        }
        label={metric.label}
        hideLabel
        align="left"
      />
      <span className="inline-flex items-center">{metric.footer}</span>
    </Link>
  );
}

function ImHereToSection({
  departing,
  secondary,
  explore,
}: {
  departing: IntentCard;
  secondary: IntentCard[];
  explore: IntentCard;
}) {
  return (
    <section
      aria-labelledby="intent-heading"
      className="flex flex-col gap-4"
    >
      <Eyebrow tone="primary">
        <span id="intent-heading">I&rsquo;m here to</span>
      </Eyebrow>

      <div className="grid grid-cols-2 gap-3">
        <DepartingHeroCard card={departing} />
        <div className="flex flex-col gap-3">
          {secondary.map((card) => (
            <CompactIntentCard key={card.id} card={card} />
          ))}
        </div>
      </div>

      <SettingsRow
        href={explore.href}
        icon={explore.icon}
        title={explore.title}
        description={explore.description}
      />
    </section>
  );
}

function DepartingHeroCard({ card }: { card: IntentCard }) {
  return (
    <Link
      href={card.href}
      aria-label={`${card.title} — ${card.description}`}
      className="block transition-opacity duration-150 hover:opacity-95"
    >
      <HeroSurface
        as="div"
        className="flex h-full min-h-[196px] flex-col justify-between p-5"
      >
        <div className="flex items-start justify-between">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] text-[var(--color-surface-hero-fg)]">
            {card.icon}
          </span>
          <span
            aria-hidden
            className="inline-flex items-center text-[var(--color-surface-hero-fg-muted)]"
          >
            <ArrowRightIcon size={16} />
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-section-title text-[var(--color-surface-hero-fg)]">
            {card.title}
          </p>
          <p className="text-label text-[var(--color-surface-hero-fg-muted)]">
            {card.description}
          </p>
        </div>
      </HeroSurface>
    </Link>
  );
}

function CompactIntentCard({ card }: { card: IntentCard }) {
  return (
    <Card padding="compact">
      <Link
        href={card.href}
        aria-label={`${card.title} — ${card.description}`}
        className="flex flex-col gap-3"
      >
        <IconTile size={32} className="bg-[var(--color-surface-tile)]">
          <span className="text-[var(--color-text-primary)]">{card.icon}</span>
        </IconTile>
        <div className="flex flex-col gap-1">
          <p className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            {card.title}
          </p>
          <p className="text-label text-[var(--color-text-secondary)]">
            {card.description}
          </p>
        </div>
      </Link>
    </Card>
  );
}

function UnlockConciergeBanner() {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <IconTile size={40} className="bg-[var(--color-surface-tile)]">
          <span className="text-[var(--color-text-primary)]">
            <SparkleIcon size={16} />
          </span>
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            Your YVR concierge
          </p>
          <p className="text-label text-[var(--color-text-secondary)]">
            Real-time gate updates, walk-time, and security ETA — there when you need them.
          </p>
        </div>
      </div>
    </Card>
  );
}

function AirportServicesSection({ services }: { services: ServiceRow[] }) {
  return (
    <section
      aria-labelledby="airport-services-heading"
      className="flex flex-col gap-4"
    >
      <header className="flex items-end justify-between gap-3">
        <Eyebrow tone="primary">
          <span id="airport-services-heading">Airport services</span>
        </Eyebrow>
        <Link
          href="/services"
          className="text-body-sm-emphasis text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)]"
        >
          All
        </Link>
      </header>

      <Card
        padding="none"
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]"
      >
        {services.map((service) => (
          <SettingsRow
            key={service.id}
            href={service.href}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}
      </Card>
    </section>
  );
}
