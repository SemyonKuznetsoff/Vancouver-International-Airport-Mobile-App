# Screen Build Checklist

Run through this list **before**, **during**, and **after** every new screen.
If any box can't be ticked, the screen is not ready to ship.

---

## Before coding

- [ ] Inspect the Figma frame via the MCP `get_design_context`.
- [ ] Skim [`design-system.md`](./design-system.md) for the relevant
      typography / color / spacing / component sections.
- [ ] Skim [`content-guide.md`](./content-guide.md) §2 (copy rules) and
      §6 (formatting) before writing any screen copy. For status,
      error, or empty states, read the matching section.
- [ ] List every visual element on the screen and map it to either:
      (a) an existing component, or (b) a new primitive proposal.
- [ ] Confirm the route path (`src/app/...`) with the user.
- [ ] Confirm the screen's **one main action** in plain English.
- [ ] Confirm the content hierarchy: eyebrow → heading → support → body → CTA.
- [ ] Confirm every interactive element (buttons, toggles, links) and where
      each navigates to.
- [ ] If any new primitive is required, propose it in `design-system.md`
      and pause for user confirmation before writing JSX.

---

## Authenticated screens

Any screen that lives inside the logged-in app (`/profile`, future
`/home`, `/flights`, `/map`, `/services`) is a structurally different
beast from onboarding. Use the rules below in addition to the generic
ones above.

- [ ] **Shell is `<AppShellAuthed>`, never `<AppShell>`.** Onboarding's
      shell omits the tab bar and uses `min-h-dvh`; the authed shell
      reserves the bottom for `<BottomTabBar>` and scrolls `<main>`
      internally. See `design-system.md` §12j.
- [ ] **Bottom tab bar is rendered by the shell.** Do not render
      `<BottomTabBar>` inside the page; `AppShellAuthed` already does.
      Active-tab detection uses `usePathname()` — putting the page at
      the matching route lights up the correct tab. Do not pass
      `activeHref` unless overriding intentionally.
- [ ] **Header uses `<LargeTitleHeader>`,** with `subtitle` for the
      single-line context line and `trailing` for icon buttons (gear,
      bell, filter). For step screens inside the authed app (forms,
      detail screens with a back chip), use `<ScreenHeader>` instead.
- [ ] **No safe-area padding at the bottom.** `BottomTabBar` owns
      `env(safe-area-inset-bottom)`. Adding it again on the page
      double-counts and creates dead space.
- [ ] **Reserve `pb-8` on the content column** so the last block does
      not touch the tab bar. Do not use `pb-0`.
- [ ] **Section rhythm is `gap-8` (32px)** between major blocks inside
      the content column; the first block sits `mt-8` below the
      `LargeTitleHeader`. Page gutter stays `px-6` (24px).
- [ ] **Settings / vault / preferences lists use `<SettingsRow>`,**
      never a hand-rolled row. Group rows inside `<Card padding="none">`
      with the divider className from §12k. If a row needs an on/off
      switch, use `<PermissionCard>` or compose `<Toggle>` — not
      `SettingsRow`'s `trailing` slot.
- [ ] **Trip / flight cards use the travel atoms.** Codes via
      `<AirportCodePair>` (inline) or `<RouteTimeline>` (split).
      Gate / Boarding / Seat strips via `<MetricBlock>`. Status via
      `<StatusPill>`. Live freshness via `<LiveIndicator>`. Never
      inline a gate number with bespoke typography.
- [ ] **Hero / membership surfaces use the §5 hero tokens.** Inline
      `linear-gradient(…, #0e4a4e, …)` and raw white-alpha foregrounds
      are violations. Loyalty-tier chips use the `--color-hero-tier-*`
      trio, never status tones.
- [ ] **CTAs inside a card stack vertically** — `Button variant="primary"`
      above `Button variant="ghost"`. Side-by-side primary + secondary
      pairs are not supported by the current Button system; if a future
      screen needs them, propose `Button size="compact"` first.

### Home-style tab roots (`/home`, future `/flights`, `/map`, `/services`)

Use the **No Trip Home pattern** (`design-system.md` §2b) when building
an authenticated *tab root* whose primary purpose is "what can the user
do right now?". `/home` is the reference implementation.

- [ ] **Shell is `<AppShellAuthed>`** and `<BottomTabBar>` is owned by
      the shell. The tab matching the route lights up automatically via
      `usePathname()` — do not pass `activeHref`.
- [ ] **One main action at the top of the screen.** The screen has
      exactly one primary CTA, and it lives at the top of the content
      column inside the hero card. No competing CTA above it, no
      promotional banner, no secondary CTA in the hero footer.
