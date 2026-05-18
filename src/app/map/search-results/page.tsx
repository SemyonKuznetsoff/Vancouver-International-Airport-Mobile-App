import Link from "next/link";
import type { Route } from "next";
import { AppShellAuthed } from "@/components/AppShellAuthed";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  FootstepsIcon,
  LayersIcon,
  NavigationIcon,
  SearchIcon,
  ShieldCheckIcon,
  SlidersIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/icons";

type FilterChip = {
  id: string;
  label: string;
  state: "active" | "soft" | "default";
};

type ResultMetric = {
  label: string;
  value: string;
  tone: "neutral" | "mint" | "warm";
  icon: React.ReactNode;
};

type BestResult = {
  rank: number;
  name: string;
  category: string;
  location: string;
  isOpen: boolean;
  onRoute: boolean;
  rating: number;
  reviewCount: number;
  metrics: ResultMetric[];
  href: Route;
};

type SecondaryResult = {
  id: string;
  rank: number;
  name: string;
  category: string;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  walkMinutes: number;
  detourMinutes: number;
};

const QUERY = "coffee";
const RESULTS_COUNT = 12;
const DESTINATION_GATE = "Gate D73";
const MAP_LEVEL_LABEL = "Level 2 · Intl";

const FILTERS: FilterChip[] = [
  { id: "on-route", label: "On Route", state: "active" },
  { id: "open-now", label: "Open Now", state: "active" },
  { id: "fits-time", label: "Fits Time", state: "soft" },
  { id: "closest", label: "Closest", state: "default" },
];

const BEST_RESULT: BestResult = {
  rank: 1,
  name: "Caffe Artigiano",
  category: "Specialty coffee",
  location: "Level 2 · Intl · Gate D",
  isOpen: true,
  onRoute: true,
  rating: 4.6,
  reviewCount: 380,
  metrics: [
    {
      label: "Route fit",
      value: "On Way",
      tone: "neutral",
      icon: <NavigationIcon size={12} />,
    },
    {
      label: "Detour",
      value: "+0 min",
      tone: "mint",
      icon: <ClockIcon size={12} />,
    },
    {
      label: "Walk",
      value: "3 min",
      tone: "warm",
      icon: <FootstepsIcon size={12} />,
    },
  ],
  href: "/map/place-detail" as Route,
};

const SECONDARY_RESULTS: SecondaryResult[] = [
  {
    id: "tim-hortons",
    rank: 2,
    name: "Tim Hortons",
    category: "Coffee · Level 2 · Intl",
    isOpen: true,
    rating: 4.1,
    reviewCount: 1102,
    walkMinutes: 5,
    detourMinutes: 1,
  },
  {
    id: "starbucks",
    rank: 3,
    name: "Starbucks",
    category: "Coffee · Level 2 · Intl",
    isOpen: true,
    rating: 4.3,
    reviewCount: 700,
    walkMinutes: 7,
    detourMinutes: 2,
  },
];

export default function MapSearchResultsPage() {
  return (
    <AppShellAuthed activeHref="/map">
      <SearchHeader query={QUERY} />
      <div className="flex flex-col gap-4 px-6 pb-8">
        <FilterChipsRow filters={FILTERS} />
        <MapPreview />
        <ResultsHeader query={QUERY} count={RESULTS_COUNT} gate={DESTINATION_GATE} />
        <BestResultCard result={BEST_RESULT} />
        <SecondaryResultsList results={SECONDARY_RESULTS} />
      </div>
    </AppShellAuthed>
  );
}

