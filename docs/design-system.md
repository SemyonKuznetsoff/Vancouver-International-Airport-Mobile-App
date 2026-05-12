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
| `/home` (Home — No Trip state) | n/a — tab root | `/trips/new`, `/trips/import`, `/security`, `/parking`, `/transport`, `/home/departing`, `/home/arriving`, `/home/pickup`, `/map`, `/services`, `/services/<category>`, `/profile`, `/profile/notifications` (placeholders today) |
| `/profile` (Profile main) | n/a — tab root | `/profile/saved-trips`, `/profile/settings`, `/profile/personal`, `/profile/payment`, `/profile/security`, `/profile/preferences`, `/profile/notifications`, `/profile/vault`, `/saved`, `/support`, `/flights/<id>`, `/flights/<id>/navigate` (placeholders today) |
| `/profile/saved-trips` (Saved Trips) | `/profile` | `/flights/<id>`, `/flights/<id>/navigate`, `/profile/saved-trips/all` (placeholders today) |

**Onboarding root vs. authenticated Home.** `/` is still the onboarding /
welcome flow for unauthenticated users. `/home` is the **authenticated
Home tab root** — specifically the "No Trip yet" state. Eventually
authenticated users should be redirected from `/` to `/home`; until that
gate exists, both routes coexist and the BottomTabBar's Home tab points
at `/home`.

When new routes are added, append rows to this table in the same PR.

---

## 2a. Onboarding screen patterns

The canonical layouts for the onboarding flow (`/`, `/onboarding/sign-in`,
`/onboarding/permissions`). Copying any of these into a future onboarding
screen should produce a screen that feels like the same product. These
rules were finalised after the May 2026 onboarding consistency audit; the
three current screens are the reference implementations.

### Top rhythm

- Non-root step screens use `<ScreenHeader>` followed by **`mt-8` (32px)**
  on the first eyebrow + heading section.
- `mt-12` (48px) after a `<ScreenHeader>` is **not** the default. Use it
  only with a one-line justification in the PR description (e.g. a screen
  with no eyebrow whose hero needs extra drop).
- The root welcome screen (`/`) uses `pt-2` from `<BrandMark>` and `mt-8`
  to its first content section.

### Bottom CTA group

Pin the CTAs with this pattern, identically across all three onboarding
screens:

```tsx
<div className="mt-auto flex flex-col gap-3 pt-8 pb-2">
  <Button variant="primary" …>{primaryLabel}</Button>
  <Button variant="ghost" …>{escapeLabel}</Button>
</div>
```

- `mt-auto` pushes the group to the bottom of the column.
- `pt-8` (32px) guarantees breathing room above on short viewports.
- `gap-3` (12px) is the primary/ghost stack rhythm.
- `pb-2` (8px) sits above `AppShell`'s
  `max(env(safe-area-inset-bottom), 16px)` — do **not** re-add safe-area
  padding here.
- The pattern is **primary + ghost**: one navy pill for the main action,
  one text-link for the escape path. Skip the ghost only when the screen
  has no escape (e.g. a forced confirmation — none today).
- **Do not** invent bespoke spring spacers
  (`<div className="min-h-N max-h-N flex-grow" />`, fixed-height shims).
  They drift between screens; `mt-auto` does not.

### Trust line

One canonical pattern, applied identically across screens:

```tsx
<p className="inline-flex items-center gap-2 text-label text-[var(--color-text-secondary)]">
  <ShieldCheckIcon size={12} />
  <span>{copy}</span>
</p>
```

- 12px leading icon (`ShieldCheckIcon`, `LockIcon`, etc. from
  `icons.tsx`).
- `gap-2` (8px), `items-center`, `text-label` — do **not** override the
  role's tracking.
- Copy is **factual and short** — one line at 375px, no marketing
  reassurance. See `content-guide.md` §6 for wording rules.
- If a third trust line lands, promote a `<TrustLine icon={…}>{…}</TrustLine>`
  primitive that bakes this composition. Until then, keep the inline form
  identical across the two onboarding instances.

### Divider label ("Or")

Inline labels inside a hairline divider use `<Eyebrow tone="secondary">`,
not a hand-rolled `<span>` with manual tracking:

```tsx
<div className="mt-8 flex items-center gap-3">
  <span className="h-px flex-1 bg-[var(--color-border)]" />
  <Eyebrow tone="secondary">Or</Eyebrow>
  <span className="h-px flex-1 bg-[var(--color-border)]" />
</div>
```

- Never combine `text-micro` with `tracking-[0.22em]` to imitate eyebrow
  styling — that fights the type-role system.
- If the existing eyebrow size doesn't fit a future case, propose a new
  role token; don't paper over it inline.

### Icon-chip chrome inside cards

- Any 28px / 40px icon chip inside a card or row uses
  `<IconTile size={N}>{icon}</IconTile>`, the single source for icon-chip
  chrome. `BrandMark`, `EmptyState`, and `PermissionCard` all consume it.
- **Do not** hand-roll
  `inline-flex h-N w-N rounded-2xl bg-[var(--color-surface-elevated)]`
  inside a card. `rounded-2xl` (16px) is off the radius-token scale; the
  IconTile primitive paints the chip at the documented chip radius (10px)
  and stays in sync if the token retunes.
- If a future card needs a softer corner on its tile, add a `radius` prop
  to `IconTile` rather than inlining the override.

---

## 2b. Authenticated screen patterns

The canonical layout for any screen that lives inside the logged-in app
(Profile today; Home, Flights, Map, Services next). The Profile main
screen (`/profile`) is the **reference implementation** — copying its
structure into a future authed screen should produce a screen that feels
like the same product.

### Shell + tab bar

```tsx
<AppShellAuthed>
  <LargeTitleHeader title="Profile" subtitle="Your travel command center" trailing={…} />
  <div className="mt-8 flex flex-col gap-8 px-6 pb-8">
    …content…
  </div>
</AppShellAuthed>
```

- **Always `AppShellAuthed`**, never `AppShell`. The five tabs surface
  routes that don't exist for unauthenticated users — onboarding uses
  `AppShell`; the authed app uses `AppShellAuthed`.
- `BottomTabBar` is rendered automatically by `AppShellAuthed`. Active-tab
  detection is driven by `usePathname()` — placing the page at the matching
  route lights up the correct tab. **Do not** pass `activeHref` unless the
  pathname can't be trusted.
- **Top rhythm:** the `LargeTitleHeader` block is followed by `mt-8` (32px)
  on the first content container. Section-to-section gap inside the column
  is `gap-8` (32px). Page horizontal gutter stays `px-6`.
- **No bottom padding for safe area.** `BottomTabBar` owns the bottom
  inset; the page must not re-add `paddingBottom: env(safe-area-inset-bottom)`.
  Reserve a content `pb-8` so the last block doesn't touch the tab bar.

### Header trailing slot

Trailing icon buttons in the header (settings gear, notification bell,
filter, etc.) use the same 44×44 chip as the back chip:

```tsx
<a
  href="/profile/settings"
  aria-label="Open settings"
  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated-hover)]"
>
  <SettingsIcon size={18} />
</a>
```

If this lockup appears on a second authed screen, promote it to a
`HeaderIconButton` primitive — until then, keep the inline form identical
to the Profile example so the chrome stays consistent.

### Profile identity hero card

The dark teal identity card on `/profile` is **screen-local** today: it
composes inline using the §5 hero-surface semantic tokens
(`--color-surface-hero-*`) plus glass tile children for the four stat
pills inside. It is **not** a `<Card>` — Card hard-codes the glass fill.

If a second hero card appears (e.g. a "Membership" panel on a future
screen), promote the inline composition to a `<HeroCard>` primitive
before duplicating the gradient. Until then:

- Use the `--color-surface-hero-*` tokens for the gradient, foreground,
  inner glass tiles, chip borders, and avatar surface.
- Use `--color-hero-tier-gold-*` for a loyalty-tier chip. Never use the
  status tones (`success` / `warning` / `danger`) decoratively — status
  is reserved for live data per §5.

### Settings / vault row groups

