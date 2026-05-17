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
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsVerticalIcon,
  BellIcon,
  CalendarIcon,
  PlaneIcon,
  ScanIcon,
  SearchIcon,
  SparkleIcon,
} from "@/components/icons";

type SecondaryAction = {
  id: string;
  title: string;
  helper: string;
  icon: React.ReactNode;
  ariaLabel: string;
};

type RouteSearch = {
  origin: { code: string; city: string };
  destination: { placeholder: string };
  date: string;
  tripType: string;
};

type RecentSearch = {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  airline: string;
  scheduledLabel: string;
  status: "On time" | "Delayed" | "Boarding" | "Cancelled";
};

const TRACKER_STATUS_LABEL = "YVR · 02";
const FOOTER_LEFT_LABEL = "YVR Live Ops";
const FOOTER_RIGHT_LABEL = "Concierge";

const SEARCH_PLACEHOLDER = "Flight number · e.g. AC 838";

const SECONDARY_ACTIONS: SecondaryAction[] = [
  {
    id: "scan-pass",
    title: "Scan Pass",
    helper: "Auto-add",
    icon: <ScanIcon size={16} />,
    ariaLabel: "Scan boarding pass to auto-add a flight",
  },
  {
    id: "track-arrival",
    title: "Track Arrival",
    helper: "For pickup",
    icon: <PlaneIcon size={16} />,
    ariaLabel: "Track an arriving flight for pickup",
  },
];

const ROUTE_SEARCH: RouteSearch = {
  origin: { code: "YVR", city: "Vancouver" },
  destination: { placeholder: "Any destination" },
  date: "Today, Apr 20",
  tripType: "Departures",
};

const RECENT_SEARCHES: RecentSearch[] = [
  {
    id: "ac838",
    flightNumber: "AC 838",
    origin: "YVR",
    destination: "NRT",
    airline: "Air Canada",
    scheduledLabel: "Today 14:35",
    status: "On time",
  },
];

export default function FlightSearchPage() {
  return (
    <AppShellAuthed activeHref="/flights">
      <FlightSearchHeader />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6">
        <LiveTrackerPass />
        <RouteSearchCard route={ROUTE_SEARCH} />
        <RecentSearchesSection searches={RECENT_SEARCHES} />
      </div>
    </AppShellAuthed>
  );
}

function FlightSearchHeader() {
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
          Add Flight
        </h1>
      </div>

      <HeaderIconButton aria-label="Flight alerts, new alert" badgeDot>
        <BellIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

function LiveTrackerPass() {
  return (
    <HeroSurface
      as="section"
      aria-label="YVR Live Tracker — track a flight for real-time updates"
      className="shadow-[var(--shadow-hero-card)]"
    >
      <PassDecorBackground variant="tall" />
      <div className="relative flex flex-col gap-5 p-5">
        <LiveTrackerHeader />
        <LiveTrackerIdentity />
        <FlightNumberSearch />
        <SecondaryActionRow actions={SECONDARY_ACTIONS} />

        <PassPerforation inset="-mx-5" />

        <LiveTrackerFooter />
      </div>
    </HeroSurface>
  );
}

function LiveTrackerHeader() {
  return (
    <div className="flex items-center justify-between gap-3">
      <StatusPill tone="success" surface="hero" leadingDot size="sm">
        Live tracker
      </StatusPill>
      <span className="text-micro uppercase tabular-nums text-[var(--color-surface-hero-fg-soft)]">
        {TRACKER_STATUS_LABEL}
      </span>
    </div>
  );
}

function LiveTrackerIdentity() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-eyebrow uppercase text-[var(--color-map-mint)]">
        Track a flight
      </span>
      <p className="text-body-sm text-[var(--color-surface-hero-fg-muted)]">
        Fastest way to get real-time updates.
      </p>
    </div>
  );
}