function SearchHeader({ query }: { query: string }) {
  return (
    <header className="flex items-center justify-between gap-3 px-6 pb-4 pt-2">
      <HeaderIconButton aria-label="Back to map">
        <ArrowLeftIcon size={16} />
      </HeaderIconButton>

      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 shadow-[var(--shadow-card)]">
        <label htmlFor="map-search-input" className="sr-only">
          Search airport places
        </label>
        <span
          aria-hidden
          className="inline-flex shrink-0 text-[var(--color-text-muted)]"
        >
          <SearchIcon size={14} />
        </span>
        <input
          id="map-search-input"
          type="text"
          inputMode="search"
          autoComplete="off"
          defaultValue={query}
          className="h-11 min-w-0 flex-1 bg-transparent text-body-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
        />
        <button
          type="button"
          aria-label="Clear search query"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-tile)] text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
        >
          <CloseIcon size={11} aria-hidden />
        </button>
      </div>

      <HeaderIconButton aria-label="Map layers">
        <LayersIcon size={16} />
      </HeaderIconButton>
    </header>
  );
}

const FILTER_CHIP_CLASSES: Record<FilterChip["state"], string> = {
  active:
    "border-[var(--color-action-teal)] bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button)]",
  soft:
    "border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] text-[var(--color-action-teal)]",
  default:
    "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]",
};

