import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import {
  ArrowLeftIcon,
  BuildingIcon,
  CarIcon,
  CheckIcon,
  FootstepsIcon,
  MoreIcon,
  NavigationIcon,
  ParkingPassChip,
  ShareIcon,
  ShieldCheckIcon,
  SlidersIcon,
  WalletIcon,
} from "@/components/icons";

type RouteStop = {
  id: string;
  label: string;
  helper: string;
  icon: React.ReactNode;
  active: boolean;
};

type DetailRow = {
  id: string;
  label: string;
  value: React.ReactNode;
};

type SecondaryAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  ariaLabel: string;
};

const ROUTE_STOPS: RouteStop[] = [
  {
    id: "p1",
    label: "P1",
    helper: "Park",
    icon: <CarIcon size={15} />,
    active: false,
  },
  {
    id: "skywalk",
    label: "Skywalk",
    helper: "Covered",
    icon: <FootstepsIcon size={15} />,
    active: false,
  },
  {
    id: "terminal",
    label: "Terminal",
    helper: "Intl.",
    icon: <BuildingIcon size={15} />,
    active: true,
  },
];

const DETAILS: DetailRow[] = [
  { id: "parkade", label: "Parkade", value: "P1 · Intl. Terminal · Covered" },
  { id: "entry", label: "Entry", value: "Apr 20, 2026 · 10:30 AM" },
  { id: "exit", label: "Exit", value: "Apr 21, 2026 · 10:30 AM" },
  { id: "vehicle", label: "Vehicle", value: "BC · 7YKR 492" },
  { id: "total", label: "Total", value: "$36.00 CAD" },
];

const SECONDARY_ACTIONS: SecondaryAction[] = [
  {
    id: "wallet",
    label: "Add to Wallet",
    icon: <WalletIcon size={16} />,
    ariaLabel: "Add parking pass to Wallet",
  },
  {
    id: "share",
    label: "Share Pass",
    icon: <ShareIcon size={16} />,
    ariaLabel: "Share parking pass",
  },
  {
    id: "manage",
    label: "Manage",
    icon: <SlidersIcon size={16} />,
    ariaLabel: "Manage reservation",
  },
];

export default function ReservedParkingPage() {
  return (
    <AppShellAuthed activeHref="/services">
      <ReservedHeader />
      <div className="flex flex-1 flex-col gap-6 px-6 pt-2 pb-6">
        <ConfirmationBlock />
        <ParkingPassCard />
        <RouteCard stops={ROUTE_STOPS} />
        <DetailsCard details={DETAILS} />
        <SecondaryActionsRow actions={SECONDARY_ACTIONS} />
      </div>
      <StickyDirectionsCTA />
    </AppShellAuthed>
  );
}

function ReservedHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-3 pt-2">
      <HeaderIconButton
        aria-label="Back to parking reservation"
        href={"/parking/reserve" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
        <p className="text-eyebrow uppercase text-[var(--color-text-secondary)]">
          YVR · Services
        </p>
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Parking Reserved
        </h1>
      </div>

      <HeaderIconButton aria-label="More parking reservation options">
        <MoreIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function ConfirmationBlock() {
  return (
    <section
      aria-label="Reservation confirmed"
      className="flex flex-col gap-3"
    >
      <div className="inline-flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-action-teal-soft)]"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-map-mint)] text-[var(--color-action-teal)]">
            <CheckIcon size={12} />
          </span>
        </span>
        <span className="text-eyebrow uppercase text-[var(--color-action-teal)]">
          Reservation confirmed
        </span>
      </div>
      <h2 className="text-title text-[var(--color-text-primary)]">
        You&rsquo;re all set for P1
      </h2>
      <p className="text-body text-[var(--color-text-secondary)]">
        Your parking pass is ready. Scan it at the barrier when you arrive.
      </p>
    </section>
  );
}

function ParkingPassCard() {
  return (
    <HeroSurface
      as="section"
      aria-label="Parking pass for Parkade P1, International Terminal"
      className="relative overflow-hidden p-0 shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground />

      <div className="relative flex flex-col gap-5 p-6">
        <PassHeader />
        <PassPerforation />
        <PassBody />
        <PassFooter />
      </div>
    </HeroSurface>
  );
}

