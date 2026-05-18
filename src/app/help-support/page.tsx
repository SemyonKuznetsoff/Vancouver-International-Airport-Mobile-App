import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import {
  AccessibilityIcon,
  ArrowLeftIcon,
  ChatBubbleIcon,
  InfoIcon,
  LuggageIcon,
  ShieldCheckIcon,
  SparkleIcon,
  UsersIcon,
} from "@/components/icons";

type InfoItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const INFO_ITEMS: InfoItem[] = [
  {
    id: "info-desks",
    icon: <InfoIcon size={16} />,
    title: "Information desks",
    description: "Throughout departures and arrivals — staffed by YVR teams.",
  },
  {
    id: "lost-found",
    icon: <LuggageIcon size={16} />,
    title: "Lost & Found",
    description: "Report missing items at any YVR information desk.",
  },
  {
    id: "accessibility",
    icon: <AccessibilityIcon size={16} />,
    title: "Accessibility services",
    description:
      "Wheelchairs, mobility carts, and assistance — ask any YVR staff member.",
  },
  {
    id: "green-coats",
    icon: <UsersIcon size={16} />,
    title: "Look for a Green Coat",
    description:
      "Friendly YVR volunteer ambassadors are stationed throughout the terminal.",
  },
];

export default function HelpSupportPage() {
  return (
    <AppShellAuthed activeHref="/profile">
      <HelpSupportHeader />
      <div className="flex flex-1 flex-col gap-6 px-6 pb-6">
        <ConciergeHeroCard />
        <InTerminalHelpSection items={INFO_ITEMS} />
      </div>
    </AppShellAuthed>
  );
}

function HelpSupportHeader() {
  return (
    <header className="flex items-start gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton aria-label="Back" href={"/profile" as Route}>
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
        <h1 className="text-title text-[var(--color-text-primary)]">
          Help &amp; Support
        </h1>
        <p className="inline-flex items-center gap-2 text-label text-[var(--color-text-secondary)]">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
          />
          YVR Concierge · Information &amp; guidance
        </p>
      </div>
    </header>
  );
}

function ConciergeHeroCard() {
  return (
    <HeroSurface
      as="section"
      aria-label="YVR Concierge information"
      angle="160deg"
      className="relative flex flex-col gap-5 p-5 shadow-[var(--shadow-hero-card)]"
    >
      <HeroDecor />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <IconTile
            size={40}
            className="rounded-[var(--radius-tile)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
          >
            <SparkleIcon size={18} />
          </IconTile>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
              Help &amp; Information
            </span>
            <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
              Information · Lost &amp; found · Accessibility
            </span>
          </div>
        </div>

        <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-2.5 text-micro uppercase text-[var(--color-surface-hero-fg)]">
          <ShieldCheckIcon size={11} aria-hidden />
          YVR Verified
        </span>
      </div>

      <div className="relative flex flex-col gap-2">
        <h2 className="text-title text-[var(--color-surface-hero-fg)]">
          How can we help with your journey?
        </h2>
        <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          Find services, support, and guidance — anywhere in the terminal,
          day and night.
        </p>
      </div>

      <QuickAnswerTile
        question="Where are baggage carousels?"
        answer="Check the Arrivals screens — your carousel is listed by flight number once bags are on their way."
      />
    </HeroSurface>
  );
}

function HeroDecor() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 330 480"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-[var(--color-map-mint)] opacity-[0.06]"
    >
      <circle cx="290" cy="60" r="110" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="290" cy="60" r="60" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 5" />
      <circle cx="40" cy="380" r="100" fill="none" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

function QuickAnswerTile({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="relative flex flex-col gap-2 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-4 py-3">
      <span className="inline-flex items-center gap-2 text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
        <ChatBubbleIcon size={11} aria-hidden />
        Quick answer
      </span>
      <p className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
        {question}
      </p>
      <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        {answer}
      </p>
    </div>
  );
}

function InTerminalHelpSection({ items }: { items: InfoItem[] }) {
  return (
    <section
      aria-labelledby="in-terminal-help-heading"
      className="flex flex-col gap-3"
    >
      <h2
        id="in-terminal-help-heading"
        className="text-section-title text-[var(--color-text-primary)]"
      >
        Find help in the terminal
      </h2>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <InfoCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function InfoCard({ item }: { item: InfoItem }) {
  return (
    <Card as="article" padding="default" surface="sheet">
      <div className="flex items-center gap-3">
        <IconTile size={36} className="bg-[var(--color-surface-tile)]">
          <span className="text-[var(--color-text-primary)]">{item.icon}</span>
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            {item.title}
          </p>
          <p className="text-label text-[var(--color-text-secondary)]">
            {item.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