function FilterChipsRow({ filters }: { filters: FilterChip[] }) {
  return (
    <div
      role="group"
      aria-label="Filter search results"
      className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={f.state === "active" || f.state === "soft"}
            className={`inline-flex h-11 shrink-0 items-center rounded-[var(--radius-pill)] border px-4 text-body-sm-emphasis transition-colors duration-150 ${FILTER_CHIP_CLASSES[f.state]}`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Static illustrative mini map preview. Not a real map — a stylized
 * panel with abstract terminal blocks, a dashed route path, numbered
 * markers, and the destination gate pill. Decorative; meaningful
 * context lives in the surrounding text + the `aria-label`.
 */
function MapPreview() {
  return (
    <section
      aria-label={`Mini map preview: ${MAP_LEVEL_LABEL}, route to ${DESTINATION_GATE}`}
      className="relative overflow-hidden rounded-[var(--radius-tile)] border border-[var(--color-border-soft)] bg-[var(--color-surface-tile)] p-4 shadow-[var(--shadow-card)]"
      style={{ height: 208 }}
    >
      <div className="relative z-10 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-micro uppercase text-[var(--color-text-secondary)]">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-action-teal)]"
          />
          {MAP_LEVEL_LABEL}
        </span>
        <span
          aria-hidden
          className="inline-flex items-center gap-1 text-micro uppercase tabular-nums text-[var(--color-text-muted)]"
        >
          YVR · INTL
        </span>
      </div>

      <MapPreviewArt />

      <span
        aria-hidden
        className="absolute bottom-3.5 right-3.5 z-10 inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-3 text-micro uppercase text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button)]"
      >
        <NavigationIcon size={12} />
        {DESTINATION_GATE}
      </span>
    </section>
  );
}

/**
 * Static airport-terminal-style mini map. Two terminal zones (main
 * horizontal concourse + Gate D wing) linked by a vertical connector,
 * with small interior room/shop blocks lining the concourses and gate
 * slot bars in the Gate D wing. The dashed route runs from "You are
 * here" near marker 1, threads through the connector, and terminates
 * at the destination halo by Gate D73. All decorative — the section's
 * aria-label carries the meaning.
 */
function MapPreviewArt() {
  return (
    <span aria-hidden className="absolute inset-0">
      <svg
        viewBox="0 0 360 208"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {/* Soft destination halo — pulled forward so route + pin sit on top */}
        <circle
          cx="282"
          cy="156"
          r="36"
          fill="var(--color-action-teal)"
          opacity="0.10"
        />

        {/* Main horizontal concourse */}
        <rect
          x="24"
          y="60"
          width="312"
          height="40"
          rx="12"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        {/* Top-edge highlight strip — subtle architectural depth */}
        <rect
          x="24"
          y="60"
          width="312"
          height="5"
          rx="12"
          fill="var(--color-surface-elevated)"
          opacity="0.7"
        />

        {/* Room blocks inside main concourse — north row (above route) */}
        <g fill="var(--color-surface-tile)" opacity="0.85">
          <rect x="40" y="68" width="14" height="8" rx="2" />
          <rect x="58" y="68" width="14" height="8" rx="2" />
          <rect x="76" y="68" width="14" height="8" rx="2" />
          <rect x="214" y="68" width="14" height="8" rx="2" />
          <rect x="232" y="68" width="14" height="8" rx="2" />
          <rect x="250" y="68" width="14" height="8" rx="2" />
          <rect x="268" y="68" width="14" height="8" rx="2" />
          <rect x="286" y="68" width="14" height="8" rx="2" />
          <rect x="304" y="68" width="14" height="8" rx="2" />
        </g>
        {/* Room blocks inside main concourse — south row (below route) */}
        <g fill="var(--color-surface-tile)" opacity="0.7">
          <rect x="40" y="86" width="14" height="8" rx="2" />
          <rect x="58" y="86" width="14" height="8" rx="2" />
          <rect x="76" y="86" width="14" height="8" rx="2" />
          <rect x="232" y="86" width="14" height="8" rx="2" />
          <rect x="250" y="86" width="14" height="8" rx="2" />
          <rect x="268" y="86" width="14" height="8" rx="2" />
          <rect x="286" y="86" width="14" height="8" rx="2" />
          <rect x="304" y="86" width="14" height="8" rx="2" />
        </g>

        {/* Vertical connector — implies escalator / walkway down to Gate D wing */}
        <rect
          x="148"
          y="100"
          width="32"
          height="20"
          rx="6"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <g stroke="var(--color-border)" strokeWidth="1" opacity="0.55">
          <line x1="155" y1="106" x2="173" y2="106" />
          <line x1="155" y1="110" x2="173" y2="110" />
          <line x1="155" y1="114" x2="173" y2="114" />
        </g>

        {/* Gate D wing (bottom-right zone) */}
        <rect
          x="196"
          y="120"
          width="140"
          height="68"
          rx="12"
          fill="var(--color-surface-sheet)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <rect
          x="196"
          y="120"
          width="140"
          height="5"
          rx="12"
          fill="var(--color-surface-elevated)"
          opacity="0.7"
        />
        {/* Gate slot bars — 5 jet bridges along the south edge of Gate D wing */}
        <g fill="var(--color-surface-tile)" opacity="0.85">
          <rect x="208" y="168" width="14" height="14" rx="2" />
          <rect x="228" y="168" width="14" height="14" rx="2" />
          <rect x="248" y="168" width="14" height="14" rx="2" />
          <rect x="268" y="168" width="14" height="14" rx="2" />
          <rect x="288" y="168" width="14" height="14" rx="2" />
        </g>
        {/* Highlight the active gate slot — D73 */}
        <rect
          x="268"
          y="166"
          width="14"
          height="16"
          rx="2"
          fill="var(--color-action-teal)"
          opacity="0.85"
        />

        {/* Route path — glow underlay */}
        <path
          d="M 62 80 Q 110 80 130 80 Q 158 80 164 100 L 164 120 Q 200 132 228 144 T 282 156"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="3.5"
          opacity="0.14"
          strokeLinecap="round"
        />
        {/* Route path — crisp dashed */}
        <path
          d="M 62 80 Q 110 80 130 80 Q 158 80 164 100 L 164 120 Q 200 132 228 144 T 282 156"
          fill="none"
          stroke="var(--color-action-teal)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />
      </svg>

      {/* Numbered place markers — aligned to the new route + corridor layout */}
      <MapMarker rank={1} state="primary" style={{ left: "17%", top: "37%" }} />
      <MapMarker rank={2} state="default" style={{ left: "37%", top: "37%" }} />
      <MapMarker rank={3} state="default" style={{ left: "63%", top: "71%" }} />
      <MapMarker rank={4} state="muted" style={{ left: "15%", top: "75%" }} />
      {/* Destination dot — sits where the route terminates next to the pill */}
      <span
        aria-hidden
        className="absolute inline-flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-action-teal)] ring-4 ring-[var(--color-action-teal-soft)]"
        style={{ left: "78%", top: "75%" }}
      />
    </span>
  );
}

function MapMarker({
  rank,
  state,
  style,
}: {
  rank: number;
  state: "primary" | "default" | "muted";
  style: React.CSSProperties;
}) {
  const tones: Record<typeof state, string> = {
    primary:
      "bg-[var(--color-action-teal)] text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button)]",
    default:
      "bg-[var(--color-surface-sheet)] text-[var(--color-text-primary)] border border-[var(--color-border)]",
    muted:
      "bg-[var(--color-surface-tile)] text-[var(--color-text-muted)] border border-[var(--color-border-soft)]",
  };
  return (
    <span
      aria-hidden
      className={`absolute inline-flex h-6 w-6 items-center justify-center rounded-full text-micro tabular-nums ${tones[state]}`}
      style={style}
    >
      {rank}
    </span>
  );
}

function ResultsHeader({
  query,
  count,
  gate,
}: {
  query: string;
  count: number;
  gate: string;
}) {
  return (
    <section className="flex items-center justify-between gap-3 pt-1">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="text-title text-[var(--color-text-primary)]">
          {count} results · {query}
        </h1>
        <p className="text-label text-[var(--color-text-secondary)]">
          Sorted by Route Fit · on your way to {gate}
        </p>
      </div>
      <button
        type="button"
        aria-label="Sort results"
        className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 text-body-sm-emphasis text-[var(--color-text-primary)] shadow-[var(--shadow-card)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
      >
        <SlidersIcon size={13} aria-hidden />
        Sort
      </button>
    </section>
  );
}

function BestResultCard({ result }: { result: BestResult }) {
  const accessibleSummary = `${result.name}, best choice, safe for boarding, on your way to ${DESTINATION_GATE}, ${result.metrics[2].value} walk, ${result.metrics[1].value} detour. Rated ${result.rating} from ${result.reviewCount} reviews.`;
  return (
    <Card
      as="article"
      surface="sheet"
      padding="lg"
      aria-label={accessibleSummary}
      className="flex flex-col gap-4"
    >
      <BestResultChips />
      <BestResultHeader result={result} />
      <BestResultStatusRow result={result} />
      <BestResultMetrics metrics={result.metrics} />
      <Button
        tone="teal"
        leadingIcon={<PlusSignSvg />}
        aria-label={`Add ${result.name} as a stop`}
      >
        Add Stop
      </Button>
    </Card>
  );
}

/**
 * Hand-rolled "+" mark for the Add Stop button. The shared icon set
 * doesn't have a thin plus sign at this weight; using a simple inline
 * SVG keeps the affordance crisp on the teal pill without touching the
 * shared `icons.tsx` file.
 */
function PlusSignSvg() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    >
      <line x1="7" y1="2" x2="7" y2="12" />
      <line x1="2" y1="7" x2="12" y2="7" />
    </svg>
  );
}

