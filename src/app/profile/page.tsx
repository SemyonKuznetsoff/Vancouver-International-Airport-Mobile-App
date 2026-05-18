import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { GateDisplay } from "@/components/GateDisplay";
import { IconTile } from "@/components/IconTile";
import { LargeTitleHeader } from "@/components/LargeTitleHeader";
import { LiveIndicator } from "@/components/LiveIndicator";
import { MetricBlock } from "@/components/MetricBlock";
import { RouteTimeline } from "@/components/RouteTimeline";
import { SettingsRow } from "@/components/SettingsRow";
import { StatusPill } from "@/components/StatusPill";
import {
  BellIcon,
  LifeBuoyIcon,
  LockIcon,
  NavigationIcon,
  PlaneIcon,
  SparkleIcon,
  SyncIcon,
} from "@/components/icons";

const user = {
  initial: "A",
  name: "Alex Mitchell",
  email: "alex.mitchell@gmail.com",
};

const stats = [
  { label: "Trips", value: "24" },
  { label: "Miles", value: "148k" },
  { label: "Saved", value: "7" },
  { label: "Alerts", value: "3", alert: true },
];

const trip = {
  airline: "Air Canada · AC 892",
  context: "Next trip · Today",
  origin: { code: "YVR", city: "Vancouver", time: "14:35" },
  destination: { code: "NRT", city: "Tokyo", time: "17:20", offset: "+1" },
  duration: "10h 45 · Nonstop",
  gate: "D73",
  terminal: "Intl",
  boarding: "13:55",
  seat: "14A",
};

export default function ProfilePage() {
  return (
    <AppShellAuthed>
      <LargeTitleHeader
        title="Profile"
        subtitle="Your travel command center"
      />

      <div className="mt-8 flex flex-col gap-8 px-6 pb-8">
        <ProfileIdentityCard />
        <NextTripCard />
        <VaultSection />
        <SupportSection />
        <p className="text-center text-label tabular-nums text-[var(--color-text-muted)]">
          YVR Concierge · v4.12.0
        </p>
      </div>
    </AppShellAuthed>
  );
}

