"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { PlaneIcon, PlusIcon } from "./icons";

const FLIGHT_NUMBER_PATTERN = /^[A-Z0-9]{2,3}\d{1,4}$/;

function normaliseFlightNumber(raw: string): string {
  return raw.trim().toUpperCase().replace(/[\s-]+/g, "");
}

/**
 * Home-hero flight search composite. Light pill input + inline navy
 * "Add trip" pill on the dark hero. Validates flight-number shape
 * locally (AC838, CX 838, ac-838 …) and routes to /flights/search with
 * the normalised query + autoSearch=1 so the search page runs the live
 * call. The browser never touches the upstream provider here.
 *
 * This composite is the documented one-off for `/home` in
 * docs/design-system.md §2a — `SearchField` has no trailing-CTA slot.
 */
export function HomeFlightSearch() {
  const router = useRouter();
  const inputId = useId();
  const errorId = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalised = normaliseFlightNumber(value);
    if (normalised === "" || !FLIGHT_NUMBER_PATTERN.test(normalised)) {
      setError("Enter a flight number like AC838.");
      return;
    }
    setError(null);
    const params = new URLSearchParams({
      flightNumber: normalised,
      autoSearch: "1",
    });
    router.push(`/flights/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Add a trip by flight number"
      className="flex flex-col gap-2"
    >
      <div className="flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-sheet)] py-1.5 pl-4 pr-1.5 transition-colors duration-150 focus-within:border-[var(--color-action-primary)]">
        <label htmlFor={inputId} className="sr-only">
          Flight number
        </label>
        <span
          aria-hidden
          className="inline-flex shrink-0 items-center text-[var(--color-text-secondary)]"
        >
          <PlaneIcon size={16} />
        </span>
        <input
          id={inputId}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          placeholder="Flight number"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-11 min-w-0 flex-1 bg-transparent text-body text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-action-primary)] px-4 text-body-sm-emphasis text-[var(--color-action-primary-fg)] shadow-[var(--shadow-button)] transition-opacity duration-150 hover:opacity-90 active:opacity-90"
        >
          <span aria-hidden className="inline-flex items-center">
            <PlusIcon size={14} />
          </span>
          <span>Add trip</span>
        </button>
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-label text-[var(--color-surface-hero-fg-muted)]"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
