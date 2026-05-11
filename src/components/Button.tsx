import Link from "next/link";
import type { Route } from "next";

type Variant = "primary" | "ghost";

type CommonProps = {
  variant?: Variant;
  children: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsLink = CommonProps & {
  href: Route | URL;
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-[0.005em] transition-colors duration-150 select-none";

const variants: Record<Variant, string> = {
  primary:
    "h-[54px] w-full rounded-[var(--radius-pill)] bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] text-[15px] leading-none shadow-[var(--shadow-button)] active:opacity-90",
  ghost:
    "h-[44px] w-full rounded-[var(--radius-pill)] bg-transparent text-[var(--color-text-secondary)] text-[13px] tracking-[0.025em] hover:text-[var(--color-text-primary)]",
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    children,
    trailingIcon,
    className = "",
    ...rest
  } = props as CommonProps & Record<string, unknown>;

  const classes = `${base} ${variants[variant]} ${className}`.trim();

  const inner = (
    <>
      <span>{children}</span>
      {trailingIcon ? (
        <span className="inline-flex items-center" aria-hidden>
          {trailingIcon}
        </span>
      ) : null}
    </>
  );

  if ("href" in props && props.href != null) {
    return (
      <Link
        href={props.href as Route}
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {inner}
    </button>
  );
}
