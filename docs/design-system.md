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

The scale is mirrored as CSS variables in `globals.css` so new components
and primitives can consume tokens directly instead of memorising Tailwind
step numbers.

| px | Token | Tailwind | Use for |
|---|---|---|---|
| 4 | `--space-1` | `gap-1` | icon ↔ adjacent text label |
| 8 | `--space-2` | `gap-2` | tight related items in a row |
| 12 | `--space-3` | `gap-3` | stacked sibling cards |
| 16 | `--space-4` | `gap-4` | internal card spacing between text blocks |
| 20 | `--space-5` | `p-5` | compact card padding |
| 24 | `--space-6` | `px-6` / `gap-6` | page horizontal gutter, generous card padding |
| 32 | `--space-8` | `mt-8` / `gap-8` | between major sections |
| 40 | `--space-10` | `mt-10` | hero-to-content rhythm |
| 48 | `--space-12` | `mt-12` | extra hero rhythm on step screens |
| 64 | `--space-16` | `mt-16` | rarely; use sparingly for vertical drama |

Either form is accepted: `gap-3`, `gap-[var(--space-3)]`, and
`gap-[12px]` all resolve to the same gap. New primitives should prefer
the token form (`gap-[var(--space-3)]`) so a future scale retune flows
through one source of truth.

**Forbidden:** 17, 22 (except `--radius-panel`), 23, 26 (except toggle
height), 27, 29, 31. Any pixel-perfect Figma value that breaks this scale
must be flagged in the PR description.

---

## 4. Typography scale

Family: **Plus Jakarta Sans**, loaded via `next/font/google` in
`src/app/layout.tsx`. Weights: 400 / 500 / 600 / 700, plus italic.

Typography is two-tier like color:

- **Primitive numeric scale** lives in `--font-size-100` … `--font-size-700`
  and `--font-weight-regular/medium/semibold/bold`.
- **Semantic roles** (`--text-display`, `--text-body`, etc.) reference the
  numeric scale plus role-specific line-height and tracking.

Components consume only the semantic roles via the Tailwind utilities
`text-display`, `text-title`, `text-body`, `text-body-sm`, `text-label`,
`text-eyebrow`, `text-micro`. Never reach for `--font-size-400` directly
in a component, and never author `text-[34px] leading-[1.05]` clusters.

### Numeric type scale

| Step | Value | Currently used by |
|---|---|---|
| `--font-size-100` | 10px | `--text-micro` |
| `--font-size-200` | 11px | `--text-label`, `--text-eyebrow` |
| `--font-size-300` | 13px | `--text-body-sm` |
| `--font-size-400` | 14px | `--text-body` |
| `--font-size-500` | 15px | inline only (card title, primary button) |
| `--font-size-600` | 30px | `--text-title` |
| `--font-size-700` | 34px | `--text-display` |

### Numeric weights

| Token | Value | Used in |
|---|---|---|
| `--font-weight-regular` | 400 | body text |
| `--font-weight-medium` | 500 | emphasised body, button labels |
| `--font-weight-semibold` | 600 | headings, micro-labels |
| `--font-weight-bold` | 700 | reserved for future emphasis |

### Emphasis-pair tokens

For each text role with an "emphasised" variant, two paired weight tokens
exist. Use them when a component needs to draw a regular/emphasised pair
without hard-coding weights:

| Role pair | Regular | Emphasised |
|---|---|---|
| Body | `--text-body-weight` (400) | `--text-body-emphasis-weight` (500) |
| Label | `--text-label-weight` (400) | `--text-label-emphasis-weight` (600) |
| Caption | `--text-caption-weight` (400) | `--text-caption-emphasis-weight` (600) |

### Semantic roles

| Role | Token / Utility | Size / LH | Weight | Tracking | Used by |
|---|---|---|---|---|---|
| Display heading (hero) | `--text-display` / `text-display` | 34 / 1.05 | 600 | -0.025em | `<Heading size="display">` |
| Screen title | `--text-title` / `text-title` | 30 / 1.1 | 600 | -0.025em | `<Heading size="title">` |
| Body | `--text-body` / `text-body` | 14 / 1.55 | 400 | 0 | screen body copy |
| Body small (card text) | `--text-body-sm` / `text-body-sm` | 13 / 1.55 | 500 | 0 | inside `<Card>` |
| Label / caption | `--text-label` / `text-label` | 11 / 1.5 | 400 | 0 | metadata, captions |
| Eyebrow | `--text-eyebrow` / `text-eyebrow` | 11 / 1.5 | 400 | +0.22em uppercase | `<Eyebrow>` |
| Micro-label (uppercase) | `--text-micro` / `text-micro` | 10 / 1.5 | 600 | +0.16em uppercase | card footer labels |

