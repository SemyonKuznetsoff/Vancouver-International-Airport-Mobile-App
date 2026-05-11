# Screen Build Checklist

Run through this list **before**, **during**, and **after** every new screen.
If any box can't be ticked, the screen is not ready to ship.

---

## Before coding

- [ ] Inspect the Figma frame via the MCP `get_design_context`.
- [ ] Skim [`design-system.md`](./design-system.md) for the relevant
      typography / color / spacing / component sections.
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

## During coding

- [ ] Wrap the screen in `<AppShell>`. Never reinvent the shell.
- [ ] Use `<ScreenHeader>` for any non-root screen (back + step label).
- [ ] Use `<Heading size="display">` or `<Heading size="title">`. Never
      override the heading size with `!important`.
- [ ] Use `<Eyebrow>` for uppercase labels.
- [ ] Use `<Card>` for any glass card chrome. No inline `bg-white/40 +
      border + shadow` combinations.
- [ ] Use `<Button>` for every CTA. Use `variant="primary"` for the one
      main action, `variant="ghost"` for the secondary text link.
- [ ] Use token classes for color and shadow:
      `text-[var(--color-text-primary)]`, not raw hex.
      `shadow-[var(--shadow-card)]`, not custom shadow values.
      For the glass card fill use `bg-[var(--color-surface-card)]`, never
      `bg-white/40`.
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

---

## After coding

- [ ] Run `npm run build`. Fix every error and warning.
- [ ] Open the page at **375px** in DevTools — content fits, no
      horizontal scroll, nothing overlaps the home-indicator safe area.
- [ ] Open the page at **1280px** — column caps at 430px, centred,
      aurora background extends to the viewport edges.
- [ ] **Keyboard tab** — every interactive element shows the navy focus
      ring. Tab order matches reading order.
- [ ] **Reduced motion** — DevTools "Emulate prefers-reduced-motion: reduce"
      → no animations longer than instant.
- [ ] **Voice over a switch** — announces switch role + on/off state.
- [ ] **No inline hex** anywhere in the new JSX.
- [ ] **No inline shadow literals** (e.g. `shadow-[0_8px_32px…]`).
- [ ] **No off-scale spacing** (e.g. `mt-[27px]`).
- [ ] **No `!important`** unless you wrote a brief note on why.
- [ ] **No `console.log`** left in.
- [ ] Update the navigation table in `design-system.md` if a new route
      was added.
- [ ] Summarise files created + changed for the user. Do not commit.

---

## Sanity questions to ask before declaring done

1. If a tired traveller sees this screen for the first time, can they tell
   what to do in 2–3 seconds?
2. Could a second screen reuse half of what I just wrote without copy-pasting?
3. Does this screen feel like the previous YVR screens, or like a different app?
4. Is there anything I would feel embarrassed about if a senior designer
   audited the file tomorrow?

If any answer is no, fix it before reporting done.
