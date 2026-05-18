"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { Heading } from "@/components/Heading";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { IconTile } from "@/components/IconTile";
import {
  AccessibilityIcon,
  ArrowLeftIcon,
  BriefcaseIcon,
  CheckIcon,
  SparkleIcon,
  UsersIcon,
} from "@/components/icons";

type ModeId = "business" | "family" | "accessibility" | "first-timer";
type LangId = "en" | "fr" | "zh" | "ja";

type Mode = {
  id: ModeId;
  title: string;
  subtitle: string;
  modeLabel: string;
  priorities: string[];
  icon: React.ReactNode;
};

const MODES: Mode[] = [
  {
    id: "business",
    title: "Business",
    subtitle: "Lounge & fast-track focus",
    modeLabel: "Concierge mode · Business",
    priorities: ["Fast routes", "Lounge access", "Priority gate alerts"],
    icon: <BriefcaseIcon size={18} />,
  },
  {
    id: "family",
    title: "Family",
    subtitle: "Amenities",
    modeLabel: "Concierge mode · Family",
    priorities: ["Family washrooms", "Play areas", "Stroller-friendly routes"],
    icon: <UsersIcon size={18} />,
  },
  {
    id: "accessibility",
    title: "Accessibility",
    subtitle: "Route & support",
    modeLabel: "Concierge mode · Accessibility",
    priorities: ["Step-free routes", "Assistance points", "Larger guidance cues"],
    icon: <AccessibilityIcon size={18} />,
  },
  {
    id: "first-timer",
    title: "First Timer",
    subtitle: "Guided help",
    modeLabel: "Concierge mode · First Timer",
    priorities: ["Simple directions", "Checkpoint reminders", "Guided airport tips"],
    icon: <SparkleIcon size={18} />,
  },
];

const LANGS: { id: LangId; label: string; aria: string }[] = [
  { id: "en", label: "English", aria: "English" },
  { id: "fr", label: "Français", aria: "Français" },
  { id: "zh", label: "中文", aria: "Chinese" },
  { id: "ja", label: "日本語", aria: "Japanese" },
];

export default function PreferencesPage() {
  const [selectedMode, setSelectedMode] = useState<ModeId>("business");
  const [selectedLang, setSelectedLang] = useState<LangId>("en");

  const activeMode = MODES.find((m) => m.id === selectedMode) ?? MODES[0];
  const otherModes = MODES.filter((m) => m.id !== selectedMode);

  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6">
        <StepHeader />
        <ProgressTrack current={3} total={4} />

        <section className="mt-8 flex flex-col gap-4">
          <Heading size="title">Personalize your experience</Heading>
          <p className="text-body text-[var(--color-text-secondary)]">
            Tell us how you travel so YVR can tailor routes, alerts, and
            airport services around you.
          </p>
        </section>

        <div className="mt-8 flex items-baseline justify-between">
          <Eyebrow>How do you typically travel?</Eyebrow>
          <span className="text-label text-[var(--color-text-muted)]">
            Pick one
          </span>
        </div>

        <div
          role="group"
          aria-label="Travel mode, pick one"
          className="mt-4 flex flex-col gap-3"
        >
          <ActiveModeCard mode={activeMode} />
          <div className="grid grid-cols-3 gap-3">
            {otherModes.map((m) => (
              <SecondaryModeButton
                key={m.id}
                mode={m}
                onSelect={() => setSelectedMode(m.id)}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-8 pb-2">
          <Button href="/onboarding/permissions" variant="primary">
            Save &amp; Continue
          </Button>
          <p className="text-center text-label text-[var(--color-text-secondary)]">
            You can update preferences anytime in Profile.
          </p>
          <LanguagePicker
            selected={selectedLang}
            onSelect={setSelectedLang}
          />
        </div>
      </main>
    </AppShell>
  );
}

function StepHeader() {
  return (
    <div className="relative pt-2">
      <div className="flex items-center justify-between">
        <HeaderIconButton aria-label="Go back" href="/onboarding/sign-in">
          <ArrowLeftIcon size={16} />
        </HeaderIconButton>
        <Link
          href="/onboarding/permissions"
          className="inline-flex h-11 items-center px-2 text-body-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          Skip
        </Link>
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-2 inline-flex h-11 items-center justify-center text-eyebrow uppercase text-[var(--color-text-secondary)]"
      >
        Step 3 of 4
      </span>
    </div>
  );
}

function ProgressTrack({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div
      role="progressbar"
      aria-label={`Onboarding step ${current} of ${total}`}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      className="mt-4 flex items-center gap-1.5"
    >
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < current;
        return (
          <span
            key={i}
            aria-hidden
            className={`h-1 flex-1 rounded-[var(--radius-pill)] ${
              filled
                ? "bg-[var(--color-action-primary)]"
                : "bg-[var(--color-border-soft)]"
            }`}
          />
        );
      })}
    </div>
  );
}

