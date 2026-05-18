import Link from "next/link";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { IconTile } from "@/components/IconTile";
import { LiveIndicator } from "@/components/LiveIndicator";
import { StickyBottomCTA } from "@/components/StickyBottomCTA";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  InfoIcon,
  SparkleIcon,
} from "@/components/icons";

type StatusKind = "online" | "standby";

type AccessStatus = {
  service: string;
  state: string;
  kind: StatusKind;
};

const COMFORT_CHIPS = [
  "English",
  "Standard text",
  "Step-free routes",
  "Alerts on",
];

const ACCESS_STATUS: AccessStatus[] = [
  { service: "Elevators online", state: "Online", kind: "online" },
  { service: "Accessible lanes available", state: "Online", kind: "online" },
  { service: "Sky Care standby", state: "Standby", kind: "standby" },
];

const LANGUAGE = {
  title: "App language",
  detail: "English · Canada",
};

export default function AccessibilitySettingsPage() {
  return (
    <AppShellAuthed activeHref="/profile">
      <PageHeader />

      <section className="mt-6 flex flex-col gap-3 px-6">
        <Heading size="display">Make YVR easier for you</Heading>
        <p className="text-body text-[var(--color-text-secondary)]">
          Language, display, routes, and assistance in one place.
        </p>
      </section>

      <div className="mt-8 flex flex-col gap-8 px-6">
        <ComfortProfileCard />
        <LanguageSection />
      </div>

      <div className="pt-8" />

      <StickyBottomCTA
        primaryAction={{
          label: "Save Accessibility Settings",
        }}
      />
    </AppShellAuthed>
  );
}

function PageHeader() {
  return (
    <header className="flex items-center justify-between gap-2 px-6 pt-2">
      <Link
        href="/profile"
        aria-label="Back to Profile"
        className="inline-flex h-11 items-center gap-1 rounded-full pr-3 text-body-sm font-medium text-[var(--color-text-primary)] transition-colors duration-150 hover:text-[var(--color-text-secondary)]"
      >
        <span
          aria-hidden
          className="inline-flex h-11 w-11 items-center justify-center"
        >
          <ArrowLeftIcon size={16} />
        </span>
        <span>Profile</span>
      </Link>

      <div className="flex items-center gap-2">
        <PersonalizedBadge />
        <HeaderIconButton
          aria-label="Accessibility settings help"
          type="button"
        >
          <InfoIcon size={18} />
        </HeaderIconButton>
      </div>
    </header>
  );
}

function PersonalizedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-teal-soft)] px-3 py-1 text-micro uppercase text-[var(--color-action-teal)]">
      <SparkleIcon size={12} aria-hidden />
      <span>Personalized</span>
    </span>
  );
}

function ComfortProfileCard() {
  return (
    <Card as="article" padding="none" aria-label="Comfort profile">
      <header className="flex items-center justify-between gap-3 px-5 pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <IconTile size={32} className="bg-[var(--color-action-teal-soft)]">
            <span className="text-[var(--color-action-teal)]">
              <SparkleIcon size={14} />
            </span>
          </IconTile>
          <h2 className="text-eyebrow uppercase text-[var(--color-text-primary)]">
            Comfort Profile
          </h2>
        </div>
        <button
          type="button"
          aria-label="Edit comfort profile"
          className="inline-flex h-11 items-center px-2 text-body-sm font-semibold text-[var(--color-action-teal)] hover:text-[var(--color-text-primary)]"
        >
          Edit
        </button>
      </header>

      <ul className="mt-4 flex flex-wrap gap-2 px-5 pb-5">
        {COMFORT_CHIPS.map((label) => (
          <li
            key={label}
            className="inline-flex h-8 items-center rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 text-body-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
          </li>
        ))}
      </ul>

      <div className="mx-5 border-t border-[var(--color-border-soft)]" />

      <div className="flex flex-col gap-4 px-5 pt-5 pb-5">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow tone="secondary">YVR Access Status</Eyebrow>
          <LiveIndicator status="live" pulse label="Live" />
        </div>

        <dl className="flex flex-col gap-3">
          {ACCESS_STATUS.map((row) => (
            <AccessStatusRow key={row.service} row={row} />
          ))}
        </dl>
      </div>
    </Card>
  );
}

function AccessStatusRow({ row }: { row: AccessStatus }) {
  const dotClass =
    row.kind === "online"
      ? "bg-[var(--color-success)]"
      : "bg-[var(--color-warning)]";
  const labelClass =
    row.kind === "online"
      ? "text-[var(--color-success-fg)]"
      : "text-[var(--color-warning-fg)]";

  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="inline-flex min-w-0 items-center gap-2">
        <span
          aria-hidden
          className={`inline-block h-2 w-2 shrink-0 rounded-full ${dotClass}`}
        />
        <span className="truncate text-body-sm text-[var(--color-text-primary)]">
          {row.service}
        </span>
      </dt>
      <dd
        className={`text-body-sm-emphasis tabular-nums ${labelClass}`}
      >
        {row.state}
      </dd>
    </div>
  );
}

function LanguageSection() {
  return (
    <section aria-label="Language" className="flex flex-col gap-4">
      <Eyebrow tone="secondary">Language</Eyebrow>
      <Card padding="none">
        <button
          type="button"
          aria-label={`Change app language, currently ${LANGUAGE.detail}`}
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
        >
          <IconTile size={38} className="bg-[var(--color-action-teal-soft)]">
            <span className="text-body-sm-emphasis text-[var(--color-action-teal)]">
              Aa
            </span>
          </IconTile>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate text-body font-medium text-[var(--color-text-primary)]">
              {LANGUAGE.title}
            </span>
            <span className="truncate text-label text-[var(--color-text-secondary)]">
              {LANGUAGE.detail}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-body-sm font-semibold text-[var(--color-action-teal)]">
            <span>Change</span>
            <span aria-hidden className="text-[var(--color-text-muted)]">
              <ChevronRightIcon size={16} />
            </span>
          </span>
        </button>
      </Card>
    </section>
  );
}
