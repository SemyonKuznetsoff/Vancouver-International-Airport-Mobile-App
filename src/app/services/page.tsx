import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { HeroSurface } from "@/components/HeroSurface";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { SettingsRow } from "@/components/SettingsRow";
import { StatusPill } from "@/components/StatusPill";
import {
  ArrowRightIcon,
  CarIcon,
  LifeBuoyIcon,
  ParkingIcon,
  PlaneIcon,
  ShieldCheckIcon,
  SignpostIcon,
  SparkleIcon,
  SyncIcon,
  TrainIcon,
} from "@/components/icons";

type ServiceStatus = {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  unit: string;
  helper: string;
};

type QuickAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: Route;
};

type ServiceRow = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: Route;
};

type ServiceGroup = {
  id: string;
  label: string;
  rows: ServiceRow[];
};

const OPERATIONAL_DATE = "Mon 20 Apr";
const OPERATIONAL_FACILITY = "YVR · International Airport";

const STATUSES: ServiceStatus[] = [
  {
    id: "security",
    label: "Security",
    icon: <ShieldCheckIcon size={13} />,
    value: "12",
    unit: "min",
    helper: "Intl · Low wait",
  },
  {
    id: "parking",
    label: "Parking",
    icon: <ParkingIcon size={13} />,
    value: "40",
    unit: "% full",
    helper: "P1 Open",
  },
  {
    id: "skytrain",
    label: "SkyTrain",
    icon: <TrainIcon size={13} />,
    value: "4",
    unit: "min",
    helper: "Next train",
  },
  {
    id: "lounges",
    label: "Lounges",
    icon: <SparkleIcon size={13} />,
    value: "3",
    unit: "open",
    helper: "Near your gate",
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "wayfinding",
    label: "Wayfinding",
    icon: <SignpostIcon size={14} />,
    href: "/map" as Route,
  },
  {
    id: "security",
    label: "Security",
    icon: <ShieldCheckIcon size={14} />,
    href: "/services/security-wait" as Route,
  },
  {
    id: "parking",
    label: "Parking",
    icon: <ParkingIcon size={14} />,
    href: "/parking" as Route,
  },
  {
    id: "transport",
    label: "Transport",
    icon: <TrainIcon size={14} />,
    href: "/ground-transport" as Route,
  },
  {
    id: "lounges",
    label: "Lounges",
    icon: <SparkleIcon size={14} />,
    href: "/lounges-premium" as Route,
  },
];

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "getting-there",
    label: "Parking & getting there",
    rows: [
      {
        id: "parking",
        icon: <ParkingIcon size={16} />,
        title: "Parking",
        description: "P1 open · Reserve, find your car, live availability",
        href: "/parking" as Route,
      },
      {
        id: "transport",
        icon: <CarIcon size={16} />,
        title: "Ground Transport",
        description: "SkyTrain 4 min · Rideshare, taxi, car rental",
        href: "/ground-transport" as Route,
      },
    ],
  },
  {
    id: "experience",
    label: "Airport experience",
    rows: [
      {
        id: "arrival-assistant",
        icon: <PlaneIcon size={16} />,
        title: "Arrival Assistant",
        description: "Guided journey from gate to ground transport",
        href: "/services/arrival-assistant" as Route,
      },
      {
        id: "lounges",
        icon: <SparkleIcon size={16} />,
        title: "Lounges",
        description: "3 open · SkyTeam, Plaza Premium",
        href: "/lounges-premium" as Route,
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    rows: [
      {
        id: "help",
        icon: <LifeBuoyIcon size={16} />,
        title: "Help & Concierge",
        description: "Ask YVR · Lost items, support, questions",
        href: "/help-support" as Route,
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <AppShellAuthed activeHref="/services">
      <div className="flex flex-col gap-5 px-6 pt-2 pb-6">
        <ServicesHero statuses={STATUSES} />
        <BestRightNowCard />
        <QuickActions actions={QUICK_ACTIONS} />
        {SERVICE_GROUPS.map((group) => (
          <ServiceListPreview key={group.id} group={group} />
        ))}
      </div>
    </AppShellAuthed>
  );
}

function ServicesHero({ statuses }: { statuses: ServiceStatus[] }) {
  const accessibleName = `YVR network active — operational status pass, ${OPERATIONAL_DATE}.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-5 p-5">
        {/* Pass header strip — issuing authority + live status */}
        <ServicesPassHeader />

        {/* Document identity — eyebrow, display title, subtitle */}
        <ServicesIdentity />

        {/* Data zone — 2x2 operational status tiles */}
        <ul
          aria-label="Live operational status"
          className="grid grid-cols-2 gap-3"
        >
          {statuses.map((s) => (
            <li key={s.id}>
              <ServiceStatusTile status={s} />
            </li>
          ))}
        </ul>

        <PassPerforation inset="-mx-5" />

        {/* Pass footer — facility chip + barcode marks */}
        <ServicesPassFooter />
      </div>
    </HeroSurface>
  );
}

function ServicesPassHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
        <SyncIcon size={11} aria-hidden />
        YVR Operations
      </span>
      <StatusPill tone="success" surface="hero" leadingDot size="sm">
        Live
      </StatusPill>
    </div>
  );
}

function ServicesIdentity() {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
        YVR Network Active
      </span>
      <Heading as="h1" size="display" tone="hero">
        Services
      </Heading>
      <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        YVR operational status · {OPERATIONAL_DATE}
      </p>
    </div>
  );
}

function ServicesPassFooter() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="inline-flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
        >
          <ShieldCheckIcon size={12} />
        </span>
        <span className="truncate text-label text-[var(--color-surface-hero-fg-muted)]">
          {OPERATIONAL_FACILITY}
        </span>
      </div>
      <ServicesBarcodeMarks />
    </div>
  );
}

function ServicesBarcodeMarks() {
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

function ServiceStatusTile({ status }: { status: ServiceStatus }) {
  return (
    <div
      aria-label={`${status.label}: ${status.value} ${status.unit}, ${status.helper}`}
      className="flex flex-col gap-2 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] p-4"
    >
      <span className="inline-flex items-center gap-1.5 text-eyebrow uppercase text-[var(--color-map-mint)]">
        <span aria-hidden className="inline-flex shrink-0">
          {status.icon}
        </span>
        {status.label}
      </span>
      <span className="inline-flex items-baseline gap-1">
        <span className="text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
          {status.value}
        </span>
        <span className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          {status.unit}
        </span>
      </span>
      <span className="inline-flex items-center gap-1.5 text-label text-[var(--color-surface-hero-fg)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-map-mint)]"
        />
        {status.helper}
      </span>
    </div>
  );
}

function BestRightNowCard() {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="default"
      aria-label="Best for right now — Head to International Security"
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-eyebrow uppercase text-[var(--color-action-teal)]">
          <SparkleIcon size={12} aria-hidden />
          Best for right now
        </span>
        <span className="inline-flex h-5 items-center rounded-[var(--radius-pill)] bg-[var(--color-success-bg)] px-2 text-micro uppercase text-[var(--color-success-fg)]">
          Optimal
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-section-title text-[var(--color-text-primary)]">
          Head to International Security
        </h2>
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Current checkpoint wait is at its lowest this morning. Domestic
          is at 6 min if closer.
        </p>
      </div>

      <Button
        tone="teal"
        href={"/services/security-wait" as Route}
        trailingIcon={<ArrowRightIcon size={16} />}
        aria-label="View all security checkpoints"
      >
        View all checkpoints
      </Button>
    </Card>
  );
}

function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <section aria-labelledby="quick-actions-heading" className="flex flex-col gap-3 pt-1">
      <h2
        id="quick-actions-heading"
        className="text-eyebrow uppercase text-[var(--color-text-muted)]"
      >
        Quick actions
      </h2>

      <div
        role="list"
        aria-label="Quick action shortcuts"
        className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max gap-2">
          {actions.map((a) => (
            <QuickActionChip key={a.id} action={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickActionChip({ action }: { action: QuickAction }) {
  const content = (
    <>
      <span aria-hidden className="inline-flex shrink-0 text-[var(--color-action-teal)]">
        {action.icon}
      </span>
      <span className="text-body-sm text-[var(--color-text-primary)]">
        {action.label}
      </span>
    </>
  );
  const classes =
    "inline-flex h-11 shrink-0 items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]";
  if (action.href) {
    return (
      <Link
        role="listitem"
        href={action.href}
        aria-label={action.label}
        className={classes}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      role="listitem"
      aria-label={action.label}
      className={classes}
    >
      {content}
    </button>
  );
}

function ServiceListPreview({ group }: { group: ServiceGroup }) {
  return (
    <section
      aria-labelledby={`service-group-${group.id}`}
      className="flex flex-col gap-3"
    >
      <h2
        id={`service-group-${group.id}`}
        className="px-1 text-eyebrow uppercase text-[var(--color-text-muted)]"
      >
        {group.label}
      </h2>
      <Card
        as="div"
        surface="sheet"
        padding="none"
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]"
      >
        {group.rows.map((row) => (
          <ServicePreviewRow key={row.id} row={row} />
        ))}
      </Card>
    </section>
  );
}

function ServicePreviewRow({ row }: { row: ServiceRow }) {
  return (
    <SettingsRow
      icon={
        <span className="text-[var(--color-action-teal)]">{row.icon}</span>
      }
      title={row.title}
      description={row.description}
      href={row.href}
    />
  );
}
