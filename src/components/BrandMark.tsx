import { IconTile } from "./IconTile";
import { PlaneIcon } from "./icons";

/**
 * YVR Concierge brand lockup — round logo mark + "YVR" wordmark +
 * uppercase "Concierge" tail label.
 *
 * Typography is fully role-token driven (no arbitrary `text-[NNpx]`):
 * - "YVR" renders at `text-body-sm-emphasis` (13/600). Already
 *   uppercase by data; no CSS `uppercase` applied.
 * - "Concierge" renders at `text-micro` (10/600/+0.16em uppercase),
 *   the system's canonical uppercase tail-label role.
 */
export function BrandMark() {
  return (
    <div className="flex items-center gap-2" aria-label="YVR Concierge">
      <IconTile>
        <PlaneIcon size={14} />
      </IconTile>
      <span
        className="text-body-sm-emphasis text-[var(--color-text-primary)]"
        aria-hidden
      >
        YVR
      </span>
      <span
        className="text-micro uppercase text-[var(--color-text-secondary)]"
        aria-hidden
      >
        Concierge
      </span>
    </div>
  );
}
