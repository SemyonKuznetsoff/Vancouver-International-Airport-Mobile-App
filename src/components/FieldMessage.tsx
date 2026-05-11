type Tone = "neutral" | "error" | "success" | "warning";

type FieldMessageProps = {
  tone?: Tone;
  children: React.ReactNode;
  id?: string;
  className?: string;
};

const toneClasses: Record<Tone, string> = {
  neutral: "text-[var(--color-text-secondary)]",
  error: "text-[var(--color-danger-fg)]",
  success: "text-[var(--color-success-fg)]",
  warning: "text-[var(--color-warning-fg)]",
};

/**
 * Helper / validation message that sits beneath a form field. Tone drives
 * colour; error tone also sets `role="alert"` so screen readers announce
 * the validation result politely.
 *
 * Pair with `<TextField>` (which composes FieldMessage internally) or use
 * stand-alone underneath a custom form region.
 *
 * Content rule: keep messages short and verb-first. "Enter your email" not
 * "Please enter your email address." See content-guide.md §4.
 */
export function FieldMessage({
  tone = "neutral",
  children,
  id,
  className = "",
}: FieldMessageProps) {
  return (
    <p
      id={id}
      role={tone === "error" ? "alert" : undefined}
      className={`text-label ${toneClasses[tone]} ${className}`.trim()}
    >
      {children}
    </p>
  );
}