function BestResultChips() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-teal)] px-3 text-micro uppercase text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button)]">
        <SparkleIcon size={12} aria-hidden />
        Best choice
      </span>
      <span className="inline-flex h-7 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-map-mint-soft)] bg-[var(--color-map-mint-bg)] px-3 text-micro uppercase text-[var(--color-action-teal)]">
        <ShieldCheckIcon size={12} aria-hidden />
        Safe for boarding
      </span>
    </div>
  );
}

function BestResultHeader({ result }: { result: BestResult }) {
  return (
    <Link
      href={result.href}
      aria-label={`View details for ${result.name}`}
      className="flex items-start gap-3 -m-2 rounded-[var(--radius-tile)] p-2 transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
    >
      <span
        aria-hidden
        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-action-teal)] text-section-title tabular-nums text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button-teal)]"
      >
        {result.rank}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 text-title text-[var(--color-text-primary)]">
          {result.name}
        </span>
        <span className="truncate text-label text-[var(--color-text-secondary)]">
          {result.category} · {result.location}
        </span>
      </div>
      <span
        aria-hidden
        className="inline-flex shrink-0 self-center text-[var(--color-text-muted)]"
      >
        <ChevronRightIcon size={16} />
      </span>
    </Link>
  );
}

function BestResultStatusRow({ result }: { result: BestResult }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-label">
      <span className="inline-flex h-5 items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-success-bg)] px-2 text-micro uppercase text-[var(--color-success-fg)]">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
        />
        {result.isOpen ? "Open" : "Closed"}
      </span>
      {result.onRoute ? (
        <span className="inline-flex h-5 items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-map-mint-bg)] px-2 text-micro uppercase text-[var(--color-action-teal)]">
          On Your Way
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1 text-body-sm text-[var(--color-text-primary)]">
        <StarIcon size={12} aria-hidden />
        <span className="tabular-nums">{result.rating.toFixed(1)}</span>
        <span className="tabular-nums text-[var(--color-text-secondary)]">
          ({result.reviewCount})
        </span>
      </span>
    </div>
  );
}

const METRIC_TONE: Record<ResultMetric["tone"], string> = {
  neutral:
    "bg-[var(--color-surface-tile)] text-[var(--color-text-primary)]",
  mint:
    "bg-[var(--color-map-mint-bg)] text-[var(--color-action-teal)]",
  warm:
    "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]",
};

function BestResultMetrics({ metrics }: { metrics: ResultMetric[] }) {
  return (
    <ul className="grid grid-cols-3 gap-2.5">
      {metrics.map((m) => (
        <li
          key={m.label}
          className={`flex flex-col gap-2 rounded-[var(--radius-tile)] px-3.5 py-3.5 ${METRIC_TONE[m.tone]}`}
        >
          <span className="inline-flex items-center gap-1.5 text-micro uppercase">
            <span aria-hidden className="inline-flex shrink-0">
              {m.icon}
            </span>
            {m.label}
          </span>
          <span className="text-section-title tabular-nums">
            {m.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SecondaryResultsList({
  results,
}: {
  results: SecondaryResult[];
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {results.map((r) => (
        <li key={r.id}>
          <SecondaryResultCard result={r} />
        </li>
      ))}
    </ul>
  );
}

function SecondaryResultCard({ result }: { result: SecondaryResult }) {
  return (
    <Card
      as="article"
      surface="sheet"
      padding="compact"
      aria-label={`${result.name}, ${result.category}, ${result.isOpen ? "open" : "closed"}, rated ${result.rating} from ${result.reviewCount} reviews, ${result.walkMinutes} minute walk, plus ${result.detourMinutes} minute detour`}
      className="flex items-center gap-3"
    >
      <span
        aria-hidden
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-tile)] text-body-sm-emphasis tabular-nums text-[var(--color-text-secondary)]"
      >
        {result.rank}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm-emphasis text-[var(--color-text-primary)]">
          {result.name}
        </span>
        <span className="truncate text-label text-[var(--color-text-secondary)]">
          {result.category}
        </span>
        <span className="inline-flex flex-wrap items-center gap-1.5 pt-0.5 text-label text-[var(--color-text-secondary)]">
          {result.isOpen ? (
            <span className="inline-flex items-center gap-1 text-[var(--color-success-fg)]">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
              />
              Open
            </span>
          ) : null}
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <FootstepsIcon size={11} aria-hidden />
            <span className="tabular-nums">{result.walkMinutes} min</span>
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon size={11} aria-hidden />
            <span className="tabular-nums">+{result.detourMinutes} min</span>
          </span>
        </span>
      </div>
      <span className="inline-flex shrink-0 flex-col items-end gap-0.5">
        <span className="inline-flex items-center gap-1 text-body-sm-emphasis text-[var(--color-text-primary)]">
          <StarIcon size={12} aria-hidden />
          <span className="tabular-nums">{result.rating.toFixed(1)}</span>
        </span>
        <span className="text-micro tabular-nums text-[var(--color-text-muted)]">
          ({result.reviewCount})
        </span>
      </span>
    </Card>
  );
}
