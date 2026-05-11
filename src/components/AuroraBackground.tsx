export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[var(--color-surface-base)]"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--color-aurora-sky) 55%, transparent) 0%, transparent 55%)",
          "radial-gradient(circle at 75% 35%, color-mix(in srgb, var(--color-aurora-lavender) 50%, transparent) 0%, transparent 55%)",
          "radial-gradient(circle at 25% 95%, color-mix(in srgb, var(--color-aurora-mint) 55%, transparent) 0%, transparent 55%)",
        ].join(", "),
      }}
    />
  );
}
