/**
 * Prototype-only routing rule for the upcoming-flight surface.
 *
 * The app does not yet have a live time-to-boarding signal, so the
 * choice between the calm `/flights/departing` document and the
 * urgent `/flights/departing-urgent` document is hard-coded here.
 *
 * Flip `PROTOTYPE_DEPARTING_STATE` to `"urgent"` to exercise the
 * urgent route from every entry point at once. Both Home
 * (`I'm here to → Departing`) and Flights (`View trip details`)
 * read from this rule so the two screens cannot disagree.
 *
 * When a real boarding-window signal exists, replace this module
 * with a derivation from flight + clock state and remove the
 * `PROTOTYPE_` constant.
 */

export type DepartingState = "upcoming" | "urgent";

export const PROTOTYPE_DEPARTING_STATE: DepartingState = "upcoming";

export type DepartingHref =
  | "/flights/departing"
  | "/flights/departing-urgent";

export function departingHref(state: DepartingState): DepartingHref {
  return state === "urgent"
    ? "/flights/departing-urgent"
    : "/flights/departing";
}
