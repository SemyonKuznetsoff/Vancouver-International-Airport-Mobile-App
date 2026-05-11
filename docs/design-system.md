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

All type-size primitives are in **rem** so the entire type system scales
with the user's OS / browser font-size preference and with browser zoom.
At the default 16px root these resolve to the documented px values.

| Step | rem | Default px (16px root) | Currently used by |
|---|---|---|---|
| `--font-size-100` | `0.625rem` | 10 | `--text-micro` |
| `--font-size-200` | `0.6875rem` | 11 | `--text-label`, `--text-eyebrow` |
| `--font-size-300` | `0.8125rem` | 13 | `--text-body-sm` |
| `--font-size-400` | `0.875rem` | 14 | `--text-body` |
| `--font-size-500` | `0.9375rem` | 15 | inline only (card title, primary button) |
| `--font-size-600` | `1.875rem` | 30 | `--text-title` |
| `--font-size-700` | `2.125rem` | 34 | `--text-display` |

> New components should consume type **roles** (`text-body`, `text-title`,
> etc.) so they pick up the rem-based scale. Hard-coded `text-[14px]` in
> a component fixes the size in CSS pixels and breaks Dynamic Type.

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
| Button (secondary) | 14 / 1.55 | 500 | 0 | `<Button variant="secondary">` |
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
| `--color-info` | `--info-500` | Neutral informational state. |

### Semantic — Status surface trios

Each trio is consumed by `<InlineAlert>`, the `<ErrorState>` icon
accent, and future toast / banner work. **bg** is the solid panel fill,
**border** is a visible mid-tint, **fg** is the high-contrast on-bg
foreground colour used for both text and icon.

| Variant | `…-bg` | `…-border` | `…-fg` |
|---|---|---|---|
| Success | `--success-50` | `--success-300` | `--success-700` |
| Warning | `--warning-50` | `--warning-300` | `--warning-700` |
| Danger | `--danger-50` | `--danger-300` | `--danger-700` |
| Info | `--info-50` | `--info-300` | `--info-700` |
| Neutral | `--mist-50` | `--steel-300` | `--steel-700` |

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

### Button states (anatomy)

| State | Visible cue | A11y |
|---|---|---|
| Default | Filled pill (primary) / text-link (ghost). | — |
| Hover | Ghost: text-color shifts to primary. Primary: no hover. | — |
| Pressed | Primary: `opacity: 0.9` (`active:opacity-90`). | — |
| Focus-visible | Global navy 2px outline, 2px offset. | `:focus-visible` |
| Disabled | `opacity-[var(--opacity-disabled)]` + `cursor-not-allowed`. Renders the native `disabled` attribute on `<button>` or `aria-disabled="true"` + `tabIndex={-1}` on the link variant. | `disabled` / `aria-disabled` |
| Loading | Trailing icon replaced by `SpinnerIcon` (16px, three-quarter arc, rotates via `animate-spin`). Cursor becomes `progress`. Click is blocked. Optional `loadingLabel` replaces the visible label. Height unchanged. | `aria-busy="true"` |

**State precedence.** `disabled` + `loading` are independent props but
behave the same way for interaction: both block clicks via `disabled`
attribute (button branch) or `aria-disabled` + `event.preventDefault()`
(link branch). `loading` additionally announces `aria-busy`. When both
are set, `disabled` styling wins (full opacity-disabled dim) and
`aria-busy` is still announced.

### Button — controlled async usage

```tsx
const [submitting, setSubmitting] = useState(false);

<Button
  variant="primary"
  loading={submitting}
  loadingLabel="Signing in…"
  onClick={async () => {
    setSubmitting(true);
    try { await signIn(); } finally { setSubmitting(false); }
  }}
  trailingIcon={<ArrowRightIcon size={16} />}
>
  Continue
</Button>
```

The `loadingLabel` is optional. Without it, the original `children` stay
visible while the spinner trails — preferred for short labels where
swapping text would feel busier than the work itself.

### Secondary CTA — `<Button variant="secondary">`

- Height: 52px.
- Width: 100% of parent.
- Radius: `var(--radius-pill)` (9999).
- Fill: `var(--color-surface-elevated)` — translucent over the aurora.
- Border: `1px solid var(--color-border)`.
- Text: 14px / Medium / `var(--color-text-primary)`.
- Hover fill: `var(--color-surface-elevated-hover)`.
- Supports `leadingIcon` (16px) — e.g. `<Button variant="secondary" leadingIcon={<MailIcon size={16} />}>Sign in with email</Button>`.
- Inherits `loading` / `disabled` from the Button base.

**When to use.** The secondary CTA is for an action that is **a peer
alternative**, not the main path and not a text link — "Sign in with
email" next to a stack of Apple/Google/Aeroplan sign-in rows, "Add
another flight" next to "Add a flight", etc. It is visually heavier
than ghost (a real pill, not text-only) and lighter than primary (no
fill colour, no shadow).

**Do not create one-off pill buttons inside page files.** If a screen
needs a pill-shaped neutral action, use `<Button variant="secondary">`.
The hand-rolled email pill that used to live in
`onboarding/sign-in/page.tsx` was the original instance; it has now
been formalised into this variant.

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
  busy={false}
/>
```

Controlled only — the parent owns state. `aria-label` is required so screen
readers can identify the switch without a visible label.

### Toggle states (anatomy)

| State | Visible cue | A11y |
|---|---|---|
| Checked | Track fills with `--color-action-primary`; knob slides to right. | `aria-checked="true"` |
| Unchecked | Track fills with `--color-track-off`; knob sits left. | `aria-checked="false"` |
| Focus-visible | Global navy outline around the visible track. | `:focus-visible` |
| Disabled | `opacity-[var(--opacity-disabled)]`; native `disabled` blocks input. | `disabled` |
| Busy | `opacity-80` + `cursor: wait`. **Current `checked` value is preserved** — no optimistic flip. Click is ignored until `busy` returns to `false`. Layout and dimensions unchanged. Works in `prefers-reduced-motion: reduce` because no animation is used. | `aria-busy="true"` |

`disabled` and `busy` are independent; both block input. `disabled`
styling wins visually when both are true.

### Toggle — controlled async usage

```tsx
const [enabled, setEnabled] = useState(true);
const [pending, setPending] = useState(false);

<Toggle
  checked={enabled}
  busy={pending}
  ariaLabel="Notifications"
  onChange={async (next) => {
    setPending(true);
    try {
      await requestPermission();
      setEnabled(next);
    } finally {
      setPending(false);
    }
  }}
