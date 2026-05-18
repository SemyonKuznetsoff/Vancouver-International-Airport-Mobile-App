"use client";

import { useState } from "react";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Card } from "@/components/Card";
import { Eyebrow } from "@/components/Eyebrow";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { Toggle } from "@/components/Toggle";
import { ArrowLeftIcon, BellIcon } from "@/components/icons";

type RowId =
  | "gate-changes"
  | "boarding-reminders"
  | "departure-delays"
  | "arrival-notifications"
  | "cancellation-alerts"
  | "security-wait-times"
  | "baggage-carousel-ready";

type Row = {
  id: RowId;
  title: string;
  description: string;
};

type Group = {
  label: string;
  ariaLabel: string;
  rows: Row[];
};

const GROUPS: Group[] = [
  {
    label: "Flight Alerts",
    ariaLabel: "Flight alerts",
    rows: [
      {
        id: "gate-changes",
        title: "Gate changes",
        description: "Instantly when gate is changed",
      },
      {
        id: "boarding-reminders",
        title: "Boarding reminders",
        description: "30 minutes and 15 minutes before boarding",
      },
      {
        id: "departure-delays",
        title: "Departure delays",
        description: "When flight is delayed by 15+ minutes",
      },
      {
        id: "arrival-notifications",
        title: "Arrival notifications",
        description: "When your tracked flight lands",
      },
      {
        id: "cancellation-alerts",
        title: "Cancellation alerts",
        description: "Immediate if your flight is cancelled",
      },
    ],
  },
  {
    label: "Travel Experience",
    ariaLabel: "Travel experience",
    rows: [
      {
        id: "security-wait-times",
        title: "Security wait times",
        description: "When wait exceeds 20 minutes",
      },
      {
        id: "baggage-carousel-ready",
        title: "Baggage carousel ready",
        description: "When your bags are being loaded",
      },
    ],
  },
];

const DEFAULTS: Record<RowId, boolean> = {
  "gate-changes": true,
  "boarding-reminders": true,
  "departure-delays": true,
  "arrival-notifications": true,
  "cancellation-alerts": true,
  "security-wait-times": true,
  "baggage-carousel-ready": true,
};

export default function NotificationsPage() {
  const [master, setMaster] = useState(true);
  const [rows, setRows] = useState<Record<RowId, boolean>>(DEFAULTS);

  const setRow = (id: RowId, next: boolean) =>
    setRows((prev) => ({ ...prev, [id]: next }));

  return (
    <AppShellAuthed activeHref="/profile">
      <PageHeader />

      <div className="mt-6 flex flex-col gap-8 px-6 pb-8">
        <MasterCard checked={master} onChange={setMaster} />

        {GROUPS.map((group) => (
          <NotificationGroup
            key={group.label}
            group={group}
            rows={rows}
            onChange={setRow}
            disabled={!master}
          />
        ))}
      </div>
    </AppShellAuthed>
  );
}

function PageHeader() {
  return (
    <header className="relative flex items-center justify-between px-6 pt-2">
      <HeaderIconButton aria-label="Back to Profile" href="/profile">
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <h1 className="pointer-events-none absolute inset-x-0 top-2 inline-flex h-11 items-center justify-center text-section-title text-[var(--color-text-primary)]">
        Notifications
      </h1>

      <span aria-hidden className="h-11 w-11" />
    </header>
  );
}

function MasterCard({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <Card
      as="article"
      padding="lg"
      surface="sheet"
      aria-label="All notifications master control"
      className="border-[var(--color-action-teal-soft)]"
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-chip)] bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]"
        >
          <BellIcon size={20} />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="text-section-title text-[var(--color-action-teal)]">
            All Notifications
          </h2>
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Master switch for all YVR alerts
          </p>
        </div>

        <Toggle
          checked={checked}
          onChange={onChange}
          ariaLabel="All YVR notifications"
        />
      </div>
    </Card>
  );
}

function NotificationGroup({
  group,
  rows,
  onChange,
  disabled,
}: {
  group: Group;
  rows: Record<RowId, boolean>;
  onChange: (id: RowId, next: boolean) => void;
  disabled: boolean;
}) {
  return (
    <section aria-label={group.ariaLabel} className="flex flex-col gap-3">
      <Eyebrow tone="secondary">{group.label}</Eyebrow>
      <Card
        padding="none"
        className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]"
      >
        {group.rows.map((row) => (
          <NotificationRow
            key={row.id}
            row={row}
            checked={rows[row.id]}
            onChange={(next) => onChange(row.id, next)}
            disabled={disabled}
          />
        ))}
      </Card>
    </section>
  );
}

function NotificationRow({
  row,
  checked,
  onChange,
  disabled,
}: {
  row: Row;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-4 transition-opacity duration-150 ${
        disabled ? "opacity-[var(--opacity-disabled)]" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-body font-medium text-[var(--color-text-primary)]">
          {row.title}
        </p>
        <p className="text-label text-[var(--color-text-secondary)]">
          {row.description}
        </p>
      </div>
      <Toggle
        checked={checked}
        onChange={onChange}
        ariaLabel={`${row.title} — ${row.description}${disabled ? ", disabled by master switch" : ""}`}
        disabled={disabled}
      />
    </div>
  );
}