Composed sizes that don't fit a single role yet:

| Role | Size / LH | Weight | Tracking | Notes |
|---|---|---|---|---|
| Section title (in-card) | 15 / 1.4 | 600 | 0 | use `<h2>` + `text-[15px] font-semibold` until promoted to a token |
| Card title | 15 / 1.4 | 600 | 0 | inside `<Card>` |
| Button (primary) | 15 / 1 | 500 | 0 | `<Button variant="primary">` |
| Button (ghost) | 13 / 1.5 | 500 | +0.025em | `<Button variant="ghost">` |
| Metadata / caption | 11 / 1.5 | 400 | +0.025em | small grey notes |

Italic accent: render via `<em>` inside `<Heading>`. The Heading component
maps `[&_em]` to `font-normal italic`, which also resets the role token's
600 weight. One italic phrase per screen, max.

**Body min:** 13px. Below that, the text is metadata — keep it short and
high-contrast.

> `FeatureList` currently uses 14 / 1.5 and 13 / 1.5 line-heights —
> slightly tighter than the body / body-sm role tokens. It is intentionally
> not refactored onto the role tokens until its rhythm is reconciled.

---

## 5. Color system

Tokens are organised in **two tiers**:

- **Primitive tokens** are raw scale values (`--navy-900`, `--mist-100`,
  `--white-a40`, etc.). They are the palette underneath the design — useful
  for re-mapping themes, but **never consumed by components**.
- **Semantic tokens** are component-facing roles (`--color-text-primary`,
  `--color-surface-card`, `--color-action-primary`). They reference
  primitives. Components consume semantic tokens only.

Editing rules:

- Need a different brand hue? Edit the primitive scale.
- Need a role to reference a different shade? Edit the semantic mapping.
- Adding a new role? Add it in the semantic block; do not hard-code hex.

Components must **never** reference a primitive directly (`--navy-900`
inside a className is a violation — use `--color-text-primary`). The lint
heuristic: if you see `--navy-`, `--steel-`, `--mist-`, `--teal-`,
`--aurora-*-`, `--success-`, `--warning-`, `--danger-`, `--info-`,
`--neutral-`, `--white-a*`, or `--black-a*` inside a `.tsx` file, refactor
it onto a semantic token.

### Primitive color scales

| Scale | Anchor used by | Notes |
|---|---|---|
| `--navy-{50..900}` | `--navy-900` → `--color-text-primary`, `--color-action-primary` | Dark brand navy. |
| `--steel-{50..900}` | `--steel-500` → `--color-text-muted`; `--steel-700` → `--color-text-secondary` | Mid-saturation supporting blue. |
| `--mist-{50..900}` | `--mist-100` → `--color-bg`, `--color-surface` | Cool pale surface. |
| `--teal-{50..900}` | (forward-looking; no current semantic) | Brand-aligned action / highlight accent. |
| `--aurora-sky-{50..900}` | `--aurora-sky-300` → `--color-aurora-sky` | Aurora gradient hue. |
| `--aurora-lavender-{50..900}` | `--aurora-lavender-200` → `--color-aurora-lavender` | Aurora gradient hue. |
| `--aurora-mint-{50..900}` | `--aurora-mint-400` → `--color-aurora-mint` | Aurora gradient hue. |
| `--success-{50..900}` | `--success-600` → `--color-success` | Live data status. |
| `--warning-{50..900}` | `--warning-500` → `--color-warning` | Live data status. |
| `--danger-{50..900}` | `--danger-500` → `--color-danger` | Live data status. |
| `--info-{50..900}` | `--info-500` → `--color-info` | Forward-looking — no current consumer. |
| `--neutral-{0,50..900,1000}` | `--neutral-0` → `--color-text-inverse`, `--color-action-primary-fg` | Achromatic anchors. |

### Primitive alpha layers

| Token | Value | Used in |
|---|---|---|
| `--white-a05` … `--white-a80` | `rgba(255,255,255, 0.05…0.8)` | Glass surface fills, hover/press tints. |
| `--black-a10` … `--black-a50` | `rgba(0,0,0, 0.1…0.5)` | Shadow composition. `--black-a18` is used by `--shadow-toggle`. |

### Semantic — Surface

