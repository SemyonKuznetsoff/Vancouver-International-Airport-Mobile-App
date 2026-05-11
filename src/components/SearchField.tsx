"use client";

import { CloseIcon, SearchIcon } from "./icons";

type SearchFieldProps = {
  placeholder?: string;
  value?: string;
  onChange?: (next: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
};

/**
 * Search input — pill-shaped field with a leading magnifier and a trailing
 * clear button that appears when the field has content.
 *
 * Use for: app-level search (flights, places on the map, food, services).
 * For form-style inputs (email, name, flight number entry) use
 * `<TextField>` which has different chrome and validation slots.
 *
 * Accessibility:
 * - Wrapper has `role="search"` so screen readers identify the region.
 * - Input is `type="search"` + `role="searchbox"` + `aria-label`.
 * - Clear button has an explicit `aria-label="Clear search"` and a 44×44
 *   tap target.
 *
 * The clear button triggers both `onClear` (if provided) and
 * `onChange("")`, so consumers can pass either callback and still get a
 * cleared input.
 */
export function SearchField({
  placeholder = "Search",
  value,
  onChange,
  onClear,
  disabled = false,
  ariaLabel = "Search",
  className = "",
}: SearchFieldProps) {
  const hasValue = value != null && value.length > 0;

  const handleClear = () => {
    onClear?.();
    onChange?.("");
  };

  return (
    <div
      role="search"
      className={`flex h-[52px] w-full items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] pl-4 pr-2 transition-colors duration-150 focus-within:border-[var(--color-action-primary)] ${
        disabled ? "opacity-[var(--opacity-disabled)] pointer-events-none" : ""
      } ${className}`.trim()}
    >
      <span
        aria-hidden
        className="inline-flex shrink-0 items-center text-[var(--color-text-secondary)]"
      >
        <SearchIcon size={18} />
      </span>
      <input
        type="search"
        role="searchbox"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="flex-1 bg-transparent text-body text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
      />
      {hasValue ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-surface-hover)]"
        >
          <CloseIcon size={16} />
        </button>
      ) : null}
    </div>
  );
}
