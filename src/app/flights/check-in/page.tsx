import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { HeroSurface } from "@/components/HeroSurface";
import { IconTile } from "@/components/IconTile";
import { PassDecorBackground } from "@/components/PassDecorBackground";
import { PassPerforation } from "@/components/PassPerforation";
import { StatusPill } from "@/components/StatusPill";
import {
  AppleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  FootstepsIcon,
  MoreIcon,
  ShieldCheckIcon,
} from "@/components/icons";

type BoardingCredential = {
  airlineCode: string;
  airlineName: string;
  flightNumber: string;
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  duration: string;
  passenger: string;
  cabinClass: string;
  gate: string;
  seat: string;
  boardingTime: string;
  terminal: string;
  numericCode: string;
  bagsChecked: number;
};

const CREDENTIAL: BoardingCredential = {
  airlineCode: "AC",
  airlineName: "Air Canada",
  flightNumber: "AC 892",
  origin: { code: "YVR", city: "Vancouver" },
  destination: { code: "NRT", city: "Tokyo" },
  duration: "10h 25m",
  passenger: "Alex Mitchell",
  cabinClass: "Zone 3 · Economy",
  gate: "D73",
  seat: "22A",
  boardingTime: "13:50",
  terminal: "International Terminal",
  numericCode: "0182 4920 1928 441",
  bagsChecked: 2,
};

export default function CheckInPage() {
  return (
    <AppShellAuthed activeHref="/flights">
      <CheckInHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <CheckInSuccessBanner bagsChecked={CREDENTIAL.bagsChecked} />
        <BoardingCredentialPass credential={CREDENTIAL} />
        <WalletActionCard />
        <NextStepCard gate={CREDENTIAL.gate} />
      </div>
    </AppShellAuthed>
  );
}

function CheckInHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton
        aria-label="Back to My Flights"
        href={"/flights" as Route}
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
        <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
          My Flights
        </span>
        <h1 className="text-section-title text-[var(--color-text-primary)]">
          Check In
        </h1>
      </div>

      <HeaderIconButton aria-label="More check-in options">
        <MoreIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function CheckInSuccessBanner({ bagsChecked }: { bagsChecked: number }) {
  return (
    <section
      aria-label={`Check-in complete, ${bagsChecked} bags checked`}
      className="flex items-center gap-3.5 rounded-[var(--radius-panel)] border border-[var(--color-success-border)] bg-[var(--color-success-bg)] p-4"
    >
      <IconTile
        size={36}
        className="rounded-full bg-[var(--color-success)] text-[var(--color-action-primary-fg)]"
      >
        <CheckIcon size={16} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm-emphasis text-[var(--color-success-fg)]">
          You're checked in
        </span>
        <span className="text-label text-[var(--color-success-fg)]">
          Boarding credential ready · {bagsChecked} bags checked
        </span>
      </div>
    </section>
  );
}

function BoardingCredentialPass({
  credential,
}: {
  credential: BoardingCredential;
}) {
  const accessibleName = `Boarding credential for ${credential.airlineName} flight ${credential.flightNumber} from ${credential.origin.city} to ${credential.destination.city}, gate ${credential.gate}, seat ${credential.seat}, boarding ${credential.boardingTime}, ready to board.`;
  return (
    <HeroSurface
      as="section"
      aria-label={accessibleName}
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-5 p-5">
        {/* Pass header — Ready to Board + YVR Official */}
        <PassHeader />

        {/* Airline identity */}
        <AirlineIdentity
          airlineName={credential.airlineName}
          flightNumber={credential.flightNumber}
        />

        {/* Route zone */}
        <RouteRow
          origin={credential.origin}
          destination={credential.destination}
          duration={credential.duration}
        />

        {/* Passenger / class module */}
        <PassengerModule
          passenger={credential.passenger}
          cabinClass={credential.cabinClass}
        />

        {/* Gate / seat / boarding details */}
        <CredentialDetailsModule
          gate={credential.gate}
          seat={credential.seat}
          boardingTime={credential.boardingTime}
        />

        <PassPerforation inset="-mx-5" />

        {/* Scan zone — code tile + numeric code */}
        <ScanZone numericCode={credential.numericCode} />

        {/* Pass footer — terminal + barcode marks */}
        <BoardingCredentialFooter terminal={credential.terminal} />
      </div>
    </HeroSurface>
  );
}

function PassHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <StatusPill tone="success" surface="hero" leadingDot size="sm">
        Ready to board
      </StatusPill>
      <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
        <ShieldCheckIcon size={11} aria-hidden />
        YVR · Official
      </span>
    </div>
  );
}

function AirlineIdentity({
  airlineName,
  flightNumber,
}: {
  airlineName: string;
  flightNumber: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-eyebrow uppercase text-[var(--color-surface-hero-fg-muted)]">
          {airlineName}
        </span>
        <h2 className="text-section-title text-[var(--color-surface-hero-fg)]">
          Boarding Credential
        </h2>
      </div>
      <span className="inline-flex h-7 shrink-0 items-center rounded-[var(--radius-pill)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] px-3 text-micro uppercase text-[var(--color-surface-hero-fg)]">
        {flightNumber}
      </span>
    </div>
  );
}

function RouteRow({
  origin,
  destination,
  duration,
}: {
  origin: BoardingCredential["origin"];
  destination: BoardingCredential["destination"];
  duration: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
          {origin.code}
        </span>
        <RouteLine />
        <span className="text-display tabular-nums text-[var(--color-surface-hero-fg)]">
          {destination.code}
        </span>
      </div>
      <div className="grid grid-cols-[auto_auto_auto] items-center gap-3">
        <span className="text-label text-[var(--color-surface-hero-fg-muted)]">
          {origin.city}
        </span>
        <span className="text-center text-label tabular-nums text-[var(--color-surface-hero-fg-soft)]">
          {duration}
        </span>
        <span className="text-right text-label text-[var(--color-surface-hero-fg-muted)]">
          {destination.city}
        </span>
      </div>
    </div>
  );
}

function RouteLine() {
  return (
    <span aria-hidden className="relative flex w-full items-center">
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-map-mint)]" />
      <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]">
        <ArrowRightIcon size={12} />
      </span>
      <span className="h-px flex-1 border-t border-dashed border-[var(--color-surface-hero-tile-border)]" />
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-surface-hero-fg-soft)]" />
    </span>
  );
}

function PassengerModule({
  passenger,
  cabinClass,
}: {
  passenger: string;
  cabinClass: string;
}) {
  return (
    <div className="grid grid-cols-2 items-start gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
          Passenger
        </span>
        <span className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
          {passenger}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1 text-right">
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
          Class
        </span>
        <span className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
          {cabinClass}
        </span>
      </div>
    </div>
  );
}

function CredentialDetailsModule({
  gate,
  seat,
  boardingTime,
}: {
  gate: string;
  seat: string;
  boardingTime: string;
}) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)]">
      <DetailCell label="Gate" value={gate} highlight />
      <DetailCell label="Seat" value={seat} divider />
      <DetailCell label="Boarding" value={boardingTime} divider />
    </div>
  );
}