Use `<SettingsRow>` for every row in a settings or vault list (Personal
Information, Payment Methods, Travel Preferences, Notifications, Saved
Places, Help & Support, etc.). Group rows inside a single `<Card>` with
hairline dividers between them:

```tsx
<Card
  padding="none"
  className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]"
>
  <SettingsRow href="/profile/personal" icon={<IdCardIcon size={18} />} title="Personal information" description="Passport · Date of birth · Contact" />
  <SettingsRow href="/profile/payment" icon={<CreditCardIcon size={18} />} title="Payment methods" description="Visa ····4821 · Apple Pay" trailing={<CountBadge>2</CountBadge>} />
  <SettingsRow href="/profile/security" icon={<LockIcon size={18} />} title="Security & password" description="2FA active · Updated 30 days ago" trailing={<StatusPill tone="success" size="sm" leadingDot>Secure</StatusPill>} />
</Card>
```

- **Never hand-roll a row** (icon + title + description + chevron flexbox)
  inside a page file. Use `<SettingsRow>`. See §12l.
- Section header above the group uses an inline `<h2>` at
  `text-section-title` plus a `text-label` subtitle, with a small
  `text-body-sm font-semibold` text link on the trailing edge (e.g.
  "Manage"). A `Button variant="ghost"` would be 44px tall and would
  dominate the section header — keep it as a plain link.

### Trip / next-trip card

Use `<Card padding="none">` and compose the trip card content inside:

```tsx
<Card as="article" padding="none" aria-label="Next trip">
  <header className="px-4 pt-4 pb-4">…airline + StatusPill…</header>
  <div className="border-t border-[var(--color-border-soft)] px-4 pt-4">
    <RouteTimeline origin={origin} destination={destination} duration="10h 45 · Nonstop" />
  </div>
  <div className="mx-4 mt-4 flex … bg-[var(--color-surface-tile)] …">
    <GateDisplay gate="D73" terminal="Intl" />
    <MetricBlock label="Boarding" value="13:55" align="left" />
    <MetricBlock label="Seat" value="14A" align="left" />
  </div>
  <div className="flex flex-col gap-2 px-4 pt-4 pb-4">
    <Button variant="primary" leadingIcon={<NavigationIcon size={16} />} href="…">Navigate to gate</Button>
    <Button variant="ghost" href="…">View trip details</Button>
  </div>
</Card>
```

- Route visualisation uses `<RouteTimeline>` (not `<AirportCodePair>`).
  See §12h for when to pick which.
- Gate / Boarding / Seat strip uses **`<GateDisplay>`** for the gate
  column and `<MetricBlock align="left">` for Boarding + Seat, with
  `--color-surface-tile` as the strip fill and `--color-border-soft`
  vertical dividers. `<GateDisplay>` is **required** for every gate
  value — never pass a gate identifier to `<MetricBlock>` (that would
  put "GATE" on the bottom and lose the `terminal` prop). `<MetricBlock>`
  stays the right primitive for general metrics like times, durations,
  percentages, and seat numbers.
- `<RouteTimeline>` and `<GateDisplay>` are designed to **compose
  together** inside a hero trip card: the timeline carries the
  origin → destination story, the gate strip below carries the boarding
  detail. See the example above and §12h for the atom rules.
- **CTAs stack vertically** inside the card: `Button variant="primary"`
  above `Button variant="ghost"`, full-width each. The Figma reference
  shows a side-by-side primary + secondary pair at ~46px height; we use
  the system's stacked primary + ghost so trip-card actions match the
  rest of the app. If a future iteration needs side-by-side actions
  inside a card, propose a `Button size="compact"` variant first.

### Card surfaces in the authed app

The Profile Figma mockup renders the trip card and vault row groups as
**solid white** cards. The system ships them as the translucent `<Card>`
glass surface (`--color-surface-card`). This is a deliberate deviation:
keeps surface continuity with onboarding and lets the aurora background
show through. **Do not** re-author solid-white card chrome inline; if a
genuinely solid surface is required, add a `tone` prop to `<Card>` first.

### Footer version line

A small centred app-version line at the bottom of the screen renders as:

```tsx
<p className="text-center text-label tabular-nums text-[var(--color-text-muted)]">
  YVR Concierge · v4.12.0
</p>
```

`tabular-nums` keeps the version numerals from shimmying when the build
rolls.

### No Trip Home pattern

`/home` is the **authenticated Home tab root** when the user has no
active saved trip. The screen's only job is to answer one question:
*"What can I do before I have a trip saved?"* — and the layout is
calibrated to that single question. The reference implementation is
[src/app/home/page.tsx](../src/app/home/page.tsx). Future tab roots
(Flights, Map, Services) should copy this skeleton.

**Hierarchy.** Top-to-bottom strictly follows this order:

1. **Add or import a trip.** The hero card is the screen's single
   primary action surface. It contains a context chip (weather /
   airport conditions), the screen's `<h1>` (`Heading size="display"
   tone="hero">`), a one-line supporting paragraph, the
   search + Add Trip composite, and a ghost "Scan boarding pass or
   import booking" link. No other section may compete with this card
   for attention.
2. **Live YVR status.** A single row of three live metric columns
   inside one `<Card padding="none">` — Security, Parking, SkyTrain.
   Every value uses `<MetricBlock>`. The section eyebrow pairs with
   a `<LiveIndicator status="live" label="…">` and a right-aligned
   "Updated · just now" `text-label` timestamp.
3. **Common airport tasks** — the "I'm here to" grid (one dark hero
   CTA + two compact tiles + a wide explore-the-airport
   `<SettingsRow>`), then an optional unlock-concierge banner that
   re-routes to Add Trip, then the airport-services list rendered as a
   `<Card padding="none">` group of `<SettingsRow>`s.

**Rules.** The Home screen MUST NOT:

- Surface promotional content above the main action.
- Place a duplicate Add Trip CTA in the hero (the search composite is the
  single CTA).
- Render an `<EmptyState>` as the main content — the hero card *is* the
  no-trip empty state.
- Use status tones (`success` / `warning` / `danger`) decoratively
  outside live data (Security "Low" status, parking availability,
  SkyTrain next-train timing).

**Known Home-specific composition patterns (current one-offs).** These
are documented exceptions until promotion paths land. New screens may
copy them, but only on equivalent surfaces — do not export them to
on-aurora contexts.

- **Hero search + Add Trip composite.** `SearchField` has no
  trailing-CTA slot today, so the hero's "Flight, airline or city"
  input + "+ Add Trip" pill is composed inline inside a
  `rounded-[var(--radius-panel)]` wrapper on the mist surface. Allowed
  on `/home` for now. **Future improvement:** extend `SearchField` with
  a `trailingAction` slot, then refactor `/home` onto the canonical
  primitive.
- **Header notification + avatar chips.** The 44×44 round chips at the
  top-right (bell + avatar) are composed inline in `/home`, mirroring
  the settings gear in Profile main and the back chip in Saved Trips.
  **Future improvement:** promote to a `HeaderIconButton` primitive
  once a fourth consumer needs it.
- **Hero-surface icon chips.** The 36×36 rounded-pill chip on the
  Departing CTA hero card and the live-sync pill on Saved Trips share
  the same hero-token chrome (`--color-surface-hero-chip*` +
  `--radius-pill`). **Future improvement:** extend `IconTile` with
  `tone="hero"` + `radius="pill"` so hero-surface chips consume the
  canonical primitive.

**Loading / empty / error.**

- *Loading:* swap each section's payload for matching `<Skeleton>`
  blocks; wrap each section in `aria-busy={loading}`. The hero's
  heading text stays visible — it's product copy, not data.
- *Empty:* the screen's reason-to-exist. The hero card *is* the empty
  state; do not nest a generic `<EmptyState>`.
- *Error (live YVR feed unreachable):* swap the live-metric `<Card>`
  for `<InlineAlert variant="warning" description="We can't reach live
  airport data right now." action={…} />`. Hero and intent grid stay
  rendered.

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

### Hero tone (inverse surface)

