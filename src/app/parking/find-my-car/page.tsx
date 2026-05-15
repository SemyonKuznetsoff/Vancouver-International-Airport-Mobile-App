import Link from "next/link";
import type { Route } from "next";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  CarIcon,
  ClockIcon,
  FootstepsIcon,
  NavigationIcon,
  ShareIcon,
} from "@/components/icons";

type SavedCar = {
  plate: string;
  province: string;
  garage: string;
  level: string;
  space: string;
  walkTime: string;
  distance: string;
  savedLocation: true;
};

const savedCar: SavedCar = {
  plate: "7YKR 492",
  province: "BC",
  garage: "Parkade P1",
  level: "Level 2",
  space: "B-042",
  walkTime: "4 min",
  distance: "280 m",
  savedLocation: true,
};

export default function FindMyCarPage() {
  return (
    <div
      className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[var(--color-surface-map)] text-[var(--color-surface-map-fg)]"
      style={{
        paddingTop: "max(env(safe-area-inset-top), 16px)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <main className="relative flex flex-1 flex-col">
        <TopControls />
        <TitleBlock car={savedCar} />
        <div className="relative flex-1">
          <ParkingMap car={savedCar} />
          <SavedCarSheet car={savedCar} />
        </div>
      </main>
    </div>
  );
}

function TopControls() {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-2">
      <HeaderIconButton
        aria-label="Back to services"
        href={"/services" as Route}
        variant="map"
      >
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <span
        aria-label="Saved location"
        className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-surface-map-border)] bg-[var(--color-surface-map-elevated)] px-4 py-2.5 text-micro uppercase text-[var(--color-map-mint)]"
      >
        <BookmarkIcon size={13} />
        <span>Saved location</span>
      </span>

      <HeaderIconButton
        aria-label="Share saved parking location"
        variant="map"
      >
        <ShareIcon size={16} />
      </HeaderIconButton>
    </div>
  );
}

function TitleBlock({ car }: { car: SavedCar }) {
  return (
    <header className="mt-6 px-5">
      <h1 className="text-display text-[var(--color-surface-map-fg)]">
        Find My Car
      </h1>
      <p className="mt-2 inline-flex flex-wrap items-center gap-1.5 text-body-sm text-[var(--color-surface-map-fg-muted)]">
        <span>{car.province}</span>
        <span aria-hidden>·</span>
        <span className="tabular-nums">{car.plate}</span>
        <span aria-hidden>·</span>
        <span className="text-[var(--color-map-mint)]">{car.garage}</span>
      </p>
    </header>
  );
}

