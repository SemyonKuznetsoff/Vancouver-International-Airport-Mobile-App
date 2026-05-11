"use client";

import type { Route } from "next";
import { Button } from "./Button";

type Action = {
  label: string;
  href?: Route | URL;
  onClick?: () => void;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
};

type StickyBottomCTAProps = {
  primaryAction: Action;
  secondaryAction?: Action;
  /**
   * When true, the wrapper carries a top-to-bottom fade from transparent
   * to `--color-bg` so scrolling content fades into the CTA region. When
   * false, the wrapper is a solid `--color-bg` block. Default: true.
   */
  showFade?: boolean;
  className?: string;
};

/**
 * Sticky bottom CTA — pins one or two action buttons to the bottom of the
 * scroll container, above the safe-area inset. Use this when a screen has
 * a single dominant action and longer-than-viewport content (e.g. an "Add
 * flight" form, a flight detail page with "Save trip" action).
 *
 * Behaviour:
 * - Uses `position: sticky bottom-0` so the wrapper sits at the bottom of
 *   its scroll container. The parent must be `overflow-y-auto` (e.g.
 *   `<AppShellAuthed>`'s `<main>`).
 * - `showFade` (default true) applies a top-to-bottom gradient from
 *   transparent → `--color-bg` so scrolling content fades into the
 *   sticky region instead of being cropped abruptly.
 * - Reserves `env(safe-area-inset-bottom)` so buttons stay above the
 *   home indicator on iOS.
 *
 * The primary action renders as `<Button variant="primary">` (54px navy
 * pill). The optional secondary action renders as `<Button variant="ghost">`
 * (44px text-link). Both inherit `loading` / `disabled` through to the
 * Button primitive.
 *
 * **Layout.** The screen's content must be vertically padded so the
 * sticky CTA doesn't visually overlap the last content row. A
 * `pb-32` (~128px) or similar on the content section is typical.
 */
export function StickyBottomCTA({
  primaryAction,
  secondaryAction,
  showFade = true,
  className = "",
}: StickyBottomCTAProps) {
  return (
    <div
      className={`sticky bottom-0 z-10 flex flex-col gap-3 px-6 ${
        showFade ? "pt-8" : "pt-4"
      } ${className}`.trim()}
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
        background: showFade
          ? "linear-gradient(to bottom, transparent 0%, var(--color-bg) 50%)"
          : "var(--color-bg)",
      }}
    >
      {renderAction("primary", primaryAction)}
      {secondaryAction ? renderAction("ghost", secondaryAction) : null}
    </div>
  );
}

function renderAction(variant: "primary" | "ghost", action: Action) {
  if (action.href) {
    return (
      <Button
        variant={variant}
        href={action.href}
        onClick={action.onClick}
        trailingIcon={action.trailingIcon}
        loading={action.loading}
        disabled={action.disabled}
      >
        {action.label}
      </Button>
    );
  }
  return (
    <Button
      variant={variant}
      onClick={action.onClick}
      trailingIcon={action.trailingIcon}
      loading={action.loading}
      disabled={action.disabled}
    >
      {action.label}
    </Button>
  );
}