The dark teal hero surface (Profile identity card, Saved Trips header)
inverts the default text colour. `<Heading>` and `<Eyebrow>` expose a
`tone="hero"` prop that maps the foreground onto the §5 hero tokens —
`--color-surface-hero-fg` for the heading and
`--color-surface-hero-fg-muted` for the eyebrow:

```tsx
<header className="… (gradient using --color-surface-hero-* tokens) …">
  <Eyebrow tone="hero">Your Travel Vault</Eyebrow>
  <Heading size="title" tone="hero">Saved Trips</Heading>
  <p className="text-body text-[var(--color-surface-hero-fg-muted)]">
    Welcome back, Alex — your next journey is ready.
  </p>
</header>
```

| Component | Default tone | Hero tone consumes |
|---|---|---|
| `<Heading>` | `tone="primary"` → `--color-text-primary` | `tone="hero"` → `--color-surface-hero-fg` |
| `<Eyebrow>` | `tone="primary"` / `tone="secondary"` | `tone="hero"` → `--color-surface-hero-fg-muted` |

**Use `tone="hero"` only on a hero-surface background.** It is not a
generic "light text" toggle. On the aurora background or inside a glass
`<Card>`, hero-toned text will fail contrast. The intended surfaces are
documented in §5 (`--color-surface-hero-*` tokens) and §2b (authenticated
screen patterns). The reference implementation is the Saved Trips header
([src/app/profile/saved-trips/page.tsx](../src/app/profile/saved-trips/page.tsx))
where the eyebrow + heading sit on the dark travel-vault gradient.

Trailing body copy on a hero surface still uses an inline
`text-body text-[var(--color-surface-hero-fg-muted)]` cluster — it's a
single-line supporting paragraph rather than a heading role, so a
component-level `tone` prop would be over-engineering for a one-line
caption.

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
| `--color-surface-hover` | `--white-a30` | Hover tint on translucent rows (e.g. `AuthOption`, `SettingsRow`). |
| `--color-surface-pressed` | `--white-a40` | Pressed tint on translucent rows. |
| `--color-surface-tile` | `rgba(29,53,87, 0.06)` (navy @ 6%) | Warm inner-card tile fill. Use for the leading `<IconTile>` inside `<SettingsRow>`, the trip card's gate/boarding/seat strip, and the trip-card header airline chip. Distinct from `--color-surface-elevated`, which is translucent over aurora — this tone is meant to sit **inside** a card. |

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

### Semantic — Hero surface

The dark teal **profile identity** card on `/profile` (and any future
premium / membership hero panel) lives on its own surface. The hero
surface tokens are the **only** correct way to render dark-teal content
in the app — never inline `linear-gradient(…, #0e4a4e, …)` or raw
`rgba(255,255,255, …)` foregrounds.

| Token | Value | Usage |
|---|---|---|
| `--color-surface-hero-start` | `#0e4a4e` | Hero gradient start stop. |
| `--color-surface-hero-end` | `#0a3a3d` | Hero gradient end stop. |
| `--color-surface-hero-fg` | `#ffffff` | High-contrast text on the hero surface. |
| `--color-surface-hero-fg-muted` | `rgba(255,255,255, 0.65)` | Secondary text on the hero surface (email, stat labels, `LiveIndicator` label). |
| `--color-surface-hero-fg-soft` | `rgba(255,255,255, 0.55)` | Tertiary text on the hero surface (sync footnote). |
| `--color-surface-hero-tile` | `rgba(255,255,255, 0.08)` | Inner glass tile fill on the hero (stat pills). |
| `--color-surface-hero-tile-border` | `rgba(255,255,255, 0.1)` | Border on hero glass tiles. |
| `--color-surface-hero-chip` | `rgba(255,255,255, 0.1)` | Membership chip fill on the hero. |
| `--color-surface-hero-chip-border` | `rgba(255,255,255, 0.16)` | Border on hero membership chips. |
| `--color-surface-hero-avatar` | `rgba(255,255,255, 0.12)` | Initial-monogram avatar tile fill. |
| `--color-surface-hero-avatar-border` | `rgba(255,255,255, 0.18)` | Avatar tile border. |

**Gradient lockup.** The hero surface is always painted as a
`linear-gradient(167deg, var(--color-surface-hero-start) 8%, var(--color-surface-hero-end) 92%)`.
Do not alter the angle or stops without updating this section.

### Semantic — Membership tier

Loyalty-tier accents used **only** on the hero surface. Not a status
colour — never use these for live data, never use them outside the
hero surface.

| Token | Value | Usage |
|---|---|---|
| `--color-hero-tier-gold-bg` | `rgba(200,164,92, 0.15)` | Gold-tier chip fill (Aeroplan Gold, Star Alliance Gold). |
| `--color-hero-tier-gold-border` | `rgba(200,164,92, 0.4)` | Gold-tier chip border. |
| `--color-hero-tier-gold-fg` | `#e1c685` | Gold-tier chip foreground (icon + label). |

If a new tier (Aeroplan Diamond, Silver, etc.) is introduced, add a
parallel `--color-hero-tier-<name>-{bg,border,fg}` trio. Never reuse
`--color-warning` or `--color-success` for a tier badge.

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
| `Heading` | stable | Display / title headings. | `display`, `title`; `tone="primary" \| "hero"` | `display`, `title` (via `size`) | One `<h1>` per page (default `as="h1"`); consumer picks `as` for subsequent. `tone="hero"` only on a hero surface. |
| `Eyebrow` | stable | Small uppercase label. | `tone="primary" \| "secondary" \| "hero"` | — | Decorative; pair with a `<Heading>`. `tone="hero"` only on a hero surface. |
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
| `RouteTimeline` | beta | Split origin/destination + dashed centre line + plane glyph + duration. Travel atom. | — | — | `aria-label="<origin> to <destination>"` on the wrapper; dots / dashed line / icon are `aria-hidden`. |
| `SettingsRow` | beta | Authed-app settings / vault list row (icon + title + description + optional trailing + chevron). | — | — | Renders as `<Link>` or `<button>` — global `:focus-visible` ring; chevron is `aria-hidden`; tap target ≥ 44px tall. |
| `icons` (module) | stable | Inline SVG icon set incl. `SpinnerIcon`. | — | numeric `size` | All icons default to `aria-hidden`; meaningful icons get `aria-label` from the parent button. |

Status legend:

- **stable** — API is committed; breaking changes require a documented migration.
- **beta** — recently introduced; API may change. Document any consumer that adopts it so future API moves don't surprise.
- **internal** — used inside one consumer only; not yet ready for general use. (None right now.)
- **deprecated** — slated for removal; do not adopt in new code. (None right now.)

---

## 12h. Travel data atoms

Six reusable primitives for the data shapes the YVR app shows on every
live-data screen: flight status, gates, boarding times, security waits,
parking availability, countdowns, airport-pair journeys. **No screen
may invent its own typography or chrome for these values** — use the
atoms or extend them in this section before writing inline markup.

```
StatusPill        →  live flight / parking / security state
LiveIndicator     →  data-freshness signal ("LIVE" / "SYNCED" / "STALE")
MetricBlock       →  value-first metric (security wait, walking time, %)
CountdownBlock    →  label-first time-relative metric (boarding in 42 min)
AirportCodePair   →  YVR → SFO inline header with optional flight + city pair
RouteTimeline     →  split origin/destination + dashed line + plane + duration
GateDisplay       →  GATE / D73 with optional terminal + helper
```

### StatusPill