function ParkingMap({ car }: { car: SavedCar }) {
  const ariaLabel = `Parking map showing the saved car at ${car.garage}, ${car.level}, space ${car.space}. Route highlighted from the terminal through the skybridge to the car location.`;
  return (
    <div className="relative mt-6 h-[420px] w-full">
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox="0 0 360 420"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="map-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="var(--color-map-grid)"
              strokeWidth="0.5"
            />
          </pattern>
          <radialGradient id="map-vignette" cx="50%" cy="60%" r="70%">
            <stop offset="0%" stopColor="var(--color-surface-map-elevated)" />
            <stop offset="100%" stopColor="var(--color-surface-map)" />
          </radialGradient>
          <filter id="mint-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="360" height="420" fill="url(#map-vignette)" />
        <rect x="0" y="0" width="360" height="420" fill="url(#map-grid)" />

        {/* Parkade outline */}
        <rect
          x="120"
          y="20"
          width="220"
          height="370"
          rx="18"
          fill="none"
          stroke="var(--color-surface-map-border)"
          strokeWidth="1.2"
        />

        {/* Parkade label group */}
        <text
          x="140"
          y="48"
          className="text-body-sm-emphasis"
          fill="var(--color-surface-map-fg)"
          fontWeight="600"
          fontSize="14"
        >
          Parkade P1
        </text>
        <text
          x="140"
          y="66"
          className="text-micro uppercase"
          fill="var(--color-map-mint)"
          fontWeight="600"
          fontSize="10"
          letterSpacing="1.5"
        >
          LEVEL 2
        </text>

        {/* L2 badge */}
        <rect
          x="306"
          y="34"
          width="22"
          height="22"
          rx="6"
          fill="var(--color-map-mint-bg)"
          stroke="var(--color-map-mint)"
          strokeWidth="0.8"
        />
        <text
          x="317"
          y="49"
          fill="var(--color-map-mint)"
          fontWeight="700"
          fontSize="10"
          textAnchor="middle"
        >
          L2
        </text>

        {/* Column markers A / B / C / D */}
        {[
          { x: 162, letter: "A" },
          { x: 212, letter: "B", isCar: true },
          { x: 262, letter: "C" },
          { x: 312, letter: "D" },
        ].map((col) => (
          <g key={col.letter}>
            <circle
              cx={col.x}
              cy="92"
              r="9"
              fill="var(--color-surface-map-elevated)"
              stroke="var(--color-surface-map-border)"
              strokeWidth="0.8"
            />
            <text
              x={col.x}
              y="96"
              fill="var(--color-surface-map-fg-soft)"
              fontWeight="700"
              fontSize="9"
              textAnchor="middle"
            >
              {col.letter}
            </text>
            {/* Parking row of stalls */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((idx) => (
              <line
                key={idx}
                x1={col.x - 6}
                x2={col.x + 6}
                y1={108 + idx * 18}
                y2={108 + idx * 18}
                stroke="var(--color-surface-map-border)"
                strokeWidth="0.6"
              />
            ))}
          </g>
        ))}

        {/* Terminal block on the left */}
        <rect
          x="14"
          y="190"
          width="60"
          height="44"
          rx="10"
          fill="var(--color-surface-map-elevated)"
          stroke="var(--color-surface-map-border)"
          strokeWidth="1"
        />
        <text
          x="44"
          y="215"
          fill="var(--color-surface-map-fg-muted)"
          fontWeight="700"
          fontSize="10"
          letterSpacing="1.5"
          textAnchor="middle"
        >
          TERMINAL
        </text>

        {/* Skybridge dashed connector — terminal to parkade entry */}
        <line
          x1="74"
          y1="212"
          x2="120"
          y2="212"
          stroke="var(--color-surface-map-fg-soft)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x="80"
          y="202"
          fill="var(--color-surface-map-fg-soft)"
          fontWeight="700"
          fontSize="8"
          letterSpacing="1"
        >
          SKYBRIDGE
        </text>

        {/* You are here glowing dot */}
        <circle
          cx="44"
          cy="248"
          r="8"
          fill="var(--color-map-mint-bg)"
          filter="url(#mint-glow)"
        />
        <circle cx="44" cy="248" r="3.5" fill="var(--color-map-mint)" />
        <text
          x="14"
          y="272"
          fill="var(--color-surface-map-fg-muted)"
          fontWeight="700"
          fontSize="8"
          letterSpacing="1.2"
        >
          YOU ARE HERE
        </text>

        {/* Route line: from "you are here" through skybridge into the parkade */}
        <path
          d="M 44 248 L 44 212 L 120 212 L 212 212 L 212 170"
          fill="none"
          stroke="var(--color-map-mint)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6 4"
          filter="url(#mint-glow)"
          opacity="0.9"
        />

        {/* Saved car marker */}
        <g filter="url(#mint-glow)">
          <circle cx="212" cy="156" r="14" fill="var(--color-map-mint-bg)" />
          <circle cx="212" cy="156" r="9" fill="var(--color-map-mint)" />
          <path
            d="M 212 144 L 218 156 L 212 168 L 206 156 Z"
            fill="var(--color-map-mint)"
            opacity="0.7"
          />
        </g>
      </svg>
    </div>
  );
}

function SavedCarSheet({ car }: { car: SavedCar }) {
  return (
    <section
      aria-label="Saved car details"
      className="absolute inset-x-3 bottom-3 rounded-[var(--radius-card)] border border-[var(--color-surface-map-border)] bg-[var(--color-surface-map-card)] p-5 shadow-[var(--shadow-map-sheet)] backdrop-blur-md"
    >
      <span
        aria-hidden
        className="mx-auto mb-3 block h-1 w-10 rounded-full bg-[var(--color-surface-map-border)]"
      />

      <header className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-chip)] border border-[var(--color-surface-map-border)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]">
          <CarIcon size={18} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-micro uppercase text-[var(--color-surface-map-fg-muted)]">
            {car.province}
          </span>
          <p className="text-section-title tabular-nums text-[var(--color-surface-map-fg)]">
            {car.plate}
          </p>
        </div>
      </header>

      <p className="mt-3 text-body-sm text-[var(--color-surface-map-fg-muted)]">
        {car.garage} · {car.level} · Space{" "}
        <span className="font-semibold text-[var(--color-surface-map-fg)]">
          {car.space}
        </span>
      </p>

      <div className="my-4 h-px bg-[var(--color-surface-map-border)]" />

      <div className="grid grid-cols-2 gap-3">
        <StatPill
          icon={<ClockIcon size={14} />}
          label="Walk time"
          value={car.walkTime}
        />
        <StatPill
          icon={<FootstepsIcon size={14} />}
          label="Distance"
          value={car.distance}
        />
      </div>

      <Link
        href={"/parking/find-my-car/navigate" as Route}
        aria-label="Navigate to my car"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-tile)] bg-[var(--color-map-mint)] px-4 text-body-sm-emphasis text-[var(--color-surface-map)] shadow-[var(--shadow-map-cta)] transition-opacity duration-150 hover:opacity-95"
      >
        <NavigationIcon size={16} />
        <span>Navigate to My Car</span>
      </Link>

      <Link
        href={"/parking/find-my-car/details" as Route}
        className="mt-3 block text-center text-body-sm text-[var(--color-surface-map-fg-muted)] transition-colors duration-150 hover:text-[var(--color-surface-map-fg)]"
      >
        View saved location details
      </Link>
    </section>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      aria-label={`${label} ${value}`}
      className="flex flex-col gap-1 rounded-[var(--radius-tile)] border border-[var(--color-surface-map-border)] bg-[var(--color-surface-map-elevated)] px-4 py-3"
    >
      <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-map-mint)]">
        <span aria-hidden>{icon}</span>
        <span>{label}</span>
      </span>
      <span className="text-section-title tabular-nums text-[var(--color-surface-map-fg)]">
        {value}
      </span>
    </div>
  );
}