| Token | Maps to | Usage |
|---|---|---|
| `--color-bg` | `--mist-100` | App background base (under aurora). |
| `--color-surface` | `--mist-100` | Generic surface. Alias of `--color-bg`. |
| `--color-surface-elevated` | `--white-a60` | Chips, icon tiles, secondary buttons. |
| `--color-surface-overlay` | `--white-a50` | Lower-opacity overlay layer. |
| `--color-surface-card` | `--white-a40` | Glass card fill. Consume via `bg-[var(--color-surface-card)]` — never `bg-white/40`. |
| `--color-surface-hover` | `--white-a30` | Hover tint on translucent rows (e.g. `AuthOption`). |
| `--color-surface-pressed` | `--white-a40` | Pressed tint on translucent rows. |

### Semantic — Text

| Token | Maps to | Usage |
|---|---|---|
| `--color-text-primary` | `--navy-900` | Headings, primary body, action labels. |
| `--color-text-secondary` | `--steel-700` | Supporting copy, captions. |
| `--color-text-muted` | `--steel-500` | Hints, disabled labels, watermark text. |
| `--color-text-inverse` | `--neutral-0` | Text on the navy primary button. |

### Semantic — Border

| Token | Maps to | Usage |
|---|---|---|
| `--color-border` | `--white-a60` | Card borders, hairlines on glass. |
| `--color-border-soft` | `--white-a40` | Subtler internal dividers. |
| `--color-border-hairline` | `--white-a60` | Legacy alias of `--color-border`. Prefer `--color-border`. |

### Semantic — Action

| Token | Maps to | Usage |
|---|---|---|
| `--color-action-primary` | `--navy-900` | Filled CTA, switch track ON. |
| `--color-action-primary-fg` | `--neutral-0` | Foreground on filled CTA. |

### Semantic — Status

| Token | Maps to | Usage |
|---|---|---|
| `--color-success` | `--success-600` | On-time, gate open, success toasts. |
| `--color-warning` | `--warning-500` | Boarding soon, tight connection. |
| `--color-danger` | `--danger-500` | Delayed, gate change, alert toasts. |
| `--color-info` | `--info-500` | Neutral informational state. Forward-looking; no consumer yet. |

### Semantic — Control

| Token | Built from | Usage |
|---|---|---|
| `--color-track-off` | `color-mix(--steel-700 40%, transparent)` | Toggle track in the OFF state. |

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

`<Card>` is the **single source** of the standard elevated glass surface.
Any glass card chrome anywhere in the app — fill, border, radius, shadow —
comes from this component. Other primitives (e.g. `AuthOptionGroup`,
`PermissionCard`) compose Card; they never re-author the chrome.

### Standard glass card

```tsx
<Card>
  <h2>...</h2>
  <p>...</p>
</Card>
```

- Background: `var(--color-surface-card)` (`rgba(255,255,255,0.4)`)
- Border: `1px solid var(--color-border)`
- Radius: `var(--radius-panel)` → 22px
- Shadow: `var(--shadow-card)`
- Padding: 20px (`p-5`) default. Use `padding="compact"` (16px) for dense
  lists, `padding="lg"` (24px) for hero cards, or `padding="none"` when
  children own their own padding.

### Padding variants

| Variant | px | When to use |
|---|---|---|
| `none` | 0 | Children own padding (rows, tabbed panels, AuthOptionGroup). |
| `compact` | 16 | Dense lists, secondary cards. |
| `default` | 20 | Most informational cards. |
| `lg` | 24 | Hero / spotlight cards. |

### Composing layout concerns

Extra layout needs (`overflow-hidden`, divider selectors, custom max-width)
flow in via Card's `className`. That keeps the chrome canonical and the
composition explicit:

```tsx
<Card
  padding="none"
  className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border)]"
>
  {/* rows */}
</Card>
```

### Do

```tsx
// ✅ One glass surface, one primitive.
<Card>…</Card>

// ✅ Composition for grouped rows.
<Card padding="none" className="overflow-hidden">
  <Row />
  <Row />
</Card>
```

### Don't

```tsx
// ❌ Re-authoring card chrome inline.
<div className="rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-white/40 shadow-[var(--shadow-card)] p-5">
  …
</div>

// ❌ Using bg-white/40 for the card fill.
<Card className="bg-white/40">…</Card> // there is a token: --color-surface-card

// ❌ Inventing a one-off shadow.
<div className="shadow-[0_8px_32px_0_rgba(0,0,0,0.07)]">…</div>
```

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

The `<Toggle>` component is the single source of switch chrome. Use it for
every on/off setting across the app — permissions, notification preferences,
accessibility toggles. Never roll a bespoke switch.

**Anatomy**

- Track: 44×26, rounded full.
- Knob: 20×20, white, `--shadow-toggle` drop, translates 18px between off
  (left, 3px from edge) and on (right, 21px from edge).
