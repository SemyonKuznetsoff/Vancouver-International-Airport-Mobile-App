import { IconTile } from "./IconTile";
import { PlaneIcon } from "./icons";

export function BrandMark() {
  return (
    <div className="flex items-center gap-2" aria-label="YVR Concierge">
      <IconTile>
        <PlaneIcon size={14} />
      </IconTile>
      <span
        className="text-[13px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-primary)]"
        aria-hidden
      >
        YVR
      </span>
      <span
        className="text-[13px] font-normal uppercase tracking-[0.18em] text-[var(--color-text-secondary)]"
        aria-hidden
      >
        Concierge
      </span>
    </div>
  );
}