function DetailCell({
  label,
  value,
  divider = false,
  highlight = false,
}: {
  label: string;
  value: string;
  divider?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 px-3 py-3 ${
        divider ? "border-l border-[var(--color-surface-hero-tile-border)]" : ""
      } ${highlight ? "bg-[var(--color-map-mint-bg)]" : ""}`}
    >
      <span
        className={`text-micro uppercase ${
          highlight
            ? "text-[var(--color-map-mint)]"
            : "text-[var(--color-surface-hero-fg-soft)]"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-section-title tabular-nums ${
          highlight
            ? "text-[var(--color-map-mint)]"
            : "text-[var(--color-surface-hero-fg)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ScanZone({ numericCode }: { numericCode: string }) {
  return (
    <div className="flex items-center gap-5">
      <BoardingCodeTile />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg-soft)]">
          Scan at gate
        </span>
        <p className="text-body-sm text-[var(--color-surface-hero-fg)]">
          Present this code at the boarding gate scanner.
        </p>
        <span
          className="font-mono text-label tabular-nums tracking-[0.12em] text-[var(--color-map-mint)]"
          aria-label={`Boarding code ${numericCode}`}
        >
          {numericCode}
        </span>
      </div>
    </div>
  );
}

function BoardingCodeTile() {
  return (
    <div
      aria-hidden
      className="relative flex shrink-0 items-center justify-center rounded-[var(--radius-tile)] bg-[var(--color-surface-hero-fg)] p-3 shadow-[var(--shadow-card)]"
      style={{ width: 116, height: 116 }}
    >
      <BoardingCodeGlyph />
    </div>
  );
}

/**
 * Abstract boarding code glyph — three finder-pattern corner blocks
 * (like a QR code) plus a dense scatter of cells for "scan tile" feel.
 * Not a scannable code. Decorative (`aria-hidden` on the tile wrapper).
 */
function BoardingCodeGlyph() {
  return (
    <svg
      viewBox="0 0 21 21"
      className="h-full w-full text-[var(--color-text-primary)]"
      aria-hidden
    >
      {BOARDING_CODE_CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
      <FinderPatternMini x={0} y={0} />
      <FinderPatternMini x={14} y={0} />
      <FinderPatternMini x={0} y={14} />
    </svg>
  );
}

function FinderPatternMini({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={5} height={5} fill="currentColor" />
      <rect
        x={x + 1}
        y={y + 1}
        width={3}
        height={3}
        fill="var(--color-surface-hero-fg)"
      />
      <rect x={x + 2} y={y + 2} width={1} height={1} fill="currentColor" />
    </g>
  );
}

const BOARDING_CODE_CELLS: ReadonlyArray<readonly [number, number]> = [
  [7, 0], [9, 0], [12, 0],
  [10, 1], [13, 1],
  [8, 2], [11, 2],
  [7, 3], [12, 3],
  [10, 4], [13, 4],
  [8, 5], [11, 5],
  [9, 6], [13, 6],
  [0, 7], [2, 7], [4, 7], [10, 7], [16, 7], [18, 7], [20, 7],
  [1, 8], [3, 8], [7, 8], [13, 8], [17, 8], [19, 8],
  [0, 9], [4, 9], [9, 9], [12, 9], [16, 9], [20, 9],
  [2, 10], [8, 10], [14, 10], [18, 10],
  [3, 11], [11, 11], [15, 11], [19, 11],
  [9, 12], [13, 12], [17, 12],
  [11, 13], [14, 13], [20, 13],
  [9, 14], [15, 14], [18, 14],
  [11, 15], [19, 15],
  [8, 16], [12, 16], [17, 16],
  [10, 17], [15, 17], [18, 17],
  [11, 18], [14, 18], [20, 18],
  [9, 19], [12, 19], [17, 19],
  [13, 20], [16, 20], [20, 20],
];

function BoardingCredentialFooter({ terminal }: { terminal: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[var(--color-surface-hero-tile-border)] pt-4">
      <div className="inline-flex min-w-0 items-center gap-2.5">
        <PassTerminalChip />
        <span className="truncate text-label text-[var(--color-surface-hero-fg-muted)]">
          {terminal}
        </span>
      </div>
      <BarcodeMarks />
    </div>
  );
}

function PassTerminalChip() {
  return (
    <span
      aria-hidden
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
    >
      <ShieldCheckIcon size={12} />
    </span>
  );
}

function BarcodeMarks() {
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

function WalletActionCard() {
  return (
    <Card
      as="section"
      surface="sheet"
      padding="default"
      className="flex items-center gap-4"
    >
      <IconTile
        size={40}
        className="rounded-[var(--radius-tile)] bg-[var(--color-surface-hero)] text-[var(--color-surface-hero-fg)]"
      >
        <AppleIcon size={20} />
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
          Add to Apple Wallet
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          Keep your pass on the lock screen.
        </span>
      </div>
      <div className="w-24 shrink-0">
        <Button
          tone="primary"
          aria-label="Add boarding credential to Apple Wallet"
        >
          Add
        </Button>
      </div>
    </Card>
  );
}

function NextStepCard({ gate }: { gate: string }) {
  return (
    <Link
      href={"/flights/detail" as Route}
      aria-label={`Next step: Head to gate ${gate}, 8 minute walk`}
      className="block"
    >
      <Card
        as="div"
        surface="sheet"
        padding="default"
        className="flex items-center gap-4 transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
      >
        <IconTile
          size={40}
          className="rounded-[var(--radius-tile)] bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)]"
        >
          <FootstepsIcon size={18} />
        </IconTile>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-eyebrow uppercase text-[var(--color-text-muted)]">
            Next step
          </span>
          <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            Head to Gate {gate}
          </span>
          <span className="text-label text-[var(--color-text-secondary)]">
            8 min walk
          </span>
        </div>
        <span
          aria-hidden
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]"
        >
          <ArrowRightIcon size={14} />
        </span>
      </Card>
    </Link>
  );
}