function PassHeader() {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <span className="inline-flex items-center gap-2 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
          />
          Parking Pass · Active
        </span>
        <p className="text-title text-[var(--color-surface-hero-fg)]">
          Parkade P1
        </p>
        <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
          International Terminal · Covered
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-3 py-1 text-micro uppercase text-[var(--color-surface-hero-fg)]">
          YVR
        </span>
        <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
          <ShieldCheckIcon size={12} />
          Secure
        </span>
      </div>
    </div>
  );
}

function PassBody() {
  return (
    <div className="flex items-center gap-5">
      <QrPlaceholder />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            Reference
          </span>
          <span className="font-mono text-section-title text-[var(--color-surface-hero-fg)]">
            YVR-P1-20849
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
            Valid
          </span>
          <span className="text-body-sm text-[var(--color-surface-hero-fg)]">
            Apr 20 — 21, 2026
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-[var(--radius-pill)] bg-[var(--color-map-mint-bg)] px-2.5 py-1 text-micro uppercase text-[var(--color-map-mint)]">
          <WalletIcon size={11} aria-hidden />
          Saved to Wallet
        </span>
      </div>
    </div>
  );
}

function QrPlaceholder() {
  return (
    <div
      aria-hidden
      className="relative flex shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-hero-fg)] p-3 shadow-[var(--shadow-card)]"
      style={{ width: 132, height: 132 }}
    >
      <QrPattern />
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className="inline-flex h-7 w-7 items-center justify-center bg-[var(--color-action-teal)] text-micro text-[var(--color-surface-hero-fg)]"
          style={{ borderRadius: 6 }}
        >
          P
        </span>
      </span>
    </div>
  );
}

function QrPattern() {
  const cells = QR_CELLS;
  return (
    <svg
      viewBox="0 0 21 21"
      className="h-full w-full text-[var(--color-text-primary)]"
      aria-hidden
    >
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
      <FinderPattern x={0} y={0} />
      <FinderPattern x={14} y={0} />
      <FinderPattern x={0} y={14} />
    </svg>
  );
}

function FinderPattern({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={7} height={7} fill="currentColor" />
      <rect
        x={x + 1}
        y={y + 1}
        width={5}
        height={5}
        fill="var(--color-surface-hero-fg)"
      />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="currentColor" />
    </g>
  );
}

const QR_CELLS: ReadonlyArray<readonly [number, number]> = [
  [9, 0], [11, 0], [13, 0],
  [9, 1], [10, 1], [12, 1],
  [8, 2], [11, 2], [13, 2],
  [9, 3], [10, 3], [12, 3], [13, 3],
  [8, 4], [9, 4], [11, 4],
  [8, 5], [10, 5], [12, 5], [13, 5],
  [8, 6], [11, 6],
  [0, 8], [2, 8], [4, 8], [6, 8], [9, 8], [11, 8], [13, 8], [16, 8], [18, 8], [20, 8],
  [1, 9], [3, 9], [5, 9], [8, 9], [10, 9], [14, 9], [17, 9], [19, 9],
  [0, 10], [2, 10], [6, 10], [9, 10], [11, 10], [13, 10], [16, 10], [18, 10],
  [1, 11], [4, 11], [7, 11], [12, 11], [15, 11], [19, 11],
  [2, 12], [5, 12], [8, 12], [10, 12], [13, 12], [17, 12], [20, 12],
  [9, 13], [11, 13], [12, 13], [14, 13], [16, 13], [18, 13],
  [8, 14], [10, 14], [13, 14], [15, 14], [17, 14], [19, 14],
  [9, 15], [11, 15], [14, 15], [16, 15], [18, 15], [20, 15],
  [8, 16], [10, 16], [12, 16], [15, 16], [17, 16], [19, 16],
  [11, 17], [13, 17], [14, 17], [16, 17], [18, 17],
  [8, 18], [10, 18], [12, 18], [15, 18], [17, 18], [20, 18],
  [9, 19], [11, 19], [13, 19], [16, 19], [18, 19],
  [8, 20], [10, 20], [12, 20], [14, 20], [17, 20], [19, 20],
];

