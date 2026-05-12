"use client";

// =============================================================================
// /design — design-system preview route
// -----------------------------------------------------------------------------
// Development-only manifest of every reusable primitive, variant, and state.
// Lives outside the production navigation — no other page links here.
//
// Path note: this route is at `/design`, not `/_design`. App Router folders
// prefixed with `_` are private and do NOT create routes; the literal
// `src/app/_design/page.tsx` requested in the spec would never have been
// reachable. If you prefer to gate this page in production, add a
// `notFound()` call from `next/navigation` at the top of the component.
// =============================================================================

import { useState } from "react";

import { AirportCodePair } from "@/components/AirportCodePair";
import { AppShell } from "@/components/AppShell";
import { AuthOption, AuthOptionGroup } from "@/components/AuthOption";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ChipFilter } from "@/components/ChipFilter";
import { CountdownBlock } from "@/components/CountdownBlock";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Eyebrow } from "@/components/Eyebrow";
import { FieldMessage } from "@/components/FieldMessage";
import { GateDisplay } from "@/components/GateDisplay";
import { Heading } from "@/components/Heading";
import { IconTile } from "@/components/IconTile";
import { InlineAlert } from "@/components/InlineAlert";
import { LargeTitleHeader } from "@/components/LargeTitleHeader";
import { LiveIndicator } from "@/components/LiveIndicator";
import { MetricBlock } from "@/components/MetricBlock";
import { PermissionCard } from "@/components/PermissionCard";
import { RouteTimeline } from "@/components/RouteTimeline";
import { SearchField } from "@/components/SearchField";
import { SettingsRow } from "@/components/SettingsRow";
import { Skeleton } from "@/components/Skeleton";
import { StatusPill } from "@/components/StatusPill";
import { StickyBottomCTA } from "@/components/StickyBottomCTA";
import { TextField } from "@/components/TextField";
import { Toggle } from "@/components/Toggle";
import {
  AccessibilityIcon,
  AeroplanBadge,
  AppleIcon,
  ArrowRightIcon,
  BellIcon,
  BookmarkIcon,
  ClockIcon,
  CreditCardIcon,
  DiningIcon,
  GoogleIcon,
  IdCardIcon,
  LifeBuoyIcon,
  LocationPinIcon,
  LockIcon,
  MailIcon,
  ParkingIcon,
  PlaneIcon,
  ScanIcon,
  SignpostIcon,
  TrainIcon,
} from "@/components/icons";

