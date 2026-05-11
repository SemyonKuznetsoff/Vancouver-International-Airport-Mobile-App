import Link from "next/link";
import type { Route } from "next";
import { ChevronRightIcon } from "./icons";
import { IconTile } from "./IconTile";

type SettingsRowProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  href?: Route | URL;
  /**
   * Optional trailing slot rendered before the chevron. Use for count
   * badges, status chips, or a small red dot on rows with unread state.
   */
  trailing?: React.ReactNode;
  /**
   * Small unread dot beside the title. Distinct from `trailing` — sits
   * inline with the title so the row reads "Notifications •" at a glance.
   */
  unread?: boolean;
  /**
   * Visual tone of the leading IconTile. `tile` sits warm on a solid
   * inner card (default settings list rhythm). `elevated` is the airy
   * translucent tile used on the aurora background.
   */
  iconTone?: "tile" | "elevated";
  onClick?: () => void;
};

const iconToneClass: Record<NonNullable<SettingsRowProps["iconTone"]>, string> = {
  tile: "bg-[var(--color-surface-tile)]",
  elevated: "",
};

/**
 * Single navigable row inside a settings / vault list. Composed of a
 * leading IconTile (38px), title + description stack, optional trailing
 * slot (count badge / status chip), and a trailing chevron.
 *
 * Group rows inside a `<Card padding="none">` with a divider className
 * (`[&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]`) — the row
 * does not paint its own divider, so the parent owns the rhythm.
 *
 * Renders as `<Link>` when `href` is passed, otherwise `<button>`. Both
 * branches expose the standard focus-visible ring from globals.css.
 */
export function SettingsRow({
  icon,
  title,
  description,
  href,
  trailing,
  unread = false,
  iconTone = "tile",
  onClick,
}: SettingsRowProps) {
  const inner = (
    <>
      <IconTile size={38} className={iconToneClass[iconTone]}>
        {icon}
      </IconTile>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="inline-flex items-center gap-2 text-body text-[var(--color-text-primary)]">
          <span className="truncate font-medium">{title}</span>
          {unread ? (
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-danger)]"
            />
          ) : null}
        </span>
        {description ? (
          <span className="truncate text-label text-[var(--color-text-secondary)]">
            {description}
          </span>
        ) : null}
      </span>
      {trailing ? (
        <span className="inline-flex shrink-0 items-center">{trailing}</span>
      ) : null}
      <span
        aria-hidden
        className="inline-flex shrink-0 items-center text-[var(--color-text-muted)]"
      >
        <ChevronRightIcon size={16} />
      </span>
    </>
  );

  const className =
    "flex w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-150 hover:bg-[var(--color-surface-hover)]";

  if (href) {
    return (
      <Link href={href as Route} className={className} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {inner}
    </button>
  );
}
