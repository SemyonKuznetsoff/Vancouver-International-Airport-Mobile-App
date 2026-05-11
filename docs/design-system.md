# YVR Concierge — Design System

The single source of truth for the YVR app's visual language. If this doc
disagrees with the code, the doc wins — fix the code.

> Companion docs: [`CLAUDE.md`](../CLAUDE.md) for AI workflow rules,
> [`screen-build-checklist.md`](./screen-build-checklist.md) for per-screen
> verification.

---

## 1. Brand feel

- Premium **airport concierge**, not a generic travel app.
- Calm, quiet, clear. The UI should feel like a hushed lounge, not a gate
  announcement.
- Built for fast scanning under stress (carrying bags, watching a clock).
- Low cognitive load: one main action per screen, supporting info muted.
- Practical airport utility — every screen answers "what now?".

---

## 2. Layout system

- **Mobile-first.** All designs start at the 375px reference width.
- Content column caps at **430px** on larger viewports.
- The shell is `AppShell` — wraps every screen, hosts the aurora background,
  applies safe-area insets.
- **No phone bezel** in production. The Figma frame's outer 50-radius shell,
  drop shadow, status bar, and home indicator are mockup chrome only.
- Page horizontal gutter: **24px** (`px-6`).
- Section vertical gap: **32px** (`mt-8`) between major blocks.
- Bottom CTA pinned with `mt-auto`. Internal CTA stack gap: 12px.

### Navigation graph

| from | back goes to | forward CTA goes to |
|---|---|---|
| `/` (Welcome) | n/a | `/onboarding/sign-in` |
| `/onboarding/sign-in` | `/` | `/onboarding/permissions` (guest) |
| `/onboarding/permissions` | `/onboarding/sign-in` | `/` (start app) |

When new routes are added, append rows to this table in the same PR.

---

## 3. Spacing scale

**Allowed values only:**

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64
```

| px | Tailwind | Use for |
|---|---|---|
| 4 | `gap-1` | icon ↔ adjacent text label |
| 8 | `gap-2` | tight related items in a row |
| 12 | `gap-3` | stacked sibling cards |
| 16 | `gap-4` | internal card spacing between text blocks |
| 20 | `p-5` | compact card padding |
| 24 | `px-6` / `gap-6` | page horizontal gutter, generous card padding |
| 32 | `mt-8` / `gap-8` | between major sections |
| 40 | `mt-10` | hero-to-content rhythm |
| 48 | `mt-12` | extra hero rhythm on step screens |
| 64 | `mt-16` | rarely; use sparingly for vertical drama |

**Forbidden:** 17, 22 (except `--radius-panel`), 23, 26 (except toggle
height), 27, 29, 31. Any pixel-perfect Figma value that breaks this scale
must be flagged in the PR description.

---

## 4. Typography scale

Family: **Plus Jakarta Sans**, loaded via `next/font/google` in
`src/app/layout.tsx`. Weights: 400 / 500 / 600 / 700, plus italic.

| Role | Size / LH | Weight | Tracking | Token / Component |
|---|---|---|---|---|
| Display heading (hero) | 34 / 1.05 | 600 | -0.025em | `<Heading size="display">` |
| Screen title | 30 / 1.1 | 600 | -0.025em | `<Heading size="title">` |
| Section title (in-card) | 15 / 1.4 | 600 | 0 | use `<h2>` + `text-[15px] font-semibold` |
| Card title | 15 / 1.4 | 600 | 0 | inside `<Card>` |
| Body | 14 / 1.55 | 400 | 0 | `<p>` |
| Body small (card text) | 13 / 1.55 | 500 | 0 | inside `<Card>` |
| Label | 11–12 / 1.5 | 400/500 | 0 | metadata, captions |
| Eyebrow | 11 / 1.5 | 400 | +0.22em uppercase | `<Eyebrow>` |
| Button (primary) | 15 / 1 | 500 | 0 | `<Button variant="primary">` |
| Button (ghost) | 13 / 1.5 | 500 | +0.025em | `<Button variant="ghost">` |
| Metadata / caption | 11 / 1.5 | 400 | +0.025em | small grey notes |
| Micro-label (uppercase) | 10 / 1.5 | 600 | +0.16em uppercase | card footer labels |

Italic accent: render via `<em>` inside `<Heading>`. The Heading component
maps `[&_em]` to `font-normal italic`. One italic phrase per screen, max.

**Body min:** 13px. Below that, the text is metadata — keep it short and
high-contrast.

---

## 5. Color system

Use **semantic tokens**, not raw hex. All tokens live in `src/app/globals.css`
under the `@theme` block.

### Surface

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#e2eef0` | App background base (under aurora). |
| `--color-surface` | `#e2eef0` | Generic surface. Alias of `--color-bg`. |
| `--color-surface-elevated` | `rgba(255,255,255,0.6)` | Chips, icon tiles, secondary buttons. |
| `--color-surface-overlay` | `rgba(255,255,255,0.5)` | Lower-opacity overlay layer. |