/>
```

Note: the value flip happens *after* the async work succeeds — busy keeps
the prior value visible so the UI doesn't promise a permission that may
yet be denied.

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

## 11. Motion

Motion is organised in two tiers, parallel to colour:

- **Primitive tokens** — raw durations, easings, spring approximations,
  distance values. Internal to the system.
- **Motion-role tokens** — semantic pairings used by components. Each
  role names *what is moving and why*, not how long it takes.

Components consume role tokens. The role itself decides the duration
and easing, so retuning the system means editing one token, not
auditing every component.

### Primitive — durations

| Token | Value | Use |
|---|---|---|
| `--duration-instant` | `100ms` | Press feedback, hover crossfade. |
| `--duration-fast` | `180ms` | Default UI transitions (colour, opacity), exits. |
| `--duration-base` | `240ms` | Element entries (cards, banners, sheets opening). |
| `--duration-slow` | `320ms` | Page-level transitions, hero transitions. |

### Primitive — easings

| Token | Curve | Use |
|---|---|---|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default entry / exit. |
| `--ease-emphasis` | `cubic-bezier(0.3, 0, 0.1, 1)` | Emphasised entry. |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Quick fade-out / dismissal. |
| `--ease-spring-snappy` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Strong overshoot — sheet detent snap, chip toggle. |
| `--ease-spring-gentle` | `cubic-bezier(0.25, 1.25, 0.5, 1)` | Subtle overshoot — favourite tap, micro pop. |
| `--ease-spring-stiff` | `cubic-bezier(0.5, 1.4, 0.4, 1)` | Tighter overshoot — drag release, quick recovery. |

> Bezier values outside the unit interval (the `1.56`, `1.25`, `1.4`
> y-components) produce overshoot — CSS-supported approximations of
> iOS UISpring. True spring physics (stiffness / damping parameters)
> requires the Web Animations API; reach for it when a CSS curve
> can't carry the intent.

### Primitive — transform distances

Slide-in / slide-out offsets. Under `prefers-reduced-motion: reduce`
all distance tokens collapse to `0px` automatically (see the media
query in `globals.css`). Any consumer that writes
`translateY(var(--motion-distance-md))` therefore degrades to a
fade-only transition for free.

| Token | Value | Use |
|---|---|---|
| `--motion-distance-xs` | `4px` | Subtle nudge — chip select. |
| `--motion-distance-sm` | `8px` | Small slide — toast entry. |
| `--motion-distance-md` | `16px` | Sheet entry, banner entry. |
| `--motion-distance-lg` | `24px` | Page-level slide. |

### Motion roles (semantic)

| Role | Duration token | Ease token | When |
|---|---|---|---|
| **micro** | `--motion-micro-duration` (100ms) | `--motion-micro-ease` | Button press feedback, toggle flip, chip tint change, tiny state flips. |
| **element** | `--motion-element-duration` (240ms) | `--motion-element-ease` | Card expand, list row reveal, inline alert entrance, badge appear. |
| **page** | `--motion-page-duration` (320ms) | `--motion-page-ease` | Route transition, full-screen modal, hero region change. |
| **overlay** | `--motion-overlay-duration` (240ms) | `--motion-overlay-ease` | Bottom sheet entry, dialog entry, toast entry. |
| **exit** | `--motion-exit-duration` (180ms) | `--motion-exit-ease` | Dismissal of any overlay / element. Exits are *always* faster than entries. |
| **spring-snappy** | n/a (gestural) | `--motion-spring-snappy` | Drag release snap to detent, chip toggle, sheet detent change. |
| **spring-gentle** | n/a (gestural) | `--motion-spring-gentle` | Favourite tap, micro pop confirmations. |
| **spring-stiff** | n/a (gestural) | `--motion-spring-stiff` | Quick drag-bounce, swipe-action snap. |

### Reduced-motion behaviour per role

The global `@media (prefers-reduced-motion: reduce)` rule does two
things:

1. Drops all `--motion-distance-*` tokens to `0px` — slide transforms
   resolve to no movement, leaving the opacity transition only.
2. Caps `animation-duration` and `transition-duration` on every
   element to `0.001ms` — a safety net for motion that bypassed the
   token system.

Per-role expectations under reduced motion:

| Role | Reduced-motion behaviour |
|---|---|
| **micro** | Becomes effectively **instant**. State flips with no transition. Press feedback still uses an opacity cue (no scale, no slide). |
| **element** | Crossfade only — distance is 0, so a sliding card-expand becomes a fade-in. Keep the opacity transition; the duration is then capped by the global cutoff. |
| **page** | **Avoid large movement** — fade-only between routes. If a slide is required for spatial orientation, keep it but use `--motion-distance-xs` so it's barely perceptible. |
| **overlay** | Fade in / out only; no slide-up from below, no spring. |
| **exit** | Same rule as entry — fade only. |
| **spring-* (gestural)** | **Snap without bounce.** Replace the spring ease with `--ease-standard`, or skip the animated phase entirely and jump to the final value. |
| **skeleton pulse** | Skeletons **stop pulsing** under the global cutoff — the block remains visible as a static placeholder. (Already handled.) |

Component authors building animations should wrap any motion-role
override that doesn't already flow through `--motion-distance-*` in
its own `@media (prefers-reduced-motion: reduce)` block.

### Migration status

Existing `transition-colors duration-150` instances in `Button`,
`AuthOption`, and `Toggle` are **not** on the new role scale (150ms
isn't a primitive). They stay in place until those components are
revisited; new components must consume role tokens from day one. Any
visual swap from `duration-150` to `--motion-micro-duration` (100ms)
would shift behaviour and is therefore deferred — never paired with a
foundation-only refactor.

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

## 12a. Accessibility modes

The default visual experience stays unchanged. Three OS-level preferences
re-map semantic tokens so the design works for users who need different
visual settings. All overrides live at the bottom of `globals.css` —
components do not branch on these modes; they consume semantic tokens
that change underneath them.

### Dynamic Type (rem-based scale)

Every type-size primitive is stored in rem. At the default 16px root the
rendered sizes are unchanged. Users who change their browser default
font-size (Chrome Settings → Appearance, or Safari → Develop → Open Page
With…) or use OS-level "larger text" preferences get a proportional
scale across the entire app.

**Rule.** Body-level type must use the role utilities (`text-body`,
`text-body-sm`, `text-title`, etc.), which resolve through the rem-based
primitive scale. Inline `text-[14px]` clusters defeat Dynamic Type and
must be replaced as those components are revisited.

### Reduce Transparency — `prefers-reduced-transparency: reduce`

When the user has Reduce Transparency on (iOS Accessibility → Display &
Text Size → Reduce Transparency; or the equivalent on macOS / Android /
desktop browsers that expose the preference), the system re-maps:

| Token | Default | Reduce-Transparency |
|---|---|---|
| `--color-aurora-sky` | `--aurora-sky-300` | `--aurora-sky-100` |
| `--color-aurora-lavender` | `--aurora-lavender-200` | `--aurora-lavender-100` |
| `--color-aurora-mint` | `--aurora-mint-400` | `--aurora-mint-100` |
| `--color-surface-card` | `--white-a40` | `--mist-50` (solid) |
| `--color-surface-elevated` | `--white-a60` | `--mist-50` (solid) |
| `--color-surface-overlay` | `--white-a50` | `--mist-50` (solid) |
| `--color-surface-hover` | `--white-a30` | `--mist-100` (solid) |
| `--color-surface-pressed` | `--white-a40` | `--mist-200` (solid) |
| `--color-border` | `--white-a60` | `--steel-300` (solid) |
| `--color-border-soft` | `--white-a40` | `--steel-200` (solid) |
| `--color-track-off` | `--steel-700` @ 40% | `--steel-300` (solid) |

**Rule.** A new component must never depend on transparency alone to
distinguish itself from the page. Layout structure, semantic landmarks,
and content are unchanged in this mode — only the surface fills and
borders flatten.

### Increase Contrast — `prefers-contrast: more`

Secondary and muted text darken; translucent borders are replaced with
visible navy tints; the focus ring grows from 2px to 3px.

| Token | Default | Increase-Contrast |
|---|---|---|
| `--color-text-secondary` | `--steel-700` | `--navy-800` |
| `--color-text-muted` | `--steel-500` | `--navy-700` |
| `--color-border` | `--white-a60` | `--navy-300` |
| `--color-border-soft` | `--white-a40` | `--navy-400` |
| `--color-track-off` | `--steel-700` @ 40% | `--steel-600` |
| `--focus-ring` | `2px solid --navy-900` | `3px solid --navy-900` |

### Forced Colors — `forced-colors: active`

Windows High Contrast and similar OS-painted themes strip developer
colours. Borders and focus rings re-route to CSS system colors so the OS
theme paints them; the `Toggle` track and knob gain explicit 1px
`CanvasText` borders so on/off remains perceivable when backgrounds are
flattened.

| Token | Default | Forced-Colors |
|---|---|---|
| `--color-border` | `--white-a60` | `CanvasText` |
| `--color-border-soft` | `--white-a40` | `CanvasText` |
| `--color-track-off` | `--steel-700` @ 40% | `ButtonFace` |
| `--focus-ring` | `2px solid --navy-900` | `2px solid Highlight` |

The Toggle's track and knob gain `border: 1px solid CanvasText` in this
mode only — a ~1px geometry shift is accepted in exchange for visibility.

### Contrast expectations (default mode)

Text contrast targets, measured against the `--mist-100` background or
against a solid `--mist-50` card under Reduce Transparency:

| Role | Token | Contrast vs bg | WCAG |
|---|---|---|---|
| Primary | `--color-text-primary` (navy-900) | ~10:1 | AAA |
| Secondary | `--color-text-secondary` (steel-700) | ~5.1:1 | AA (normal text) |
| Muted | `--color-text-muted` (steel-500) | ~3.5:1 | AA (large text only) |
| Label / caption | `--color-text-secondary` on caption sizes | as above | AA at ≥11px / 1.5 |
| Micro | `--color-text-secondary` on `--text-micro` | as above | AA at uppercase + 600 weight |

**Small-text rules.** Body content must use `--text-body` (14px) or
larger. `--text-body-sm` (13px) is permitted inside `<Card>` body
copy. `--text-label` (11px) and `--text-eyebrow` (11px) are reserved for
**metadata, captions, and uppercase labels** — never for primary content.
`--text-micro` (10px) is reserved for **uppercase, weight-600 footer
labels** where the letter-spacing and weight compensate for the small
size; never use 10px in regular case or regular weight.

---

## 12b. Component state matrix

Every interactive primitive should declare how it behaves across the
full state surface: **default, hover, pressed, focus-visible, disabled,
loading, busy, error, success**. Today coverage is partial. This matrix
is the authoritative gap list — each new primitive must update it.

Legend: ✓ supported · — not applicable to this primitive · ❌ missing,
should exist · ⏳ future required (drives Phase 2 work).

| Component | Default | Hover | Pressed | Focus | Disabled | Loading | Busy | Error | Success |
|---|---|---|---|---|---|---|---|---|---|
| `Button` (primary) | ✓ | ❌ ⏳ | ✓ (`active:opacity-90`) | ✓ (global) | ✓ | ✓ (spinner trailing) | ✓ (`aria-busy` via `loading`) | ❌ ⏳ | — |
| `Button` (ghost) | ✓ | ✓ (text-primary) | ❌ ⏳ | ✓ (global) | ✓ | ✓ (spinner trailing) | ✓ (`aria-busy` via `loading`) | — | — |
| `Card` | ✓ | — | — | — | — | ✓ (compose `<Skeleton>`) | ❌ ⏳ | ✓ (compose `<ErrorState>`) | ✓ (compose `<EmptyState>` for invitational) |
| `Toggle` | ✓ | ❌ ⏳ | ❌ ⏳ | ✓ (global) | ✓ | — | ✓ (`aria-busy`, opacity-80) | ❌ ⏳ | — |
| `AuthOption` | ✓ | ✓ (`--color-surface-hover`) | ✓ (`--color-surface-pressed`) | ✓ (global) | ❌ ⏳ | ❌ ⏳ | ❌ ⏳ | ❌ ⏳ | — |
| `PermissionCard` | ✓ | — | — | — | ❌ ⏳ (OS-unavailable) | ❌ ⏳ | ❌ ⏳ (forwards to Toggle) | ❌ ⏳ (denied) | ❌ ⏳ (just-granted) |
| `ScreenHeader` back chip | ✓ | ✓ (`bg-white/70`) | ❌ ⏳ | ✓ (global) | — | — | — | — | — |
| `IconTile` | ✓ | — | — | — | — | — | — | — | — |
| `FeatureList` | ✓ | — | — | — | — | ✓ (wrap in `aria-busy` + `<Skeleton>` rows) | — | ✓ (replace with `<ErrorState>` / `<EmptyState>`) | — |
| `Heading` | ✓ | — | — | — | — | — | — | — | — |
| `Eyebrow` | ✓ | — | — | — | — | — | — | — | — |
| `Skeleton` | ✓ (is loading) | — | — | — | — | ✓ (its purpose) | — | — | — |
| `InlineAlert` | ✓ | — | — | — | — | — | ✓ (`aria-live`) | ✓ (variant=danger) | ✓ (variant=success) |
| `EmptyState` | ✓ | — | — | — | — | — | — | — | ✓ (its purpose) |
| `ErrorState` | ✓ | — | — | — | — | — | ✓ (`aria-live`) | ✓ (its purpose) | — |

### State rules

- **Hover** is *optional on touch-first UI*. Mobile users don't trigger
  hover, so primitives may omit it — but if a primitive ships hover, it
  must not regress on desktop. Hover effects are presentation-only and
  should not be required to communicate state (use focus-visible or a
  pressed tint for actual signalling).
- **Pressed** must be **subtle and consistent** across the system. Today
  primary `Button` uses `active:opacity-90` and `AuthOption` swaps to
  `--color-surface-pressed`. Future pressed states should reuse those
  patterns rather than invent new ones. *(Visible press-scale is
  deferred.)*
- **Focus-visible** is the one state that must **always be visible**.
  Handled globally in `globals.css` via `:focus-visible` → `--focus-ring`.
  Never override per-component.
- **Disabled** must be visually clear *and* non-interactive. Convention:
  `opacity-[var(--opacity-disabled)]` (0.5) + `pointer-events-none` +
  the native `disabled` attribute when the primitive renders a `<button>`
  or form control. Never communicate disabled with text-color change
  alone — opacity is the system-wide cue.
- **Loading** is a *busy + content-replacement* state. Used for actions
  whose UI must visibly indicate work-in-progress (e.g. submit, async
  sign-in). It prevents duplicate submits via `pointer-events-none` +
  `aria-busy="true"` and should replace the action's label/icon with a
  spinner. Each primitive owns its loading rendering — **no one-off
  spinners inside page files**.
- **Busy** is a *busy without content replacement* state. Used for async
  toggles, permission grants, optimistic-update windows. Sets
  `aria-busy="true"` and disables interaction but keeps the existing
  visual chrome. `Toggle` and `PermissionCard` both need this — granting
  an OS permission is async and the switch should reflect that without
  flipping value.
- **Error / Success** must use **status surface tokens** (`--color-danger`,
  `--color-success`) for their accent — never invent a red. They are
  visual states on primitives that wrap data (cards, lists, fields) and
  on actions that report outcome (toast, banner, inline-alert). Status
  colors stay reserved for live data states per §5.

### Loading vs disabled vs busy — when to use which

The three states all block input but mean different things. Picking the
right one is part of API design, not an implementation detail.

| State | Meaning | Lives on | Visual cue | A11y |
|---|---|---|---|---|
| `disabled` | "This control is **configured off**" — the user has no path to make it work right now (missing required field, gated feature, network offline). | Configuration. Usually derived from props/state and stays put until config changes. | Full `opacity-[var(--opacity-disabled)]` dim. `cursor-not-allowed`. | Native `disabled` (button branch) or `aria-disabled="true"` (link branch). |
| `loading` | "This action is **working right now** on a foreground request." Used on actions where the result is what the user is waiting for: submit, sign-in, save. | The Button. | Trailing spinner inside the button. Cursor `progress`. Label can swap to `loadingLabel`. | `aria-busy="true"`. |
| `busy` | "This control is **temporarily working** on a background request." Used on stateful controls (switch, slider) where the user has triggered something async but the control's value should not optimistically flip. | The Toggle (and future Switch/Slider primitives). | Subtle 80% opacity + `cursor: wait`. **Value does not change** until busy clears. | `aria-busy="true"`. |

**Rules of thumb:**

- If clicking the control **submits** something, use `loading` (button).
- If clicking the control **changes a value** that the system must
  confirm, use `busy` (toggle).
- If the control is not available **independent of any in-flight work**,
  use `disabled`.
- Never use a one-off `<Spinner/>` inside a page body. The
  loading/busy state belongs in the primitive that owns the action.

---

## 12c. Future contracts (forward-looking — do not implement here)

These are the desired prop surfaces for the two primitives most likely
to grow in Phase 2. Documenting them up front so consumers can read the
contract before the implementation lands.

### Button — future contract

```tsx
type ButtonProps = {
  variant?: "primary" | "ghost";
  size?: "md" | "lg";              // (forward-looking — sizes today are baked into variant)
  fullWidth?: boolean;             // default true for primary, opt-in for ghost
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;               // shows spinner, sets aria-busy="true", blocks clicks
  loadingLabel?: string;           // optional override of the visible label while loading
  disabled?: boolean;              // applies opacity-disabled + pointer-events-none + native disabled
  href?: Route | URL;              // renders as <Link>; disabled in this mode adds aria-disabled
  children: React.ReactNode;
};
```

**Behaviour notes:**

- `loading` and `disabled` are independent — `loading` implies non-interactive
  but is conceptually a *transient* state; `disabled` is configuration.
- While loading, the visible label is preserved but optionally replaced
  by `loadingLabel`. Trailing icon is replaced by a spinner. The button
  keeps its width (no layout shift).
- `aria-busy="true"` is set on the rendered element when `loading`.
- For the `<Link>` variant, `disabled` adds `aria-disabled="true"` and
  `pointer-events-none` since native `disabled` is not honoured on
  anchors. `loading` on links navigates immediately — links shouldn't
  display a loading state; if you need one, render as a button + handle
  navigation manually.

### Toggle — future contract

```tsx
type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;              // current
  busy?: boolean;                  // new — aria-busy="true", blocks input, no value change
  error?: boolean;                 // new — paints status-danger accent, e.g. permission denied
};
```

**Behaviour notes:**

- `busy` keeps the *current* checked value (no optimistic flip) and sets
  `aria-busy="true"`. Use for the brief window between user tap and OS
  permission resolution. Visual cue: same as default but with a subtle
  animated indicator (forward-looking — no live animation yet).
- `error` paints a danger accent (border tint via `--color-danger`) and
  is announced via the parent component (a status banner / inline alert
  takes the live-region announcement, not the Toggle itself).
- `aria-checked` is always set. `aria-busy` only when `busy` is true.
- `disabled` and `busy` are mutually overridable — both block input.
  `disabled` is configured intent, `busy` is transient state.

---

## 12d. Feedback primitives

Four primitives + one documented contract cover the surface area for
async, empty, error, and inline-status feedback. They share a single
guiding principle: **a screen that depends on live data must never
render blank, never render a generic browser alert, and never display
unstyled error text.**

```
Skeleton   →  during fetch              ("loading bones")
EmptyState →  fetch succeeded, nothing  ("no trips yet")
ErrorState →  fetch failed              ("we can't reach Vancouver")
InlineAlert→  live status while content is present  ("gate change")
Toast      →  contract only; build deferred
```

### Skeleton

```tsx
<Skeleton width="60%" height={16} />
<Skeleton width="100%" height={120} radius="var(--radius-panel)" />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `width` | `string \| number` | `"100%"` | Pixel number or any CSS length. |
| `height` | `string \| number` | `"1rem"` | Same. |
| `radius` | `string \| number` | `--radius-chip` | Pass a token (`var(--radius-panel)`) for card-shaped skeletons. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** Glass-tinted block (`--color-surface-card`) that animates
opacity 1 → 0.5 → 1 over 2s. Reduced-motion strips the animation; the
block stays visible as a static placeholder.