function FlightNumberSearch() {
  return (
    <div className="flex items-center gap-2.5 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-chip-border)] bg-[var(--color-surface-hero-chip)] py-2 pl-3.5 pr-2 transition-colors duration-150 focus-within:border-[var(--color-map-mint-soft)]">
      <label htmlFor="flight-number-input" className="sr-only">
        Flight number
      </label>
      <span
        aria-hidden
        className="inline-flex shrink-0 text-[var(--color-map-mint)]"
      >
        <PlaneIcon size={14} />
      </span>
      <input
        id="flight-number-input"
        type="text"
        inputMode="text"
        autoComplete="off"
        placeholder={SEARCH_PLACEHOLDER}
        className="h-11 min-w-0 flex-1 bg-transparent text-body-sm tabular-nums text-[var(--color-surface-hero-fg)] placeholder:text-[var(--color-surface-hero-fg-soft)] focus:outline-none"
      />
      <button
        type="button"
        aria-label="Search flight number"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button)] transition-opacity duration-150 hover:opacity-90"
      >
        <SearchIcon size={14} aria-hidden />
      </button>
    </div>
  );
}

function SecondaryActionRow({ actions }: { actions: SecondaryAction[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {actions.map((a) => (
        <SecondaryActionTile key={a.id} action={a} />
      ))}
    </div>
  );
}

function SecondaryActionTile({ action }: { action: SecondaryAction }) {
  return (
    <button
      type="button"
      aria-label={action.ariaLabel}
      className="flex items-center gap-3 rounded-[var(--radius-tile)] border border-[var(--color-surface-hero-tile-border)] bg-[var(--color-surface-hero-tile)] px-3.5 py-3.5 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hero-chip)]"
    >
      <span
        aria-hidden
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-tile)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-map-mint)]"
      >
        {action.icon}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-body-sm-emphasis text-[var(--color-surface-hero-fg)]">
          {action.title}
        </span>
        <span className="text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
          {action.helper}
        </span>
      </span>
    </button>
  );
}

function LiveTrackerFooter() {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-map-mint)]"
        />
        {FOOTER_LEFT_LABEL}
      </span>
      <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-surface-hero-fg-muted)]">
        <SparkleIcon size={11} aria-hidden />
        {FOOTER_RIGHT_LABEL}
      </span>
    </div>
  );
}

function RouteSearchCard({ route }: { route: RouteSearch }) {
  const accessibleName = `Search flights by route from ${route.origin.city} (${route.origin.code}) to ${route.destination.placeholder}, ${route.tripType.toLowerCase()} on ${route.date}.`;
  return (
    <section
      aria-label={accessibleName}
      className="flex flex-col gap-3 pt-1"
    >
      <RouteSearchDivider />
      <Card
        as="div"
        surface="sheet"
        padding="default"
        className="flex flex-col gap-4"
      >
        <RouteRow
          origin={route.origin}
          destinationPlaceholder={route.destination.placeholder}
        />
        <RouteSearchSeparator />
        <DateAndCtaRow
          date={route.date}
          tripType={route.tripType}
        />
      </Card>
    </section>
  );
}

function RouteSearchDivider() {
  return (
    <div
      aria-hidden
      className="flex items-center gap-3 pb-1"
    >
      <span className="h-px flex-1 bg-[var(--color-border-soft)]" />
      <span className="text-micro uppercase text-[var(--color-text-muted)]">
        Or search by route
      </span>
      <span className="h-px flex-1 bg-[var(--color-border-soft)]" />
    </div>
  );
}