- Track ON: `--color-action-primary`. Track OFF: `--color-text-secondary` @ 40%.
- Hit area: extended to 44×44 via a transparent `::before` pseudo-element so
  the visible chrome stays compact while the tap target meets the 44px floor.
  No layout impact.
- Disabled: `opacity-50 pointer-events-none` plus the native `disabled` attr.

**API**

```tsx
<Toggle
  checked={on}
  onChange={setOn}
  ariaLabel="Notifications"
  disabled={false}
/>
```

Controlled only — the parent owns state. `aria-label` is required so screen
readers can identify the switch without a visible label.

**A11y**

- `role="switch"`, `aria-checked={checked}`, `aria-label` are all set by the
  component.
- Focus is handled globally via `:focus-visible` in `globals.css`.
- Motion (`transition-colors`, `transition-transform`) is short-lived and
  honours the global `prefers-reduced-motion: reduce` cutoff.

**Do**

```tsx
<Toggle checked={notifications} onChange={setNotifications} ariaLabel="Notifications" />
```

**Don't**

```tsx
// ❌ Bespoke <button role="switch">
<button role="switch" aria-checked={on} onClick={() => setOn(!on)} className="…">…</button>

// ❌ Native checkbox styled to look like a switch
<input type="checkbox" className="appearance-none w-11 h-[26px] rounded-full" />
```

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

## 10a. Opacity & alpha tokens

Scalars used for interaction states and color composition. They live in
`globals.css` and exist so that inline patterns like `bg-white/40`,
`hover:bg-white/30`, `text-secondary/40`, and `opacity-50` stop drifting
into screens unchecked.

### State-opacity scalars

| Token | Value | Use |
|---|---|---|
| `--opacity-disabled` | `0.5` | Disabled state on any interactive primitive (`opacity-[var(--opacity-disabled)]`). |
| `--opacity-muted` | `0.6` | Visually quieter content that is still legible. |
| `--opacity-hover` | `0.7` | Reserved for hover dim where a surface-tint isn't appropriate. |
| `--opacity-pressed` | `0.9` | Active/pressed dim. Matches Button's `active:opacity-90`. |
| `--opacity-overlay` | `0.5` | Default modal / sheet backdrop dim. |

### Composition-alpha scalars

| Token | Value | Used by |
|---|---|---|
| `--alpha-track-off` | `0.4` | Toggle off-state (via `--color-track-off`). |
| `--alpha-border-soft` | `0.4` | Soft border surfaces (via `--color-border-soft`). |
| `--alpha-surface-card` | `0.4` | Glass card fill (via `--color-surface-card`). |

These compose with semantic colors instead of being applied as inline
opacity modifiers. The pattern is to derive a new semantic color (e.g.
`--color-track-off`) using the alpha scalar plus a primitive — never to
write `bg-[var(--color-text-secondary)]/40` in a component.

### What to use instead of inline opacity

| ❌ Inline | ✅ Semantic |
|---|---|
| `bg-white/40` | `bg-[var(--color-surface-card)]` |
| `bg-white/30 hover state` | `bg-[var(--color-surface-hover)]` |
| `bg-white/40 active state` | `bg-[var(--color-surface-pressed)]` |
| `bg-[var(--color-text-secondary)]/40` | `bg-[var(--color-track-off)]` |
| `opacity-50` (disabled) | `opacity-[var(--opacity-disabled)]` |

---

## 10b. Blur tokens

Backdrop-blur values for future glass / overlay effects. **No current
screen applies backdrop blur** — the aurora aesthetic is achieved with
radial gradients, per CLAUDE.md. These tokens exist so that when sheets
or modals are introduced, their blur values stay consistent.

| Token | Value | Use |
|---|---|---|
| `--blur-none` | `0` | Default. |
| `--blur-card` | `8px` | Subtle frost behind a card if ever introduced. |
| `--blur-overlay` | `12px` | Sheet / modal backdrop. |
| `--blur-heavy` | `24px` | Hero / focus overlay. |

Apply via `backdrop-filter: blur(var(--blur-overlay))` or the Tailwind
arbitrary-value form. Live `filter: blur` on content is still forbidden
(see CLAUDE.md §14).

---

## 10c. Elevation scale

Shadows are organised as a 5-step elevation scale. The component-facing
shadow tokens (`--shadow-card`, `--shadow-panel`) map onto the scale;
`--shadow-button` and `--shadow-toggle` stay as component-specific values
because their colour cast (navy / black) differs from the elevation
shadows (cool indigo).