```tsx
<StatusPill tone="success" leadingDot>On time</StatusPill>
<StatusPill tone="warning">Boarding</StatusPill>
<StatusPill tone="danger" size="sm">Delayed 40 min</StatusPill>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `"success" \| "warning" \| "danger" \| "info" \| "neutral"` | `"neutral"` | Picks the status surface trio (bg + border + fg). |
| `size` | `"sm" \| "md"` | `"md"` | `sm` = 20px tall, `md` = 28px tall. Both use `text-micro` so the label scans identically. |
| `leadingDot` | `boolean` | `false` | 6px filled dot at `currentColor` (the variant fg). |
| `children` | `ReactNode` | — | The label. Keep it short — content-guide §3. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** Pill (`--radius-pill`), 1px border, status surface fill,
status surface fg, `text-micro uppercase`. Single-line content.

**Do**

```tsx
<StatusPill tone="success" leadingDot>On time</StatusPill>
<StatusPill tone="danger">Gate changed</StatusPill>
```

**Don't**

```tsx
// ❌ Rolling a custom pill in a page file.
<span className="rounded-full bg-green-100 text-green-800 px-2 py-1 text-[10px]">…</span>

// ❌ Using tone for decoration (status surfaces are reserved for live data).
<StatusPill tone="success">Vancouver</StatusPill>
```

### LiveIndicator

```tsx
<LiveIndicator status="live" label="Live" pulse />
<LiveIndicator status="synced" label="Synced" />
<LiveIndicator status="stale" label="Stale" />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `status` | `"live" \| "synced" \| "stale"` | `"live"` | Maps to `--color-success` / `--color-text-muted` / `--color-warning` for the dot. |
| `label` | `string` | (required) | "LIVE" / "SYNCED" / "STALE" — content carries the meaning. |
| `pulse` | `boolean` | `false` | Adds a soft expanding-ring `animate-ping` on the dot. Only fires when `status === "live"`. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** Small dot (8px) + uppercase `text-micro` label. `aria-label`
on the wrapper carries the label so screen readers don't read the dot.
The label `<span>` is `aria-hidden` to avoid double-announce.

**Reduced motion.** `animate-ping`'s duration collapses to ~0ms via the
global `prefers-reduced-motion: reduce` rule — the dot stays static and
visible. No extra component logic.

### MetricBlock

```tsx
<MetricBlock value="8 min" label="Security wait" />
<MetricBlock value="72%" label="Parking" tone="warning" align="center" />
<MetricBlock value="420 m" label="Walk to D73" helper="8 min walk" />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `ReactNode` | (required) | Renders at `text-title tabular-nums`. Pass the formatted string ("8 min", "72%", "420 m") per content-guide §6. |
| `label` | `string` | (required) | `text-micro uppercase`, secondary colour. |
| `helper` | `string` | — | Optional second line at `text-label` muted. |
| `tone` | `"neutral" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Tints **the value only**. Label + helper stay neutral. |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Useful when laying out a strip of metrics. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** Value (top, large, tabular-nums) → label (small uppercase)
→ optional helper. Value-first scanning.

**When to use which.** `MetricBlock` is the **stand-alone metric** —
"security wait is 8 min." `CountdownBlock` is the **time-until** form
— "boarding in 42 min." Pick by which one a user would say aloud.

**Never use `MetricBlock` for gate values.** Gates are not general
metrics — they carry a `terminal` prop and a canonical "GATE" eyebrow.
Use `<GateDisplay>` instead (see below). The lint check can't catch
this swap because both primitives consume valid tokens; treat it as a
contract violation on review.

### CountdownBlock

```tsx
<CountdownBlock value="42 min" label="Boarding in" tone="warning" />
<CountdownBlock value="8 min" label="Walk" />
<CountdownBlock value="52 min" label="Buffer" tone="success" />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `ReactNode` | (required) | `text-title tabular-nums`. |
| `label` | `string` | (required) | `text-eyebrow uppercase` — sits **above** the value (countdowns are context-first). |
| `tone` | `"neutral" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Tints the value as time tightens. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** Eyebrow label (top) → value (large, tabular-nums). The
label-first order is the only visual difference from `MetricBlock` and
it carries semantic intent.

### AirportCodePair

```tsx
<AirportCodePair origin="YVR" destination="SFO" />
<AirportCodePair
  origin="YVR"
  destination="NRT"
  flightNumber="AC003"
  subtitle="Vancouver → Tokyo Narita"
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `origin` | `string` | (required) | Three-letter IATA code; rendered uppercase. |
| `destination` | `string` | (required) | Same. |
| `flightNumber` | `string` | — | Joined with subtitle by ` · `. |
| `subtitle` | `string` | — | Free-form, e.g. the city pair. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** `text-title tabular-nums uppercase` for the code pair with
a `→` (U+2192) separator. Support line below at `text-label`. The
`<span>` carrying the code pair has `aria-label="<origin> to <destination>"`;
the arrow is `aria-hidden` so screen readers read "YVR to SFO".

**Formatting.** Per [content-guide.md](./content-guide.md) §6:
- Codes are always 3 uppercase letters.
- Arrow is `→` (U+2192). Never `->` or `>`.
- City name only appears in `subtitle`, never inside the code pair.

### RouteTimeline

```tsx
<RouteTimeline
  origin={{ code: "YVR", city: "Vancouver", time: "14:35" }}
  destination={{ code: "NRT", city: "Tokyo", time: "17:20", offset: "+1" }}
  duration="10h 45 · Nonstop"
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `origin` | `{ code, city, time, offset? }` | (required) | Left endpoint. `code` is 3-letter IATA (rendered uppercase). `time` is 24-hour `HH:MM`. `offset` is the day suffix beside the time (`"+1"` for next-day arrival). |
| `destination` | `{ code, city, time, offset? }` | (required) | Right endpoint. Same shape. |
| `duration` | `string` | — | Centre-line label, e.g. `"10h 45 · Nonstop"` or `"12h 10 · 1 stop"`. Per content-guide §6, use `h` + bare minutes (no `min`). |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** Three columns inside a flex row: left endpoint block,
centre column (dashed hairline + plane glyph + duration label), right
endpoint block. Codes render at `text-title tabular-nums uppercase`
(identical to `AirportCodePair`). City at `text-label` secondary. Time
at `text-body-sm tabular-nums` primary, with optional offset in
secondary colour beside it.

**Accessibility.** The wrapper carries `aria-label="<origin> to
<destination>"` so screen readers announce "YVR to NRT". All decorative
parts (dots, dashed line, plane icon) are `aria-hidden`.

**When to use `RouteTimeline` vs `AirportCodePair`.**

| Use `AirportCodePair` | Use `RouteTimeline` |
|---|---|
| Inline single-line header (`YVR → SFO`) on a flight card, search result, or notification. | Hero trip card where origin + destination need their own city / time stacks split across the card width. |
| Mid-density list rows where vertical space is at a premium. | Profile next-trip card, Trip detail header, connection timeline, boarding-pass detail. |
| The subtitle line carries the flight number + city pair as a single string. | Each endpoint owns its own city + time; the centre line carries duration + stop pattern. |

Both primitives render the codes with the same typography
(`text-title tabular-nums uppercase`) so a screen that mixes them keeps
visual rhythm.

**Do**

```tsx
// Hero trip card on Profile.
<Card padding="none">
  <RouteTimeline origin={origin} destination={destination} duration="10h 45 · Nonstop" />
</Card>

// Inline header on a flight search result.
<AirportCodePair origin="YVR" destination="SFO" flightNumber="AC123" />
```

**Don't**

```tsx
// ❌ Inlining the split layout in a page file.
<div className="flex justify-between">
  <span className="text-title font-bold">YVR</span>
  <PlaneIcon />
  <span className="text-title font-bold">NRT</span>
</div>

// ❌ Embedding RouteTimeline inside another card-shaped primitive
// (e.g. EmptyState) — atoms don't nest inside elevation primitives.
```

### GateDisplay

