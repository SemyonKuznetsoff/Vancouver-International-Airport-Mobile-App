import Link from "next/link";
import type { Route } from "next";

type Variant = "light" | "map";
type BadgeTone = "warning" | "danger" | "success";

type CommonProps = {
  /**
   * Required. The button has no visible label; screen readers rely
   * entirely on this string. If `badgeDot` is shown, fold the alert
   * state into the label (e.g. `"Flight notifications, new alert"`)
   * so AT users learn the state alongside the action.
   */
  "aria-label": string;
  /**
   * The icon. Render at 16–18px (`<ArrowLeftIcon size={16} />`,
   * `<BellIcon size={16} />`, etc.). The component does not constrain
   * icon size — pass it explicitly.
   */
  children: React.ReactNode;
  /**
   * Optional small dot in the top-right corner used for unread /
   * alert affordances. Decorative (`aria-hidden`); the alert state
   * must also be reflected in `aria-label`.
   */
  badgeDot?: boolean;
  /** Default `"warning"` (amber). */
  badgeTone?: BadgeTone;
  /**
   * Chrome variant.
   * - `"light"` (default) — the canonical elevated white circle used
   *   on aurora screens (back, search, share, bell, more).
   * - `"map"` — bordered dark surface variant used on the immersive
   *   `/parking/find-my-car` map shell so the back / share buttons
   *   read on the dark navy-teal map background.
   */
  variant?: Variant;
  className?: string;
};

type AsLink = CommonProps & {
  href: Route | URL;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type AsButton = CommonProps & {
  href?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

const variantClasses: Record<Variant, string> = {
  light:
    "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-[var(--shadow-card)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]",
  map:
    "border border-[var(--color-surface-map-border)] bg-[var(--color-surface-map-elevated)] text-[var(--color-surface-map-fg)] transition-opacity duration-150 hover:opacity-80",
};

const badgeToneClasses: Record<BadgeTone, string> = {
  warning: "bg-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]",
  success: "bg-[var(--color-success)]",
};

const base =
  "relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full";

/**
 * Shared circular icon button used in screen headers across the
 * authed app — back, search, share, bell, more, etc. Replaces the
 * 17 duplicated inline copies of the same class string and gives
 * the design system one source of truth for header chrome.
 *
 * - 44×44 tap target preserved (`h-11 w-11`).
 * - Renders `<Link>` when `href` is provided; otherwise `<button>`.
 * - `aria-label` is **required** because the visible content is
 *   icon-only.
 * - Focus visibility is inherited from the global `:focus-visible`
 *   rule in `globals.css` — no per-component overrides.
 * - For dark-surface contexts (Find My Car immersive map), pass
 *   `variant="map"` to swap chrome to the navy-teal surface tokens.
 *
 * @example
 *   <HeaderIconButton aria-label="Back to services" href="/services">
 *     <ArrowLeftIcon size={16} />
 *   </HeaderIconButton>
 *
 *   <HeaderIconButton
 *     aria-label="Flight notifications, new alert"
 *     badgeDot
 *   >
 *     <BellIcon size={16} />
 *   </HeaderIconButton>
 */
export function HeaderIconButton(props: AsLink | AsButton) {
  const {
    children,
    badgeDot = false,
    badgeTone = "warning",
    variant = "light",
    className = "",
    "aria-label": ariaLabel,
    ...rest
  } = props as CommonProps & Record<string, unknown>;

  const classes =
    `${base} ${variantClasses[variant]} ${className}`.trim();

  const inner = (
    <>
      {children}
      {badgeDot ? (
        <span
          aria-hidden
          className={`absolute right-2 top-2 inline-block h-2 w-2 rounded-full ${badgeToneClasses[badgeTone]}`}
        />
      ) : null}
    </>
  );

  if ("href" in props && props.href != null) {
    const linkProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link
        href={(props as AsLink).href as Route}
        aria-label={ariaLabel}
        className={classes}
        {...linkProps}
      >
        {inner}
      </Link>
    );
  }

  const btnProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={btnProps.type ?? "button"}
      aria-label={ariaLabel}
      className={classes}
      {...btnProps}
    >
      {inner}
    </button>
  );
}