function RouteRow({
  origin,
  destinationPlaceholder,
}: {
  origin: RouteSearch["origin"];
  destinationPlaceholder: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-micro uppercase text-[var(--color-text-muted)]">
          From
        </span>
        <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
          {origin.code}
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {origin.city}
        </span>
      </div>
      <button
        type="button"
        aria-label="Swap origin and destination"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-tile)] text-[var(--color-action-teal)] transition-colors duration-150 hover:bg-[var(--color-action-teal-soft)]"
      >
        <span aria-hidden className="inline-flex rotate-90">
          <ArrowsVerticalIcon size={14} />
        </span>
      </button>
      <div className="flex min-w-0 flex-col items-end gap-0.5 text-right">
        <span className="text-micro uppercase text-[var(--color-text-muted)]">
          To
        </span>
        <span className="text-section-title tabular-nums text-[var(--color-text-muted)]">
          ———
        </span>
        <span className="text-label text-[var(--color-text-secondary)]">
          {destinationPlaceholder}
        </span>
      </div>
    </div>
  );
}

function RouteSearchSeparator() {
  return (
    <span
      aria-hidden
      className="block h-px w-full bg-[var(--color-border-soft)]"
    />
  );
}

function DateAndCtaRow({
  date,
  tripType,
}: {
  date: string;
  tripType: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <IconTile
          size={36}
          className="rounded-[var(--radius-tile)] bg-[var(--color-action-teal-soft)] text-[var(--color-action-teal)]"
        >
          <CalendarIcon size={16} />
        </IconTile>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-micro uppercase text-[var(--color-text-muted)]">
            {date}
          </span>
          <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
            {tripType}
          </span>
        </div>
      </div>
      <div className="w-36 shrink-0">
        <Button
          tone="teal"
          trailingIcon={<ArrowRightIcon size={16} />}
          aria-label={`Search ${tripType.toLowerCase()} flights on ${date}`}
        >
          Search Flights
        </Button>
      </div>
    </div>
  );
}

function RecentSearchesSection({
  searches,
}: {
  searches: RecentSearch[];
}) {
  return (
    <section
      aria-labelledby="recent-searches-heading"
      className="flex flex-col gap-3 pt-1"
    >
      <div className="flex items-end justify-between gap-3">
        <h2
          id="recent-searches-heading"
          className="text-eyebrow uppercase text-[var(--color-text-muted)]"
        >
          Recent searches
        </h2>
        <button
          type="button"
          aria-label="View all recent searches"
          className="inline-flex h-11 items-center text-body-sm-emphasis text-[var(--color-action-teal)] hover:opacity-80"
        >
          View all
        </button>
      </div>
      <ul className="flex flex-col gap-2.5">
        {searches.map((s) => (
          <li key={s.id}>
            <RecentSearchRow search={s} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecentSearchRow({ search }: { search: RecentSearch }) {
  const statusTone =
    search.status === "On time"
      ? "success"
      : search.status === "Delayed"
        ? "warning"
        : search.status === "Boarding"
          ? "info"
          : "danger";
  return (
    <Card
      as="article"
      surface="sheet"
      padding="compact"
      aria-label={`${search.flightNumber}, ${search.origin} to ${search.destination}, ${search.airline}, ${search.scheduledLabel}, ${search.status}`}
      className="flex items-center gap-4"
    >
      <div className="flex shrink-0 flex-col">
        <span className="text-micro uppercase text-[var(--color-text-muted)]">
          {search.flightNumber.split(" ")[0]}
        </span>
        <span className="text-section-title tabular-nums text-[var(--color-text-primary)]">
          {search.flightNumber.split(" ")[1] ?? search.flightNumber}
        </span>
      </div>
      <span aria-hidden className="block h-9 w-px bg-[var(--color-border-soft)]" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="inline-flex items-center gap-2 text-body-sm-emphasis tabular-nums text-[var(--color-text-primary)]">
          {search.origin}
          <span
            aria-hidden
            className="inline-flex text-[var(--color-text-muted)]"
          >
            <PlaneIcon size={11} />
          </span>
          {search.destination}
        </span>
        <span className="truncate text-label text-[var(--color-text-secondary)]">
          {search.airline} · {search.scheduledLabel}
        </span>
      </div>
      <StatusPill tone={statusTone} size="sm" leadingDot>
        {search.status}
      </StatusPill>
    </Card>
  );
}