```tsx
<GateDisplay gate="D73" />
<GateDisplay gate="D73" terminal="M" helper="Domestic" />
<GateDisplay gate="A1" terminal="A" helper="Pre-clearance" />
<GateDisplay size="compact" gate="—" terminal="Intl" />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `gate` | `string` | (required) | The bare gate identifier — `"D73"`, not `"Gate D73"`. The component renders the "GATE" eyebrow (default) or the `Gate` prefix (compact). Use `"—"` for a TBD gate. |
| `terminal` | `string` | — | Default size renders as `"Terminal <X>"` on the support line. Compact joins terminal + gate inline (`Gate Intl · —`). |
| `helper` | `string` | — | Appended after the terminal join with ` · `. |
| `size` | `"default" \| "compact"` | `"default"` | Picks the layout. See sizes below. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy (default).** Eyebrow `GATE` (top) → value (large, tabular-nums,
uppercase) → optional support line at `text-label`. Use on the boarding
strip, hero trip card, and boarding-pass detail.

**Anatomy (compact).** Single inline line at `text-label` /
`tabular-nums` / `text-secondary`:
`Gate <terminal · gate · helper>`. The `Gate` word stays as the prefix
so the row reads naturally in a screen-reader linear walk. Use inside
small list-card meta rows (e.g. saved-journey card) where the default's
three-line stack would overwhelm the row. When both terminal and gate
are passed, the join order is `terminal · gate` so a known terminal
with a TBD gate still surfaces useful information (`Gate Intl · —`).

**Required for every gate value.** Anywhere the app shows a gate
identifier — flight card, boarding pass, next-trip strip, journey
timeline, saved-journey meta row — render it through `<GateDisplay>`.
Do not pass a gate to `<MetricBlock>`, do not inline `<p>Gate D73</p>`,
do not concatenate terminal + gate into a single string at the call
site. Pick `size="default"` when the gate is a primary card metric and
`size="compact"` when it sits among other facts in a single-line meta
row. `<GateDisplay>` and `<RouteTimeline>` are designed to compose
inside a hero trip card — timeline carries origin → destination,
GateDisplay carries the gate column of the boarding strip.

### Do / Don't (cross-cutting)

**Do**

```tsx
// A flight card composed from atoms.
<Card>
  <AirportCodePair origin="YVR" destination="SFO" flightNumber="AC123" />
  <div className="mt-6 flex items-end justify-between">
    <CountdownBlock value="42 min" label="Boarding in" tone="warning" />
    <GateDisplay gate="D73" terminal="M" />
  </div>
  <div className="mt-4 flex items-center justify-between">
    <StatusPill tone="warning" leadingDot>Boarding soon</StatusPill>
    <LiveIndicator status="live" label="Live" pulse />
  </div>
</Card>
```

**Don't**

```tsx
// ❌ Hand-rolling a status pill in a page file.
<span className="bg-red-100 text-red-700 rounded-full px-2 py-1 text-xs">Delayed</span>

// ❌ Inlining the gate as bare text inside a card body.
<p className="text-lg">Gate D73</p>

// ❌ Rendering the gate through MetricBlock.
<MetricBlock label="Gate" value="Intl D73" />   // use <GateDisplay terminal="Intl" gate="D73" />

// ❌ Using → "by hand" inside a heading.
<h2 className="text-2xl">YVR → SFO</h2>

// ❌ Using StatusPill or LiveIndicator as decoration on non-live content.
<StatusPill tone="success">Welcome aboard</StatusPill>
```

### Composition rules

1. **Atoms do not nest inside each other.** A `CountdownBlock` does
   not contain a `StatusPill`; that's two atoms inside a row layout
   owned by the screen.
2. **Atoms do not own card chrome.** Wrap them in `<Card>` (or compose
   them inside `<EmptyState>` / `<ErrorState>`) when you need
   elevation.
3. **Numbers use the atoms or `tabular-nums`.** If a value needs to
   appear inline inside body copy, use `tabular-nums` on the wrapping
   `<span>` so adjacent numbers don't shimmy as they update.
4. **Status tone is reserved for live data.** Don't use the `tone`
   prop on `StatusPill` / `MetricBlock` / `CountdownBlock` for
   decorative purposes — `success` is for "on time", not for "good".

---

## 12i. Form & search primitives

Four primitives cover **every** input, search, and filter pattern. No
screen may roll its own `<input>`, `<button role="search">`, or
toggle-pill — use these atoms or extend them here first.

```
TextField     →  text/email/password/number entry, with label + validation
SearchField   →  app-level search (flights, places, services)
ChipFilter    →  multi-select filter pill (Departures / Food / Standard)
FieldMessage  →  helper / error / success / warning message below a field
```

### TextField

```tsx
<TextField
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={setEmail}
  helperText="We'll send your boarding pass here."
  required
  leadingIcon={<MailIcon size={16} />}
/>

<TextField
  label="Flight number"
  value={flight}
  onChange={setFlight}
  errorText="That flight number isn't recognised."
  autoComplete="off"
  inputMode="text"
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Renders above the field at `text-label`; bound to the input via `htmlFor`. |
| `placeholder` | `string` | — | Shown when empty; `text-muted` colour. |
| `value` | `string` | — | Controlled. Pair with `onChange`. |
| `defaultValue` | `string` | — | Uncontrolled initial value. Don't combine with `value`. |
| `helperText` | `string` | — | Neutral hint below the field. Hidden when `errorText` is set. |
| `errorText` | `string` | — | Validation error. Sets `aria-invalid`, `aria-describedby`, and triggers `FieldMessage` with `tone="error"`. |
| `leadingIcon` / `trailingIcon` | `ReactNode` | — | 16–18px icons rendered in the input row. |
| `disabled` | `boolean` | `false` | `opacity-[var(--opacity-disabled)] pointer-events-none` + native `disabled`. |
| `required` | `boolean` | `false` | Adds a danger-tinted ` *` after the label and `aria-required`. |
| `onChange` | `(next: string) => void` | — | Receives the next string (not the event). |
| `id` / `name` / `type` / `inputMode` / `autoComplete` | native input attrs | — | Pass-through. `id` defaults to a `useId()`-generated value. |

**States**

| State | Visual cue | A11y |
|---|---|---|
| Default | `--color-border` on `--color-surface-elevated`. | — |
| Focused | Border transitions to `--color-action-primary` via `:focus-within`. | Native focus (caret + screen-reader announce). |
| Filled | Same chrome as default; the value carries the state. | — |
| Error | `--color-danger` border. `FieldMessage` below with `role="alert"`. | `aria-invalid="true"` + `aria-describedby`. |
| Disabled | Wrapper at `--opacity-disabled`, no pointer events. | Native `disabled` on input. |

**Anatomy.** Label (optional) → 52px input row with border + leading/trailing
icon slots → `FieldMessage` (helper or error). All horizontal padding is
`px-4` (16px); gap between icon and input is `gap-3` (12px). Input text
uses the `text-body` role.

### SearchField

```tsx
<SearchField
  placeholder="Search flights, gates, places"
  value={query}
  onChange={setQuery}
  ariaLabel="Search YVR"
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `placeholder` | `string` | `"Search"` | — |
| `value` | `string` | `""` | Controlled. |
| `onChange` | `(next: string) => void` | — | Receives the next string. |
| `onClear` | `() => void` | — | Optional clear-only callback. Clear always also fires `onChange("")`. |
| `disabled` | `boolean` | `false` | Same dim pattern as TextField. |
| `ariaLabel` | `string` | `"Search"` | Bound to the input. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** Pill-shaped (`--radius-pill`) input row, 52px tall, leading
`SearchIcon` (18px) at `text-secondary`, then the input, then a
44×44 clear button that appears only when the field has content. Wrapper
is `role="search"`; the input is `type="search" role="searchbox"`.

**Why a separate primitive from TextField.** Search has a distinct
iOS-native chrome (pill, leading magnifier, clear button) and a
different a11y posture (`role="search"` region). Forcing it through
TextField would dilute both. They share the same surface tokens so the
visual relationship is preserved.

### ChipFilter

```tsx
<div role="group" aria-label="Filter results" className="flex flex-wrap gap-2">
  <ChipFilter selected={dep} onToggle={setDep}>Departures</ChipFilter>
  <ChipFilter selected={arr} onToggle={setArr}>Arrivals</ChipFilter>
  <ChipFilter selected={lay} onToggle={setLay}>Layovers</ChipFilter>