function PassFooter() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="inline-flex items-center gap-2.5">
        <ParkingPassChip size={28} />
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          Scan at parking barrier
        </span>
      </div>
      <BarcodeStripe />
    </div>
  );
}

function BarcodeStripe() {
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

function RouteCard({ stops }: { stops: RouteStop[] }) {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="compact"
      aria-label="Walking route from Parkade P1 to International Terminal"
    >
      <div className="flex items-start justify-between gap-2">
        {stops.map((stop, index) => (
          <RouteStopColumn
            key={stop.id}
            stop={stop}
            connectorAfter={index < stops.length - 1}
            connectorLabel={index === 0 ? "5 min walk" : undefined}
          />
        ))}
      </div>
    </Card>
  );
}

function RouteStopColumn({
  stop,
  connectorAfter,
  connectorLabel,
}: {
  stop: RouteStop;
  connectorAfter: boolean;
  connectorLabel?: string;
}) {
  const tile = stop.active
    ? "bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]"
    : "bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]";
  return (
    <div className="flex flex-1 items-start gap-2">
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <span
          aria-hidden
          className={`inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-pill)] ${tile}`}
        >
          {stop.icon}
        </span>
        <span className="text-micro uppercase text-[var(--color-text-primary)]">
          {stop.label}
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {stop.helper}
        </span>
      </div>

      {connectorAfter ? (
        <div className="flex flex-1 flex-col items-center gap-1.5 pt-4">
          <DottedConnector />
          {connectorLabel ? (
            <span className="text-label text-[var(--color-text-secondary)]">
              {connectorLabel}
            </span>
          ) : (
            <span aria-hidden className="h-4" />
          )}
        </div>
      ) : null}
    </div>
  );
}

function DottedConnector() {
  return (
    <span aria-hidden className="flex w-full items-center justify-center gap-1">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className="inline-block h-0.5 w-1.5 rounded-full bg-[var(--color-border-soft)]"
        />
      ))}
    </span>
  );
}

function DetailsCard({ details }: { details: DetailRow[] }) {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="none"
      aria-label="Reservation details"
      className="overflow-hidden"
    >
      <div className="flex flex-col">
        {details.map((row, index) => (
          <DetailLine key={row.id} row={row} divider={index > 0} />
        ))}
        <CancellationLine />
      </div>
    </Card>
  );
}

function DetailLine({ row, divider }: { row: DetailRow; divider: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-5 py-3 ${
        divider ? "border-t border-[var(--color-border-soft)]" : ""
      }`}
    >
      <span className="text-body-sm text-[var(--color-text-secondary)]">
        {row.label}
      </span>
      <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
        {row.value}
      </span>
    </div>
  );
}

function CancellationLine() {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border-soft)] px-5 py-3">
      <span className="text-body-sm text-[var(--color-text-secondary)]">
        Cancellation
      </span>
      <span className="inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--color-action-teal-soft)] px-2.5 py-1 text-micro uppercase text-[var(--color-action-teal)]">
        Free before entry
      </span>
    </div>
  );
}

function SecondaryActionsRow({ actions }: { actions: SecondaryAction[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <SecondaryActionTile key={action.id} action={action} />
      ))}
    </div>
  );
}

function SecondaryActionTile({ action }: { action: SecondaryAction }) {
  return (
    <button
      type="button"
      aria-label={action.ariaLabel}
      className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-tile)] border border-[var(--color-border-soft)] bg-[var(--color-surface-sheet)] px-2 py-3 text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
    >
      <span aria-hidden className="text-[var(--color-text-primary)]">
        {action.icon}
      </span>
      <span className="text-label font-semibold text-[var(--color-text-primary)]">
        {action.label}
      </span>
    </button>
  );
}

function StickyDirectionsCTA() {
  return (
    <div
      className="sticky bottom-0 z-10 px-6 pt-6"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
        background:
          "linear-gradient(to bottom, transparent 0%, var(--color-bg) 60%)",
      }}
    >
      <Button
        href={"/parking/find-my-car" as Route}
        tone="teal"
        leadingIcon={<NavigationIcon size={16} />}
      >
        Get Directions to P1
      </Button>
    </div>
  );
}