export default function DesignPreviewPage() {
  // Interactive state for live demos.
  const [toggleOff, setToggleOff] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const [toggleBusy, setToggleBusy] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [chipDep, setChipDep] = useState(true);
  const [chipArr, setChipArr] = useState(false);
  const [chipLay, setChipLay] = useState(false);

  return (
    <AppShell>
      <LargeTitleHeader
        title="Design preview"
        subtitle="Every reusable primitive, variant, and state."
      />

      <main className="flex flex-col gap-12 px-6 py-8">
        <InlineAlert
          variant="warning"
          title="Development only"
          description="This route is a manifest for visual review. It is not linked from production navigation. Check this before building a new screen."
        />

        {/* ============================================================ */}
        <Section title="Typography roles">
          <SubSection title="Default surface (aurora / glass card)">
            <Stack>
              <Heading>Display heading</Heading>
              <Heading size="title">Title heading</Heading>
              <h2 className="text-section-title text-[var(--color-text-primary)]">
                Section title
              </h2>
              <p className="text-body text-[var(--color-text-primary)]">
                Body — flights, gates, maps, and alerts in one quiet place.
              </p>
              <p className="text-body-sm text-[var(--color-text-secondary)]">
                Body small — secondary copy inside cards.
              </p>
              <p className="text-label text-[var(--color-text-secondary)]">
                Label — helper / caption / form labels (11px).
              </p>
              <Eyebrow>Eyebrow — uppercase tracked label</Eyebrow>
              <p className="text-micro uppercase text-[var(--color-text-secondary)]">
                Micro — footer micro-label
              </p>
            </Stack>
          </SubSection>

          <SubSection title="Hero tone (dark teal hero surface)">
            <p className="text-body-sm text-[var(--color-text-secondary)]">
              `tone=&quot;hero&quot;` on `&lt;Heading&gt;` and `&lt;Eyebrow&gt;` maps the
              foreground to the `--color-surface-hero-*` tokens. Use only on the
              dark hero surface (Profile identity card, Saved Trips header).
            </p>
            <div
              className="flex flex-col gap-2 rounded-[var(--radius-card)] p-5"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, var(--color-surface-hero-start) 0%, var(--color-surface-hero-end) 100%)",
              }}
            >
              <Eyebrow tone="hero">Your Travel Vault</Eyebrow>
              <Heading size="title" tone="hero">
                Saved Trips
              </Heading>
              <p className="text-body text-[var(--color-surface-hero-fg-muted)]">
                Welcome back, Alex — your next journey is ready.
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-label tabular-nums text-[var(--color-surface-hero-fg-muted)]">
                <ClockIcon size={12} />
                <span>10:45 → 05:30 · Gate Intl · —</span>
              </p>
            </div>
          </SubSection>
        </Section>

        {/* ============================================================ */}
        <Section title="Surfaces & status colours">
          <div className="grid grid-cols-2 gap-2">
            <Swatch token="--color-bg" label="bg" />
            <Swatch token="--color-surface-elevated" label="surface-elevated" />
            <Swatch token="--color-surface-card" label="surface-card" />
            <Swatch token="--color-surface-hover" label="surface-hover" />
            <Swatch token="--color-action-primary" label="action-primary" foreground />
            <Swatch token="--color-text-primary" label="text-primary" foreground />
            <Swatch token="--color-text-secondary" label="text-secondary" foreground />
            <Swatch token="--color-text-muted" label="text-muted" foreground />
            <Swatch token="--color-success" label="success" foreground />
            <Swatch token="--color-warning" label="warning" foreground />
            <Swatch token="--color-danger" label="danger" foreground />
            <Swatch token="--color-info" label="info" foreground />
          </div>
        </Section>

        {/* ============================================================ */}
        <Section title="Status surface trios" description="Used by InlineAlert and ErrorState badges.">
          <Stack>
            <InlineAlert variant="info" description="Info banner — boarding starts in 20 minutes." />
            <InlineAlert variant="success" description="Success banner — flight added to your trip." />
            <InlineAlert
              variant="warning"
              title="Gate change"
              description="Now boarding at Gate B12."
            />
            <InlineAlert
              variant="danger"
              title="Cancelled"
              description="Flight AC123 has been cancelled. Tap for options."
            />
            <InlineAlert variant="neutral" description="Neutral banner — last updated 2 min ago." />
          </Stack>
        </Section>

        {/* ============================================================ */}
        <Section title="Buttons">
          <Stack>
            <Button variant="primary" trailingIcon={<ArrowRightIcon size={16} />}>
              Primary action
            </Button>
            <Button variant="primary" loading loadingLabel="Signing in…">
              Continue
            </Button>
            <Button variant="primary" disabled>
              Disabled primary
            </Button>
            <Button variant="secondary" leadingIcon={<MailIcon size={16} />}>
              Sign in with email
            </Button>
            <Button variant="secondary" loading>
              Loading secondary
            </Button>
            <Button variant="ghost">I already have an account</Button>
          </Stack>
        </Section>

        {/* ============================================================ */}
        <Section title="Cards">
          <Stack>
            <Card>
              <p className="text-body text-[var(--color-text-primary)]">
                Default padding (20px).
              </p>
            </Card>
            <Card padding="compact">
              <p className="text-body text-[var(--color-text-primary)]">
                Compact padding (16px).
              </p>
            </Card>
            <Card padding="lg">
              <p className="text-body text-[var(--color-text-primary)]">
                Large padding (24px) — for hero cards.
              </p>
            </Card>
            <Card padding="none">
              <div className="px-5 py-4">
                <p className="text-body text-[var(--color-text-primary)]">
                  Padding none — children own padding.
                </p>
              </div>
            </Card>
          </Stack>
        </Section>

        {/* ============================================================ */}
        <Section title="Toggle">
          <Card className="flex items-center justify-between">
            <span className="text-body-sm text-[var(--color-text-primary)]">Unchecked</span>
            <Toggle checked={toggleOff} onChange={setToggleOff} ariaLabel="Toggle off demo" />
          </Card>
          <Card className="flex items-center justify-between">
            <span className="text-body-sm text-[var(--color-text-primary)]">Checked</span>
            <Toggle checked={toggleOn} onChange={setToggleOn} ariaLabel="Toggle on demo" />
          </Card>
          <Card className="flex items-center justify-between">
            <span className="text-body-sm text-[var(--color-text-primary)]">Disabled</span>
            <Toggle checked onChange={() => {}} disabled ariaLabel="Toggle disabled demo" />
          </Card>
          <Card className="flex items-center justify-between">
            <span className="text-body-sm text-[var(--color-text-primary)]">Busy (async)</span>
            <Toggle
              checked={toggleBusy}
              onChange={setToggleBusy}
              busy
              ariaLabel="Toggle busy demo"
            />
          </Card>
        </Section>

        {/* ============================================================ */}
        <Section title="AuthOption / AuthOptionGroup">
          <AuthOptionGroup>
            <AuthOption leading={<AppleIcon size={18} />} label="Continue with Apple" />
            <AuthOption leading={<GoogleIcon size={18} />} label="Continue with Google" />
            <AuthOption
              leading={<AeroplanBadge size={20} />}
              label="Continue with Aeroplan"
              badge="Linked"
            />
          </AuthOptionGroup>
        </Section>

        {/* ============================================================ */}
        <Section title="PermissionCard">
          <PermissionCard
            icon={<LocationPinIcon size={18} />}
            title="Find my way"
            description="Step-by-step directions to gates, lounges, food, and services."
            footerLabel="Location while using app"
            toggleAriaLabel="Enable wayfinding guidance"
            defaultOn={false}
          />
          <PermissionCard
            icon={<BellIcon size={18} />}
            title="Keep me updated"
            description="Gate changes, boarding reminders, delays, and security wait alerts."
            footerLabel="Notifications"
            toggleAriaLabel="Enable flight updates"
            defaultOn={false}
          />
        </Section>

        {/* ============================================================ */}
        <Section
          title="SettingsRow"
          description="Authed-app list rows. Group inside Card with a hairline divider className. See design-system.md §12k."
        >
          <Card
            padding="none"
            className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]"
          >
            <SettingsRow
              href="/design"
              icon={<IdCardIcon size={18} />}
              title="Personal information"
              description="Passport · Date of birth · Contact"
            />
            <SettingsRow
              href="/design"
              icon={<CreditCardIcon size={18} />}
              title="Payment methods"
              description="Visa ····4821 · Apple Pay"
              trailing={
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-surface-tile)] px-2 text-micro tabular-nums text-[var(--color-text-primary)]">
                  2
                </span>
              }
            />
            <SettingsRow
              href="/design"
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
              href="/design"
              icon={<BellIcon size={18} />}
              title="Notifications"
              description="Flight alerts · Gate changes · Security"
              unread
            />
            <SettingsRow
              href="/design"
              icon={<BookmarkIcon size={18} />}
              title="Saved places"
              description="7 lounges, cafés and services"
            />
            <SettingsRow
              href="/design"
              icon={<LifeBuoyIcon size={18} />}
              title="Help & support"
              description="Concierge · Lost & found · Feedback"
            />
          </Card>
        </Section>

        {/* ============================================================ */}
        <Section
          title="Home screen icons"
          description="New glyphs introduced for the No Trip Home pattern. Render inside an IconTile or directly in 12 – 18px contexts. See design-system.md §2b."
        >
          <ul className="grid grid-cols-3 gap-3">
            {[
              { id: "parking", label: "Parking", icon: <ParkingIcon size={18} /> },
              { id: "train", label: "SkyTrain", icon: <TrainIcon size={18} /> },
              { id: "scan", label: "Scan / import", icon: <ScanIcon size={18} /> },
              {
                id: "accessibility",
                label: "Accessibility",
                icon: <AccessibilityIcon size={18} />,
              },
              { id: "dining", label: "Dining", icon: <DiningIcon size={18} /> },
              {
                id: "signpost",
                label: "Wayfinding",
                icon: <SignpostIcon size={18} />,
              },
            ].map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col items-start gap-2"
              >
                <IconTile size={40} className="bg-[var(--color-surface-tile)]">
                  <span className="text-[var(--color-text-primary)]">
                    {entry.icon}
                  </span>
                </IconTile>
                <p className="text-label text-[var(--color-text-secondary)]">
                  {entry.label}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ============================================================ */}
        <Section title="Skeleton" description="Loading placeholders.">
          <Card>
            <div className="flex flex-col gap-2" aria-busy>
              <Skeleton height={28} width="60%" />
              <Skeleton height={14} width="90%" />
              <Skeleton height={14} width="75%" />
            </div>
          </Card>
          <Skeleton height={120} radius="var(--radius-panel)" />
        </Section>

        {/* ============================================================ */}
        <Section title="EmptyState">
          <EmptyState
            icon={<PlaneIcon size={18} />}
            title="No trips yet"
            description="Add a flight to start your journey."
            primaryAction={{ label: "Add a flight", onClick: () => {} }}
            secondaryAction={{ label: "Browse departures", onClick: () => {} }}
          />
        </Section>

        {/* ============================================================ */}
        <Section title="ErrorState">
          <ErrorState
            icon={<PlaneIcon size={18} />}
            title="We can't reach Vancouver right now"
            description="Check your connection and try again."
            retryAction={{ label: "Try again", onClick: () => {} }}
            secondaryAction={{ label: "Open settings", onClick: () => {} }}
          />
        </Section>

        {/* ============================================================ */}
        <Section title="Travel atoms" description="Reusable data shapes for live flight + gate info.">
          <SubSection title="StatusPill">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="success" leadingDot>On time</StatusPill>
              <StatusPill tone="warning" leadingDot>Boarding</StatusPill>
              <StatusPill tone="danger" leadingDot>Delayed 40 min</StatusPill>
              <StatusPill tone="info">Gate changed</StatusPill>
              <StatusPill tone="neutral">Open</StatusPill>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="success" size="sm" leadingDot>On time</StatusPill>
              <StatusPill tone="warning" size="sm">Boarding</StatusPill>
              <StatusPill tone="danger" size="sm">Cancelled</StatusPill>
            </div>
          </SubSection>

          <SubSection title="LiveIndicator">
            <div className="flex flex-wrap items-center gap-6">
              <LiveIndicator status="live" label="Live" pulse />
              <LiveIndicator status="synced" label="Synced" />
              <LiveIndicator status="stale" label="Stale" />
            </div>
          </SubSection>

          <SubSection title="MetricBlock">
            <Card>
              <div className="flex items-end justify-between">
                <MetricBlock value="8 min" label="Security wait" />
                <MetricBlock value="72%" label="Parking" tone="warning" align="right" />
              </div>
            </Card>
          </SubSection>

          <SubSection title="CountdownBlock">
            <Card>
              <div className="flex items-end justify-between">
                <CountdownBlock value="42 min" label="Boarding in" tone="warning" />
                <CountdownBlock value="52 min" label="Buffer" tone="success" />
              </div>
            </Card>
          </SubSection>

          <SubSection title="AirportCodePair">
            <Card>
              <AirportCodePair
                origin="YVR"
                destination="SFO"
                flightNumber="AC123"
                subtitle="Vancouver → San Francisco"
              />
            </Card>
          </SubSection>

          <SubSection title="RouteTimeline">
            <Card>
              <RouteTimeline
                origin={{ code: "YVR", city: "Vancouver", time: "14:35" }}
                destination={{
                  code: "NRT",
                  city: "Tokyo",
                  time: "17:20",
                  offset: "+1",
                }}
                duration="10h 45 · Nonstop"
              />
            </Card>
          </SubSection>

          <SubSection title="GateDisplay">
            <Card>
              <GateDisplay gate="D73" terminal="M" helper="Domestic" />
            </Card>
          </SubSection>
        </Section>

        {/* ============================================================ */}
        <Section title="Form & search">
          <SubSection title="TextField — states">
            <TextField
              label="Email"
              type="email"
              placeholder="you@example.com"
              helperText="We'll send your boarding pass here."
              leadingIcon={<MailIcon size={16} />}
              required
            />
            <TextField
              label="Flight number"
              placeholder="AC123"
              errorText="That flight number isn't recognised."
            />
            <TextField label="Disabled field" placeholder="Disabled" disabled />
          </SubSection>

          <SubSection title="SearchField">
            <SearchField
              placeholder="Search flights, gates, places"
              value={searchQuery}
              onChange={setSearchQuery}
              ariaLabel="Search YVR"
            />
          </SubSection>

          <SubSection title="ChipFilter">
            <div
              role="group"
              aria-label="Filter results"
              className="flex flex-wrap gap-2"
            >
              <ChipFilter selected={chipDep} onToggle={setChipDep}>
                Departures
              </ChipFilter>
              <ChipFilter selected={chipArr} onToggle={setChipArr}>
                Arrivals
              </ChipFilter>
              <ChipFilter selected={chipLay} onToggle={setChipLay}>
                Layovers
              </ChipFilter>
              <ChipFilter selected={false} onToggle={() => {}} disabled>
                Disabled
              </ChipFilter>
            </div>
          </SubSection>

          <SubSection title="FieldMessage">
            <Stack>
              <FieldMessage tone="neutral">We'll save your changes automatically.</FieldMessage>
              <FieldMessage tone="error">Enter a valid email.</FieldMessage>
              <FieldMessage tone="success">Saved.</FieldMessage>
              <FieldMessage tone="warning">This number looks unusual — double-check.</FieldMessage>
            </Stack>
          </SubSection>
        </Section>

        {/* ============================================================ */}
        <Section title="Navigation chrome" description="Shells, headers, and bottom navigation.">
          <SubSection title="LargeTitleHeader">
            <p className="text-body-sm text-[var(--color-text-secondary)]">
              The header at the top of this page is a `&lt;LargeTitleHeader&gt;`. It accepts an optional
              `backHref`, optional `trailing` content, and a subtitle.
            </p>
          </SubSection>

          <SubSection title="BottomTabBar">
            <p className="text-body-sm text-[var(--color-text-secondary)]">
              Rendered inline below (normally lives at the bottom of `&lt;AppShellAuthed&gt;`). No tab is
              active here because `/design` isn't a tab.
            </p>
            <Card padding="none" className="overflow-hidden">
              <BottomTabBar badges={{ flights: true }} />
            </Card>
          </SubSection>

          <SubSection title="StickyBottomCTA">
            <p className="text-body-sm text-[var(--color-text-secondary)]">
              Rendered inline for visual reference. Sticky positioning only activates inside a scroll
              container.
            </p>
            <Card padding="none" className="overflow-hidden">
              <StickyBottomCTA
                primaryAction={{ label: "Continue", onClick: () => {} }}
                secondaryAction={{ label: "Cancel", onClick: () => {} }}
              />
            </Card>
          </SubSection>

          <SubSection title="AppShell vs AppShellAuthed">
            <p className="text-body-sm text-[var(--color-text-secondary)]">
              This preview is wrapped in `&lt;AppShell&gt;` (onboarding shell). The authenticated app uses
              `&lt;AppShellAuthed&gt;`, which reserves the bottom for the tab bar and scrolls main content
              internally.
            </p>
          </SubSection>
        </Section>

        <div className="pb-8" />
      </main>
    </AppShell>
  );
}

// ---------- Layout helpers (preview page only) ----------

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-section-title text-[var(--color-text-primary)]">{title}</h2>
        {description ? (
          <p className="text-body-sm text-[var(--color-text-secondary)]">{description}</p>
        ) : null}
      </header>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-eyebrow uppercase text-[var(--color-text-secondary)]">{title}</h3>
      {children}
    </div>
  );
}

function Stack({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

function Swatch({
  token,
  label,
  foreground = false,
}: {
  token: string;
  label: string;
  foreground?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1 rounded-[var(--radius-chip)] border border-[var(--color-border)] p-3"
      style={{
        background: foreground ? undefined : `var(${token})`,
      }}
    >
      {foreground ? (
        <span
          aria-hidden
          className="inline-block h-8 w-full rounded-[var(--radius-chip)]"
          style={{ background: `var(${token})` }}
        />
      ) : null}
      <span className="text-micro uppercase text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-label text-[var(--color-text-muted)]">{token}</span>
    </div>
  );
}