**Composition rule.** Skeletons sit inside a region that the parent
marks `aria-busy="true"`. The skeleton blocks themselves are
`aria-hidden` — they're a visual cue, not the announcement.

**Do**

```tsx
<section aria-busy={loading}>
  {loading ? (
    <div className="flex flex-col gap-2">
      <Skeleton height={20} width="40%" />
      <Skeleton height={14} width="80%" />
    </div>
  ) : (
    <Flights data={flights} />
  )}
</section>
```

**Don't**

```tsx
// ❌ A spinner alone.
{loading ? <SpinnerIcon /> : <Flights data={flights} />}

// ❌ Random grey div.
<div className="h-6 w-40 bg-gray-300 animate-pulse" />
```

### EmptyState

```tsx
<EmptyState
  icon={<PlaneIcon size={18} />}
  title="No trips yet"
  description="Add a flight to start your journey."
  primaryAction={{ label: "Add a flight", href: "/flights/new" }}
/>
```

| Prop | Type | Required | Notes |
|---|---|---|---|
| `icon` | `ReactNode` | no | Rendered inside an `IconTile` at 40×40. |
| `title` | `string` | yes | Card title — max 3 short words. |
| `description` | `string` | no | One-line follow-on. |
| `primaryAction` | `Action` | no | Primary CTA (`href` *or* `onClick`). |
| `secondaryAction` | `Action` | no | Ghost CTA. |
| `className` | `string` | no | Composition hook. |