### Text

| Token | Value | Usage |
|---|---|---|
| `--color-text-primary` | `#1d3557` | Headings, primary body, action labels. |
| `--color-text-secondary` | `#3a6a8a` | Supporting copy, captions. |
| `--color-text-muted` | `#6d8aa3` | Hints, disabled labels, watermark text. |
| `--color-text-inverse` | `#ffffff` | Text on the navy primary button. |

### Border

| Token | Value | Usage |
|---|---|---|
| `--color-border` | `rgba(255,255,255,0.6)` | Card borders, hairlines on glass. |
| `--color-border-soft` | `rgba(255,255,255,0.4)` | Subtler internal dividers. |
| `--color-border-hairline` | `rgba(255,255,255,0.6)` | Legacy alias of `--color-border`. Prefer `--color-border`. |

### Action

| Token | Value | Usage |
|---|---|---|
| `--color-action-primary` | `#1d3557` | Filled CTA, switch track ON. |
| `--color-action-primary-fg` | `#ffffff` | Foreground on filled CTA. |

### Status

| Token | Value | Usage |
|---|---|---|
| `--color-success` | `#0a8754` | On-time, gate open, success toasts. |
| `--color-warning` | `#c97a16` | Boarding soon, tight connection. |
| `--color-danger` | `#b3261e` | Delayed, gate change, alert toasts. |

> Status colors are reserved for **live data states only**. Never use them
> as decoration.

### Aurora accents (background-only)

| Token | Value |
|---|---|
| `--color-aurora-sky` | `#8ec5ff` |
| `--color-aurora-lavender` | `#dab2ff` |
| `--color-aurora-mint` | `#46ecd5` |

### Focus

| Token | Value | Usage |
|---|---|---|
| `--focus-ring` | `2px solid #1d3557` | Applied globally via `:focus-visible`. |

---

## 6. Cards

The `<Card>` primitive owns the glass card chrome. Compose content inside.

### Standard glass card

```tsx
<Card>
  <h2>...</h2>
  <p>...</p>
</Card>
```

- Background: `rgba(255,255,255,0.4)`
- Border: `1px solid var(--color-border)`
- Radius: `var(--radius-panel)` → 22px
- Shadow: `var(--shadow-card)`
- Padding: 20px (`p-5`) default. Override via `padding="lg"` for hero cards.

### Variants

| Variant | When to use |
|---|---|
| `default` | Most informational cards. |
| `compact` | Inside dense lists (16px padding instead of 20). |
| `interactive` | Hover/active feedback for tappable cards. |

### Stacked card group

Use `flex flex-col gap-3` (12px between siblings).

### Specialised cards

| Component | Use case |
|---|---|
| `PermissionCard` | Single permission with title, body, footer label, toggle. |
| `AuthOptionGroup` + `AuthOption` | Stacked sign-in providers, dividers between. |
| `FeatureList` + `FeatureListItem` | Numbered feature rows with hairlines. |

### Content limits

- Card title: max **3 words**, max 1 line.
- Card body: max **2 lines** at 13px / 1.55. If it doesn't fit, the copy is
  too long — rewrite, don't expand the card.
- Footer micro-label: max **4 words**, uppercase, with a small mint dot.

---

## 7. Buttons

### Primary CTA — `<Button variant="primary">`

- Height: 54px.
- Width: 100% of parent.
- Radius: `var(--radius-pill)` (9999).
- Fill: `var(--color-action-primary)`.
- Text: 15px / Medium / white.
- Trailing icon optional (16px).
- One per screen. Lives at the bottom in a `mt-auto` block.

### Ghost / text link — `<Button variant="ghost">`

- Height: 44px (minimum tap target).
- Fill: transparent.
- Text: 13px / Medium / `--color-text-secondary`. Hover → `--color-text-primary`.
- Used for "I already have an account", "Not now", etc.

### Card row action — `<AuthOption>`

- Height: 58px row inside a glass card group.
- Leading 18–22px icon, label, optional small badge, trailing chevron.
- The whole row is a `<button>`.

### Icon button (e.g. back, close)

- Size: 44×44 minimum tap target.
- Visible chip: 36–44px circular, `--color-surface-elevated` background.
- Inner icon: 16px.
- Always pair with `aria-label`.

### Toggle (switch)