function ActiveModeCard({ mode }: { mode: Mode }) {
  return (
    <Card as="article" padding="lg" surface="sheet">
      <div
        aria-current="true"
        aria-label={`${mode.title} mode, selected`}
        className="flex items-start gap-4"
      >
        <IconTile
          size={40}
          className="bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
        >
          {mode.icon}
        </IconTile>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-section-title text-[var(--color-text-primary)]">
              {mode.title}
            </h2>
            <span className="inline-flex h-5 items-center rounded-[var(--radius-pill)] bg-[var(--color-action-teal-soft)] px-2 text-micro uppercase text-[var(--color-action-teal)]">
              Active
            </span>
          </div>
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            {mode.subtitle}
          </p>
        </div>
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]"
        >
          <CheckIcon size={14} />
        </span>
      </div>

      <div className="mt-4 rounded-[var(--radius-tile)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
        <p className="inline-flex items-center gap-2 text-eyebrow uppercase text-[var(--color-action-teal)]">
          <SparkleIcon size={12} />
          <span>{mode.modeLabel}</span>
        </p>
        <p className="mt-3 text-body-sm text-[var(--color-text-primary)]">
          Your app will prioritize:
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {mode.priorities.map((p) => (
            <li
              key={p}
              className="inline-flex h-7 items-center rounded-[var(--radius-pill)] bg-[var(--color-action-teal-soft)] px-3 text-body-sm font-medium text-[var(--color-action-teal)]"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function SecondaryModeButton({
  mode,
  onSelect,
}: {
  mode: Mode;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={false}
      aria-label={`Switch to ${mode.title} mode`}
      className="group block rounded-[var(--radius-panel)] text-left"
    >
      <Card padding="compact" className="h-full transition-colors duration-150 group-hover:bg-[var(--color-surface-hover)]">
        <IconTile size={32}>
          <span className="text-[var(--color-text-secondary)]">
            {mode.icon}
          </span>
        </IconTile>
        <p className="mt-3 text-body-sm-emphasis text-[var(--color-text-primary)]">
          {mode.title}
        </p>
        <p className="mt-1 text-label text-[var(--color-text-secondary)]">
          {mode.subtitle}
        </p>
      </Card>
    </button>
  );
}

function LanguagePicker({
  selected,
  onSelect,
}: {
  selected: LangId;
  onSelect: (id: LangId) => void;
}) {
  const groupId = useId();
  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <span
        id={groupId}
        className="text-eyebrow uppercase text-[var(--color-text-muted)]"
      >
        Language
      </span>
      <div
        role="group"
        aria-labelledby={groupId}
        className="flex flex-wrap items-center justify-center gap-2"
      >
      {LANGS.map((l) => {
        const isSelected = l.id === selected;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => onSelect(l.id)}
            aria-pressed={isSelected}
            aria-label={l.aria}
            className={`inline-flex h-11 items-center gap-1.5 rounded-[var(--radius-pill)] border px-4 text-body-sm font-medium transition-colors duration-150 ${
              isSelected
                ? "border-[var(--color-action-teal)] bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
                : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated-hover)]"
            }`}
          >
            {isSelected ? (
              <CheckIcon size={12} aria-hidden />
            ) : null}
            <span>{l.label}</span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