- [ ] **Live airport data uses the travel atoms.** Every live value
      (security wait, parking availability, SkyTrain timing, security
      status badges) renders through `<MetricBlock>`, `<StatusPill>`,
      and `<LiveIndicator>` — never inline `text-[NNpx]` digits, never
      hand-rolled status chips. Refer to `design-system.md` §12h.
- [ ] **No promotional content above the main action.** Tier
      upgrade nudges, marketing banners, and cross-sell tiles belong
      below the hero, the live-status strip, and the common-task grid
      (in that order). If a banner needs to sit higher, it must be
      time-critical live data (gate change, security closure) and use
      `<InlineAlert role="alert">`.
- [ ] **Empty-state policy.** The screen itself can *be* an empty
      state (e.g. `/home` is the no-trip empty state — the hero card is
      the action surface). Do not nest an additional `<EmptyState>` as
      the main content. Use `<EmptyState>` only for nested feeds that
      are themselves empty (e.g. "No saved journeys" inside a section).

## Live-data screens

Any screen whose primary content depends on a remote fetch must
declare its **three states** before declaring done:

- [ ] **Loading state** — every region that fetches has a
      `<Skeleton>` layout matching the eventual content shape. Wrap
      the region in `aria-busy={loading}`. No blank screens. No
      spinner-on-empty.
- [ ] **Empty state** — when the fetch succeeds but returns nothing,
      render `<EmptyState>` with a verb-first CTA. Never "no data"
      placeholder text.
- [ ] **Error state** — when the fetch fails, render `<ErrorState>`
      with a calm title and a retry action. Never `alert()`, never a
      raw error message, never silent failure.
- [ ] **No browser-native alerts.** No `alert(...)`, `confirm(...)`,
      or `prompt(...)` anywhere. Confirmation flows go through the
      future Toast / Dialog primitives.
- [ ] **No unstyled error text.** Don't drop `<p>Error</p>` into JSX.
      All status copy passes through `<InlineAlert>` or
      `<ErrorState>`.
- [ ] **No local one-off spinners.** If a region is loading, it gets
      a `<Skeleton>`. If a button is submitting, it uses
      `<Button loading>`. If a switch is pending, it uses
      `<Toggle busy>`. Never compose a `<SpinnerIcon>` directly into
      a page file.
- [ ] **Live status inside content** uses `<InlineAlert>` with the
      appropriate variant. `info` / `success` / `neutral` default to
      polite announcement; `warning` / `danger` opt in to
      `role="alert"` only when the message is time-critical.
- [ ] **Travel data uses travel atoms.** Every gate, boarding time,
      security wait, parking %, distance, walking time, countdown,
      flight status, airport-code pair, and live-data freshness
      indicator must render via the §12h primitives (`<StatusPill>`,
      `<LiveIndicator>`, `<MetricBlock>`, `<CountdownBlock>`,
      `<AirportCodePair>`, `<GateDisplay>`). Never inline a gate
      number with bespoke typography, never roll a custom status
      pill, never type `→` by hand inside a heading.
- [ ] **No one-off inputs inside pages.** Every text input goes
      through `<TextField>`; every search input goes through
      `<SearchField>`; every toggleable filter pill goes through
      `<ChipFilter>`; every helper / validation message goes through
      `<FieldMessage>`. Grep your diff for `<input ` and
      `<button role="search"` — there should be none outside the
      form primitives.
- [ ] **Every form defines its empty / error / loading states.**
      Submitting → `<Button loading>`. Async validation in flight →
      `aria-busy` on the field's wrapper. Submission failed → inline
      `<FieldMessage tone="error">` per field, or a top-of-form
      `<InlineAlert variant="danger">` for root-cause errors. Server
      returned no results → `<EmptyState>` named for the query.
      Never show a blank form on error.

## Component state coverage

When adding or revising a primitive:

- [ ] Declare its row in the state matrix in `design-system.md` §12b.
      Mark every state as ✓ supported, — N/A, ❌ missing, or ⏳ future
      required — never leave a column blank.
- [ ] Every interactive primitive (button, link, switch, row) must
      ship with both `disabled` and `focus-visible` support, even if
      the current screen doesn't use them.
- [ ] Any async action (sign-in, submit, permission grant, data fetch)
      must define its `loading` or `busy` behaviour at the primitive
      level. Set `aria-busy="true"` on the busy element and block
      duplicate input via `pointer-events-none`.