**Anatomy.** Composes `<Card padding="lg">` and centers icon → title →
description → optional CTAs. Not a live region — empty state is *content*,
not an announcement.

**Use cases (airport app):**

- "No trips yet" on home dashboard
- "No notifications" in settings
- "No saved routes" in maps
- "No nearby places" in dining/lounges search

**Tone.** Invitational, not apologetic. Pair with a CTA that gets the
user somewhere, not "Sorry, nothing here."

### ErrorState

```tsx
<ErrorState
  icon={<AlertIcon size={18} />}
  title="We can't reach Vancouver right now"
  description="Check your connection and try again."
  retryAction={{ label: "Try again", onClick: refetch }}
/>
```

| Prop | Type | Required | Notes |
|---|---|---|---|
| `icon` | `ReactNode` | no | Tinted with `--color-danger` inside a neutral chip. |
| `title` | `string` | yes | State the fact, not the blame. |
| `description` | `string` | no | Short line on what the user can do next. |
| `retryAction` | `Action` | no | Primary CTA — verb-first label ("Try again", "Reload flights"). |
| `secondaryAction` | `Action` | no | Ghost CTA. |
| `role` | `"status" \| "alert"` | no, default `"status"` | `alert` is assertive — reserve for time-sensitive failures. |
| `className` | `string` | no | Composition hook. |