function ProfileIdentityCard() {
  return (
    <section
      aria-label="Account summary"
      className="relative overflow-hidden rounded-[var(--radius-card)] p-5 text-[var(--color-surface-hero-fg)]"
      style={{
        backgroundImage:
          "linear-gradient(167deg, var(--color-surface-hero-start) 8%, var(--color-surface-hero-end) 92%)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-chip)] border border-[var(--color-surface-hero-avatar-border)] bg-[var(--color-surface-hero-avatar)] text-section-title text-[var(--color-surface-hero-fg)]"
        >
          {user.initial}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-section-title text-[var(--color-surface-hero-fg)]">
            {user.name}
          </p>
          <p className="truncate text-label text-[var(--color-surface-hero-fg-muted)]">
            {user.email}
          </p>
        </div>
        <LiveIndicator
          status="live"
          label="Live"
          className="text-[var(--color-surface-hero-fg-muted)]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <MembershipChip icon={<SparkleIcon size={12} />} label="Aeroplan Gold" tone="gold" />
        <MembershipChip dot label="YVR Member" tone="neutral" />
      </div>

      <p className="mt-4 inline-flex items-center gap-2 text-label text-[var(--color-surface-hero-fg-soft)]">
        <SyncIcon size={12} />
        <span>YVR Concierge · Synced just now</span>
      </p>

      <ul className="mt-5 grid grid-cols-4 gap-2">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="flex flex-col gap-1 rounded-[var(--radius-chip)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-3 py-3"
          >
            <span className="inline-flex items-center gap-2 text-section-title tabular-nums text-[var(--color-surface-hero-fg)]">
              {stat.value}
              {stat.alert ? (
                <span
                  aria-label="Unread alert"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]"
                />
              ) : null}
            </span>
            <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
              {stat.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MembershipChip({
  icon,
  dot = false,
  label,
  tone,
}: {
  icon?: React.ReactNode;
  dot?: boolean;
  label: string;
  tone: "gold" | "neutral";
}) {
  const toneClass =
    tone === "gold"
      ? "border-[var(--color-hero-tier-gold-border)] bg-[var(--color-hero-tier-gold-bg)] text-[var(--color-hero-tier-gold-fg)]"
      : "border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] text-[var(--color-surface-hero-fg)]";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1 text-micro uppercase ${toneClass}`}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      {dot ? (
        <span
          aria-hidden
          className="inline-block h-1 w-1 rounded-full bg-current"
        />
      ) : null}
      <span>{label}</span>
    </span>
  );
}

function NextTripCard() {
  return (
    <Card as="article" padding="none" aria-label="Next trip">
      <header className="flex items-center justify-between gap-3 px-4 pt-4 pb-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <IconTile size={36} className="bg-[var(--color-surface-tile)]">
            <span className="text-[var(--color-text-primary)]">
              <PlaneIcon size={16} />
            </span>
          </IconTile>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-body-sm text-[var(--color-text-primary)]">
              {trip.airline}
            </p>
            <p className="truncate text-label text-[var(--color-text-secondary)]">
              {trip.context}
            </p>
          </div>
        </div>
        <StatusPill tone="success" size="sm" leadingDot>
          On time
        </StatusPill>
      </header>

      <div className="border-t border-[var(--color-border-soft)] px-4 pt-4">
        <RouteTimeline
          origin={trip.origin}
          destination={trip.destination}
          duration={trip.duration}
        />
      </div>

      <div className="mx-4 mt-4 flex items-center justify-between gap-4 rounded-[var(--radius-chip)] bg-[var(--color-surface-tile)] px-4 py-3">
        <GateDisplay gate={trip.gate} terminal={trip.terminal} />
        <span aria-hidden className="h-6 w-px bg-[var(--color-border-soft)]" />
        <MetricBlock label="Boarding" value={trip.boarding} align="left" />
        <span aria-hidden className="h-6 w-px bg-[var(--color-border-soft)]" />
        <MetricBlock label="Seat" value={trip.seat} align="left" />
      </div>

      <div className="flex flex-col gap-2 px-4 pt-4 pb-4">
        <Button
          variant="primary"
          href="/flights/detail"
          leadingIcon={<NavigationIcon size={16} />}
          aria-label="Navigate to gate for AC 892"
        >
          Navigate to gate
        </Button>
        <Button
          variant="ghost"
          href="/flights/detail"
          aria-label="View trip details for AC 892"
        >
          View trip details
        </Button>
      </div>
    </Card>
  );
}

function VaultSection() {
  return (
    <section aria-label="Travel Vault" className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-section-title text-[var(--color-text-primary)]">
          Travel Vault
        </h2>
        <p className="text-label text-[var(--color-text-secondary)]">
          Account &amp; preferences
        </p>
      </header>

      <Card
        padding="none"
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]"
      >
        <SettingsRow
          href="/profile/saved-trips"
          icon={<PlaneIcon size={18} />}
          title="Saved trips"
          description="Your next journey · 2 saved"
        />
        <SettingsRow
          icon={<LockIcon size={18} />}
          title="Security & password"
          description="2FA active · Updated 30 days ago"
          trailing={
            <StatusPill tone="success" size="sm" leadingDot>
              Secure
            </StatusPill>
          }
        />
        <SettingsRow
          href="/profile/notifications"
          icon={<BellIcon size={18} />}
          title="Notifications"
          description="Flight alerts · Gate changes · Security"
          unread
        />
      </Card>
    </section>
  );
}

function SupportSection() {
  return (
    <Card
      padding="none"
      className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]"
    >
      <SettingsRow
        href="/help-support"
        icon={<LifeBuoyIcon size={18} />}
        title="Help & support"
        description="Concierge · Lost &amp; found · Feedback"
      />
    </Card>
  );
}