</div>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `selected` | `boolean` | (required) | Controlled. |
| `onToggle` | `(next: boolean) => void` | (required) | Receives the next state. |
| `disabled` | `boolean` | `false` | — |
| `children` | `ReactNode` | (required) | The chip label. Sentence case. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** 44px tall pill (`--radius-pill`) with `text-body-sm
font-medium` label. Selected state fills with `--color-action-primary`
and inverts text to `--color-action-primary-fg`. Unselected state uses
`--color-surface-elevated` with `--color-border` hairline.

**A11y.** Each chip is a real `<button>` with `aria-pressed`. The chip
row should be wrapped in a `<div role="group" aria-label="…">` by the
consumer so screen readers identify the filter cluster.

**Use cases.** Departures / Arrivals; Food / Shops / Services;
Standard / Accessible / Family; On time / Delayed / Cancelled.

### FieldMessage

```tsx
<FieldMessage tone="neutral">We'll send your boarding pass here.</FieldMessage>
<FieldMessage tone="error">Enter a valid email.</FieldMessage>
<FieldMessage tone="success">Saved.</FieldMessage>
<FieldMessage tone="warning">This number looks unusual — double-check.</FieldMessage>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `"neutral" \| "error" \| "success" \| "warning"` | `"neutral"` | Maps to text colour from the status fg tokens. |
| `children` | `ReactNode` | (required) | The message. Keep it short and verb-first per content-guide §4. |
| `id` | `string` | — | When set, `TextField` wires `aria-describedby` to this id. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** A single `<p>` at `text-label`. Error tone adds
`role="alert"` so screen readers announce validation results politely.

### Form anatomy

```
┌───────────────────────────────────────┐
│  Label                              * │   ← text-label, optional " *" if required
├───────────────────────────────────────┤
│ ◌  Input value                     ✕ │   ← 52px row, leading + trailing icon slots
├───────────────────────────────────────┤
│  Helper / error message               │   ← FieldMessage, optional
└───────────────────────────────────────┘
```

Vertical rhythm between sibling fields: `gap-4` (16px) inside a form
section, `gap-6` (24px) between sections.

### Validation rules

- **Inline error first.** `TextField` shows the error directly under
  the field via `errorText`. The parent form does not also surface the
  same error in a banner unless multiple fields share one root cause.
- **Verb-first error labels.** "Enter your email" not "Email is
  required." "Use a valid flight number" not "Invalid input."
- **No technical codes.** Never surface "HTTP 422", "ValidationError",
  or stack traces. Translate at the form layer.
- **Validate on blur or submit, not keystroke.** Aggressive
  validation on every keystroke harasses the user; the exception is
  patterns that can short-circuit (e.g. the user typed `"foo bar"`
  into a flight-number field — that's clearly wrong).
- **Required fields** get a danger-tinted ` *` after the label and
  `aria-required`. The required indicator is **not** the error
  indicator — the field is only in error after the user has attempted
  to submit or blurred while empty.
- **Success tone** is for confirmed-saved feedback ("Saved.") — not
  for "looks valid so far." Reserve restraint.

### Search rules

- **Always passive.** Search runs after a debounce or on submit; never
  fire a fetch per keystroke. The user sees a `<Skeleton>` row layout
  while results load.
- **Empty result is an `<EmptyState>`**, not a blank list. Title
  reflects the query ("Nothing matched 'ramen'") and the CTA clears
  the filter.
- **Clear button is always present when filled.** Tap target 44×44.
  Clearing returns the input to its empty state and refocuses the
  input.
- **Search region is `role="search"`.** Single search region per
  screen.

### Chip-filter rules

- **Selection is multi by default.** Each chip toggles independently.
  Single-select chip groups need a different primitive (future
  `SegmentedControl`).
- **Chip rows can scroll horizontally.** Use `flex flex-nowrap
  overflow-x-auto` on the wrapping div; chips are `shrink-0` already.
- **Active chip count visible somewhere.** When more than 3 chips are
  selected, surface a "Clear all" ghost button next to the chip row so
  the user can reset without untoggling each.

### Accessibility quick-rules

- Every `TextField` has a `<label>` bound by `htmlFor`. If a visible
  label isn't needed (e.g. a search-only screen), pass `ariaLabel` to
  `<SearchField>` and omit the label on `<TextField>` only when an
  adjacent visual context already labels it (rare).
- Error messages set `role="alert"` automatically via `FieldMessage`.
- Disabled inputs are not focusable; do not communicate "disabled"
  with colour alone — the opacity dim is the system-wide cue.
- Touch targets ≥ 44×44 for chips and clear buttons.
- Inputs honour `prefers-reduced-motion: reduce` automatically — the
  border-color transition collapses to ~0ms via the global rule.

---

## 12j. Navigation & app shell

Four primitives govern the app's chrome: two shells (one per app phase),
a tab bar, a sticky bottom CTA, and a large-title header. The onboarding
flow and the authenticated app use **different shells** — never mix them.

```
AppShell           →  onboarding chrome (no tab bar, page-length flow)
AppShellAuthed     →  authenticated chrome (with tab bar, internal scroll)
BottomTabBar       →  five-tab bottom navigation, safe-area-aware
LargeTitleHeader   →  iOS-style display title + optional back + trailing
StickyBottomCTA    →  pinned bottom action for forms / detail screens
```

### AppShell vs AppShellAuthed

The two shells have intentionally different layouts.

| Concern | `AppShell` (onboarding) | `AppShellAuthed` (main app) |
|---|---|---|
| Height | `min-h-dvh` — at least viewport, grows for tall content. | `h-dvh` — exactly viewport; main scrolls internally. |
| Background | `<AuroraBackground />` | `<AuroraBackground />` (same hues). |
| Top safe area | `paddingTop: max(env(safe-area-inset-top), 16px)` on the inner. | Same — applied to `<main>`. |
| Bottom safe area | `paddingBottom: max(env(safe-area-inset-bottom), 16px)` on the inner. | **Owned by `<BottomTabBar>`** via `paddingBottom: env(safe-area-inset-bottom)`. Consumers must not re-add. |
| Bottom CTA pattern | `mt-auto` on the CTA group inside content, or a constrained spacer (`min-h-8 max-h-16 flex-grow`). | `<StickyBottomCTA>` inside `<main>` (sticky bottom-0). Tab bar stays below. |
| Tab bar | None. | `<BottomTabBar>` rendered as last child of the shell. |

**Never apply `AppShellAuthed` to onboarding screens.** The five tabs
would surface routes that don't exist for unauthenticated users and
break the onboarding's single-CTA focus.

### BottomTabBar

```tsx
<AppShellAuthed badges={{ flights: true }}>
  <LargeTitleHeader title="Home" />
  …content…
</AppShellAuthed>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `activeHref` | `string` | `usePathname()` | Override active-tab detection. The component checks `active === tab.href` and `active.startsWith(tab.href + "/")` so nested routes light up the parent tab. |
| `badges` | `Partial<Record<TabKey, boolean>>` | — | Per-tab dot toggle. `TabKey` is `"home" \| "flights" \| "map" \| "services" \| "profile"`. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** 56px tall row (`h-14`) + `env(safe-area-inset-bottom)`.
Top border at `--color-border`. Background `--color-surface-card`.
Five evenly-spaced tabs (`flex-1` each). Each tab: 22px icon + `text-micro
uppercase` label, vertical stack. Active tab uses `--color-action-primary`;
inactive uses `--color-text-secondary` with hover to `--color-text-primary`.

**Badge dot.** 6px filled `--color-danger` dot positioned at the top-right
of the active icon (right ~28% of the tab width). Decorative; the change
of state should be announced by the relevant screen, not the tab itself.

**Tabs.** Hard-coded: Home, Flights, Map, Services, Profile. Adding or
reordering tabs is a design-system change, not a screen change.

**A11y.** `<nav aria-label="Main">` wrapper. Each `<Link>` carries
`aria-current="page"` when active and `aria-label={label}` so the
uppercase label and the icon are not double-announced.

### LargeTitleHeader

