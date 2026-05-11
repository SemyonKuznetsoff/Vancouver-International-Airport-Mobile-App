type IconTileProps = {
  children: React.ReactNode;
  size?: number;
  className?: string;
};

export function IconTile({
  children,
  size = 28,
  className = "",
}: IconTileProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[var(--radius-chip)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] ${className}`.trim()}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}