**Anatomy.** Composes `<Card padding="lg">` with a danger-tinted icon
chip. The card chrome stays neutral — the tone is calm, not "red
everywhere." Wraps content in a live region (`role="status"` by
default, `role="alert"` opt-in).

**Copy guidance.**

- ✅ "We can't reach Vancouver right now"
- ✅ "Boarding pass didn't load"
- ❌ "Error: 503 Service Unavailable"
- ❌ "Something went wrong" (no specifics, no path forward)

**Use cases (airport app):** flight-status fetch failed, map tile
fetch failed, boarding pass render failed, ID Check service offline.

### InlineAlert

```tsx
<InlineAlert
  variant="warning"
  icon={<AlertIcon size={16} />}
  title="Gate change"
  description="Your flight is now boarding at Gate B12."
  action={{ label: "View flight", href: "/flights/AC123" }}
/>
```

| Prop | Type | Required | Notes |
|---|---|---|---|
| `variant` | `"info" \| "success" \| "warning" \| "danger" \| "neutral"` | no, default `"info"` | Picks the status surface trio. |
| `icon` | `ReactNode` | no | Leading. Inherits `currentColor` from the variant fg. |
| `title` | `string` | no | Optional emphasis line. |
| `description` | `string` | yes | The status content. |
| `action` | `Action` | no | One ghost-style CTA, label-only. |
| `role` | `"status" \| "alert"` | no, default `"status"` | Set `"alert"` for urgent live data (gate change at boarding, sudden delay). |
| `className` | `string` | no | Composition hook. |

**Anatomy.** Flat tinted block — *not* a Card. The variant fg / bg /
border trio is the only chrome. Tinted icon + content stack.

| Variant | Bg | Border | Fg |
|---|---|---|---|
| `info` | `--color-info-bg` | `--color-info-border` | `--color-info-fg` |
| `success` | `--color-success-bg` | `--color-success-border` | `--color-success-fg` |
| `warning` | `--color-warning-bg` | `--color-warning-border` | `--color-warning-fg` |
| `danger` | `--color-danger-bg` | `--color-danger-border` | `--color-danger-fg` |
| `neutral` | `--color-neutral-bg` | `--color-neutral-border` | `--color-neutral-fg` |

**Live-region policy.**

- `info` / `success` / `neutral` → default `role="status"` (polite).
- `warning` / `danger` → default `role="status"`; opt-in `role="alert"`
  when the message demands immediate attention (active boarding,
  imminent closure). Don't make every warning an alert — users tune out.

**Use cases (airport app):** gate change, delay notice, security wait
spike, tight connection warning, parking near-full warning, on-time
confirmation, "flight added" success.

**Do**

```tsx
// Calm, non-urgent info.
<InlineAlert variant="info" description="Boarding starts in 20 minutes." />

// Urgent live announcement.
<InlineAlert
  variant="warning"
  role="alert"
  title="Gate change"
  description="Now boarding at Gate B12."
/>
```

**Don't**

```tsx
// ❌ Wrapping the alert in a Card. The variant tint IS the chrome.
<Card><InlineAlert … /></Card>

// ❌ Using a status colour as decoration on a non-live block.
<div className="bg-[var(--color-danger-bg)]">Welcome back!</div>
```

### Toast — contract (deferred build)

A full toast system is non-trivial — global mount, queue, focus return,
dismiss timer, motion. Build deferred. Until then, the spec all future
toasts must conform to:

| Concern | Rule |
|---|---|
| **Modality** | Non-modal. Never blocks the screen, never traps focus. |
| **Mount point** | Single portal pinned to the bottom-center of the viewport, inside the safe-area inset. |
| **Stacking** | Newest on top, max 3 visible. Older toasts collapse into a single "3 more" pill or fade out as new ones arrive. |
| **Auto-dismiss** | `info` / `success` / `neutral`: 4s. `warning`: 8s. `danger`: **manual dismiss only** — errors do not vanish on a timer. |
| **Manual dismiss** | Every toast has a close button (44×44 hit area). `Esc` dismisses the most recent toast. |
| **A11y** | Toast container is `role="region" aria-live="polite"` for routine and `aria-live="assertive"` for urgent. Newly inserted toasts inherit the announcement. Focus is *not* moved to the toast — the user keeps task focus. |
| **Z-index** | `var(--z-toast)` (2000). |
| **Motion** | Enter: translate-y from 16px + fade, `--duration-base` (240ms), `--ease-emphasis`. Exit: translate-y to 16px + fade, `--duration-fast` (180ms), `--ease-exit`. Reduced motion: fade only, instant. |
| **Content** | Single line of body + optional one-tap action. No icon required (variant tint carries the meaning). |
| **Source of truth** | Toasts are triggered by a global `toast.show(...)` helper, never by mounting a `<Toast>` inline in a page. Pages don't compose toasts. |

When the system lands as a primitive, document API + usage here and
flip its row in the §12b state matrix.

### Composition rules for feedback primitives

1. **Don't nest feedback primitives in `<Card>` manually.** EmptyState
   and ErrorState already compose Card; double-wrapping looks like a
   bordered card inside a bordered card. InlineAlert is not a Card and
   doesn't go inside one.
2. **Don't make pages compose a generic loading state.** If a region
   loads asynchronously, ship a `<Skeleton>` block per content shape.
   No spinner-on-blank-screen.
3. **Don't use `alert()`, `confirm()`, or a `<div className="error">`.**
   These have no a11y story and don't fit the visual language. Use
   InlineAlert (inline) or ErrorState (page) instead.
4. **One urgent live region per screen at a time.** Two simultaneous
   `role="alert"` announcements collide. If you need to stack
   notifications, queue them through the future Toast system.

### Accessibility quick-rules

- **Skeleton** — `aria-hidden`. Parent region marks `aria-busy="true"`.
- **EmptyState** — content, no live region.
- **ErrorState** — `role="status" aria-live="polite"` by default;
  opt-in `role="alert" aria-live="assertive"` for urgency.
- **InlineAlert** — same policy as ErrorState; variant doesn't change
  the role automatically.
- **Toast** (when built) — container `aria-live="polite"` / `"assertive"`
  depending on priority. Focus stays with the user.

---

## 12e. iOS interaction patterns (future contracts)

