"use client";

import Link from "next/link";
import type { Route } from "next";
import { SpinnerIcon } from "./icons";

type Variant = "primary" | "secondary" | "ghost";

type CommonProps = {
  variant?: Variant;
  children: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> & {
    href?: never;
  };

type ButtonAsLink = CommonProps & {
  href: Route | URL;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-[0.005em] transition-colors duration-150 select-none disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed disabled:pointer-events-none aria-disabled:opacity-[var(--opacity-disabled)] aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-busy:cursor-progress";

/**
 * Variant typography is intentionally **inline** rather than via type-role
 * utilities. Button's text size is coupled to its variant chrome (54px
 * primary pill takes 15px / `leading-none`; 52px secondary pill takes 14px
 * paired with its border + elevated fill; 44px ghost takes 13px with the
 * specific 0.025em tracking that distinguishes it from a body link). All
 * three are documented exceptions to the "use type-role utilities" rule in
 * design-system.md §4 and allow-listed in `scripts/check-design-system.mjs`.
 */
const variants: Record<Variant, string> = {
  primary:
    "h-[54px] w-full rounded-[var(--radius-pill)] bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] text-[15px] leading-none shadow-[var(--shadow-button)] active:opacity-90",
  secondary:
    "h-[52px] w-full rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] text-[14px] hover:bg-[var(--color-surface-elevated-hover)]",
  ghost:
    "h-[44px] w-full rounded-[var(--radius-pill)] bg-transparent text-[var(--color-text-secondary)] text-[13px] tracking-[0.025em] hover:text-[var(--color-text-primary)]",
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    children,
    leadingIcon,
    trailingIcon,
    loading = false,
    loadingLabel,
    disabled = false,
    className = "",
    ...rest
  } = props as CommonProps & Record<string, unknown>;

  const isLink = "href" in props && props.href != null;
  const inactive = disabled || loading;

  const classes = `${base} ${variants[variant]} ${className}`.trim();

  const label = loading && loadingLabel ? loadingLabel : children;
  // Loading replaces the trailing slot with a spinner. Leading slot stays
  // visible so the button's identity (e.g. the mail icon on "Sign in with
  // email") remains recognisable during async work.
  const trailing = loading ? (
    <SpinnerIcon size={16} />
  ) : trailingIcon ? (
    trailingIcon
  ) : null;

  const inner = (
    <>
      {leadingIcon ? (
        <span className="inline-flex items-center" aria-hidden>
          {leadingIcon}
        </span>
      ) : null}
      <span>{label}</span>
      {trailing ? (
        <span className="inline-flex items-center" aria-hidden>
          {trailing}
        </span>
      ) : null}
    </>
  );

  if (isLink) {
    const linkProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const { onClick: providedOnClick, ...restLinkProps } = linkProps;
    const onClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
      if (inactive) {
        event.preventDefault();
        return;
      }
      providedOnClick?.(event);
    };
    return (
      <Link
        href={(props as ButtonAsLink).href as Route}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={inactive || undefined}
        tabIndex={inactive ? -1 : undefined}
        onClick={onClick}
        {...restLinkProps}
      >
        {inner}
      </Link>
    );
  }

  const btnProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type="button"
      className={classes}
      disabled={inactive}
      aria-busy={loading || undefined}
      {...btnProps}
    >
      {inner}
    </button>
  );
}