| Level | Token | When to use |
|---|---|---|
| 0 | `--shadow-elevation-0` (`none`) | Flat surface. No lift. |
| 1 | `--shadow-elevation-1` | Resting card (`--shadow-card` maps here). |
| 2 | `--shadow-elevation-2` | Lifted interactive card — hover/focus lift. Forward-looking; no current consumer. |
| 3 | `--shadow-elevation-3` | Sheet, modal, dialog (`--shadow-panel` maps here). |
| 4 | `--shadow-elevation-4` | Toast, popover. Forward-looking; no current consumer. |

Component-shadow tokens:

| Token | Maps to / value | Used by |
|---|---|---|
| `--shadow-card` | `--shadow-elevation-1` | `Card`. |
| `--shadow-panel` | `--shadow-elevation-3` | Future sheets / modals. |
| `--shadow-button` | `0 6px 18px -8px rgba(29,53,87,0.45)` | `Button` (navy-tinted lift). |
| `--shadow-toggle` | `0 2px 6px 0 var(--black-a18)` | `Toggle` knob. |

Components must consume the component-facing shadow tokens, not the raw
elevation primitives. Pick `--shadow-card` for a card body, not
`--shadow-elevation-1`.

---

## 11. Motion tokens

Motion tokens live in `globals.css` and exist so future transitions, sheets,
toasts, and overlays share one rhythm. New transitions should consume these
tokens via `duration-[var(--duration-fast)]` and
`[transition-timing-function:var(--ease-standard)]`. Existing
`duration-150` instances in `Button`, `AuthOption`, and the
`PermissionCard` toggle are not on the scale and are left in place until
revisited.

| Token | Value | Use |
|---|---|---|
| `--duration-instant` | `100ms` | Hover / press feedback. |
| `--duration-fast` | `180ms` | Default UI transition (color, fade). |
| `--duration-base` | `240ms` | Sheets, drawers, expanding rows. |
| `--duration-slow` | `320ms` | Hero / page-level transitions. |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default entry / exit. |
| `--ease-emphasis` | `cubic-bezier(0.3, 0, 0.1, 1)` | Emphasised entry. |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Quick fade-out / dismissal. |

All new motion must still respect the global
`prefers-reduced-motion: reduce` cutoff in `globals.css`.

---

## 12. Z-index scale

A small, fixed stack. Use these tokens (or their numeric values) for
anything that creates a stacking layer; never invent ad-hoc `z-50` style
values. Nothing in onboarding currently needs anything beyond
`--z-base`.

| Token | Value | Use |
|---|---|---|
| `--z-base` | `0` | Default in-flow content. |
| `--z-sticky` | `10` | Sticky headers, pinned bottom CTAs. |
| `--z-overlay` | `100` | Dimmers, scrims behind sheets. |
| `--z-modal` | `1000` | Bottom sheets, modals, dialogs. |
| `--z-toast` | `2000` | Toasts and snackbars. |

---

## 13. Foundation refactor rules

Foundation work upgrades tokens, primitives, and conventions **without
visibly changing existing screens.**

- Existing onboarding screens (`/`, `/onboarding/sign-in`,
  `/onboarding/permissions`) must look pixel-identical before and after a
  foundation refactor. If a token swap would shift a pixel, defer the
  refactor and document why.
- New components and primitives **must consume tokens** (color, spacing,
  type role, shadow, radius, motion) instead of arbitrary values like
  `bg-white/40`, `shadow-[0_8px_…]`, `mt-[27px]`, or
  `text-[34px] leading-[1.05]`.
- Refactor opportunistically: when you touch a component for another
  reason, migrate its inline literals onto tokens — but only if the
  visual output is identical. Never bundle a visual change with a
  token migration; ship them in separate PRs so regressions are
  attributable.
- If a token does not yet exist for the value you need, add the token in
  this doc and `globals.css` first, then consume it.

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
| `AuthOption` / `AuthOptionGroup` | `src/components/AuthOption.tsx` | Auth provider rows. Group composes `Card`. |
| `PermissionCard` | `src/components/PermissionCard.tsx` | Permission card. Uses `Toggle` for the switch. |
| `Toggle` | `src/components/Toggle.tsx` | Reusable accessible switch. Use for any on/off setting. |
| `icons` | `src/components/icons.tsx` | Inline SVG icons + brand marks. |

---

## Appendix B — Adding a new primitive

1. Propose it here first (3 lines: what, where used, what tokens).
2. Confirm with the user before writing JSX.
3. Add the component to `src/components/` with one tight responsibility.
4. Document it under "Components inventory" above.
5. Use only tokens — no inline hex, no off-scale spacing, no custom shadows.