YVR users carry iOS muscle memory: bottom sheets, large-title nav,
swipe-to-reveal, pull-to-refresh, sticky bottom CTAs. These primitives
aren't built yet, but their contracts are documented here so when they
land they reuse motion roles, tokens, and a11y conventions instead of
inventing new ones. **No implementation in this phase.**

### Bottom sheet (with detents)

| Concern | Contract |
|---|---|
| Detents | Three: `compact` (~25% viewport), `medium` (~60%), `full` (~95%). Configurable per instance; default opens to `medium`. |
| Drag handle | 36×4 mist-300 chip, top-center, 8px from edge. Acts as visual affordance + drag target. |
| Backdrop | Dimmer at `--opacity-overlay` (0.5), tappable, dismisses. |
| Snap behaviour | Drag release uses `--motion-spring-snappy` toward the nearest detent. |
| Open / close | Translate-y from `--motion-distance-md` (16px) + fade. `--motion-overlay-duration` / `--motion-overlay-ease` for entry. `--motion-exit-duration` / `--motion-exit-ease` for dismiss. |
| Z-index | `--z-modal` (sheet) above `--z-overlay` (backdrop). |
| Backdrop blur | `backdrop-filter: blur(var(--blur-overlay))` on the sheet surface — gated behind `prefers-reduced-transparency` (skip blur in reduce mode). |
| A11y | `role="dialog" aria-modal="true"`, focus moves to the first focusable element on open, focus returns to the trigger on close, focus is trapped while open, `Esc` dismisses. |
| Reduced motion | Fade-only entry. No spring snap — value jumps to the detent. |

### Large-title collapsing header

| Concern | Contract |
|---|---|
| Default state | At scroll-y 0, the screen heading sits inside the page content (`<Heading size="display">` or `<Heading size="title">`). |
| Collapsed state | Once scroll-y exceeds the heading's height, a sticky 44px header at top-of-viewport appears with the heading text at `--font-size-500` (15px) / weight 600 / `--color-text-primary`. Subtle backdrop blur (`--blur-card`) over `--color-surface-overlay` once active. |
| Transition | Opacity crossfade — `--motion-fast` (180ms). No scale, no slide. The large title doesn't shrink; it fades while the sticky one fades in. |
| Back chip | Lives in the sticky header. Reuses `<ScreenHeader>`'s back chip styling. |
| Reduced motion | Crossfade still works (it's already opacity-only). |
| A11y | The sticky title is a visually presented copy of the same heading — the underlying `<h1>` is once. Screen readers don't re-announce. |

### Swipe actions on list rows

| Concern | Contract |
|---|---|
| Trigger | Horizontal pan on a row, threshold 20px. |
| Action panel | Max two actions per side. Right-side actions are destructive-prone (delete, archive); left-side actions are positive (mark read, favourite). |
| Action width | 80px each (fits a 16px icon + 11px label). Background uses status surface fg (`--color-danger-fg`, `--color-success-fg`) at full opacity. |
| Snap | Release uses `--motion-spring-stiff` toward the nearest of {closed, revealed-once, revealed-twice, default-action}. |
| Long-pull default action | When swipe exceeds 60% of the row's width, the rightmost / leftmost action becomes the default (snaps to full reveal, triggers on release). |
| Desktop fallback | Hover reveals a kebab `⋯` button at the trailing edge that opens the same actions as a small menu. |
| A11y | Each row has an accessible-name-bearing button per action exposed via `role="menu"` on long-press / context menu — swipe is *augmentation*, not the only path. |
| Reduced motion | Tap reveals action panel instantly. No swipe gesture animation. |

### Pull-to-refresh

| Concern | Contract |
|---|---|
| Eligibility | Any vertically-scrolling list whose data benefits from manual refresh (flights, gates, parking, security wait). **No PTR on static lists.** |
| Trigger | Vertical pan at scroll-y 0, pull threshold 80px. |
| Indicator | A small `SpinnerIcon` rendered between the pull origin and the first row. Rotation tracks pull distance until threshold; then locks and runs `animate-spin` until refresh completes. |
| Release | Snap back with `--motion-spring-gentle`. |
| Reduced motion | Tap an explicit "Refresh" button (provided by the surrounding ScreenHeader or list chrome) instead of the gesture. The pull gesture still works but the rotation transitions are skipped. |
| Decision | **Not built until a list screen explicitly requests it.** Pages should expose a refresh button regardless, since PTR is a touch-only augmentation. |

### Sticky bottom CTA

Current `AppShell` already pins the primary CTA via `mt-auto` when the
page has flexible vertical content. The future "sticky bottom" variant
adds:

| Concern | Contract |
|---|---|
| Behaviour | When content overflows the viewport vertically, the bottom CTA stays fixed inside the safe area instead of flowing off-screen. |
| Background | Linear gradient mask above the CTA (from `transparent` at the top to `--color-bg` at the bottom over 32px) so underlying content fades into the CTA bar instead of being cropped abruptly. |
| Z-index | `--z-sticky` (10). Above content, below overlays. |
| Reduced transparency | Mask becomes solid `--color-bg` (no gradient). |
| Reduced motion | No change — sticky has no entry animation. |
| A11y | Order in DOM stays content-then-CTA so screen-reader navigation reaches the CTA last. |

### Haptic intent map (forward-looking)

iOS Safari does not currently expose haptic feedback via the Web API.
This map documents **intent**, so when the app is wrapped natively
(or when web haptics ship) every interaction has the right cue. Until
then it's metadata.

| Intent | iOS Generator | Use |
|---|---|---|
| Selection | `UISelectionFeedbackGenerator` | Switch flip, chip toggle, segmented control change. |
| Light impact | `UIImpactFeedbackGenerator(.light)` | Primary CTA tap, list-row reveal. |
| Medium impact | `UIImpactFeedbackGenerator(.medium)` | Sheet open, modal open, destructive confirm. |
| Heavy impact | `UIImpactFeedbackGenerator(.heavy)` | Reserved — strong commit (boarding scan success). Use sparingly. |
| Notification success | `UINotificationFeedbackGenerator(.success)` | Flight added, trip saved, sign-in succeeded. |
| Notification warning | `UINotificationFeedbackGenerator(.warning)` | Tight connection notice, security wait spike. |
| Notification error | `UINotificationFeedbackGenerator(.error)` | Sign-in failed, permission denied. |

Implementation note: components that own an interaction expose a
documented haptic intent. The shim layer (Capacitor / RN bridge / web
fallback) reads the intent and fires the appropriate API or no-ops.

### Status pill behaviour

| Concern | Contract |
|---|---|
| Chrome | Pill shape (`--radius-pill`), 24–28px tall, padded 4 / 10. |
| Content | Leading status dot (`--color-success` / `--color-warning` / `--color-danger`) at 6px diameter + label at `--text-micro` weight 600 uppercase, tracking +0.16em. |
| Variants | `on-time`, `boarding`, `delayed`, `gate-changed`, `cancelled`. Each maps to a status fg/bg/border trio (`--color-success-*`, `--color-warning-*`, `--color-danger-*`). |
| Status change | When the bound value changes (e.g. on-time → delayed), the pill crossfades colour using `--motion-element-duration` / `--motion-element-ease`. No layout shift, no jump. |
| Live region | When status changes mid-screen, the parent surface (flight card) owns the announcement via `aria-live="polite"`. The pill itself is decorative content. |
| Reduced motion | Status change is an instant swap; no fade. |

### Search field with filter chips

| Concern | Contract |
|---|---|
| Field | Pill-shaped input with leading 16px `SearchIcon`, `--color-surface-elevated` fill, 44px tall, `--radius-pill`, `--text-body` placeholder via `--color-text-muted`. |
| Filter chips | Horizontal scroll row below the input. Chips are 32px tall, `--radius-pill`, `--color-surface-elevated` fill (inactive) / `--color-action-primary` fill (active). |
| Multi-select | Chips can be combined unless documented otherwise. Each chip toggles independently. |
| Animation | Chip toggle uses `--motion-spring-gentle` on background colour. Active chip's text colour crossfades from `--color-text-primary` to `--color-action-primary-fg`. |
| Clear | When chips are active, a "Clear" ghost button appears at the trailing end of the chip row. |
| A11y | Chips render as `role="button" aria-pressed`. Input has an associated `<label>` (visually hidden if a leading icon already implies "search"). Chip row is `role="group" aria-label="Filters"`. |
| Reduced motion | Chip toggle is an instant swap. |

---

## 12f. Component API conventions

The library is small enough today that inconsistencies are still easy
to fix. This section is the binding standard for every new primitive,
and the migration target for the inconsistencies catalogued below.

### Prop naming standard

- **camelCase** for all React props (`leadingIcon`, `defaultOn`,
  `loadingLabel`, `toggleAriaLabel`).
- Boolean props read as the **affirmative state** (`disabled`,
  `loading`, `busy`, `checked`, `fullWidth`) — never `isDisabled`,
  never `notReady`. Negation reads worst.
- Avoid prefixes that duplicate meaning. `iconLeft` ≠ `leadingIcon`;
  pick one — **the standard is `leadingIcon` / `trailingIcon`** for
  icon-only slots, **`leading` / `trailing`** for free-form content
  slots.
- Numeric props that map to design tokens use the **token suffix**
  (`size`, `padding`, `variant`). Tokens are strings keyed to a
  documented set, not pixel numbers — except `IconTile.size`, which
  is intentionally a raw pixel value because icons are sized by
  pixel, not by t-shirt.
- Required props are listed before optional in the type. Optional
  props default to `undefined`, **never to a meaningful value
  silently** — if a default matters, it's named with a clear
  semantic (`variant = "primary"`, `padding = "default"`).

### Event handler naming standard

- `onChange` for state primitives whose primary purpose is value
  change (`Toggle`, future `Slider`, future `Select`). Signature:
  `(next: ValueType) => void`. The next-value-first convention
  matches React's controlled-input pattern.
- `onClick` for action primitives (`Button`, `AuthOption`, future
  `ListRow`). Signature matches `React.MouseEventHandler` so native
  HTML event semantics flow.
- `onSelect` is **forbidden** for now — pick `onChange` if it's a
  value handler or `onClick` if it's an action. (Reserved for future
  `Menu` / `Select` once those primitives need to differentiate
  "user picked an option" from "value changed.")