- [ ] **Async buttons must use `<Button loading={…} />`** — never roll
      a local "Submitting…" label or wrap a button in a `<Spinner/>`
      sibling. The `loading` prop wires the spinner, `aria-busy`, and
      click-blocking together.
- [ ] **Async switches must use `<Toggle busy={…} />`** — never
      optimistically flip `checked` while a permission grant or other
      async work is in flight. Pass `busy={pending}` and only call
      `setChecked(next)` after the work succeeds.
- [ ] No one-off spinners inside page files. If a page reaches for a
      loading indicator, that indicator lives in a primitive
      (`Button.loading`, `Toggle.busy`, `SpinnerIcon`, `Skeleton`) —
      promote it before shipping.
- [ ] Error and success visuals on a primitive use `--color-danger` /
      `--color-success`, never raw red / green hex. Live-region
      announcements (`aria-live`) go on the parent banner / toast, not
      on the primitive itself.

## During coding

- [ ] Wrap the screen in `<AppShell>`. Never reinvent the shell.
- [ ] Use `<ScreenHeader>` for any non-root screen (back + step label).
- [ ] Use `<Heading size="display">` or `<Heading size="title">`. Never
      override the heading size with `!important`.
- [ ] Use `<Eyebrow>` for uppercase labels.
- [ ] Use `<Card>` for any glass card chrome. No inline `bg-white/40 +
      border + shadow` combinations. If children own padding (rows,
      grouped controls), pass `padding="none"`.
- [ ] Use `<Toggle>` for any on/off switch (permissions, notifications,
      accessibility settings). Never roll a bespoke `<button role="switch">`.
- [ ] Use `<Button>` for every CTA. Use `variant="primary"` for the one
      main action, `variant="secondary"` for a peer-alternative pill
      action (e.g. "Sign in with email" next to OAuth options), and
      `variant="ghost"` for the secondary text-link CTA. Never roll a
      one-off pill button inside a page file.
- [ ] Use token classes for color and shadow:
      `text-[var(--color-text-primary)]`, not raw hex.
      `shadow-[var(--shadow-card)]`, not custom shadow values.
      For the glass card fill use `bg-[var(--color-surface-card)]`, never
      `bg-white/40`. For hover/pressed tints use `--color-surface-hover` /
      `--color-surface-pressed`, never `bg-white/30` / `bg-white/40`.
- [ ] **Never reference a primitive token in a component.** Names that
      start with `--navy-`, `--steel-`, `--mist-`, `--teal-`, `--aurora-*-`,
      `--success-`, `--warning-`, `--danger-`, `--info-`, `--neutral-`,
      `--white-a*`, `--black-a*`, or `--font-size-*` are primitives — they
      belong to `globals.css` only. Use semantic tokens in `.tsx` files.
- [ ] Use type-role utilities for typography: `text-display`, `text-title`,
      `text-body`, `text-body-sm`, `text-label`, `text-eyebrow`, `text-micro`.
      Avoid inline `text-[34px] leading-[1.05]` clusters.
- [ ] Use only allowed spacing values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
      Spacing tokens (`--space-1` … `--space-16`) are also available — prefer
      the token form (`gap-[var(--space-3)]`) over arbitrary px values.
- [ ] Keep tap targets ≥ 44×44.
- [ ] Body copy: max 2 short lines per paragraph.
- [ ] Card body: max 2 lines at 13px.
- [ ] Card title: max 3 words / 1 line.
- [ ] Icon-only buttons / links must have an `aria-label`.
- [ ] Toggles use `role="switch" aria-checked aria-label`.
- [ ] Avoid one-off styles. If you reach for a custom value, ask whether it
      should become a token.
- [ ] **Onboarding step screens use `mt-8` after `<ScreenHeader>`.**
      `mt-12` is not the default; use only with a one-line PR
      justification. See `design-system.md` §2a.
- [ ] **Onboarding bottom CTA group uses
      `mt-auto flex flex-col gap-3 pt-8 pb-2`** with a primary + ghost
      stack. No bespoke `min-h-N max-h-N flex-grow` spacers, no fixed
      shim divs. See `design-system.md` §2a.
- [ ] **Trust microcopy uses
      `inline-flex items-center gap-2 text-label text-[var(--color-text-secondary)]`**
      with a 12px leading icon and no tracking override. See
      `design-system.md` §2a.
- [ ] **Inline divider labels use `<Eyebrow tone="secondary">`,**
      never a `<span>` with `text-micro` + manual tracking. See
      `design-system.md` §2a.
- [ ] **Icon chips inside cards use `<IconTile size={N}>`,** never a
      hand-rolled `rounded-2xl` chip. See `design-system.md` §2a.

---

## After coding

