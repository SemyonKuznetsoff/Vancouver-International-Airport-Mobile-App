export type Feature = {
  title: string;
  description: string;
};

type FeatureListProps = {
  items: Feature[];
  className?: string;
};

export function FeatureList({ items, className = "" }: FeatureListProps) {
  return (
    <ol
      className={`w-full border-t border-[var(--color-border-hairline)] ${className}`.trim()}
    >
      {items.map((item, index) => (
        <FeatureListItem
          key={item.title}
          index={index + 1}
          title={item.title}
          description={item.description}
        />
      ))}
    </ol>
  );
}

type FeatureListItemProps = {
  index: number;
  title: string;
  description: string;
};

export function FeatureListItem({
  index,
  title,
  description,
}: FeatureListItemProps) {
  const label = String(index).padStart(2, "0");

  return (
    <li className="flex h-16 items-center justify-between border-b border-[var(--color-border-hairline)]">
      <div className="flex flex-col gap-[2px] pr-4">
        <p className="text-[14px] font-medium leading-[1.5] text-[var(--color-text-primary)]">
          {title}
        </p>
        <p className="text-[13px] leading-[1.5] text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
      <span
        aria-hidden
        className="shrink-0 text-[11px] leading-[1.5] tracking-[0.05em] text-[var(--color-text-secondary)]"
      >
        {label}
      </span>
    </li>
  );
}