- Async actions don't take an `onSubmit` prop on the primitive —
  parent state owns the async lifecycle, primitive consumes
  `loading` / `busy` props (see §12c).

### Accessibility prop standard

- Use **camelCase `ariaLabel`** when the prop will *always* be
  rendered onto a single host element's `aria-label` attribute
  (e.g. `<Toggle ariaLabel="…">`, `<AuthOption ariaLabel="…">`).
  This is the YVR convention; the rendered DOM is `aria-label`.
- Use **kebab-case `aria-*` HTML attributes directly** when the
  prop spreads through `...rest` onto an underlying HTML element
  (e.g. `<Button aria-label="…">`).
- Never invent new ARIA-coloured props. `role`, `aria-live`,
  `aria-busy`, `aria-checked`, etc. are owned by the host primitive
  and set internally — consumers don't pass them.
- Icon-only buttons: `ariaLabel` is **required** by the type.
- Decorative icons: the primitive sets `aria-hidden` internally.

### Variant naming standard

- **Intent names** for behaviour variants — `primary`, `ghost`,
  `info`, `success`, `warning`, `danger`, `neutral`. The name says
  *what role this variant plays*, not what it looks like.
- **T-shirt names** are reserved for `size`. Never mix t-shirt and
  intent in the same prop's value set. (Today `Card.padding` does
  this with `"none" / "compact" / "default" / "lg"` — flagged for
  future cleanup, see *Known inconsistencies* below.)
- New variants need an entry in the component's anatomy table in
  this doc before they ship.

### Size naming standard

- T-shirt: `xs` / `sm` / `md` / `lg` / `xl` — pick a subset.
- Default size is `md` and is the prop's default value.
- Avoid `default` as a size — it's the absence of choice, not a
  size.
- Numeric `size: number` is allowed only for primitives whose size
  is a raw pixel value, not a step (`IconTile`, `Skeleton.height`).

### className policy

- **Every primitive must accept a `className` prop** that is
  appended to the host element's class list. Composition without a
  `className` escape hatch is a dead-end primitive.
- `className` is appended *last* so consumers can override base
  styles when necessary. Use this sparingly — overrides indicate
  the primitive needs a new variant or prop, not a one-off override.
- Style overrides via `style={{}}` are discouraged. Use `className`
  with arbitrary-value Tailwind utilities that consume tokens.

### `as` prop policy

- `as` is reserved for **changing the HTML element**, not the
  visual variant. `<Card as="article">` and `<Heading as="h2">`
  swap the host tag without changing styles.
- Allowed values are an explicit union — never `keyof JSX.IntrinsicElements`.
  The narrower the union, the easier to type-check what the
  consumer can pass.
- `as` is **not** used to switch between a `<button>` and an `<a>`
  on action primitives. That polymorphism flows through the `href`
  discriminant (see below).

### Link vs button polymorphism