- [ ] Run `npm run build`. Fix every error and warning.
- [ ] Run `npm run check:design-system`. Fix every error-severity finding.
      Warnings (heuristic / convention) should be reviewed but are
      non-blocking.
- [ ] Before merge, run `npm run check:design-system:strict`. This exits
      non-zero on any error and is intended for CI gating once wired up.
      Strict mode treats warnings as informational.
- [ ] Open the page at **375px** in DevTools — content fits, no
      horizontal scroll, nothing overlaps the home-indicator safe area.
- [ ] Open the page at **1280px** — column caps at 430px, centred,
      aurora background extends to the viewport edges.
- [ ] **Keyboard tab** — every interactive element shows the navy focus
      ring. Tab order matches reading order.
- [ ] **Reduced motion** — DevTools "Emulate prefers-reduced-motion: reduce"
      → no animations longer than instant.
- [ ] **Browser zoom at 125% and 150%** — layout still fits at 375px
      viewport, no horizontal scroll, no clipped text. Type-role
      utilities scale automatically; inline `text-[NNpx]` does not.
- [ ] **Reduce Transparency** — DevTools "Emulate
      prefers-reduced-transparency: reduce" → glass surfaces flatten to
      solid mist; aurora dims; borders gain visible steel; layout and
      content unchanged.
- [ ] **Increase Contrast** — DevTools "Emulate prefers-contrast: more"
      → secondary / muted text darkens; borders darken; focus ring
      grows to 3px. Layout unchanged.
- [ ] **Forced Colors** — DevTools "Emulate forced-colors: active" (or
      enable Windows High Contrast) → card borders paint via CanvasText;
      focus rings via Highlight; Toggle track + knob have visible 1px
      borders.
- [ ] **Touch targets ≥ 44×44** — buttons, links, switches, back chip.
- [ ] **Voice over a switch** — announces switch role + on/off state.
- [ ] **No inline hex** anywhere in the new JSX.
- [ ] **No inline shadow literals** (e.g. `shadow-[0_8px_32px…]`).
- [ ] **No duplicated card chrome** — grep your diff for
      `rounded-[var(--radius-panel)] border` outside `Card.tsx`. If you find
      it elsewhere, refactor onto `<Card>`.
- [ ] **No bespoke switches** — every `role="switch"` element is the
      `<Toggle>` component.
- [ ] **No off-scale spacing** (e.g. `mt-[27px]`).
- [ ] **No `!important`** unless you wrote a brief note on why.
- [ ] **No `console.log`** left in.
- [ ] Update the navigation table in `design-system.md` if a new route
      was added.
- [ ] Summarise files created + changed for the user. Do not commit.

---

## Content weight (every screen)

- [ ] **The screen's main heading is readable in under 2 seconds.**
      Read it aloud — if you stumble or pause, shorten it.
- [ ] **The primary action is obvious without reading the body.** A
      tired traveller should know what to tap from the CTA label alone.
- [ ] **No paragraph is longer than necessary.** Cut every word that
      doesn't change the reader's next action. If a card body runs to
      three lines at 13px, rewrite — don't expand the card.
- [ ] **No marketing puff.** Grep your diff for "premium",
      "seamless", "best-in-class", "elevate", "revolutionary",
      "experience". If you find any, rewrite the line.
- [ ] **No anxiety-heavy wording.** No "Hurry!", "Last chance!",
      exclamation marks in body copy. Urgency comes from the timing,
      not the punctuation.
- [ ] **Status copy follows the patterns in
      [`content-guide.md`](./content-guide.md) §3.** Pill says the
      fact, supporting line carries the detail or action.
- [ ] **Errors follow the calm-title + 1-line-context + verb-first-retry
      pattern (§4).** No raw codes, no "Something went wrong."
- [ ] **Empty states are invitations, not apologies (§5).** Title is
      present tense; CTA is the next step.
- [ ] **Time, distance, and airport formats match §6.** `14:15`,
      `40 min`, `420 m`, `Gate D73`, `YVR → SFO`. Mixed formats are
      a bug.

## Sanity questions to ask before declaring done

1. If a tired traveller sees this screen for the first time, can they tell
   what to do in 2–3 seconds?
2. Could a second screen reuse half of what I just wrote without copy-pasting?
3. Does this screen feel like the previous YVR screens, or like a different app?
4. Is there anything I would feel embarrassed about if a senior designer
   audited the file tomorrow?
5. Could every line of copy survive a content audit against
   [`content-guide.md`](./content-guide.md)? If a single line would get
   flagged, fix it now.

If any answer is no, fix it before reporting done.