```tsx
<LargeTitleHeader title="Home" subtitle="Tuesday · YVR" />

<LargeTitleHeader
  title={<>Your <em>journey.</em></>}
  subtitle="Today's flight + ground plan"
  trailing={<NotificationButton />}
/>

<LargeTitleHeader
  title="Flight detail"
  backHref="/flights"
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `ReactNode` | (required) | Display heading. Pass `<em>…</em>` for an italic accent. |
| `subtitle` | `string` | — | Single body line beneath the title. |
| `backHref` | `Route \| URL` | — | When present, renders the 44×44 back chip on the left. |
| `backLabel` | `string` | `"Go back"` | `aria-label` for the back chip. |
| `trailing` | `ReactNode` | — | Optional content (icon button, ghost CTA) on the right of the top row. |
| `className` | `string` | `""` | Composition hook. |

**Anatomy.** Optional top row (back chip + trailing slot), then a
display-size `<Heading>` and optional subtitle. The title block sits
`mt-6` below the top row, or `pt-8` when no top row is present.

**v1 is non-collapsing.** The title doesn't shrink on scroll. The future
collapse variant will reuse this API and layer in scroll-driven opacity
crossfade per §12e (large-title collapsing header contract).

**When to use which header.**

| Header | When |
|---|---|
| `<LargeTitleHeader>` | Authenticated-app screens (Home, Flights, Map, Services, Profile). Title is content-first. |
| `<ScreenHeader>` | Step screens with a back chip + step label, no large title. Used by onboarding (`/onboarding/sign-in`, `/onboarding/permissions`). |

### StickyBottomCTA

```tsx
<AppShellAuthed>
  <LargeTitleHeader title="Add flight" backHref="/flights" />
  <section className="px-6 pb-32 pt-6">
    <TextField label="Flight number" … />
    …
  </section>
  <StickyBottomCTA
    primaryAction={{ label: "Add flight", onClick: submit, loading: submitting }}
    secondaryAction={{ label: "Cancel", href: "/flights" }}
  />
</AppShellAuthed>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `primaryAction` | `Action` | (required) | Renders as `<Button variant="primary">`. |
| `secondaryAction` | `Action` | — | Renders as `<Button variant="ghost">`. |
| `showFade` | `boolean` | `true` | When true, the wrapper carries a top-to-bottom gradient from transparent → `--color-bg` so scrolling content fades into the sticky region. |
| `className` | `string` | `""` | Composition hook. |

`Action` is `{ label, href?, onClick?, trailingIcon?, loading?, disabled? }`
matching the Button surface.

**Anatomy.** `position: sticky bottom-0` inside the scroll container.
The wrapper carries a gradient background (or solid `--color-bg` when
`showFade={false}`), padding-top 32px (or 16px without fade), padding-x
24px, and `paddingBottom: max(env(safe-area-inset-bottom), 8px)` so the
buttons stay above the home indicator.

**Z-index.** `z-10` within the scroll container. Sits above scrolling
content; the BottomTabBar (when present) lives outside `<main>` and is
unaffected.

**Layout requirement.** The screen's content must reserve bottom space
(e.g. `pb-32`) so the last row isn't visually hidden behind the sticky
CTA when scrolled to the very bottom.

### Safe-area behaviour summary

| Edge | Owner |
|---|---|
| Top inset | Both shells apply `paddingTop: max(env(safe-area-inset-top), 16px)` to their inner content area. |
| Bottom inset (onboarding) | `<AppShell>` applies it to the inner content area. |
| Bottom inset (authenticated) | `<BottomTabBar>` applies it on itself. `<AppShellAuthed>` does **not** also add it (avoid double-counting). |
| Bottom inset (sticky CTA) | `<StickyBottomCTA>` applies it on its own wrapper. When a screen has both `<BottomTabBar>` and `<StickyBottomCTA>`, hide the tab bar via `<AppShellAuthed hideTabBar>` while the CTA is present — sticky CTAs and tab bars don't stack. |
| Left / right insets | Both shells apply `paddingLeft/Right: env(safe-area-inset-left/right)` to the inner content area. |

### Do / Don't (navigation)

**Do**

```tsx
// Authenticated screen with large title + tab bar.
<AppShellAuthed badges={{ flights: hasNewAlert }}>
  <LargeTitleHeader title="Home" />
  <section className="px-6 pt-6">…</section>
</AppShellAuthed>

// Form-style detail screen with sticky CTA, tab bar hidden.
<AppShellAuthed hideTabBar>
  <LargeTitleHeader title="Add flight" backHref="/flights" />
  <section className="px-6 pb-32 pt-6">…fields…</section>
  <StickyBottomCTA primaryAction={…} />
</AppShellAuthed>
```

**Don't**

```tsx
// ❌ Tab bar on an onboarding screen.
<AppShell>
  <BottomTabBar />
  …
</AppShell>

// ❌ Sticky CTA stacked on top of tab bar.
<AppShellAuthed>
  …
  <StickyBottomCTA … />   {/* tab bar is still showing — visual clash */}
</AppShellAuthed>

// ❌ Adding paddingBottom for safe area inside AppShellAuthed.
<AppShellAuthed>
  <main className="pb-[env(safe-area-inset-bottom)]">  {/* BottomTabBar owns this */}
    …
  </main>
</AppShellAuthed>

// ❌ Inlining a custom bottom tab bar.
<nav className="fixed bottom-0 h-16 …">…</nav>
```

---

## 12k. Authenticated app list primitives

Row primitives for the **settings / vault / preferences lists** that
recur across the authed app. Onboarding has its own row primitive
(`AuthOption` for sign-in provider rows); the authed app uses
`SettingsRow`. Pick by surface, not by visual similarity.

```
SettingsRow   →  icon + title + description + optional trailing + chevron
```

### SettingsRow

```tsx
<Card
  padding="none"
  className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]"
>
  <SettingsRow
    href="/profile/personal"
    icon={<IdCardIcon size={18} />}
    title="Personal information"
    description="Passport · Date of birth · Contact"
  />
  <SettingsRow
    href="/profile/payment"
    icon={<CreditCardIcon size={18} />}
    title="Payment methods"
    description="Visa ····4821 · Apple Pay"
    trailing={<CountBadge>2</CountBadge>}
  />
  <SettingsRow
    href="/profile/notifications"
    icon={<BellIcon size={18} />}
    title="Notifications"
    description="Flight alerts · Gate changes · Security"
    unread
  />
</Card>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `ReactNode` | (required) | Leading glyph — passed into a 38px `<IconTile>`. Use 18px inline icons from `icons.tsx`. |
| `title` | `string` | (required) | One-line label, `text-body` weight 500. Truncated with ellipsis if too long — keep titles 3 words / 1 line. |
| `description` | `string` | — | Single line beneath the title, `text-label` secondary. Truncated. |
| `href` | `Route \| URL` | — | When present, renders as `<Link>`. Otherwise renders as `<button>`. |
| `onClick` | `() => void` | — | Optional. Fires on both branches. |
| `trailing` | `ReactNode` | — | Optional slot before the chevron — use for `<StatusPill size="sm">`, a count badge, or a small status chip. Never use for a second action button (one tap target per row). |
| `unread` | `boolean` | `false` | Adds a small `--color-danger` dot beside the title. Use for rows whose downstream screen has unread / pending state. |
| `iconTone` | `"tile" \| "elevated"` | `"tile"` | Picks the IconTile fill. `tile` reads warm on a solid inner card (the default authed list rhythm); `elevated` is the airy translucent tile used directly on the aurora background. |

**Anatomy.** 70px row, `px-4 py-4`, `gap-3`. Leading `<IconTile size={38}>`,
title + description vertical stack, optional trailing slot, trailing 16px
chevron at `--color-text-muted`. Hover tints `--color-surface-hover`.

**Grouping.** Stack rows inside a single `<Card padding="none">` with
hairline dividers:

```tsx
<Card padding="none" className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-[var(--color-border-soft)]">
```

The divider selector belongs on the Card, not on the row — the row
does not paint its own border. Multiple groups can sit on the same
screen (the Profile screen has two: Travel Vault and Help & Saved).

**A11y.** Renders as `<Link>` or `<button>`; both branches inherit the
global `:focus-visible` ring. The chevron is `aria-hidden`. Tap target
is the full row (≥ 44px tall). When `unread` is true, the dot is
`aria-hidden` — surface the unread state via the row's `description`
or a `<StatusPill>` in `trailing` if it must be announced.

**When to use `SettingsRow`.**

| Use `SettingsRow` | Use something else |
|---|---|
| Profile vault rows (Personal info, Payment, Security, Notifications). | An on/off toggle in a row → use `<PermissionCard>` or compose `<Toggle>` inside a custom row. |
| Settings / preferences screens (Language, Accessibility, Parking, Dining). | A sign-in provider row → use `<AuthOption>` (onboarding only). |
| Help & Support, Saved Places, App about. | A row that is the *only* content on the screen → consider `<Button>` or a hero card instead. |

**Do**

```tsx
<SettingsRow
  href="/profile/security"
  icon={<LockIcon size={18} />}
  title="Security & password"
  description="2FA active · Updated 30 days ago"
  trailing={<StatusPill tone="success" size="sm" leadingDot>Secure</StatusPill>}