Action primitives (`Button`, future `ListRow`) render as either
`<button>` or `<Link>` (Next's anchor) depending on whether `href`
is provided:

```tsx
<Button onClick={fn}>…</Button>          // <button>
<Button href="/path">…</Button>          // <Link>
```

Rules:

- `href` is the **discriminant**. If `href` is present, the
  rendered element is `<Link>`. If absent, `<button>`.
- TypeScript enforces the split via a union of `ButtonAsButton`
  and `ButtonAsLink`. `ButtonAsButton` extends
  `ButtonHTMLAttributes`; `ButtonAsLink` extends
  `AnchorHTMLAttributes`.
- `disabled` on the `<Link>` branch maps to `aria-disabled="true"`,
  `tabIndex={-1}`, and an `onClick` guard that calls
  `event.preventDefault()` — native `disabled` does not apply to
  anchors.
- `loading` is supported on both branches; on `<Link>` it sets
  `aria-busy` and the click guard.

### Controlled vs uncontrolled

- **Primitives are controlled by default.** State lives in the
  parent; the primitive takes `value` / `checked` / `selected` +
  `onChange`. This is the default for `Toggle` and every future
  state primitive.
- **Convenience wrappers may be uncontrolled** when the state is
  unambiguously internal to the wrapper's purpose. `PermissionCard`
  is the example — it accepts `defaultOn` and manages its own
  Toggle state because a permission card's value is local to that
  permission row, not lifted into a parent form.
- Uncontrolled wrappers **never expose a `value`/`checked` prop** —
  the API is `defaultX` (initial) + (optional) `onChange` (notify).
  Mixing both creates ambiguous controlled-or-not behaviour.

### Slot composition rules

Pick a content pattern based on how the consumer will think about the
component:

| Pattern | When to use | Examples |
|---|---|---|
| `children` | Single content slot. The consumer thinks of the primitive as "a thing wrapping content." | `Button`, `Card`, `Heading`, `Eyebrow`, `AuthOptionGroup`, `IconTile` |
| Named text props (`title`, `description`) | Multi-text composition with semantic roles. Consumer thinks of the primitive as "a layout for this kind of content." Title is required; description is optional. | `PermissionCard`, `EmptyState`, `ErrorState`, `InlineAlert` |
| Named slot props (`leading`, `trailing`, `icon`) | Specific positional content — icons, badges, side actions. | `AuthOption.leading`, `Button.trailingIcon`, `ScreenHeader.trailing`, `PermissionCard.icon` |
| Typed data prop (`items: T[]`) | When the primitive owns rendering for an array of identically-shaped data. Consumer doesn't compose JSX inside. | `FeatureList.items` |

**Header / body / footer** composition is not yet used at the
primitive level; `Card` is intentionally a single-slot primitive
with consumer-owned interior. When a future `Card.Header` /
`Card.Footer` subcomponent is needed, follow the dot-notation
compound-component pattern (`<Card><Card.Header>…</Card.Header>
<Card.Body>…</Card.Body></Card>`).

### Known inconsistencies (migration targets)

These are flagged for future cleanup. None are visual; all are API
shape:

| Component | Inconsistency | Migration |
|---|---|---|
| `Card` | `padding` values mix t-shirt and intent (`"none"` / `"compact"` / `"default"` / `"lg"`). | Rename to a pure t-shirt scale: `"none"` / `"sm"` / `"md"` / `"lg"`. Breaking change — schedule with the first `<Card>` consumer that needs another padding step. |
| `AuthOption` | Slot prop named `leading` but always contains an icon. | Rename to `leadingIcon` when AuthOption gets a second consumer outside onboarding/sign-in. |
| `AuthOption` | Content via `label: string` prop instead of `children`. | Keep as-is; multi-segment rows (`label` + `badge`) work better with named props than children. Documented, not migrated. |
| `Toggle` / `AuthOption` / `PermissionCard` | `ariaLabel` / `toggleAriaLabel` camelCase props. | Documented standard above — these are the rule, not the exception. |
| `FeatureList` | Numbered index baked in; no slot for custom item rendering. | When the second consumer needs a non-numbered list, evolve into a `<List>` + `<ListRow>` primitive pair. |
| `ScreenHeader` | (Resolved this phase) `right` → `trailing`. | Done — no callers were affected. |

---

## 12g. Component inventory + status

Every primitive carries a status label. Beta primitives are subject
to API change between releases without notice; stable primitives
follow the migration discipline in §12f.

| Component | Status | Purpose | Variants | Sizes | A11y requirements |
|---|---|---|---|---|---|
| `AppShell` | stable | Page shell + safe area + 430px max-width. | — | — | Wraps `<main>` content; consumer owns landmark roles. |
| `AuroraBackground` | stable | Static radial-gradient aurora. | — | — | `aria-hidden` (decorative). |
| `BrandMark` | stable | YVR Concierge lockup. | — | — | `aria-label="YVR Concierge"`. |
| `ScreenHeader` | stable | Back chip + step label / trailing content. | — | — | Back link has `aria-label` (default "Go back"). |
| `Heading` | stable | Display / title headings. | `display`, `title` | `display`, `title` (via `size`) | One `<h1>` per page (default `as="h1"`); consumer picks `as` for subsequent. |
| `Eyebrow` | stable | Small uppercase label. | `primary`, `secondary` (via `tone`) | — | Decorative; pair with a `<Heading>`. |
| `Card` | stable | Single source of glass-card chrome. | — | `none`, `compact`, `default`, `lg` (via `padding`) | Non-interactive by default; consumer adds role if needed. |
| `Button` | stable | Primary / ghost CTA. | `primary`, `ghost` | — | Tap target ≥ 44; icon-only requires `aria-label`. Loading sets `aria-busy`. |
| `Toggle` | stable | Accessible on/off switch. | — | — | `role="switch" aria-checked` + required `ariaLabel`. `aria-busy` while pending. |
| `IconTile` | stable | Translucent icon chip. | — | numeric `size` | Decorative; the inner icon should be `aria-hidden`. |
| `FeatureList` / `FeatureListItem` | stable | Numbered feature rows. | — | — | Renders `<ol>`; trailing index is `aria-hidden`. |
| `AuthOption` / `AuthOptionGroup` | stable | Stacked sign-in provider rows. | — | — | Each row is a `<button>` with `aria-label` (defaults to `label`). Group composes `<Card>`. |
| `PermissionCard` | stable | Permission card with embedded `Toggle`. | — | — | Toggle's `ariaLabel` is required via `toggleAriaLabel`. |
| `Skeleton` | beta | Async-loading placeholder block. | — | numeric `width`/`height` | `aria-hidden`; parent region sets `aria-busy`. |
| `EmptyState` | beta | Centered "no content yet" panel. | — | — | Content, not a live region. |
| `ErrorState` | beta | Centered "something went wrong" panel. | — | — | `role` prop chooses `status` (polite, default) or `alert`. |
| `InlineAlert` | beta | Flat status banner. | `info`, `success`, `warning`, `danger`, `neutral` | — | `role` prop chooses `status` (default) or `alert`. |
| `icons` (module) | stable | Inline SVG icon set incl. `SpinnerIcon`. | — | numeric `size` | All icons default to `aria-hidden`; meaningful icons get `aria-label` from the parent button. |

Status legend:

- **stable** — API is committed; breaking changes require a documented migration.
- **beta** — recently introduced; API may change. Document any consumer that adopts it so future API moves don't surprise.
- **internal** — used inside one consumer only; not yet ready for general use. (None right now.)
- **deprecated** — slated for removal; do not adopt in new code. (None right now.)

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
| `Skeleton` | `src/components/Skeleton.tsx` | Glass-tinted placeholder block for async-loading regions. |
| `EmptyState` | `src/components/EmptyState.tsx` | Centered "no content yet" panel. Composes `Card`. |
| `ErrorState` | `src/components/ErrorState.tsx` | Centered "something is wrong" panel with retry. Composes `Card`. |
| `InlineAlert` | `src/components/InlineAlert.tsx` | Flat status banner for inline live data (gate change, delay). |
| `icons` | `src/components/icons.tsx` | Inline SVG icons + brand marks (incl. `SpinnerIcon`). |

---

## Appendix B — Adding a new primitive

1. Propose it here first (3 lines: what, where used, what tokens).
2. Confirm with the user before writing JSX.
3. Add the component to `src/components/` with one tight responsibility.
4. Document it under "Components inventory" above.
5. Use only tokens — no inline hex, no off-scale spacing, no custom shadows.