- Track: 44×26, rounded full.
- Knob: 20×20, white, `--shadow-button` style drop.
- Track ON: `--color-action-primary`. Track OFF: `--color-text-secondary` @ 40%.
- Always `role="switch" aria-checked aria-label`.

### Disabled

`opacity-50 pointer-events-none`. No custom disabled colors yet.

---

## 8. Icons

All icons are inline SVGs in `src/components/icons.tsx`.

### Sizes

| Size | Use |
|---|---|
| 12 | Inside a 11–12px caption (e.g. lock before "Your location stays…"). |
| 14 | Inside a 28px brand chip. |
| 16 | Standard inline icon, primary CTA trailing arrow, back button. |
| 18 | Inside a 36–40px tile (auth row, permission card). |
| 20 | Aeroplan-style avatar badge. |
| 22 | Reserved for future bottom-nav glyphs. |
| 24 | Max inline size — hero / brand only. |

### Stroke

- Default stroke width: **1.75**.
- Stroke caps and joins: round.
- Color: `currentColor` — let the parent text color drive it.

### Brand / multicolour icons

`AppleIcon`, `GoogleIcon`, `AeroplanBadge` are exceptions to the stroke
rule — they keep brand colors. Replace with licensed assets before public
launch.

### When to add an icon

If a screen needs a new glyph, add it to `icons.tsx` with a stroked
`viewBox="0 0 24 24"` path. Do not import an external library or asset.

---

## 9. Content rules

- **One main idea per screen.** If a screen needs two, it should be two
  screens.
- **Headings:** max 2 lines, italic accent optional.
- **Body:** max 1–2 short lines per paragraph at this screen size.
- **Cards:** ≤ 2 lines body. Footer micro-label is the punctuation.
- **Action labels:** verb-first. "Begin your journey" > "Get started".
  "Continue with Apple" > "Sign in via Apple".
- **No marketing puff.** "A premium companion" got cut — kept the punchier
  "Flights, maps, gates, and alerts in one quiet place."
- **No repeated explanation** across cards. Each card says one new thing.
- **Plain airport language.** "Gate change", "boarding", "security wait",
  "wayfinding". Not "indoor positioning system" or "real-time intelligence".

---

## 10. Accessibility rules

- One `<h1>` per page. Subsequent titles use `<h2>` / `<h3>`.
- Semantic landmarks: `<header>`, `<main>`, `<section>`, `<article>`.
- Icon-only buttons / links: always `aria-label`.
- Toggles: `role="switch" aria-checked aria-label`.
- Focus is global in `globals.css` — don't override per-component.
- Reduced motion: animations cut to 0.001ms via `prefers-reduced-motion`
  media query. Keep new motion behind this guard.
- Tap targets ≥ 44×44. The 44px floor is enforced by Button height
  variants and ScreenHeader's back button.
- Contrast: primary text on aurora is 10:1; secondary is ~4.5:1. Keep
  secondary text **on the lighter aurora regions** when feasible.
- Line length: don't let body paragraphs exceed ~50 characters per line at
  375px — the `<p>` widths in `AppShell` already enforce this.
- Use `prefers-color-scheme` only when dark mode tokens exist (not yet).

---

## Appendix A — Components inventory

| Component | Source | Notes |
|---|---|---|
| `AppShell` | `src/components/AppShell.tsx` | Page shell + safe area + max-width. |
| `AuroraBackground` | `src/components/AuroraBackground.tsx` | Static radial-gradient aurora. |
| `ScreenHeader` | `src/components/ScreenHeader.tsx` | Back button + step label row. |
| `BrandMark` | `src/components/BrandMark.tsx` | Plane chip + "YVR Concierge" lockup. |
| `Eyebrow` | `src/components/Eyebrow.tsx` | Small uppercase label. |
| `Heading` | `src/components/Heading.tsx` | `display` / `title` sizes. |
| `Card` | `src/components/Card.tsx` | Glass card primitive. |
| `Button` | `src/components/Button.tsx` | `primary` / `ghost` variants. |
| `IconTile` | `src/components/IconTile.tsx` | Generic translucent chip. |
| `FeatureList` | `src/components/FeatureList.tsx` | Numbered feature rows. |
| `AuthOption` / `AuthOptionGroup` | `src/components/AuthOption.tsx` | Auth provider rows. |
| `PermissionCard` | `src/components/PermissionCard.tsx` | Permission + toggle card. |
| `icons` | `src/components/icons.tsx` | Inline SVG icons + brand marks. |

---

## Appendix B — Adding a new primitive

1. Propose it here first (3 lines: what, where used, what tokens).
2. Confirm with the user before writing JSX.
3. Add the component to `src/components/` with one tight responsibility.
4. Document it under "Components inventory" above.
5. Use only tokens — no inline hex, no off-scale spacing, no custom shadows.
