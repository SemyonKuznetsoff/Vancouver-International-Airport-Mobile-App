type EyebrowProps = {
  children: React.ReactNode;
  tone?: "primary" | "secondary";
  className?: string;
};

export function Eyebrow({
  children,
  tone = "primary",
  className = "",
}: EyebrowProps) {
  const color =
    tone === "primary"
      ? "text-[var(--color-text-primary)]"
      : "text-[var(--color-text-secondary)]";

  return (
    <p
      className={`text-[11px] leading-[1.5] uppercase tracking-[0.22em] ${color} ${className}`.trim()}
    >
      {children}
    </p>
  );
}