/>
```

**Don't**

```tsx
// ❌ Hand-rolling a row inside a page file.
<a href="/profile/security" className="flex items-center gap-3 px-4 py-4">
  <span className="h-10 w-10 rounded-2xl bg-white/40 …">
    <LockIcon size={18} />
  </span>
  <div>
    <p className="text-sm font-medium">Security & password</p>
    <p className="text-xs text-gray-500">2FA active · Updated 30 days ago</p>
  </div>
  <ChevronRightIcon />
</a>

// ❌ Two actions in one row.
<SettingsRow … trailing={<><Button …/><Button …/></>} />

// ❌ Manual divider lines on the row.
<SettingsRow … className="border-b border-gray-200" />
```

---

## 12l. Design preview route

**`/design`** — a development manifest of every reusable primitive,
variant, and state. Lives at [src/app/design/page.tsx](../src/app/design/page.tsx).

### Why it exists

- One scrollable surface that proves every primitive renders correctly
  before you build a real screen.
- Visual contract for the design system: if a primitive isn't on this
  page, the system doesn't fully own it.
- Snapshot target — when visual regression testing lands, this page is
  what Playwright will photograph at 375px and 1280px across all
  accessibility-mode emulations.

### How to use it

1. **Before building a new screen**, open `http://localhost:3000/design`
   in DevTools mobile mode (375px). Confirm every primitive your new
   screen will use renders the way you expect.
2. **Toggle DevTools accessibility-mode emulators** against this page:
   `prefers-reduced-motion`, `prefers-reduced-transparency`,
   `prefers-contrast: more`, `forced-colors: active`. Each variant
   should remain legible and structurally identical.
3. **After adding or modifying a primitive**, add a section to the
   preview that demonstrates the new variant or state. The page is the
   primitive's first consumer.
4. **Tab through the page** with the keyboard. Every interactive
   element (Toggle, Button, ChipFilter, AuthOption row, SearchField
   clear button, BottomTabBar link) should show the global navy focus
   ring.

### What it is not

- **Not part of production navigation.** No page links to `/design`.
  It's reachable only by typing the URL.
- **Not a Storybook replacement** — it's a single page, not isolated
  component stories. For per-component state matrices and prop
  documentation, this design-system.md is the source of truth.
- **Not gated server-side** by default. If you want the route to 404
  in production builds, add `notFound()` from `next/navigation` at the
  top of the page guarded by `process.env.NODE_ENV === "production"`.

### Path note

The route lives at `/design`, **not** `/_design`. Next.js App Router
treats any folder prefixed with `_` as a **private folder** and does
not generate a route for it — a `src/app/_design/page.tsx` would be
file-system colocation only, not a navigable URL. The preview is most
useful when it's navigable.

### Before-build checklist

Before building any new screen, work through `/design` and confirm:

- [ ] The typography roles you plan to use render at the expected
      size + weight + tracking.
- [ ] The colour tokens / status surface trios you plan to consume
      render with adequate contrast against the page background.
- [ ] The Button / Toggle / ChipFilter states you'll need (loading,
      disabled, busy, selected) exist and look right.
- [ ] If your screen shows live data, the travel atoms you'll consume
      (StatusPill, GateDisplay, AirportCodePair, CountdownBlock, etc.)
      look correct for the data shape.
- [ ] If your screen accepts input, TextField / SearchField / ChipFilter
      / FieldMessage states match the visual you have in mind.
- [ ] If you'll need a primitive that isn't on the page, **add the
      primitive and a preview entry before building the screen.**

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
| `Eyebrow` | `src/components/Eyebrow.tsx` | Small uppercase label. `tone="primary" \| "secondary" \| "hero"`. |
| `Heading` | `src/components/Heading.tsx` | `display` / `title` sizes. `tone="primary" \| "hero"`. |
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
| `StatusPill` | `src/components/StatusPill.tsx` | Compact pill for flight / parking / security live state. Travel atom. |
| `LiveIndicator` | `src/components/LiveIndicator.tsx` | Small dot + uppercase label signalling data freshness. Travel atom. |
| `MetricBlock` | `src/components/MetricBlock.tsx` | Value-first stand-alone metric (security wait, parking %). Travel atom. |
| `CountdownBlock` | `src/components/CountdownBlock.tsx` | Label-first time-relative metric ("Boarding in 42 min"). Travel atom. |
| `AirportCodePair` | `src/components/AirportCodePair.tsx` | "YVR → SFO" inline header with optional flight + city pair. Travel atom. |
| `RouteTimeline` | `src/components/RouteTimeline.tsx` | Split origin/destination with dashed centre line, plane glyph, and duration label. Travel atom — pair with `<AirportCodePair>` for inline contexts. |
| `GateDisplay` | `src/components/GateDisplay.tsx` | "GATE / D73" with optional terminal + helper. Travel atom. |
| `TextField` | `src/components/TextField.tsx` | Label + 52px input + helper / error message. Form atom. |
| `SearchField` | `src/components/SearchField.tsx` | Pill-shaped search input with clear button. Form atom. |
| `ChipFilter` | `src/components/ChipFilter.tsx` | Toggleable filter pill. Form atom. |
| `FieldMessage` | `src/components/FieldMessage.tsx` | Helper / error / success / warning message under a field. Form atom. |
| `AppShellAuthed` | `src/components/AppShellAuthed.tsx` | App shell for logged-in app. Reserves bottom for `BottomTabBar`. |
| `BottomTabBar` | `src/components/BottomTabBar.tsx` | Five-tab bottom nav (Home, Flights, Map, Services, Profile). Safe-area aware. |
| `LargeTitleHeader` | `src/components/LargeTitleHeader.tsx` | iOS-style display title with optional back chip + trailing slot. |
| `StickyBottomCTA` | `src/components/StickyBottomCTA.tsx` | Sticky bottom action(s) inside a scroll container. |
| `SettingsRow` | `src/components/SettingsRow.tsx` | Authed-app settings / vault list row. Composes `<IconTile>` + `ChevronRightIcon`. Group rows inside a `<Card padding="none">` with hairline dividers. See §12k and §2b. |
| `icons` | `src/components/icons.tsx` | Inline SVG icons + brand marks (incl. `SpinnerIcon`, `SearchIcon`, `CloseIcon`, `HomeIcon`, `MapIcon`, `ServicesIcon`, `ProfileIcon`, `SettingsIcon`, `SparkleIcon`, `SyncIcon`, `NavigationIcon`, `IdCardIcon`, `CreditCardIcon`, `SlidersIcon`, `BookmarkIcon`, `LifeBuoyIcon`, `ClockIcon`, `ParkingIcon`, `TrainIcon`, `ScanIcon`, `AccessibilityIcon`, `DiningIcon`, `SignpostIcon`). |

---

## Appendix B — Adding a new primitive

1. Propose it here first (3 lines: what, where used, what tokens).
2. Confirm with the user before writing JSX.
3. Add the component to `src/components/` with one tight responsibility.
4. Document it under "Components inventory" above.
5. Use only tokens — no inline hex, no off-scale spacing, no custom shadows.
