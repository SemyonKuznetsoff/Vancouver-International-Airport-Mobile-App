type Padding = "none" | "compact" | "default" | "lg";
type Tone = "glass" | "solid";

type CardProps = {
  children: React.ReactNode;
  padding?: Padding;
  as?: "div" | "article" | "section";
  /**
   * Surface tone.
   *
   * - `glass` (default) — translucent white over aurora. Used by every
   *   screen on `<AppShellAuthed tone="aurora">` (Profile, Saved Trips).
   * - `solid` — opaque white with a warm hairline and a warm teal-tinted
   *   shadow. Used by screens on `<AppShellAuthed tone="warm">` (Home).
   *   A solid card on aurora reads stark; a glass card on warm fades
   *   into the page bg.
   */
  tone?: Tone;
  className?: string;
};

const paddingClasses: Record<Padding, string> = {
  none: "",
  compact: "p-4",
  default: "p-5",
  lg: "p-6",
};

const toneClasses: Record<Tone, string> = {
  glass:
    "border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-card)]",
  solid:
    "border-[var(--color-border-solid)] bg-[var(--color-surface-solid)] shadow-[var(--shadow-card-solid)]",
};

/**
 * Card primitive — the **single source** of standard elevated card
 * chrome (fill, border, radius, shadow). Compose content inside.
 *
 * - Do not re-author card chrome in page files or other primitives.
 * - Use `padding="none"` when the children own their own padding
 *   (e.g. a list of rows, an `AuthOptionGroup`).
 * - Use `padding="compact"` (16px) inside dense lists.
 * - Use `padding="default"` (20px) for most informational cards.
 * - Use `padding="lg"` (24px) for hero cards.
 * - Use `tone="solid"` on screens that opt into the warm page surface
 *   via `<AppShellAuthed tone="warm">` (Home today). Default
 *   `tone="glass"` keeps continuity on aurora screens.
 *
 * Extra layout concerns (e.g. `overflow-hidden`, divider selectors)
 * come in via `className`.
 */
export function Card({
  children,
  padding = "default",
  as: Tag = "div",
  tone = "glass",
  className = "",
}: CardProps) {
  return (
    <Tag
      className={`rounded-[var(--radius-panel)] border ${toneClasses[tone]} ${paddingClasses[padding]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
